import {
  getSaleCount,
  getSaleList,
  getReturnCount,
  getReturnList
} from "../../api/finance"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    list: [],
    list2: [],
    total: 0,
    isEnd: false,
    isEnd2: false,
    tablepage: {
      pageNum: 1,
      pageSize: 20,
      supplierId: getApp().globalData.supplierId
    },
    tablepage2: {
      pageNum: 1,
      pageSize: 20,
      supplierId: getApp().globalData.supplierId
    },
    countInfo: {},
    countInfo2: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let supplierId = getApp().globalData.supplierId
    let obj = this.data.tablepage;
    obj.supplierId = supplierId;
    this.setData({
      tablepage: obj
    })

    let obj2 = this.data.tablepage2;
    obj2.supplierId = supplierId;
    this.setData({
      tablepage2: obj2
    })
    this.getSaleList();
    this.getRList();
    this.getSaleCount(supplierId);
    this.getRCount(supplierId);
  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  //获取收入统计
  getSaleCount(supplierId) {
    let self = this;
    getSaleCount(supplierId).then(res => {
      this.setData({
        countInfo: res.data
      })
    }).catch(err => {
      console.log(err);
    })

  },

  //获取收入的列表
  getSaleList() {
    let self = this;
    getSaleList(this.data.tablepage).then(res => {
      wx.stopPullDownRefresh({})
      let rows = res.rows
      // let maxPage = res.maxPage
      if (rows.length > 0) {
        let obj = this.data.tablepage;
        if (rows.length <= obj.pageSize) {
          let a = self.data.list.concat(rows);
          let isEnd = this.data.isEnd;
          if (a.length == res.total) {
            isEnd = true
          }
          self.setData({
            list: a,
            total: res.total,
            isEnd: isEnd
          })
        }
        obj.pageNum = parseInt(obj.pageNum) + 1;
        self.setData({
          tablepage: obj
        })
      } else {
        // wx.showToast({
        //   title: '无数据',
        // });
      }
    }).catch(err => {
      wx.stopPullDownRefresh({})
      console.log(err);
    })
  },


  //获取支出统计
  getRCount(supplierId) {
    let self = this;
    getReturnCount(supplierId).then(res => {
      this.setData({
        countInfo2: res.data
      })
    }).catch(err => {
      console.log(err);
    })

  },

  //获取支出的列表
  getRList() {
    let self = this;
    getReturnList(this.data.tablepage2).then(res => {
      wx.stopPullDownRefresh({})
      let rows = res.rows
      // let maxPage = res.maxPage
      if (rows.length > 0) {
        let obj = this.data.tablepage2;
        if (rows.length <= obj.pageSize) {
          let a = self.data.list2.concat(rows);
          let isEnd = this.data.isEnd2;
          if (a.length == res.total) {
            isEnd = true
          }
          self.setData({
            list2: a,
            isEnd2: isEnd
          })
        }
        obj.pageNum = parseInt(obj.pageNum) + 1;
        self.setData({
          tablepage2: obj
        })
      } else {
        // wx.showToast({
        //   title: '无数据',
        // });
      }
    }).catch(err => {
      wx.stopPullDownRefresh({})
      console.log(err);
    })
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
    let c = this.data.currentIndex;
    if (c == 0) {
      let obj = this.data.tablepage;
      obj.pageNum = 1;
      this.setData({
        list: [],
        tablepage: obj,
        isEnd:false
      })
      this.getSaleList();
    } else {
      let obj = this.data.tablepage2;
      obj.pageNum = 1;
      this.setData({
        list2: [],
        tablepage2: obj,
        isEnd2:false
      })
      this.getRList();
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let c = this.data.currentIndex;
    if (c == 0) {
      if (!this.data.isEnd) {
        this.getSaleList();
      }
    } else {
      if (!this.data.isEnd2) {
        this.getRList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})