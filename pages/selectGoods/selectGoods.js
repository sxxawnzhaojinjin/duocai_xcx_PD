// pages/work/orderDetail.js
import {
  selectGoodsInfo,
} from "../../api/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    productCode: '',
    list: [],
    sum: 0,
    sumPrice: 0,
    itemName: "",
    suggestedPrice: "",
    stockTotal: 0,
    isSale: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    this.setData({
      productCode: options.productCode,
      itemName: options.itemName,
      suggestedPrice: options.suggestedPrice,
      stockTotal: options.stockTotal,
      isSale: options.isSale
    }, () => {
      this.requestInfo()
    })
  },
  requestInfo() {
    selectGoodsInfo(this.data.productCode)
      .then(data => {
        console.log(data)
        let list = data.data
        let lista = []
        let listb = []
        for (let i in list) {
          list[i]['number'] = 0
          list[i]['actualAmount'] = list[i].price
          if (this.data.isSale == 2) {
            list[i]['returnType'] = "NORMAL"


          }
          if (list[i].stock == 0) {
            listb.push(list[i])
          } else {
            lista.push(list[i])
          }
        }
        this.setData({
          list: lista.concat(listb)
        })

      })
      .catch(error => {
        console.log(error);

      })
  },

  changeReturnType(e) {

    let item = e.currentTarget.dataset.item
    let list = this.data.list
    console.log("---", item)
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        if (list[i]['returnType'] == "NORMAL") {
          list[i]['returnType'] = 'SUBSTANDARD'
        } else {
          list[i]['returnType'] = 'NORMAL'
        }
        break
      }
    }
    console.log("---", list)
    this.setData({
      list: list
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
        list[i].number = Number(list[i].number) - 1
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })

  },
  addClilck(e) {


    console.log(e);

    var that = this
    let item = e.currentTarget.dataset.item

    console.log('--', item)
    if (this.data.isSale == 1) {
      if (item.number >= item.stock) {
        return
      }
    }

    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        list[i].number = 1 + Number(list[i].number)
        console.log(list);
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })
  },
  ridPriceClilck(e) {
    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        if (list[i].actualAmount <= 0 || list[i].actualAmount == "") {
          return
        }
        list[i].actualAmount = Number(list[i].actualAmount) - 1
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })
  },
  addPriceClilck(e) {
    var that = this
    let item = e.currentTarget.dataset.item

    console.log('--', item)

    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        list[i].actualAmount = 1 + Number(list[i].actualAmount)
        console.log(list);
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })
  },
  changePrice(e) {

    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        let actualAmount = e.detail.value

        let v
        if (actualAmount == ".") {
          v = '0.'
        } else if (actualAmount.length >= 2 && actualAmount[0] == '0' && actualAmount[1] !== ".") {
          v = actualAmount.replace("0", '')
        } else if (actualAmount[actualAmount.length - 1] == '.' && actualAmount.split('.').length <= 2) {
          v = actualAmount;
        } else if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字

          v = e.detail.value

        } else {
          v = list[i].actualAmount
        }

        list[i].actualAmount = v
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })

  },
  changeNumber(e) {

    var that = this
    let item = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (item.skuId == list[i].skuId) {
        let number = e.detail.value

        if (!(/(^[0-9]\d*$)/.test(number)) && number !== "") {
          wx.showToast({
            title: '请输入正确数量',
          })
          number = list[i].number
        } else {
          number = e.detail.value
        }
        if (this.data.isSale == 1) {
          if (number >= item.stock) {
            number = item.stock
          }
        }
        list[i].number = Number(number)
        break
      }
    }
    that.setData({
      list: list
    }, () => {
      this.changeSum()
    })

  },

  changeSum() {
    let list = this.data.list
    let sum = 0;
    let price = 0
    for (let i in list) {
      sum = sum + Number(list[i].number)
      if (this.data.isSale == 1) {
        price = list[i].price

      } else {
        price = price + list[i].number * (list[i].actualAmount || 0)
      }
    }
    if (this.data.isSale == 1) {
      this.setData({
        sum: 0 + Number(sum),
        sumPrice: Number(sum * price).toFixed(2)
      })
    } else {
      this.setData({
        sum: 0 + Number(sum),
        sumPrice: Number(price).toFixed(2)
      })
    }

  },
  submit() {
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 3]; //上一页面

    let list = prevPage.data.goodsList

    let bodyList = this.data.list


    for (let index in list) {
      if (this.data.isSale == 1) {
        for (let j in bodyList) {
          if(bodyList[j].skuId == list[index].skuId){
            if (list[index].number + bodyList[j].number > list[index].stock) {
              wx.showToast({
                title: '货号:' + list[index].productCode + "库存不足,请检查",
                icon: "none"
              })
              return
            }
          }

          console.log('----  返回上一页列表数据 ----')
          console.log(list)
        }
      }

    }

    for (let i in bodyList) {
      let obj = bodyList[i]
      let isHave = 0
      for (let index in list) {

        if (list[index].skuId == obj.skuId) {
          list[index].number = Number(list[index].number) + Number(obj.number)
          isHave = 1
        }
      }
      if (isHave == 0 && obj.number != 0) {
        list.push(obj)
      }

    }

    console.log(list)

    let sumNumber = 0
    let sumPrice = 0
    for (let index in list) {
      sumNumber = Number(sumNumber) + Number(list[index].number)
      sumPrice = Number(sumPrice) + Number(list[index].number) * Number(list[index].actualAmount)
      list[index]["actualAmount"] = list[index]["actualAmount"] || 0
      if (this.data.isSale == 1) {
        if (list[index].number > list[index].stock) {
          wx.showToast({
            title: '货号:' + list[index].productCode + "库存不足,请检查",
            icon: "none"
          })
          return
        }

        console.log('----  返回上一页列表数据 ----')
        console.log(list)

      }

    }


    let maLingPrice = prevPage.data.maLingPrice

    prevPage.setData({ //直接给上移页面赋值
      goodsList: list, //e.currentTarget.dataset.id,
      sumNumber: Number(sumNumber),
      sumPrice: Number(sumPrice).toFixed(2),
      relPrice: Number(sumPrice - maLingPrice).toFixed(2)
    });
    wx.navigateBack({
      delta: 2
    })
  },


})