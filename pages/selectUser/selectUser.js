// pages/selectUser/selectUser.js
import { selectUserList} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[1,23,4],
    isEnd:false,
    pageIndex:1,
  },

  selectUser(e){
    let item = e.currentTarget.dataset.item
    console.log(e.currentTarget.dataset.item);

    let pages = getCurrentPages();               //当前页面
    let prevPage = pages[pages.length - 2];     //上一页面    
    let contact={
      contactPerson:item.contactPerson,
      contactPhone:item.contactPhone,
      customerName:item.customerName,
      customerId:item.customerId,
    }
    // let name= e.
    prevPage.setData({                          //直接给上移页面赋值
      contact: contact//e.currentTarget.dataset.id,
    });
    wx.navigateBack({
      delta:1
    })
    
  },

  requestUserList(){
    var that = this
    let pageNum = this.data.pageIndex
    selectUserList(pageNum)
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
    this.requestUserList()
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
        this.requestUserList()
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
          this.requestUserList()
      })
    }else{
      wx.showToast({
        title: '没有更多了',
        icon:"none"
      })
    }
  },


})