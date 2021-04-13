let util = require("../../utils/util.js");
import {
  getWarehousingList
} from '../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    pageNum: 1,
    pageSize: 20,
    hasMoreData: true,
    //下拉框
    select: false,
    search_name: '请选择',
    search_list: ['采购人员', '入库单号'],
    //日期
    date: "",
    loading: false,
    //搜索条件
    search: '',
    byUser: '',
    entryNo: '',
    createTime: '',
    nowDate: ''

  },
  //全局点击
  outBtn() {
    this.setData({
      select: false
    })
  },
  itemClick(e) {
    console.log(e);
    let entryId = e.currentTarget.dataset.item.entryId
    // wx.navigateTo({
    //   url: './orderDetail?itemId='+itemId+"&itemName="+itemName+"&itemNo="+itemNo+"&pictureUrl="+pictureUrl,
    // })
    wx.navigateTo({
      url: './warehouseEntryDetail?entryId=' + entryId
    })
  },
  // 点击下拉框 
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  // 已选下拉框 
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      search_name: name,
      select: false
    })
  },
  // 日期选择器
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //清空输入框
  removeDate() {
    this.setData({
      date: ""
    })
  },

  /** 搜索input框 **/
  searchInput_Btn(e) {
    this.setData({
      search: e.detail.value
    })
  },
  /** 搜索按钮 **/
  searchBtn() {
    let that = this,
      name = that.data.search_name,
      val = that.data.search,
      search_byUser = '',
      search_entryNo = '';
    // if (name == '请选择') {
    //   wx.showToast({
    //     title: '请选择要搜索的内容',
    //     icon: 'none'
    //   })
    //   return false;
    // } else 
    if (name == '采购人员') {
      search_byUser = val
    } else if (name == '入库单号') {
      search_entryNo = val
    }
    that.setData({
      select: false,
      pageNum: 1,
      byUser: search_byUser, //采购人员
      entryNo: search_entryNo //入库单号
    }, () => {
      wx.showLoading({
        title: '正在搜索中'
      });
      that.requestOrderList()
    })

  },
  /** 搜索框 **/
  // onSearch(e) {
  //   console.log(e)
  //   let that = this,
  //     name = that.data.search_name,
  //     val = e.detail.value,
  //     search_byUser = '',
  //     search_entryNo = '';
  //   if (name == '请选择') {
  //     wx.showToast({
  //       title: '请选择要搜索的内容',
  //       icon: 'none'
  //     })
  //     return false;
  //   } else if (name == '采购人员') {
  //     search_byUser = val
  //   } else if (name == '入库单号') {
  //     search_entryNo = val
  //   }
  //   that.setData({
  //     pageNum: 1,
  //     byUser: search_byUser, //采购人员
  //     entryNo: search_entryNo //入库单号
  //   }, () => {
  //     wx.showLoading({
  //       title: '正在搜索中'
  //     });
  //     // that.requestOrderList()

  //   })

  // },

  requestOrderList() {
    let that = this;
    let beginTime = that.data.date == '' ? '' : (that.data.date) + ' 00:00:00';
    let endTime = that.data.date == '' ? '' : (that.data.date) + ' 23:59:59';
    let param = 'pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize + "&byUser=" + that.data.byUser + "&entryNo=" + that.data.entryNo + '&beginTime=' + beginTime + '&endTime=' + endTime;
    getWarehousingList(param)
      .then(res => {
        wx.hideLoading();
        let contentlistTem = that.data.dataList;
        if (res.code == 200) {
          if (that.data.pageNum == 1) {
            contentlistTem = []
          }
          let dataList = res.rows;
          if (res.total <= that.data.pageSize * that.data.pageNum) {
            that.setData({
              dataList: contentlistTem.concat(dataList),
              hasMoreData: false
            })
          } else {
            that.setData({
              dataList: contentlistTem.concat(dataList),
              hasMoreData: true,
              pageNum: that.data.pageNum + 1
            })
          }
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
    this.setData({
      nowDate: util.formatDate(new Date())
    });
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
      pageNum: 1,
      select: false
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    // if (!this.data.isEnd) {
    //   this.setData({
    //     pageNum: this.data.pageNum + 1
    //   }, () => {
    //     this.requestOrderList()
    //   })
    // } else {
    //   wx.showToast({
    //     title: '已经到底了',
    //     icon: 'none'
    //   })
    // }
    if (this.data.hasMoreData) {
      this.requestOrderList();
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }

  },

})