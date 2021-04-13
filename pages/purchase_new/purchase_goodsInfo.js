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
    /** 新需求表格更改 **/
    trList: [],
    thList: [],
    //最外层表格
    rightList: [],
    arryList: [],
    //原列表
    oldList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pictureUrl: options.pictureUrl,
      itemName: options.itemName,
      itemNo: options.itemNo,
      itemId: options.itemId
    }, () => {
      this.requestInfo()
    })

  },
  requestInfo() {
    let that = this;
    getSelectSku(this.data.itemId).then(data => {
        let listObj = data.data;
        let oldList = data.data;

        let colors = [],
          skusizes = []

        for (let i in listObj) {
          let obj = listObj[i];
          // listObj[i]['quantity'] = 0

          let colour = obj.colour
          let skuSize = obj.skuSize
          colors.push(colour);
          skusizes.push(skuSize);
        }
        colors = Array.from(new Set(colors))

        skusizes = Array.from(new Set(skusizes))

        let arryList = []
        let topobj = {
          item_left: this.data.itemId,
          sku: skusizes
        }
        arryList.push(topobj)

        for (let j in colors) {
          let item1 = colors[j];
          let skuIds = []
          for (let z in skusizes) {
            let item2 = skusizes[z]
            let n = listObj.findIndex(item => (item.skuSize == item2 && item.colour == item1));
            if (n > -1) {
              let skuId = listObj[n].skuId
              let skuSize = listObj[n].skuSize
              let skuobj = {
                // quantity: 1,
                quantity: "",
                skuId: skuId,
                skuSize: skuSize

              }
              skuIds.push(skuobj)
            }
          }
          let obj2 = {
            item_left: item1,
            sku: skuIds
          }
          arryList.push(obj2)

        }
        this.setData({
          arryList: arryList,
          oldList: oldList
        })
        // console.log('重组数据==', arryList);

        // let {
        //   trList,
        //   thList
        // } = that.getThAndTrList(listObj);
        // let json = [{
        //   // itemNo: itemNo,
        //   // id: id,
        //   th: thList,
        //   tr: trList,
        //   list: listObj
        // }];

        // console.log('json', json)

        // this.setData({
        //   list: listObj,
        //   trList: trList,
        //   thList: thList,
        //   rightList: json
        // })

      })
      .catch(error => {
        console.log(error);
      })
  },

  // input
  changeNum(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let val = e.detail.value;
    let list = this.data.arryList;
    // if (val == 0 || val == '') {
    //   val = val.replace('0', '1')
    // }
    if (val.length >= 2 && val[0] == "0") {
      val = val.replace("0", "");
    } else if (val > 100000) {
      val = 100000
    }
    list[index1].sku[index2].quantity = val;
    this.setData({
      arryList: list
    })
  },
  changeNum_blur(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let val = e.detail.value;
    let list = this.data.arryList;
    // if (val == '' || val == undefined || val <= 0) {
    //   list[index1].sku[index2].quantity = 1;
    //   this.setData({
    //     arryList: list
    //   })
    // }
    if (val == '' || val == undefined) {
      list[index1].sku[index2].quantity = "";
    } else if (val <= 0) {
      list[index1].sku[index2].quantity = 0;
    }
    this.setData({
      arryList: list
    })

  },

  // // 获取tr th
  // getThAndTrList(list) {
  //   let th = [];
  //   let tr = [];
  //   let trList = [];
  //   // 解析原始数据 获取X,Y轴列表长度
  //   list.forEach(item => {
  //     if (th.indexOf(item.skuSize) === -1) {
  //       th.push(item.skuSize);
  //     }
  //     if (tr.indexOf(item.colour) === -1) {
  //       tr.push(item.colour);
  //     }
  //   });
  //   tr.forEach(item => {
  //     trList.push({
  //       name: item
  //     });
  //   });
  //   return {
  //     trList: trList,
  //     thList: th
  //   };
  // },


  submit() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    let listData = prevPage.data.goodsList;
    console.log(listData, 'list')

    let that = this;
    let checkList = that.data.arryList;
    let oldList = that.data.oldList;

    for (let i = 0; i < checkList.length; i++) {
      if (i > 0) {
        let skuList = checkList[i].sku;
        for (let j = 0; j < skuList.length; j++) {
          let items = skuList[j];
          // if (items.quantity != '' || items.quantity != 0) {
          let n = oldList.findIndex(item => (item.skuId == items.skuId));
          if (n > -1) {
            oldList[n].quantity = Number(items.quantity)
          }
          // }
        }

      }
    }

    // for (let i = 0; i < oldList.length; i++) {
    //   oldList[i].pictureUrl = that.data.pictureUrl
    // }

    let hasselectItem = []
    oldList.forEach(listItem => {
      listItem.pictureUrl = that.data.pictureUrl
      if (listItem.quantity != "" || listItem.quantity != 0) {
        hasselectItem.push(listItem);
      }
    })
    console.log(hasselectItem, 'hasselectItem')


    if (listData.length == 0) {
      listData = hasselectItem

    } else {
      //合并数组并过滤掉相同skuId,并替换采购数量
      listData = [...listData, ...hasselectItem];
      listData = listData.reduce((res, cur, index) => {
        let hasValue = res.findIndex(current => {
          return current.skuId === cur.skuId;
        });
        hasValue === -1 && res.push(cur);
        hasValue !== -1 &&
          (res[hasValue].quantity =
            // Number(res[hasValue].quantity) + Number(cur.quantity)
           (Number(res[hasValue].quantity) + Number(cur.quantity)) > 100000 ? 100000 : (Number(res[hasValue].quantity) + Number(cur.quantity)));
        return res;
      }, []);
    }

    console.log(listData, 'listData')

    prevPage.setData({
      goodsList: listData,
    })

    wx.navigateBack({
      delta: 2,
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