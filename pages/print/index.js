import {
  getPrintList,
  removePrintGoods,
  getPrintGoodsInfo,
  clearPrintGoods
} from '../../api/printTag'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isData: false,
    dataList: [],
    showModal: false,
    // 设置开始的位置
    startX: 0,
    startY: 0,
    pageNum: 1,
    isEnd: false,
    modalId: "2",
    //打印详情
    printTagInfo: {},
    //打印数量
    printNum: 1,


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
      pageNum: 1,
      showModal: false
    }, () => {
      this.getList()
    })
  },

  /** 获取列表 **/
  getList() {
    let that = this
    let param = 'pageNum=' + this.data.pageNum + "pageSize=20"
    getPrintList(param).then(data => {
        if (that.data.pageNum == 1) {
          that.setData({
            dataList: data.rows,
            isEnd: data.total >= data.rows.length
          })
        } else {
          let list = that.data.list.concat(data.rows)
          that.setData({
            dataList: list,
            isEnd: data.total >= list.length
          })
        }

      })
      .catch(error => {
        console.log(error);
      })
  },

  // 开始滑动
  touchStart(e) {
    // console.log('touchStart=====>', e);
    let dataList = [...this.data.dataList]
    dataList.forEach(item => {
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    this.setData({
      dataList: dataList,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },

  touchMove(e) {
    // console.log('touchMove=====>', e);
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let dataList = [...this.data.dataList]

    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    dataList.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 30) {
        return
      }
      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    })
    this.setData({
      dataList
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  /** 打印吊牌详情 **/
  getPrintTag(skuId) {
    getPrintGoodsInfo(skuId).then(data => {
        this.setData({
          printTagInfo: data.data
        })
      })
      .catch(error => {
        console.log(error);
      })
  },
  /** 查看吊牌 **/
  see(e) {
    let skuId = e.currentTarget.dataset.id;
    this.setData({
      showModal: true,
      modalId: 2
    }, () => {
      this.getPrintTag(skuId)
    })
  },

  /** 关闭吊牌 **/
  close() {
    this.setData({
      showModal: false
    })
  },

  // 删除
  delItem(e) {
    let id = e.currentTarget.dataset.id;
    removePrintGoods(id).then(data => {
        wx.showToast({
          title: '移除成功',
          icon: 'none',
          duration: 2000
        })
        this.getList()
      })
      .catch(error => {
        console.log(error);
      })
  },


  /** 清空 **/
  emptyBtn() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否清空全部商品',
      success(res) {
        if (res.confirm) {
          clearPrintGoods().then(data => {
              wx.showToast({
                title: '清空成功',
                icon: 'none',
                duration: 2000
              })
              that.getList()
            })
            .catch(error => {
              console.log(error);
            })
        }
      }
    })
  },


  /** 列表点击 **/
  itemClick(e) {
    let skuId = e.currentTarget.dataset.id;
      // let item = e.currentTarget.dataset.item;
    this.setData({
      showModal: true,
      printNum: 1,
      modalId: 1
    }, () => {
      this.getPrintTag(skuId)
    })
  },

  /** 模态框 **/
  toShowModal(e) {
    this.setData({
      showModal: true
    })
  },
  hideModal() {
    this.setData({
      showModal: false
    });
  },

  /** 取消 **/
  cancel() {
    this.setData({
      showModal: false
    });
  },

  /** 打印数量 **/
  printNum_input(e) {
    let val = e.detail.value;
    if(val == 0 || val == ''){
        val = val.replace('0','1')
    }
    this.setData({
      printNum: val
    })

  },
  printNum_blur(e) {
    let val = e.detail.value;
    if (val == '' || val == undefined || val <= 0) {
      this.setData({
        printNum: 1
      })
    }
  },

  /** 开始打印 **/
  startPrintBtn(e) {
    let printData = e.currentTarget.dataset.item;
    wx.navigateTo({
      // url: '../printTag/index?printData=' + JSON.stringify(printData) + '&num=' + this.data.printNum,
      url: '../printTag_new/index?printData=' + JSON.stringify(printData) + '&num=' + this.data.printNum,
    })
  },


  /** 跳转到吊牌打印列表 **/
  goPrintGoodsList() {
    wx.navigateTo({
      url: 'printGoodsList'
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNum: 1
    }, () => {
      this.getList()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isEnd) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.getList()
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
  },

})