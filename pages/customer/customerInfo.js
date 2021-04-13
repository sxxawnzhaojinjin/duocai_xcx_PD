import {customerInfo, addCustomer, editCustomer} from '../../api/customer'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      data:{},
      customerId:'',
      genderList:['男','女'],
      index:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
        this.setData({
          customerId: options.id
        })
        this.getCustomerInfo();
    }
  },
  hideKeyBorder() {
    wx.hideKeyboard({
      success: (res) => {
        console.log(res)
      },
    })
  },
  /** 选择性别 **/
  bindPickerChange: function(e) {
    console.log('picker-----')
    this.setData({
      index: e.detail.value
    })
  },

  /**获取客户详情**/
  getCustomerInfo(){
    if(this.data.customerId){
      customerInfo(this.data.customerId).then(data => {
        this.setData({
          data: data.data,
          index: data.data.gender
        })
      })
      .catch(error => {
        console.log(error);
      })
    }
  },

  //保存
  formSubmit(e){
    let that = this,
    value = e.detail.value;
    if(!value.customerName){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!value.gender){
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!value.contactPhone){
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.contactPhone)){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if(!value.address){
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    value.gender == '男'? value.gender = 0 :value.gender =='女'? value.gender = 1 : value.gender =2
    value["supplierId"] = getApp().globalData.supplierId
    //新增(编辑)
    if(that.data.customerId){
      value.customerId = that.data.customerId;
      editCustomer(value).then(data => {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        }) 
        setTimeout(() => {
          wx.navigateBack()
        }, 2000);
      })
      .catch(error => {
        console.log(error);
      })
    }else{
      addCustomer(value).then(data => {
        wx.showToast({
          title: '新增成功',
          icon: 'none',
          duration: 2000
        }) 
        setTimeout(() => {
          wx.navigateBack()
        }, 2000);
      })
      .catch(error => {
        console.log(error);
      })
    }
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