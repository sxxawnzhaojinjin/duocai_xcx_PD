// pages/sale/addSale.js
import {
  saveBackOrder,
  backOrderToIn
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    isShow: true,
    isGZ: false,
    payType: '-',
    createBy: "",
    contact: {
      contactPerson: "",
      contactPhone: "",
      customerName: "",
      customerId: "",
    },
    sumNumber: 0,
    sumPrice: 0,
    maLingPrice: 0,
    relPrice: 0,
    supplierName: "",
    supplierId: '',

  },
  showMore() {
    if (this.data.goodsList.length < 1) {
      return
    }
    this.setData({
      isShow: !this.data.isShow
    })
  },
  onchangeMaLingPrice(e) {
    let number = e.detail.value

    let v
    if (this.data.sumNumber == 0) {
      v = 0
    } else if (number == ".") {
      v = '0.'
    } else if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      if (this.data.sumPrice < number) {
        v = e.detail.value.substring(0, e.detail.value.length - 1);
      } else {
        v = e.detail.value;

      }
    } else {
      v = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    console.log(v);

    this.setData({
      relPrice: this.data.sumPrice - v,
      maLingPrice: v
    })

  },
  selectPay(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      payType: e.currentTarget.dataset.index
    })


  },
  selectUser() {
    wx.navigateTo({
      url: '../selectUser/selectUser',
    })
  },
  selectGoods() {
    wx.navigateTo({
      url: '../selectGoods/goodsList?isSale=2',
    })
  },
  delectGoods(e) {
    let item = e.currentTarget.dataset.item
    let list = this.data.goodsList
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        list.splice(i, 1)
        break
      }
    }
    console.log(list);
    let sumNumber = 0
    let sumPrice = 0
    for (let index in list) {
      sumNumber = sumNumber + Number(list[index].number)
      sumPrice = sumPrice + Number(list[index].number) * Number(list[index].actualAmount)
    }
    let maLingPrice = this.data.maLingPrice
    this.setData({ //直接给上移页面赋值
      goodsList: list, //e.currentTarget.dataset.id,
      sumNumber: sumNumber,
      sumPrice: sumPrice,
      relPrice: sumPrice - maLingPrice
    });

  },
  /**
   * 退货
   */
  toBack() {

    let body = this.combinationData()
    if (body == 1) {
      return
    }
    console.log("body=>", body);
    var that = this
    saveBackOrder(body)
      .then(data => {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          icon: "success"
        })
        setTimeout(() => {
          wx.navigateBack({
            complete: (res) => {},
          })
        }, 2000)
        console.log(data);
        // that.requestBackOrderToIn(data.data)
      })
      .catch(error => {
        console.log(error);

      })
  },
  requestBackOrderToIn(entryId) {
    backOrderToIn(entryId)
      .then(data => {
        wx.showToast({
          title: '提交成功',
          duration: 2000,
          icon: "success"
        })
        setTimeout(() => {
          wx.navigateBack({
            complete: (res) => {},
          })
        }, 2000)

      })
      .catch(error => {
        console.log(error);

      })
  },
  combinationData() {
    let isCheck = this.checkData()
    if (isCheck == 0) {
      return 1
    }
    var body = {}


    body["customerName"] = this.data.contact.customerName
    body["contacts"] = this.data.contact.contactPerson
    body["contactNumber"] = this.data.contact.contactPhone
    body["customerId"] = this.data.contact.customerId
    body["amountTotal"] = this.data.sumPrice

    // if (this.data.isGZ) {
    //   body["settlementMethod"] = "ON_ACCOUNT"
    // } else {
    //   body["settlementMethod"] = "CASH_SETTLEMENT"
    // }
    body["settlementMethod"] = "CASH_SETTLEMENT"

    var paymentMethod = ""
    var remarks = ""
    switch (this.data.payType) {
      case "0":
        paymentMethod = "WECHAT"
        remarks = JSON.stringify([{
          "WECHAT": this.data.sumPrice.toString()
        }])

        break;
      case "1":
        console.log('bbbbb');
        paymentMethod = "ALIPAY"
        remarks = JSON.stringify([{
          "ALIPAY": this.data.sumPrice.toString()
        }])
        break;
      case "2":
        paymentMethod = "CASH"
        remarks = JSON.stringify([{
          "CASH": this.data.sumPrice.toString()
        }])
        break;
      case "3":
        paymentMethod = "PAY_BY_CARD"
        remarks = JSON.stringify([{
          "PAY_BY_CARD": this.data.sumPrice.toString()
        }])
        break;
      case "-":
        paymentMethod = ""
        remarks = "{}"
        break;
    }

    body["paymentMethod"] = "UNION"
    body["remarks"] = remarks

    let list = this.data.goodsList
    for (let index in list) {
      let obj = list[index]
      obj['category'] = obj["categoryName"]
      obj['quantity'] = obj["number"]
      obj['size'] = obj["skuSize"]
      // obj["actualAmount"] = obj["price"]
      obj["discountAmount"] = "0.00"
      // delete obj.number
      // delete obj.size
    }
    body["skus"] = list
    body["supplierName"] = this.data.supplierName
    body["saleBy"] = this.data.supplierName
    body["supplierId"] = this.data.supplierId
    return body
  },
  showMsg(msg) {
    wx.showToast({
      title: msg,
      icon: "none"
    })
  },
  checkData() {

    if (this.data.contact.customerName == "") {
      this.showMsg("请选择客户")
      return 0
    }

    if (this.data.goodsList.length < 1) {
      this.showMsg("请选择添加货品")
      return 0
    }
    if (this.data.payType == "-") {
      this.showMsg("请选择付款方式")
      return 0
    }

    return 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      supplierName: getApp().globalData.supplierName,
      supplierId: getApp().globalData.supplierId,
    })
  },


})