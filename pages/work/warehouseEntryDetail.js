// pages/work/warehouseEntryDetail.js
import {
  getWarehousingDetail
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestdetail(options.entryId);

  },

  requestdetail(entryId) {
    getWarehousingDetail(entryId).then(res => {
        let detail = res.data;
        this.setData({
          detail: detail
        })
      })
      .catch(error => {
        console.log(error);
      })
  },

  onUnload: function () {
    //相当于监听返回按钮
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      newList: [],
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})