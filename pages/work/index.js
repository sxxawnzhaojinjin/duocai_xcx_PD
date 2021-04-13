Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeName:'-',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeName:getApp().globalData.storeName
    })
  },
  
  /** 跳转页面 **/
  goTab(e){
      let index = e.currentTarget.dataset.index;
      switch (index) {
        case '1':
          wx.navigateTo({
            url: './inventory'
          })
          break;  
        case '2':
          // wx.navigateTo({
          //   url: './warehouse'
          // })
          wx.navigateTo({
            url: './../purchase_new/purchase_goods'
          })
          break;  
        case '3':
          wx.navigateTo({
            url: './warehouseEntry'
          })
          break;  
        case '4':
          wx.navigateTo({
            url: './outbound'
          })
          break;
        case '5':
          wx.navigateTo({
            url: './outboundOrder'
          })
          break;  
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

})