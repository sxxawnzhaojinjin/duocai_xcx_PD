// pages/login/index.js
import {
  login
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    phone: "",
    password: "",

    // phone: '15029026073',
    // password: '123456',

    // phone: 'hezhenya',
    // password: 'hezhenya',


  },

  setPhone(e) {
    this.setData({
      phone: e.detail.value
    })

  },
  setPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton({
      complete: (res) => {},
    })
  },

  loginWidthPhoneAndPassword() {
    // if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
    //   wx.showToast({
    //     title: '手机号码输入有误',
    //     icon:"none"
    //   })
    //   return;
    // }
    if (this.data.password.length < 1) {
      wx.showToast({
        title: '密码格式输入有误',
        icon: "none"
      })
      return;
    }
    let body = {
      // contactPhone: this.data.phone,
      username: this.data.phone,
      password: this.data.password
    }

    login(body)
      .then(data => {
        wx.setStorage({
          key: 'userName',
          data: this.data.phone
        })
        wx.setStorage({
          key: 'pwd',
          data: this.data.password
        })
        getApp().globalData.token = data.token
        getApp().globalData.supplierName = ''
        getApp().globalData.supplierId = ''
        /** 店铺shopId **/
        getApp().globalData.shopId = data.shopId
        getApp().globalData.storeName = data.shopName

        wx.reLaunch({
          url: '../work/index',
        })
      })
      .catch(error => {
        console.log(error);

      })
  },
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
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

  submit() {
    this.loginWidthPhoneAndPassword()

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