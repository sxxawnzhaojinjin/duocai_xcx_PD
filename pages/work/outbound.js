import {
  getSelectProduct,
  saveOutBill,
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isEnd: false,
    // // hasSelectSkus: [],
    itemId: '', //选中项
    list: [],
    index: -1,
    // dataList: [],
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
    console.log(e);
    let index = e.currentTarget.dataset.index
    let itemId = e.currentTarget.dataset.item.itemId
    let itemName = e.currentTarget.dataset.item.itemName
    let itemNo = e.currentTarget.dataset.item.itemNo
    let pictureUrl = e.currentTarget.dataset.item.itemPhoto
    let item = e.currentTarget.dataset.item
    if (item.stockTotal <= 0) {
      wx.showToast({
        title: '所选货品库存不足',
        icon: "none"
      })
      return
    }
    this.setData({
      itemId: itemId,
      index: index
    })
    wx.navigateTo({
      url: './outboundDetail?itemId=' + itemId + "&itemName=" + itemName + "&itemNo=" + itemNo + "&pictureUrl=" + pictureUrl + "&index=" + index,
    })
  },

  requestOrderList() {
    let that = this;
    let param = 'pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize + "&itemName=" + that.data.itemName + "&itemNo=" + that.data.itemNo;
    getSelectProduct(param).then(res => {
        // console.log(data);
        // let rows = data.rows
        // for (let j in rows) {
        //   rows[j].falg = false
        // }
        // if (that.data.pageNum == 1) {
        //   that.setData({
        //     list: rows,
        //     isEnd: data.total >= data.rows.length
        //   })
        // } else {
        //   let list = that.data.list.concat(rows)
        //   that.setData({
        //     list: list,
        //     isEnd: data.total >= list.length
        //   })
        // }
        wx.hideLoading();
        let contentlistTem = that.data.list;
        if (res.code == 200) {
          if (that.data.pageNum == 1) {
            contentlistTem = []
          }
          let list = res.rows;
          for (let j in list) {
            list[j].falg = false
          }

          if (res.total <= that.data.pageSize * that.data.pageNum) {
            that.setData({
              list: contentlistTem.concat(list),
              hasMoreData: false
            })
          } else {
            that.setData({
              list: contentlistTem.concat(list),
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
      pageNum: 1,
      select: false
    }, () => {
      this.requestOrderList()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      select: false,
      search_name: '请选择',
      search: ""
    })
  },

  cancel(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    list[index].falg = !list[index].falg
    this.setData({
      list: list
    })
  },

  submit() {
    this.setData({
      select: false
    })
    let list = this.data.list
    let sku = []
    for (let i in list) {
      if (list[i].falg) {
        let skuList = list[i].hasSelectSkus
        for (let j in skuList) {
          sku.push(skuList[j])
        }
      }
    }
    if (sku.length < 1) {
      wx.showToast({
        title: '请选择要出库的货品',
        icon: "none"
      })
      return
    }
    var that = this
    saveOutBill({
        skus: sku
      }).then(data => {
        wx.navigateTo({
          url: './outboundEntryDetail?entryId=' + data.data,
        })
        that.setData({
          pageNum: 1
        }, () => {
          this.requestOrderList()
        })
        console.log(data);

      })
      .catch(error => {
        console.log(error);

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