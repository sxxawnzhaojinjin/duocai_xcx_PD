// pages/mine/changePassword.js
import{upDatePassword} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: "",
    againPassword: ""
  },
  submit() {

    if(this.data.oldPassword.length < 1){
      wx.showToast({
        title: '请输入旧密码',
        icon:'none'
      })
      return
    }
    
    if(this.data.newPassword !== this.data.againPassword){
      wx.showToast({
        title: '两次输入密码不一致',
        icon:'none'
      })
      return
    }
    if(this.data.newPassword.length < 1){
      wx.showToast({
        title: '请输入新密码',
        icon:'none'
      })
      return
    }
    let body ={
      supplierId:getApp().globalData.supplierId,
      passwordOld:this.data.oldPassword,
      passwordNew:this.data.newPassword,
    }
    upDatePassword(body)
      .then(data=>{
        wx.clearStorage({
          complete: (res) => {},
        })
        wx.showToast({
          title: '密码修改成功,请重新登录',
          icon:'none'
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '../login/index',
          })
        },2000)
      })
      .catch(error=>{
        console.log(error);
        
      })

  },
  editOldPassword(e) {
    this.setData({
      oldPassword:e.detail.value
    })

  },
  editNewPassword(e) {
    this.setData({
      newPassword:e.detail.value
    })
  },
  editAgainPassword(e) {
    this.setData({
      againPassword:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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