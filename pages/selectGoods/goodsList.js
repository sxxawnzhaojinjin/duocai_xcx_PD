import {
  selectGoodsList
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // pageNum: 1,
    // list: [],
    // isEnd: false,
    isSale: 1,
    dataList: [],
    pageNum: 1,
    pageSize: 10,
    hasMoreData: true,
    itemName: '',
    itemNo: '',
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
  // getCode() {
  //   let that = this;
  //   // 允许从相机和相册扫码
  //   wx.scanCode({
  //     success: (res) => {
  //       console.log(res)
  //       let result = res.result;
  //       that.setData({
  //         pageNum: 1,
  //         itemNo: result,
  //         search: ''
  //       })
  //     }
  //   })
  // },

  /** 点击列表 **/
  itemClick(e) {
    let item = e.currentTarget.dataset.item
    if (this.data.isSale == 1) {
      if (item.stockTotal <= 0) {
        wx.showToast({
          title: '所选货品库存不足',
          icon: "none"
        })
        return
      }
    }
    let productCode = item.itemId
    wx.navigateTo({
      url: './selectGoods?productCode=' + productCode + "&itemName=" + item.itemName + "&suggestedPrice=" + item.suggestedPrice + "&stockTotal=" + item.stockTotal + "&isSale=" + this.data.isSale,
    })

  },

  requestOrderList() {
    let that = this;
    let param = 'pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize + "&itemName=" + that.data.itemName + "&itemNo=" + that.data.itemNo;
    selectGoodsList(param)
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
    console.log("---", options)
    if (options.isSale && options.isSale == 1) {
      this.setData({
        isSale: 1,
      })
    } else if (options.isSale && options.isSale == 2) {
      this.setData({
        isSale: 2,
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
    this.setData({
      pageNum: 1,
      select: false
    }, () => {
      this.requestOrderList()
    })
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