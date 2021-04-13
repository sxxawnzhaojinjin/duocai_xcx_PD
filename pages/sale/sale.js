// pages/sale/sale.js
import {
  saleOrderList,
  saleHangingOrderList
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    pageIndex: 1,
    isEnd: false,
    list: [],
  },
  addDisClick() {
    wx.navigateTo({
      url: './addSale',
    })
  },
  titleClick: function (e) {
    let tabIndex = e.currentTarget.dataset.idx
    // let searchKey = this.data.searchKey
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx,
      pageIndex: 1,
      list: [],
      isEnd: false
    }, () => {
      if (tabIndex == 0) {
        this.requestOrderList()
      } else {
        this.requestHaddingOrderList()
      }
    })

  },


  itemClick(e) {
    let item = e.currentTarget.dataset.item

    console.log("--", item)

    if (this.data.currentIndex == 0) {
      wx.navigateTo({
        url: './saleInfo?orderId=' + item.orderId,
      })
    } else {
      wx.navigateTo({
        url: './addSale?orderId=' + item.orderId + "&contacts=" + item.contacts + "&contactNumber=" + item.contactNumber + "&customerId=" + item.customerId,
      })
    }

  },
  requestOrderList() {
    var that = this

    let pageNum = this.data.pageIndex

    saleOrderList(pageNum)
      .then(data => {
        console.log(data);
        if (pageNum == 1) {
          let list = data.rows
          that.setData({
            list: list,
            isEnd: data.total <= list.length
          })
        } else {
          let list = that.data.list.concat(data.rows)
          that.setData({
            list: list,
            isEnd: data.total <= list.length
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  },
  requestHaddingOrderList() {
    var that = this

    let pageNum = this.data.pageIndex

    saleHangingOrderList(pageNum)
      .then(data => {
        console.log(data);
        if (pageNum == 1) {
          let list = data.rows
          that.setData({
            list: list,
            isEnd: data.total <= list.length
          })
        } else {
          let list = that.data.list.concat(data.rows)
          that.setData({
            list: list,
            isEnd: data.total <= list.length
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      pageIndex: 1,
      isEnd: false,
    }, () => {
      if (this.data.currentIndex == 0) {
        this.requestOrderList()
      } else {
        this.requestHaddingOrderList()
      }
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
      pageIndex: 1,
      isEnd: false,
    }, () => {
      if (this.data.currentIndex == 0) {
        this.requestOrderList()
      } else {
        this.requestHaddingOrderList()
      }
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
        pageIndex: 1 + this.data.pageIndex,
      }, () => {
        if (this.data.currentIndex == 0) {
          this.requestOrderList()
        } else {
          this.requestHaddingOrderList()
        }
      })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: "none"
      })
    }

  },

})