import {
  getSelectSku,
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
    index: -1,
    skus: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let index = options.index
    let skus = prevPage.data.list[index].hasSelectSkus || [];
    console.log(skus)
    this.setData({
      pictureUrl: options.pictureUrl,
      itemName: options.itemName,
      itemNo: options.itemNo,
      itemId: options.itemId,
      index: options.index,
      skus: skus
    }, () => {
      this.requestInfo()
    })

  },
  requestInfo() {
    let self = this;
    getSelectSku(this.data.itemId).then(data => {
        let listObj = data.data
        for (let i in listObj) {
          let obj = listObj[i];
          let index2 = self.data.skus.findIndex(item => (item.skuId == obj.skuId));
          if (index2 > -1) {
            listObj[i]['number'] = self.data.skus[index2].quantity
          } else {
            listObj[i]['number'] = 0
            // listObj[i]['number'] = ""
          }
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

    console.log(e);

    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {

      if (item.skuId == list[i].skuId) {
        if (parseInt(list[i].number) < parseInt(list[i].stock)) {
          list[i].number = 1 + Number(list[i].number)
        }
        console.log(list);
        break
      }
    }
    that.setData({
      list: list
    })
  },
  changeNumber(e) {
    console.log(e)
    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        let number = e.detail.value
        if (number.length >= 2 && number[0] == "0") {
          number = number.replace("0", "");
        } 
        else if (Number(number) > Number(list[i].stock)) {
          number = Number(list[i].stock)
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
        // if (parseInt(number) <= parseInt(list[i].stock)) {
        //   list[i].number = number
        // } else {
        //   wx.showToast({
        //     title: '输入数量不能大于库存',
        //     icon:"none"
        //   })
        // }

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
    let number = 0
    for (let i in this.data.list) {
      let obj = {
        skuId: this.data.list[i].skuId,
        quantity: this.data.list[i].number,
        itemNo: this.data.list[i].itemNo,
        itemName: this.data.list[i].itemName,
        category: this.data.list[i].categoryName,
        colour: this.data.list[i].colour,
        skuSize: this.data.list[i].skuSize,
        purchasePrice: this.data.list[i].purchasePrice,
        price: this.data.list[i].price,
        productCode: this.data.list[i].productCode,
      }
      if (this.data.list[i].number === "") {
        wx.showToast({
          title: "货号:" + this.data.list[i].productCode + '\n库存数量输入有误',
          icon: "none"
        })
        return
      }
      if (parseInt(obj.quantity) > 0) {
        list.push(obj)
      }
      number += parseInt(obj.quantity)
    }

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let listData = prevPage.data.list;
    let index = this.data.index
    listData[index].hasSelectSkus = list;
    listData[index].selectNumber = number;
    listData[index].falg = true
    prevPage.setData({
      list: listData,
    })
    wx.navigateBack({
      delta: 1,
    })
    // upDateOrderInfo(list).then(data=>{
    //   wx.showToast({
    //     title: '更新成功',
    //     icon:"success"
    //   })
    //   that.requestInfo()
    //   console.log(data);
    // })
    // .catch(error=>{
    //   console.log(error);
    // })


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