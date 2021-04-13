// pages/goods/goodsDetail.js
import {goodsInfo} from "../../api/goods"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemId:"",
    body:{},
    size:[],
    color:[],
    isShow:true,
    //skus表格
    thList: ["尺码", "颜色", "入库数量"],
    tdList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemId:options.itemId
      // itemId:"31077a15-1af5-4a86-818a-dd92973a7c3a"
    },()=>{
      this.getGoodsInfo()
    })
  },
  showMore(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  editInfo(){
    wx.navigateTo({
      url: './goodsInfo?itemId='+this.data.itemId,
    })
  },
  getGoodsInfo(){
     let itemId = this.data.itemId
    goodsInfo(itemId)
    .then(data=>{
      console.log(data.data.item)
      this.setData({
        body:data.data.item,
        tdList: data.data.skus,
        size:data.data.item.sizes.split(","),
        color:data.data.item.colours.split(",")
      })
      
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
    if(this.data.itemId !== ""){
      this.getGoodsInfo()
    }
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