import {
  goodsList
} from '../../api/newGoods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    pageNum: 1,
    pageSize: 10,
    hasMoreData: true,
    itemName: '',
    itemNo: '',
    // list: [],
    // isEnd: false,
    //下拉框
    select: false,
    search_name: '请选择',
    search_list: ['款号', '货品名称']

  },
  //全局点击
  outBtn() {
    this.setData({
      select: false
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

  /** 搜索框 **/
  onSearch(e) {
    console.log(e)
    let that = this,
      name = that.data.search_name,
      val = e.detail.value,
      search_itemName = '',
      search_itemNo = '';
    if (name == '请选择') {
      wx.showToast({
        title: '请选择要搜索的内容',
        icon: 'none'
      })
      return false;
    } else if (name == '款号') {
      search_itemNo = val
    } else if (name == '货品名称') {
      search_itemName = val
    }
    that.setData({
      pageNum: 1,
      itemName: search_itemName,
      itemNo: search_itemNo
    }, () => {
      wx.showLoading({
        title: '正在搜索中'
      });
      that.requestOrderList()

    })

  },
  /** 扫一扫 **/
  getCode() {
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        let result = res.result;
        that.setData({
          pageNum: 1,
          itemNo: result,
          search: ''
        })
      }
    })
  },

  /** 跳转到货品详情 **/
  itemClick(e) {
    let itemId = e.currentTarget.dataset.item.itemId
    wx.navigateTo({
      url: './goodsDetail?itemId=' + itemId,
    })
  },
  addDisClick() {
    wx.navigateTo({
      url: './goodsInfo',
    })
  },

  requestOrderList() {
    let that = this;
    let param = 'pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize + "&itemName=" + that.data.itemName + "&itemNo=" + that.data.itemNo;
    goodsList(param).then(res => {
        console.log(res);
        // if (that.data.pageNum == 1) {
        //   that.setData({
        //     list: data.rows,
        //     isEnd: data.total >= that.data.list.length
        //   })
        // } else {
        //   that.setData({
        //     list: that.data.list.concat(data.rows),
        //     isEnd: data.total >= that.data.list.length
        //   })
        // }
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