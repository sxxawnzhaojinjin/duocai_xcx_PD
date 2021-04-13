import {
  getOrderInfo,
  upDateOrderInfo
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictureUrl: "",
    itemName: "",
    itemNo: "",
    itemId: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      pictureUrl: options.pictureUrl,
      itemName: options.itemName,
      itemNo: options.itemNo,
      itemId: options.itemId,
    }, () => {
      this.requestInfo()
    })
  },
  requestInfo() {
    getOrderInfo(this.data.itemId)
      .then(data => {
        let listObj = data.data.skus
        for (let i in listObj) {
          listObj[i]['number'] = listObj[i].stock
        }
        this.setData({
          list: listObj
        })
        console.log(listObj);

      })
      .catch(error => {
        console.log(error);

      })
  },

  ridClilck(e) {
    // console.log(e);

    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        if (list[i].number <= 0 || list[i].number == "") {
          return
        }

        list[i].number = list[i].number - 1
        break
      }
    }
    that.setData({
      list: list
    })

  },
  addClilck(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId && list[i].number < 100000) {
        list[i].number = 1 + Number(list[i].number)
        break
      }
    }
    that.setData({
      list: list
    })
  },
  changeNumber(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        let number = e.detail.value
        if (number.length >= 2 && number[0] == "0") {
          number = number.replace("0", "");
        } else if (number > 100000) {
          number = 100000
        }
        if (!(/(^[0-9]\d*$)/.test(number)) && number !== "") {
          wx.showToast({
            title: '请输入正确数量',
          })
          number = list[i].number
        } else {
          number = number
        }
        list[i].number = number
        break
      }
    }
    that.setData({
      list: list
    })

  },
  submit() {
    var that = this
    var list = []

    for (let i in this.data.list) {
      let obj = {
        skuId: this.data.list[i].skuId,
        stock: this.data.list[i].number
      }
      if (this.data.list[i].number === "") {
        wx.showToast({
          title: "货号:" + this.data.list[i].productCode + '\n库存数量输入有误',
          icon: "none"
        })
        return
      }
      list.push(obj)
    }

    upDateOrderInfo(list)
      .then(data => {
        wx.showToast({
          title: '更新成功',
          icon: "success"
        })
        that.requestInfo()
        console.log(data);
      })
      .catch(error => {
        console.log(error);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})