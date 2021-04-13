// pages/sale/saleInfo.js
import {
  backOrderInfo
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    isShow: true,
    isGZ: false,
    settlementMethodString:'',
    contact: {
      contactPerson: "",
      contactPhone: "",
      customerName: "",
      customerId: "",
    },
    sumNumber: 0,
    sumPrice: 0,
    maLingPrice: 0,
    relPrice: 0,
  },
  showMore() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      settlementMethodString:options.settlementMethod

    }, () => {
      this.requestInfo()
    })
    this.setData({
      supplierName: getApp().globalData.supplierName,
      supplierId: getApp().globalData.supplierId,
    })
  },
  requestInfo() {
    let orderId = this.data.orderId
    let that = this
    backOrderInfo(orderId)
      .then(data => {
        that.setDataFromNet(data.data)

      })
      .catch(error => {
        console.log(error);

      })
  },

  setDataFromNet(data) {
    console.log(data);
    let list = data.skus
    let sumNumber = 0
    let sumPrice = 0
    for (let index in list) {
      let obj = list[index]
      obj["number"] = obj["quantity"]
      obj["itemName"] = obj["skuName"]
      obj["discountAmount"] = "0.00"
      sumNumber = sumNumber + obj["quantity"]
      sumPrice = sumPrice + obj["quantity"] * obj["price"]
    }

    this.setData({
      orderId: data.orderId,
      
      contact: Object.assign(this.data.contact,{
        contacts:data.contacts,
        saleBy:data.saleBy,
        contactNumber:data.contactNumber,
        customerName: data.customerName,
      }),
      sumNumber: data.quantitySum,
      sumPrice: (data.actualAmountTotal).toFixed(2),
      maLingPrice: 0,
      relPrice: (data.actualAmountTotal).toFixed(2),
      goodsList: list,

    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})