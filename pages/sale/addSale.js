// pages/sale/addSale.js
import {
  saveSaleOrder,
  saleOrderInfo,
  saveSaleHangingOrder
} from '../../api/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    orderType: 0,
    goodsList: [],
    isShow: true,
    isGZ: false,
    payType: '-',
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
    //销售员
    saleBy:""

  },
  selectUser() {
    wx.navigateTo({
      url: '../selectUser/selectUser',
    })
  },

  selectGoods() {
    wx.navigateTo({
      url: '../selectGoods/goodsList?isSale=1',
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
      sumPrice = sumPrice + Number(list[index].number) * Number(list[index].price)
    }
    let maLingPrice = this.data.maLingPrice
    this.setData({ //直接给上移页面赋值
      goodsList: list, //e.currentTarget.dataset.id,
      sumNumber: sumNumber,
      sumPrice: sumPrice,
      relPrice: sumPrice - maLingPrice
    });
    if (list.length < 1) {
      this.setData({
        maLingPrice: 0,
        relPrice: 0,
      })
    }

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
    console.log(e)
    let number = e.detail.value

    let v
    if (this.data.sumNumber == 0) {
      v = 0
    }else if (number == ".") {
      v = '0.'
    } else if (number.length >= 2 && number[0] == '0' && number[1] !== ".") {
      v = number.replace("0", '')
    } else if (number[number.length - 1] == '.' && number.split('.').length <= 2) {
      v = e.detail.value;
    }  else if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字


      if (Number(this.data.sumPrice) < Number(number)) {
        v = e.detail.value.substring(0, e.detail.value.length - 1);
      } else {
        v = e.detail.value
      }
    } else {
      v = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    console.log(v);

    this.setData({
      relPrice: this.data.sumPrice - Number(v),
      maLingPrice: v
    })

  },
  selectPay(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      payType: e.currentTarget.dataset.index
    })
  },

  selectGZ() {
    this.setData({
      isGZ: !this.data.isGZ,
      payType: "-"
    })
  },
  /**
   * 挂单
   */
  toGuadan() {
    console.log('--- 挂单 ---')
    let body = this.combinationData('gd')
    if (body == 1) {
      return
    }
    console.log("body=>", body);
    // let dataSkus =  body.skus
   
    // for (let i in dataSkus) {
    //   if(dataSkus[i].quantity > dataSkus[i].stock){
    //     this.showMsg("货品库存不足")
    //     return false
    //   }
    // }

    saveSaleHangingOrder(body)
      .then(data => {
        wx.showToast({
          title: '挂单成功',
          duration: 2000,
          icon: "success"
        })
        setTimeout(() => {
          wx.navigateBack({
            complete: (res) => {},
          })
        }, 2000)
        console.log(data);
      })
      .catch(error => {
        console.log(error);

      })
  },
  /**
   * 删除
   */
  toDelete() {

  },
  /**
   * 销售
   */
  toSale() {
    console.log('sale-------')
 
    let body = this.combinationData("xs")
    if (body == 1) {
      return
    }
    
    // let dataSkus =  body.skus
    // let isTrue = dataSkus.findIndex(value => value.stock == 0)
    // if (isTrue !== -1) {
    //   this.showMsg("货品库存不足")
    //   return false
    // }

    saveSaleOrder(body)
      .then(data => {
        if(data.code == 200){
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
        }
       
        
      })
      .catch(error => {
        console.log(error);
        // wx.navigateBack()

      })

  },
  combinationData(type) {
    let isCheck = this.checkData(type)
    if (isCheck == 0) {
      return 1
    }
    var body = {}
    if (this.data.orderId !== "") {
      body.orderId = this.data.orderId
    }
    body["customerName"] = this.data.contact.customerName
    body["contacts"] = this.data.contact.contactPerson
    body["contactNumber"] = this.data.contact.contactPhone
    body["customerId"] = this.data.contact.customerId
    body["amountWipe"] = this.data.maLingPrice || 0
    var paymentMethod = ""

    if (this.data.isGZ) {
      body["settlementMethod"] = "ON_ACCOUNT"
      paymentMethod = ""
      remarks = JSON.stringify([])
    } else {
      body["settlementMethod"] = "CASH_SETTLEMENT"
      var remarks = ""
      switch (this.data.payType) {
        case "0":
          paymentMethod = "WECHAT"
          remarks = JSON.stringify([{
            "WECHAT": this.data.sumPrice.toString()
          }])
          break;
        case "1":
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
          remarks = "[]"
          break;
      }
    }


    body["paymentMethod"] = paymentMethod
    body["remarks"] = remarks

    let list = this.data.goodsList
    let arr = []
    console.log(list);
    
    for (let index in list) {
      let obj = list[index]
      obj['category'] = obj["categoryName"]
      obj['quantity'] = obj["number"]
      obj['size'] = obj["skuSize"]
      obj["actualAmount"] = obj["price"]
      obj["discountAmount"] = "0.00"
     
      let object = {
        actualAmount:obj["actualAmount"],
        category:obj["category"],
        categoryName:obj["categoryName"],
        colour:obj["colour"],
        discountAmount:obj["discountAmount"],
        itemId:obj["itemId"],
        itemName:obj["itemName"],
        itemNo:obj["itemNo"],
        positio:obj["positio"],
        price:obj["price"],
        productCode:obj["productCode"],
        purchasePrice:obj["purchasePrice"],
        quantity:obj["quantity"],
        skuId:obj["skuId"],
        skuName:obj["skuName"],
        skuSize:obj["skuSize"],
        stock:obj["stock"],
        supplierId:obj["supplierId"],
        supplierName:obj["supplierName"],
        unit:obj["unit"],
        pictureUrl:obj["pictureUrl"]
      }
      // delete object.number
      // delete object.size
      arr.push(object)
    }
    body["skus"] = arr
    body["supplierName"] = this.data.supplierName
    body["createBy"] = this.data.supplierId
    body["supplierId"] = this.data.supplierId
    return body
  },
  showMsg(msg) {
    wx.showToast({
      title: msg,
      icon: "none"
    })
  },
  checkData(type) {
    let dataList = this.data.goodsList
    if (this.data.contact.customerName == "") {
      this.showMsg("请选择客户")
      return 0
    }

   
    if (dataList.length < 1) {
      this.showMsg("请选择添加货品")
      return 0
    } else {
      for (let i in dataList) {
        if(dataList[i].quantity > dataList[i].stock){
          this.showMsg("货品库存不足")
          return 0
        }
      }
    }
    
    if (type == "xs") {
      if (this.data.payType == "-" && this.data.isGZ == false) {
        this.showMsg("请选择付款方式")
        return 0
      }

    }

    return 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      this.setData({
        orderType: 1,
        orderId: options.orderId,
        contact: {
          contactPerson: options.contacts,
          contactPhone: options.contactNumber,
          customerId: options.customerId,
        }
      }, () => this.requestInfo())
    }
    this.setData({
      supplierName: getApp().globalData.supplierName,
      supplierId: getApp().globalData.supplierId,
    })

  },
  //*********取单编辑********* */
  requestInfo() {
    let orderId = this.data.orderId
    let that = this
    saleOrderInfo(orderId)
      .then(data => {
        that.setDataFromNet(data.data)

      })
      .catch(error => {
        console.log(error);

      })
  },

  setDataFromNet(data) {
    console.log('合计金额------')
    console.log(data);
   
    let list = data.skus
    for (let index in list) {
      let obj = list[index]
      obj["number"] = obj["quantity"]
      obj["actualAmount"] = obj["price"]
      obj["discountAmount"] = "0.00"
    }
   
    this.setData({
      orderId: data.orderId,
      orderType: 1,
      contact: Object.assign({
        customerName: data.customerName,
      }, this.data.contact),
      sumNumber: data.totalQuantity,
      sumPrice: data.amountsPayable,
      maLingPrice: data.amountWipe || 0,
      relPrice: data.amount,
      goodsList: list,
      saleBy: data.createBy
    })

  },

})