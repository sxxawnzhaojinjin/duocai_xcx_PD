
// pages/loadding/index.js
import {
  login
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      try {
        const user = wx.getStorageSync('userName')
        const pwd = wx.getStorageSync('pwd')
        if (user && pwd) {
          console.log(user,pwd);
          let body = {
            // contactPhone:user,
            username: user,
            password: pwd
          }
          console.log(body);
      
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
              console.log(data);
            })
            .catch(error => {
              console.log(error);
              wx.reLaunch({
                url: '../login/index',
              })
            })
          // Do something with return value
        }else{
          wx.reLaunch({
            url: '../login/index',
          })
        }
      } catch (e) {
        console.log('e=-',e);
        wx.reLaunch({
          url: '../login/index',
        })
        // Do something when catch error
      }
    }, 500);
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

})