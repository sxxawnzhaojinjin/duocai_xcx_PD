import { getSaleOrderSummary, getCustomerAccountList } from '../../api/customerAccount'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    list:[],
    isEnd:false,
    countInfo:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let supplierId = getApp().globalData.supplierId
    // this.getSaleOrderSummary(supplierId);
  },


  //获取收入统计
  getSaleOrderSummary(supplierId) {
      let self = this;
      getSaleOrderSummary(supplierId).then(res => {
        this.setData({
          countInfo: res.data
        })
      }).catch(err => {
        console.log(err);
      })
  
  },

  itemClick(e){
    console.log(e);
    let customerId=e.currentTarget.dataset.item.customerId
    wx.navigateTo({
      url: './customerAccountInfo?customerId='+customerId
    })
  },

  requestOrderList(){
    var that = this
    let param='&pageNum='+this.data.pageNum+"&pageSize=20"+"&supplierId=" + getApp().globalData.supplierId
    
    getCustomerAccountList(param)
    .then(data=>{
      console.log(data);
      if(that.data.pageNum == 1){
        that.setData({
          list:data.rows,
          isEnd:data.total>=data.rows.length
        })
      }else{
        let list = that.data.list.concat(data.rows)
        that.setData({
          list:list,
          isEnd:data.total>=list.length
        })
      }
    
    })
    .catch(error=>{
      console.log(error);
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
    this.getSaleOrderSummary(getApp().globalData.supplierId);
    this.setData({
      pageNum:1
    },()=>{
      this.requestOrderList()
    })
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
    this.setData({
      pageNum:1
    },()=>{
      this.requestOrderList()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isEnd){
      this.setData({
        pageNum:this.data.pageNum+1
      },()=>{
        this.requestOrderList()
      })
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }

  },

})