import {
  getPrintGoodsChoiceList,
  addPrintGoods
} from '../../api/printTag'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_itemNo: '',
    search_productCode: '',
    search_skuName: '',
    dataList: [],
    pageNum: 1,
    pageSize: 10,
    hasMoreData: true,
    //选中
    checkedListId: '',
    checkedLength: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //款号输入框
  itemNo_input(e) {
    this.setData({
      search_itemNo: e.detail.value
    })
  },
  //货号输入框
  productCode_input(e) {
    this.setData({
      search_productCode: e.detail.value
    })
  },
  //货品名称输入框
  skuName_input(e) {
    this.setData({
      search_skuName: e.detail.value
    })
  },

  //清空输入框
  removeDate(e) {
    let that = this,
      name = e.currentTarget.dataset.name;
    switch (name) {
      case 'search_itemNo':
        this.setData({
          search_itemNo: ""
        })
        break;
      case 'search_productCode':
        this.setData({
          search_productCode: ""
        })
        break;
      case 'search_skuName':
        this.setData({
          search_skuName: ""
        })
        break;
    }
  },


  /** 搜索按钮 **/
  searchBtn() {
    let that = this;
    that.setData({
      pageNum: 1,
      checkedLength: 0
    },()=> {
      wx.showLoading({ title:'正在搜索中'});
      setTimeout(() => {
        this.getList()
      }, 1500);
    })

  },

  /** 获取列表 **/
  getList() {
    let that = this;
    let param = 'pageNum=' + that.data.pageNum + "&pageSize=" + that.data.pageSize + '&itemNo=' + that.data.search_itemNo + '&productCode=' + that.data.search_productCode + '&skuName=' + that.data.search_skuName;
    console.log(param)

    getPrintGoodsChoiceList(param).then(res => {
      wx.hideLoading()
      let contentlistTem = that.data.dataList;
      if (res.code == 200) {
        if (that.data.pageNum == 1) {
          contentlistTem = []
        }
        let dataList = res.rows;
        for (let j in dataList) {
          dataList[j].checked = false
        }

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
    }).catch(error => {
      console.log(error);
    })

  },


  /** 选中 **/
  checkboxChange(e) {
    let list = this.data.dataList
    let checkedVal = e.detail.value
    for (let key in list) {
      if (checkedVal.includes(list[key].skuId)) {
        list[key].checked = true
      } else {
        list[key].checked = false
      }
    }
    this.setData({
      // checkedListId: checkedVal,
      checkedLength: checkedVal.length,
      dataList: list
    })
  },

  /** 添加 **/
  add() {
    let that = this,
      list = that.data.dataList,
      checkedIdArr = that.data.checkedListId;
    // let checkedList = list.filter(item => checkedIdArr.indexOf(item.skuId) > -1);
    let checkedList = list.filter(item => {
      return item.checked == true
    })
    if (checkedList.length == 0) {
      wx.showToast({
        title: '请先选择要添加的商品',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    addPrintGoods(checkedList).then(data => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500);
      })
      .catch(error => {
        console.log(error);
      })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   pageNum: 1
    // }, () => {
    //   this.getList()
    // })
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    this.setData({
      pageNum: 1
    }, () => {
      that.getList()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getList();
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  },





})