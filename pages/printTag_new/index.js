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
    printData: {},
    num: '',
    imageData: "",
    //是否点击打印
    isClick: false,
    /** 打印优化 **/
    isInitializePrint: true, //初始化打印按钮默认置灰
    //下拉框
    select: false,
    name: '请选择打印机',
    search_list: ['打印机型号1', '打印机型号2', '打印机型号3', '打印机型号4'],
    lastDeviceName: "",
    isTrue: false,
    isPrint: false, //是否打印
    listLength: 0 //列表长度(超出滚动)


  },

  /** 蓝牙优化下拉框 **/
  //全局点击
  outBtn() {
    this.setData({
      select: false
    })
  },

  // 点击下拉框 
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  // 已选下拉框 
  // mySelect(e) {
  //   console.log(e)
  //   var name = e.currentTarget.dataset.name
  //   this.setData({
  //     search_name: name,
  //     select: false
  //   })
  // },

  onUnload() {
    this.closeBluetoothAdapter()

  },
  openBluetoothAdapter() {
    console.log('----打开蓝牙')
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
            title: '提示',
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
        // wx.showModal({
        //   title: '提示',
        //   content: '蓝牙连接已断开',
        //   showCancel: false
        // })
        wx.showToast({
          title: '蓝牙连接打印机型号已断开',
          icon: 'none'
        })

      }
    });
    this.setData({
      select: true
    })
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
      console.log(res, 'res')
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        let firstName = device.name;
        firstName = firstName.substring(0, 1);
        if (firstName == 'C') {
          const foundDevices = this.data.devices
          console.log(foundDevices, 'foundDevices')

          const idx = inArray(foundDevices, 'deviceId', device.deviceId)
          const data = {}
          if (idx === -1) {
            data[`devices[${foundDevices.length}]`] = device
          } else {
            data[`devices[${idx}]`] = device
          }
          this.setData({
            listLength: foundDevices.length
          })
          this.setData(data)

        }

      })
    })
  },
  createBLEConnection(e) {
    console.log(e, '选择蓝牙型号---------')
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    this.setData({
      isTrue: true,
      isInitializePrint: false,
      isClick: false,
      name,
      deviceId,
      select: false
    }, () => {
      this._createBLEConnection(deviceId, name)
    })

    // this._createBLEConnection(deviceId, name)

  },
  _createBLEConnection(deviceId, name) {
    console.log(deviceId, '--------' + name)
    wx.showLoading({
      title: "连接中..."
    })
    wx.createBLEConnection({
      deviceId,
      success: () => {
        console.log('createBLEConnection success');
        this.setData({
          connected: true
        })
        this.getBLEDeviceServices(deviceId)
        // wx.setStorage({
        //   key: LAST_CONNECTED_DEVICE,
        //   data: name + ':' + deviceId
        // })
      },
      complete() {
        wx.hideLoading()
      },
      fail: (res) => {
        console.log('createBLEConnection fail', res)

      }
    })


    // this.stopBluetoothDevicesDiscovery()

  },
  // closeBLEConnection() {
  //   wx.closeBLEConnection({
  //     deviceId: this.data.deviceId
  //   })
  //   this.setData({
  //     connected: false,
  //     chs: [],
  //     canWrite: false,
  //   })
  // },


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
            // this.setData({
            //   canWrite: true,
            //   isInitializePrint: false
            // })
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

  getImageDate() {
    const ctx = wx.createCanvasContext('secondCanvas');
    const temppath = "../../images/print/jiancha.jpg"
    //获取图片的宽高信息
    wx.getImageInfo({
      src: temppath,
      success: (res) => {
        console.log(res);
        const w = res.width;
        const h = res.height;
        this.setData({
            canvasHeight: h,
            canvasWidth: w,
          },
          () => {
            //canvas 画一张图片
            ctx.drawImage(temppath, 0, 0, w, h);
            ctx.draw();
            setTimeout(() => {
              //获取画布里的图片数据
              wx.canvasGetImageData({
                canvasId: 'secondCanvas',
                x: 0,
                y: 0,
                width: w,
                height: h,
                success: (res) => {
                  const pix = res.data;
                  this.setData({
                    icon_a: {
                      imageData: pix,
                      width: w,
                      height: h,
                      threshold: 190,
                    }
                  })

                },
              });
            }, 500);
          },
        );
      },
    });
  },

  getImageDate_B() {

    const ctx = wx.createCanvasContext('secondCanvas_b');
    const temppath = "../../images/print/1.jpg"
    //获取图片的宽高信息
    wx.getImageInfo({
      src: temppath,
      success: (res) => {
        console.log(res);

        const w = res.width;
        const h = res.height;
        this.setData({
            canvasHeight_b: h,
            canvasWidth_b: w,
          },
          () => {
            //canvas 画一张图片
            ctx.drawImage(temppath, 0, 0, w, h);
            ctx.draw();
            setTimeout(() => {
              //获取画布里的图片数据
              wx.canvasGetImageData({
                canvasId: 'secondCanvas_b',
                x: 0,
                y: 0,
                width: w,
                height: h,
                success: (res) => {
                  const pix = res.data;
                  this.setData({
                    icon_b: {
                      imageData: pix,
                      width: w,
                      height: h,
                      threshold: 190,
                    }
                  })

                },
              });
            }, 500);
          },
        );
      },
    });
  },
  writeBLECharacteristicValue() {
    if (this._deviceId !== this.data.deviceId) {
      wx.showToast({
        title: '请匹配正确的打印机型号',
        icon: 'none'
      })
      return false;
    }

    if (this.data.icon_a == '' || this.data.icon_a == undefined || this.data.icon_b == '' || this.data.icon_b == undefined) {
      wx.showToast({
        title: '数据处理中，请稍后重试',
        icon: 'none'
      })
      return false;
    }

    let that = this,
      num = Number(that.data.num),
      printData = that.data.printData;

    // let strCmd = zksdk.CreatCPCLPage(425, 510, num, 1); //开发所用到的打印纸尺寸
    let strCmd = zksdk.CreatCPCLPage(400, 510, num, 1); //多彩所用到的打印纸尺寸

    strCmd += zksdk.addCPCLGAP();

    strCmd += zksdk.addCPCLText(140, 50, '0', '32', 0, "合格证");

    strCmd += zksdk.addCPCLText(10, 95, '0', '20', 0, "款号:" + printData.itemNo);
    // strCmd += zksdk.addCPCLText(10, 115, '0', '20', 0, "名称:" + printData.skuName);

    let yHeight;
    //更改名称换行
    let val = printData.skuName;
    if (val.length > 0 && val.length <= 15) {
      yHeight = 115;
      strCmd += zksdk.addCPCLText(10, 115, '0', '20', 0, "名称:" + val.substring(0, 15));
    } else if (val.length > 15 && val.length <= 30) {
      yHeight = 135;
      strCmd += zksdk.addCPCLText(10, 115, '0', '20', 0, "名称:" + val.substring(0, 15));
      strCmd += zksdk.addCPCLText(10, 135, '0', '20', 0, val.substring(15, 30));
    } else if (val.length > 30) {
      yHeight = 155;
      strCmd += zksdk.addCPCLText(10, 115, '0', '20', 0, "名称:" + val.substring(0, 15));
      strCmd += zksdk.addCPCLText(10, 135, '0', '20', 0, val.substring(15, 30));
      strCmd += zksdk.addCPCLText(10, 155, '0', '20', 0, val.substring(30, val.length - 1));
    }

    strCmd += zksdk.addCPCLText(10, yHeight + 20, '0', '20', 0, "尺码:" + printData.size);
    strCmd += zksdk.addCPCLText(10, yHeight + 40, '0', '20', 0, "颜色:" + printData.color);
    strCmd += zksdk.addCPCLText(10, yHeight + 60, '0', '20', 0, "等级:合格品");

    strCmd += zksdk.addCPCLImageCmd(260, yHeight + 60, this.data.icon_a);

    strCmd += zksdk.addCPCLText(10, yHeight + 80, '0', '20', 0, "执行标准:FZ/T81007-2012");
    strCmd += zksdk.addCPCLText(10, yHeight + 100, '0', '20', 0, "安全类别:GB18401-2010");

    let content = printData.materials;
    content = content.split('\n');

    let y = yHeight + 100;
    if (content) {
      for (let i = 0; i < content.length; i++) {
        y = y + 20;
        let item = content[i];
        if (i == 0) {
          strCmd += zksdk.addCPCLText(10, y, '0', '20', 0, "产品成分:" + item);
        } else {
          strCmd += zksdk.addCPCLText(100, y, '0', '20', 0, item);
        }
      }
    } else {
      strCmd += zksdk.addCPCLText(10, yHeight + 100, '0', '20', 0, "产品成分:--");
    }

    strCmd += zksdk.addCPCLImageCmd(40, 340, this.data.icon_b);


    strCmd += zksdk.addCPCLBarCode(42, 400, "128", 50, 0, 1, 3, printData.productCode)
    // strCmd += zksdk.addCPCLLocation(2);
    strCmd += zksdk.addCPCLText(120, 450, '0', '16', 0, printData.productCode);

    strCmd += zksdk.addCPCLLocation(0);
    strCmd += zksdk.addCPCLText(10, 470, '0', '16', 0, "经销商:西安卓资时尚信息科技有限公司");
    strCmd += zksdk.addCPCLText(10, 490, '0', '16', 0, "地址:陕西省西安市新城区长缨西路464号");

    strCmd += zksdk.addCPCLPrint();

    let buffer = util.hexStringToBuff(strCmd);

    console.log(strCmd);

    // let buffer = printerJobs.buffer();
    // 1.并行调用多次会存在写失败的可能性
    // 2.建议每次写入不超过20字节
    // 分包处理，延时调用
    const maxChunk = 100;
    const delay = 20;
    for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk, j++) {
      let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) : length);
      setTimeout(this._writeBLECharacteristicValue, j * delay, subPackage);
    }
    wx.setStorage({
      key: LAST_CONNECTED_DEVICE,
      data: this.data.name + ':' + this.data.deviceId
    })
    this.setData({
      isClick: true,
      isPrint: true
    })

  },
  _writeBLECharacteristicValue(buffer) {
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
      success(res) {
        console.log('writeBLECharacteristicValue success', res)
        if (res.errCode == 0) {
          wx.showToast({
            title: '打印成功',
            icon: 'none'
          })
        }
      },
      fail(res) {
        console.log('writeBLECharacteristicValue fail', res)
        wx.showToast({
          title: '打印异常',
          icon: 'none'
        })
      }
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },


  onLoad(options) {
    console.log(options);
    this.getImageDate()
    this.getImageDate_B()
    let lastDevice = wx.getStorageSync(LAST_CONNECTED_DEVICE);
    let index = lastDevice.indexOf(':');
    let lastDeviceName = lastDevice.substring(0, index);
    this.setData({
      printData: JSON.parse(options.printData),
      num: options.num,
      lastDevice: lastDevice,
      lastDeviceName: lastDeviceName,
      // isInitializePrint: lastDeviceName ? false : true,
      // connected: lastDeviceName ? true : false
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
            title: '提示',
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