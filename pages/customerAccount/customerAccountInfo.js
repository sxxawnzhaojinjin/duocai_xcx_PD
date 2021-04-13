import { getCustomerAccountInfo, customerWriteOff } from '../../api/customerAccount'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    pageIndex: 1,
    isEnd: false,
    list: [],
    showModal: false,
    customerId:'',
    sumPrice:'',
    money:'',
    orderId:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let customerId = options.customerId

    this.setData({
      pageIndex: 1,
      isEnd: false,
      customerId: customerId
    }, () => {
      if (this.data.currentIndex == 0) {
        this.requestOrderList(customerId,'')
      } else {
        this.requestOrderList(customerId,'ON_ACCOUNT')
      }
    })
    
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
      pageIndex:1,
      list:[],
      isEnd:false
    },()=>{
      if(tabIndex == 0){
        this.requestOrderList(this.data.customerId,'')
      }else{
        this.requestOrderList(this.data.customerId,'ON_ACCOUNT')
      }
    })
    
  },


  requestOrderList(customerId,type) {
    var that = this

    let pageNum = this.data.pageIndex
    
    getCustomerAccountInfo(pageNum,customerId,type)
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
  * 弹窗
  */
  showDialogBtn(e) {
      let item = e.currentTarget.dataset.item
    
      console.log("--",item)
    
      this.setData({
        showModal: true,
        sumPrice: item.amount,
        money: item.amount,
        orderId: item.orderId
      })
  },
  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove() {

  },
  /**
  * 隐藏模态对话框
  */
  hideModal() {
      this.setData({
        showModal: false
      });
  },
  /**
  * 对话框取消按钮点击事件
  */
  onCancel() {
      this.hideModal();
  },
  /**
  * 对话框确认按钮点击事件
  */
  onConfirm() {
      

      console.log('付款方式---'+ this.data.payType)
      console.log(this.data.payType == '')
      if( this.data.payType == '' || this.data.payType == undefined){
        wx.showToast({
          title: '请选择付款方式',
          icon: "none"
        })
        return false;

      }else{
          var paymentMethod = ""
          var remarks = ""
          switch (this.data.payType) {
            case "0":
              paymentMethod = "WECHAT"
              remarks = [{
                "WECHAT": this.data.sumPrice.toString()
              }]
              break;
            case "1":
              paymentMethod = "ALIPAY"
              remarks = [{
                "ALIPAY": this.data.sumPrice.toString()
              }]
              break;
            case "2":
              paymentMethod = "CASH"
              remarks = [{
                "CASH": this.data.sumPrice.toString()
              }]
              break;
            case "3":
              paymentMethod = "PAY_BY_CARD"
              remarks = [{
                "PAY_BY_CARD": this.data.sumPrice.toString()
              }]
              break;
            case "-":
              paymentMethod = ""
              remarks = []
              break;
          }
  
          
          let data = {
            money: this.data.money,
            orderId: this.data.orderId,
            remarks: remarks
          };
          customerWriteOff(data).then(data => {
              if(data.code == 200){
                wx.showToast({
                  title: '销账成功',
                  icon: "none"
                })
                this.hideModal();
                this.setData({
                  pageIndex: 1
                })
                this.requestOrderList(this.data.customerId,'')
               
              }

          })
          .catch(error => {
            console.log(error);
          })
      }

      

  },

  //付款方式
  selectPay(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      payType: e.currentTarget.dataset.index
    })
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
    
    // this.setData({
    //   pageIndex: 1,
    //   isEnd: false,
    // }, () => {
    //   if (this.data.currentIndex == 0) {
    //     this.requestOrderList()
    //   } else {
    //     this.requestHaddingOrderList()
    //   }
    // })


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
        this.requestOrderList(this.data.customerId,'')
      } else {
        this.requestOrderList(customerId,'ON_ACCOUNT')
      }
    })
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
          this.requestOrderList(this.data.customerId,'')
        } else {
          this.requestOrderList(customerId,'ON_ACCOUNT')
        }
      })
    }else{
      wx.showToast({
        title: '没有更多了',
        icon:"none"
      })
    }
  },
})