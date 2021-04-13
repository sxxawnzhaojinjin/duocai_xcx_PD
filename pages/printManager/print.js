const LAST_CONNECTED_DEVICE = 'last_connected_device'
const PrinterJobs = require('../../utils/printer/printerjobs')
const printerUtil = require('../../utils/printer/printerutil')
var util = require('../../utils/util.js');
var gbk = require('../../utils/printUtil-GBK');
import * as zksdk from '../../utils/bluetoolth';

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join(',')
}

function str2ab(str) {
  // Convert str to ArrayBuff and write to printer
  let buffer = new ArrayBuffer(str.length)
  let dataView = new DataView(buffer)
  for (let i = 0; i < str.length; i++) {
    dataView.setUint8(i, str.charAt(i).charCodeAt(0))
  }
  return buffer;
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
    printData: {

    }

  },
  onUnload() {
    this.closeBluetoothAdapter()
  },
  openBluetoothAdapter() {


    if (!wx.openBluetoothAdapter) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return
    }
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        console.log('openBluetoothAdapter fail', res)
        if (res.errCode === 10001) {
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
          wx.onBluetoothAdapterStateChange((res) => {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              // 取消监听，否则stopBluetoothDevicesDiscovery后仍会继续触发onBluetoothAdapterStateChange，
              // 导致再次调用startBluetoothDevicesDiscovery
              wx.onBluetoothAdapterStateChange(() => {});
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
    wx.onBLEConnectionStateChange((res) => {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log('onBLEConnectionStateChange', `device ${res.deviceId} state has changed, connected: ${res.connected}`)
      this.setData({
        connected: res.connected
      })
      if (!res.connected) {
        wx.showModal({
          title: '错误',
          content: '蓝牙连接已断开',
          showCancel: false
        })
      }
    });
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
      fail: (res) => {
        console.log('startBluetoothDevicesDiscovery fail', res)
      }
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery({
      complete: () => {
        console.log('stopBluetoothDevicesDiscovery')
        this._discoveryStarted = false
      }
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    this._createBLEConnection(deviceId, name)
  },
  _createBLEConnection(deviceId, name) {
    wx.showLoading()
    wx.createBLEConnection({
      deviceId,
      success: () => {
        console.log('createBLEConnection success');
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
        wx.setStorage({
          key: LAST_CONNECTED_DEVICE,
          data: name + ':' + deviceId
        })
      },
      complete() {
        wx.hideLoading()
      },
      fail: (res) => {
        console.log('createBLEConnection fail', res)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('getBLEDeviceServices', res)
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        // 这里会存在特征值是支持write，写入成功但是没有任何反应的情况
        // 只能一个个去试
        for (let i = 0; i < res.characteristics.length; i++) {
          const item = res.characteristics[i]
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            break;
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
  },

  setStinglength(str, len) {
    let fillWith = " "

    if (len < printerUtil.getStringWidth(str)) {
      return str.substring(0, len)
    }
    let fillCount = len - printerUtil.getStringWidth(str)
    let fillStr = new Array(fillCount).fill(fillWith.charAt(0)).join('');
    console.log('---', fillStr + "----");
    return str + fillStr

  },
  writeBLECharacteristicValue() {

    // let printerJobs = new PrinterJobs();
    // let str = this.setStinglength('货号', 14) + this.setStinglength('款号', 14) + this.setStinglength('数量', 6) + this.setStinglength('单价', 6) + this.setStinglength('小计', 6)
    // console.log(str);
    // printerJobs
    // .setSize(2, 2)
    // .print("现金支付:200")
    // .println();
    // printerJobs
    //   .setAlign('lt')
    //   .setSize(1, 1)
    //   .print('客户联')
    //   .setAlign('ct')
    //   .setSize(2, 2)
    //   .print('卓资时尚销售单')
    //   .setAlign('lt')
    //   .setSize(1, 1)
    //   .print('日期:2018年12月5日')
    //   .print(printerUtil.inline('客户:快手碎花001', '店员:'))

    //   .print(printerUtil.fillLine())


    //   .print(str)
    //   .print(printerUtil.fillLine())

    // for (let i = 0; i < 2; i++) {
    //   let str1 = this.setStinglength('ab精神抖擞', 14) + this.setStinglength('大二额', 14) + this.setStinglength('1', 4) + this.setStinglength('33.3', 8)+this.setStinglength('33.3', 8)
    //   printerJobs
    //     .print(str1)
    // }
    //   printerJobs
    //   .print(printerUtil.fillLine())
    //   .print("合计 销售:"+"12   "+"总额:"+"2288.3")
    //   .print(printerUtil.fillLine())
    //   .print(printerUtil.fillLine())
    //   .setSize(2, 2)
    //   .print("现金支付:200")
    //   .setSize(1, 1)
    //   .print(printerUtil.fillLine())
    //   .print("电话:"+"13122222222")
    //   .print("提醒:"+"钱款,件数请当面点清,离店概不负责")
    //   .println();



    // .setAlign('ct')
    // .setSize(2, 2)
    // .print('#20饿了么外卖')
    // .setSize(1, 1)
    // .print('切尔西Chelsea')
    // .setSize(2, 2)
    // .print('在线支付(已支付)')
    // .setSize(1, 1)
    // .print('订单号：5415221202244734')
    // .print('下单时间：2017-07-07 18:08:08')
    // .setAlign('lt')
    // .print(printerUtil.fillAround('一号口袋'))
    // .print(printerUtil.inline('意大利茄汁一面 * 1', '15'))
    // .print(printerUtil.fillAround('其他'))
    // .print('餐盒费：1')
    // .print('[赠送康师傅冰红茶] * 1')
    // .print(printerUtil.fillLine())
    // .setAlign('rt')
    // .print('原价：￥16')
    // .print('总价：￥16')
    // .setAlign('lt')
    // .print(printerUtil.fillLine())
    // .print('备注')
    // .print("无")
    // .print(printerUtil.fillLine())
    // .println();
    let printData = this.data.printData
    let list = printData.goodList

    let height = 300 + (list.length * 45) + 400
    let strCmd = zksdk.CreatCPCLPage(560, height, 1, 0);
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLTextDefault(10, 0, '客户联'); //0:20
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLTextBig(10, 40, printData.shopName); //40:30
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLSETMAG(1, 1);
    strCmd += zksdk.addCPCLTextDefault(10, 100, '日期:' + printData.createTime); //90:20
    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLTextBig(10, 130, '客户:' + printData.customerName); //130:30
    // strCmd += zksdk.addCPCLLocation(1);
    // strCmd += zksdk.addCPCLTextBig(10, 130, '店员:'); //130:30
    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLTextBig(10, 170, '———————————————————————'); //170:20
    strCmd += zksdk.addCPCLSETMAG(1, 1);
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLTextDefault(10, 200, '款号'); //130:30
    strCmd += zksdk.addCPCLTextDefault(160, 200, '名称'); //130:30
    strCmd += zksdk.addCPCLTextDefault(320, 200, '数量'); //130:30
    strCmd += zksdk.addCPCLTextDefault(400, 200, '单价'); //130:30
    strCmd += zksdk.addCPCLTextDefault(480, 200, '小计'); //130:30
    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLTextBig(10, 230, '———————————————————————'); //230:30
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLSETMAG(1, 1);
    let y = 260
    for (let i = 0; i < list.length; i++) {
      y = y + 30 + 5
      let item = list[i]
      strCmd += zksdk.addCPCLTextDefault(10, y, item.itemNo); //130:30
      strCmd += zksdk.addCPCLTextDefault(160, y, item.itemName); //130:30
      strCmd += zksdk.addCPCLTextDefault(320, y, item.number); //130:30
      strCmd += zksdk.addCPCLTextDefault(400, y, item.price); //130:30
      strCmd += zksdk.addCPCLTextDefault(480, y, item.price * item.number); //130:30
    }
    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLTextBig(10, y + 30, '———————————————————————'); //y+30:30
    strCmd += zksdk.addCPCLSETMAG(1, 1);
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLTextDefault(10, y + 60, '合计:  销售：' + printData.sumNumber + "       总额：" + printData.sumPrice); //y+90:30

    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLTextBig(10, y + 90, '———————————————————————'); //y+30:30
    strCmd += zksdk.addCPCLTextBig(10, y + 130, '———————————————————————'); //y+60:30
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLTextBig(10, y + 160, '支付方式:' + printData.settlementMethodString); //y+90:30
    strCmd += zksdk.addCPCLTextBig(10, y + 200, '抹零:' + printData.maLingPrice); //y+90:30
    strCmd += zksdk.addCPCLTextBig(10, y + 240, '实收金额:' + printData.relPrice); //y+90:30

    strCmd += zksdk.addCPCLSETMAG(2, 2);
    strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLTextBig(10, y + 280, '———————————————————————'); //y+30:30
    strCmd += zksdk.addCPCLSETMAG(1, 1);
    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLTextDefault(10, y + 310, '电话：13122818888'); //y+30:30
    strCmd += zksdk.addCPCLTextDefault(10, y + 340, '提醒：钱款、件数请当面数清，离店概不负责'); //y+30:30
    // strCmd += zksdk.addCPCLBarCode(270,0,'128',80,0,1,1,'00051');
    // strCmd += zksdk.addCPCLText(290,80,'7','2',0,'00051');
    // strCmd += zksdk.addCPCLText(40,110,'3','0',0,'CHICKEN FEET (BONELESS)-Copy-Copy');
    // strCmd += zksdk.addCPCLSETMAG(2,2);
    // strCmd += zksdk.addCPCLText(40,150,'55','0',0,'无骨鸡爪 一盒（约1.5磅）');
    // strCmd += zksdk.addCPCLSETMAG(0,0);
    // strCmd += zksdk.addCPCLText(350,180,'7','2',0,'2019-08-12');

    // strCmd += zksdk.addCPCLLocation(2);
    // strCmd += zksdk.addCPCLQRCode(0,220,'M', 2, 6, 'qr code test');

    strCmd += zksdk.addCPCLPrint();
    console.log(strCmd);

    //let buffer = util.hexStringToBuff(strCmd);
    let buffer = gbk.strToGBKByte(strCmd);

    // let buffer = printerJobs.buffer();
    console.log('ArrayBuffer', 'length: ' + buffer.byteLength, ' hex: ' + ab2hex(buffer));
    // 1.并行调用多次会存在写失败的可能性
    // 2.建议每次写入不超过20字节
    // 分包处理，延时调用
    const maxChunk = 20;
    const delay = 20;
    for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
      let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
      setTimeout(this._writeBLECharacteristicValue, j * delay, subPackage);
    }
  },
  _writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
      },
      fail(res) {
        console.log('writeBLECharacteristicValue fail', res)
      }
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  onLoad(options) {
    console.log(options.printData);
    this.setData({
      printData: JSON.parse(options.printData)
    })

    const lastDevice = wx.getStorageSync(LAST_CONNECTED_DEVICE);
    this.setData({
      lastDevice: lastDevice
    })
  },
  createBLEConnectionWithDeviceId(e) {
    // 小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备
    const device = this.data.lastDevice
    if (!device) {
      return
    }
    const index = device.indexOf(':');
    const name = device.substring(0, index);
    const deviceId = device.substring(index + 1, device.length);
    console.log('createBLEConnectionWithDeviceId', name + ':' + deviceId)
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this._createBLEConnection(deviceId, name)
      },
      fail: (res) => {
        console.log('openBluetoothAdapter fail', res)
        if (res.errCode === 10001) {
          wx.showModal({
            title: '错误',
            content: '未找到蓝牙设备, 请打开蓝牙后重试。',
            showCancel: false
          })
          wx.onBluetoothAdapterStateChange((res) => {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              // 取消监听
              wx.onBluetoothAdapterStateChange(() => {});
              this._createBLEConnection(deviceId, name)
            }
          })
        }
      }
    })
  }
})