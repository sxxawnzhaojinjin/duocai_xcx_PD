// pages/back/backList.js
import {
  backOrderList
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    list: [],
    isEnd: false,
  },
  itemClick(e) {

    let item = e.currentTarget.dataset.item
    console.log("--", item)
    wx.navigateTo({
      url: './backdetail?orderId=' + item.orderId+"&settlementMethod="+item.settlementMethod ,
    })
  },

  requestOrderList() {
    var that = this

    backOrderList(this.data.pageNum)
      .then(data => {
        console.log(data);
        if (that.data.pageNum == 1) {
          that.setData({
            list: data.rows,
            isEnd: data.total >= data.rows.length
          })
        } else {
          let list = that.data.list.concat(data.rows)
          that.setData({
            list: tlist,
            isEnd: data.total >= list.length
          })
        }

      })
      .catch(error => {
        console.log(error);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageNum: 1
    }, () => {
      this.requestOrderList()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNum: 1
    }, () => {
      this.requestOrderList()
    })
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isEnd) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.requestOrderList()
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  },


})