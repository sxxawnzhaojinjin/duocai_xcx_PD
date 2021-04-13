// pages/sale/saleInfo.js
import {
  saleOrderInfo
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
    //销售员
    saleBy:""
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
      orderId: options.orderId
    }, () => {
      this.requestInfo()
    })
    this.setData({
      supplierName: getApp().globalData.supplierName,
      supplierId: getApp().globalData.supplierId,
    })
  },

  //*********取单编辑********* */
  requestInfo() {
    let orderId = this.data.orderId
    let that = this
    saleOrderInfo(orderId)
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
    for (let index in list) {
      let obj = list[index]
      obj["number"] = obj["quantity"]
      obj["actualAmount"] = obj["price"]
      obj["discountAmount"] = "0.00"
    }

    this.setData({
      orderId: data.orderId,
      orderType: 1,
      amountWipe:data.amountWipe||"0",
      contact: Object.assign({
        customerName: data.customerName,
      }, this.data.contact),
      sumNumber: data.totalQuantity,
      sumPrice: (data.amountsPayable).toFixed(2),
      maLingPrice: data.amountWipe,
      relPrice: data.amount,
      goodsList: list,
      settlementMethodString:data.settlementMethod,
      createTime:data.createTime,
      saleBy: data.createBy
    })

  },
  printText(){
    console.log(this.data);
    let printData={

      shopName:"销售单",
      createTime:this.data.createTime,
      customerName:this.data.contact.customerName,

      goodList:this.data.goodsList,

      sumPrice:this.data.sumPrice,
      sumNumber:this.data.sumNumber,

      maLingPrice:this.data.maLingPrice,
      relPrice:this.data.relPrice,
      settlementMethodString:this.data.settlementMethodString,

    }
    
    wx.navigateTo({
      url: '../printManager/print?printData='+ JSON.stringify(printData)
      ,
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