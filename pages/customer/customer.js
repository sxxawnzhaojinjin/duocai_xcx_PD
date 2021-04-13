import {customerList, delCustomer} from '../../api/customer'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    // 设置开始的位置
    startX: 0,
    startY: 0,
    pageNum:1,
    isEnd:false

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
      pageNum:1
    },()=>{
      this.getCustomerList()
    })
  },
  
  /** 获取列表 **/
  getCustomerList(){
    var that = this
    let param='pageNum='+this.data.pageNum+"pageSize=20"
    customerList(param).then(data=>{
      if(that.data.pageNum == 1){
        that.setData({
          dataList:data.rows,
          isEnd:data.total>=that.data.dataList.length
        })
      }else{
        that.setData({
          dataList:that.data.dataList.concat(data.rows),
          isEnd:data.total>=that.data.dataList.length
        })
      }
    
    })
    .catch(error=>{
      console.log(error);
    })
  },

  //新增/编辑客户
  goCustomerInfo(e){
    let customerId = e.currentTarget.dataset.id;
    if(customerId){
      wx.navigateTo({
        url: './customerInfo?id=' + customerId
      })
    }else{
      wx.navigateTo({
        url: './customerInfo'
      })
    }
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

  // 删除
  delItem(e) {
    let customerId = e.currentTarget.dataset.id;
    delCustomer(customerId).then(data => {
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      }) 
      this.getCustomerList()
    })
    .catch(error => {
      console.log(error);
    })
     
    // let dataList = [...this.data.dataList];
    // for (let i = 0; i < dataList.length; i++) {
    //   const item = dataList[i];
    //   item.isTouchMove = false;
    //   if (item.customerId === id) {
    //     dataList.splice(i, 1);
    //     break;
    //   }
    // }
    // this.setData({
    //   dataList
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNum:1
    },()=>{
      this.getCustomerList()
    })
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isEnd){
      this.setData({
        pageNum:this.data.pageNum+1
      },()=>{
        this.getCustomerList()
      })
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      })
    }
  },

})