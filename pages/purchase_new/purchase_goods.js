const App = getApp();
import {
  purchaseByList,
  getProductCode
} from '../../api/purchase_new'
import {
  savePurchaseBill,
} from '../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    //下拉框
    select: false,
    search_name: '请选择',
    search_id: '',
    search_list: [],
    listLength: 0,
    // 设置开始的位置
    startX: 0,
    startY: 0,
    //条码
    code: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })

    this.getPurchaseByList()
  },

  //全局点击
  outBtn() {
    this.setData({
      select: false
    })
  },

  /** 采购人员列表 **/
  getPurchaseByList() {
    purchaseByList().then(res => {
      this.setData({
        search_list: res.data,
        listLength: res.data.length
      })
    })
  },

  /** 添加商品按钮 **/
  addGoodsBtn() {
    wx.navigateTo({
      url: './purchase_goodsList',
    })
  },
  /** 扫码添加商品按钮 **/
  addScanCodeBtn() {
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        if (result != '' || result != undefined || result != null) {
          that.getCode(result)
        }
      },
      fail: (res) => {
        console.log(res)
        // wx.showToast({
        //   title: '扫码异常',
        //   icon: "none"
        // })
      }
    })
  },
  /** 条码 **/
  getCode(code) {
    getProductCode(code).then(res => {
      if (res.code == 200) {
        if (Object.keys(res.data).length > 0) {
          let product = res.data;
          product['quantity'] = 1;
          product['pictureUrl'] = product['itemPhoto']
          let list = this.data.goodsList

          //判断是否存在相同的数据项
          let isSkuId = list.findIndex(
            value => value.skuId == product.skuId
          );
          //添加到列表
          if (isSkuId == -1) {
            list.push(product)
          } else {
            //合并数量
            list = this.concatQuantity(
              list,
              product
            );
          }
          // list.push(product)

          this.setData({
            goodsList: list
          })
        }
      } else {
        wx.showToast({
          title: '扫码异常',
          icon: "none"
        })
      }

    })
  },

  //合并数量
  concatQuantity(data, obj) {
    obj != '' ? data.push(obj) : ''
    data = data.reduce(
      (res, cur, index) => {
        const hasValue = res.findIndex(current => {
          return current.skuId === cur.skuId;
        });
        hasValue === -1 && res.push(cur);
        hasValue !== -1 &&
          (res[hasValue].quantity =
            (Number(res[hasValue].quantity) + 1) > 100000 ? 100000 : (Number(res[hasValue].quantity) + 1));
        return res;
      },
      []
    );
    return data;
  },

  // 点击下拉框 
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  // 已选下拉框 
  mySelect(e) {
    let name = e.currentTarget.dataset.name
    let id = e.currentTarget.dataset.id
    this.setData({
      search_name: name,
      select: false,
      search_id: id
    })
  },


  // 开始滑动
  touchStart(e) {
    // console.log('touchStart=====>', e);
    let goodsList = [...this.data.goodsList]
    goodsList.forEach(item => {
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    this.setData({
      goodsList: goodsList,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  touchMove(e) {
    // console.log('touchMove=====>', e);
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let goodsList = [...this.data.goodsList]

    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    goodsList.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 30) {
        return
      }
      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    })
    this.setData({
      goodsList
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除
  delItem(e) {
    let skuId = e.currentTarget.dataset.id;
    let goodsList = [...this.data.goodsList];
    for (let i = 0; i < goodsList.length; i++) {
      const item = goodsList[i];
      item.isTouchMove = false;
      if (item.skuId === skuId) {
        goodsList.splice(i, 1);
        break;
      }
    }
    this.setData({
      goodsList
    })
  },

  /** 更改入库数量 **/
  changeNum(e) {
    let index = e.currentTarget.dataset.index;
    let val = e.detail.value;
    let list = this.data.goodsList;
    if (val == 0 || val == '') {
      val = val.replace(0, 1)
    } else if (val > 100000) {
      val = 100000
    } else {
      val = val
    }
    list[index].quantity = val;
    this.setData({
      goodsList: list
    })
  },
  changeNum_blur(e) {
    let index = e.currentTarget.dataset.index;
    let val = e.detail.value;
    let list = this.data.goodsList;
    if (val == '' || val == undefined || val <= 0) {
      list[index].quantity = 1;
      this.setData({
        goodsList: list
      })
    }
  },

  /** 确定入库 **/
  submit() {
    let that = this,
      dataJson, body = {},
      arr = [];
    let dataList = that.data.goodsList;

    if (dataList.length == 0) {
      wx.showToast({
        title: '请先添加商品',
        icon: "none"
      })
      return false
    }

    for (let index in dataList) {
      let obj = dataList[index]
      if (obj['quantity'] == '' || obj['quantity'] == undefined) {
        wx.showToast({
          title: '入库数量不能为空',
          icon: "none"
        })
        return false
      }
      console.log(obj, 'obj')

      dataJson = {
        skuId: obj["skuId"],
        quantity: Number(obj["quantity"]),
        itemNo: obj["itemNo"],
        itemName: obj["itemName"],
        category: obj["categoryName"],
        colour: obj["colour"],
        skuSize: obj["skuSize"],
        purchasePrice: obj["purchasePrice"],
        price: obj["price"],
        productCode: obj["productCode"],
      }
      arr.push(dataJson)
    }
    body["skus"] = arr
    body["createBy"] = that.data.search_name == '请选择' ? '' : that.data.search_id

    console.log('json', body)

    savePurchaseBill({
        createBy: body.createBy,
        skus: body.skus
      })
      .then(res => {
        wx.navigateTo({
          // url: '../work/warehouseEntryDetail?entryId=' + res.data,
          url: '../success/index?entryId=' + res.data,
        })
        that.setData({
          goodsList: [],
          search_name: '请选择',
          search_id: ''
        })
      })
      .catch(error => {
        console.log(error);
      })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      select: false
    })
  },

})