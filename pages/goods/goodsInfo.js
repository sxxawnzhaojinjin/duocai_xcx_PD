const app = getApp();
let util = require("../../utils/util.js");
import {
  // listGoodsType,
  // brandList,
  // styleList,
  // seasonList,
  // materialsList,
  // addGoods,
  // editGoods,
  goodsInfo
} from '../../api/goods'

import {
  addGoods,
  editGoods
} from '../../api/newGoods'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //店铺id
    shopId: "",
    itemId: "",
    isShow: true,
    HTTP: app.globalData.url + '/appletStock/file/img/upload',
    personImage: './../../images/addImg.png',
    itemPhoto: '',
    data: {},
    pageNum: 1,
    pageSize: 10000,
    // //分类
    // categoryList: [],
    // multiObjArray: [
    //   [],
    //   []
    // ],
    // multiIndex: ['', ''],
    // //品牌
    // brandList: [],
    // brandIndex: '',
    // //风格
    // styleList: [],
    // styleIndex: '',
    // //季节
    // seasonList: [],
    // seasonIndex: '',
    // //面料
    // materialsList: [],
    // materialsIndex: '',

    // //分类id
    // parentId: '',
    // childId: '',

    //分类名称
    categoryName: "",
    categoryId: "",
    //尺码
    sizes: "",
    size: [],
    //颜色
    colours: "",
    color: [],

    supplier: "",
    supplierId: "",

    year: '',
    status: 0,
    /** 入库表格 **/
    // isTrue: false,
    thList: ["尺码", "颜色", "入库数量"],
    tdList: [],
    /***** 新增入库 ******/
    isWarehouse: false,
    /** 编辑 **/
    editId: "",
    isEdit: false,
    editCheckedSizes: "",
    editCheckedColours: "",
    oldSkusList: [],
    //点击保存
    isClick: false,
    //日期
    startYear:"",
    endYear:""


  },
  showMore() {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  onShow() {
    this.editWarehouseList(); 
    //起始日期
    let year =util.formatYear(new Date());
    let startYear = Number(year)-5;
    let endYear = Number(year)+3;
    this.setData({
      startYear: startYear,
      endYear: endYear
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.itemId) {
      wx.setNavigationBarTitle({
        title: '编辑货品'
      })
      that.setData({
        itemId: options.itemId
      }, () => {
        that.getGoodsInfo()
      })
    } else {
      that.setData({
        isEdit: false,
        isWarehouse: false
      })
    }
    this.setData({
      shopId: getApp().globalData.shopId,
      // supplierName: getApp().globalData.supplierName,
      // supplierId: getApp().globalData.supplierId,
    })
    //分类
    // that.getCategoryList();
    // //更多下拉列表
    // that.getMoreList();

  },
  changeDate(e) {
    this.setData({
      year: e.detail.value
    })
  },
  //点击换手机相册或者电脑本地图片    
  changeAvatar() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePath = res.tempFilePaths[0];
        let header = {
          'content-type': 'application/json'
        };
        // if (getApp().globalData.token) {
        //   header['Authorization-app'] = 'Bearer ' + getApp().globalData.token;
        // }
        that.setData({
          itemPhoto: tempFilePath
        })
        wx.uploadFile({
          url: that.data.HTTP,
          filePath: tempFilePath,
          name: 'fileField',
          header: header,
          // formData: {
          //   fileField: tempFilePath
          // },
          success(res) {
            let data = JSON.parse(res.data).data.path;
            that.setData({
              itemPhoto: data
            })
          }
        })
      }
    })
  },
  // /** 分类 **/
  // getCategoryList() {
  //   listGoodsType().then(data => {
  //     this.setData({
  //       categoryList: data.data,
  //       'multiObjArray[0]': data.data,
  //       'multiObjArray[1]': data.data[0].children,
  //     })
  //   })
  // },
  // bindMultiPickerChange(e) {
  //   let multiIndex = e.detail.value;
  //   this.setData({
  //     multiIndex: e.detail.value,
  //     slash: '/',
  //     parentId: this.data.multiObjArray[0][multiIndex[0]].categoryId,
  //     childId: this.data.multiObjArray[0][multiIndex[0]].children[multiIndex[1]].categoryId,
  //     categoryName:this.data.multiObjArray[0][multiIndex[0]].categoryName+"/" + this.data.multiObjArray[0][multiIndex[0]].children[multiIndex[1]].categoryName,
  //     // rightName:this.data.multiObjArray[0][multiIndex[0]].children[multiIndex[1]].categoryName
  //   })

  // },
  // bindMultiPickerColumnChange(e) {
  //   if (e.detail.column == 0) {
  //     this.setData({
  //       'multiObjArray[1]': this.data.categoryList[e.detail.value].children,
  //     });
  //   }
  // },
  // /** 更多下拉列表 **/
  // getMoreList() {
  //   let that = this;
  //   /** 品牌 **/
  //   brandList().then(response => {
  //     that.setData({
  //       brandList: response.rows
  //     })
  //   });
  //   /** 风格 **/
  //   styleList().then(response => {
  //     that.setData({
  //       styleList: response.rows
  //     })
  //   });
  //   /** 季节 **/
  //   seasonList().then(response => {
  //     that.setData({
  //       seasonList: response.rows
  //     })
  //   });
  //   /** 面料 **/
  //   materialsList().then(response => {
  //     that.setData({
  //       materialsList: response.rows
  //     })
  //   });
  // },

  /** 跳转分类列表 **/
  goCategory() {
    wx.navigateTo({
      url: '../goodsManager/type?oneSelect=1&lastSelect=' + this.data.categoryName
    })
  },
  /** 跳转颜色列表 **/
  goColorSeleteType() {
    // this.setData({
    //   isWarehouse: false,
    //   tdList: []
    // })
    wx.navigateTo({
      url: '../goodsManager/color?oneSelect=0&lastSelect=' + this.data.colours
    })

  },
  /** 跳转尺码列表 **/
  goSizeSelete() {
    // this.setData({
    //   isWarehouse: false,
    //   tdList: []
    // })
    wx.navigateTo({
      url: '../goodsManager/size?oneSelect=0&lastSelect=' + this.data.sizes
    })
  },

  /** 跳转页面 **/
  goPage(e) {
    let url = e.currentTarget.dataset.index;
    switch (url) {
      case '1':
        wx.navigateTo({
          url: '../goodsManager/brand?oneSelect=1&lastSelect=' + this.data.brandName
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../goodsManager/style?oneSelect=1&lastSelect=' + this.data.styleName
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../goodsManager/season?oneSelect=1&lastSelect=' + this.data.seasonName
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../goodsManager/fabric?oneSelect=1&lastSelect=' + this.data.materialsName
        })
        break;
    }
  },

  //下拉选择器点击事件
  // bindPickerChange(e) {
  //   let name = e.currentTarget.dataset.name;
  //   let that = this;
  //   switch (name) {
  //     case 'brandName':
  //       that.setData({
  //         brandIndex: e.detail.value,
  //         brandName:this.data.brandList[e.detail.value].chineseName
  //       })
  //       break;
  //     case 'styleName':
  //       that.setData({
  //         styleIndex: e.detail.value,
  //         styleName:this.data.styleList[e.detail.value].styleName
  //       })
  //       break;
  //     case 'seasonName':
  //       that.setData({
  //         seasonIndex: e.detail.value,
  //         seasonName:this.data.seasonList[e.detail.value].seasonName
  //       })
  //       break;
  //     case 'materialsName':
  //       that.setData({
  //         materialsIndex: e.detail.value,
  //         materialsName:this.data.materialsList[e.detail.value].materialsName
  //       })
  //       break;
  //   }
  // },

  // 价格
  priceTap(e) {
    let changeName = e.currentTarget.dataset.index;
    let value = e.detail.value;
    value = value.replace(/[^\d\.]|^\./g, '').replace(/\.{2}/g, '.').replace(/^([1-9]\d*|0)(\.\d{1,2})(\.|\d{1})?$/, '$1$2').replace(/^0\d{1}/g, '0');
    switch (changeName) {
      case 'purchasePrice':
        this.setData({
          ["data.purchasePrice"]: value
        })
        break;
      case 'suggestedPrice':
        this.setData({
          ["data.suggestedPrice"]: value
        })
        break;
    }
  },


  /** 操作产品成分 **/
  operateProductComponent(e) {
    let input = e.detail.value;
    input = input.replace(/％/g, "%");
    console.log(input)
    this.setData({
      materialsName: input
    })
  },

  /********** 尺码颜色更改(入库数量) **********/
  editWarehouseList() {
    let that = this;
    // if(this.data.itemId){
    // let listC = that.data.editCheckedColours.split(',')
    // let listD = that.data.colours.split(',')
    // let result1 = listC.length === listD.length && listC.every(a => listD.some(b => a === b)) && listD.every(_b => listC.some(_a => _a === _b));
    // let listA = that.data.editCheckedSizes.split(',')
    // let listB = that.data.sizes.split(',')
    // let result2 = listA.length === listB.length && listA.every(a => listB.some(b => a === b)) && listB.every(_b => listA.some(_a => _a === _b));

    //   if(result1 && result2){
    //     that.setData({
    //       isWarehouse: true,
    //       isEdit: true,
    //       tdList: that.data.oldSkusList
    //     })
    //     // if(that.data.itemId){
    //     //   that.setData({
    //     //     tdList: that.data.oldSkusList
    //     //   })
    //     // }

    //   }else{
    //     that.setData({
    //       isWarehouse: false,
    //       isEdit: false,
    //       tdList: []
    //     })
    //   }

    // }
    if (!that.data.itemId) {
      that.setData({
        isWarehouse: false,
        isEdit: false,
        tdList: []
      })
    }

  },


  /** 新增入库 **/
  addWarehouse() {
    let that = this;
    if (that.data.sizes == "" || that.data.color.length == 0) {
      wx.showToast({
        title: '请先选择尺码和颜色',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let sizesArr = that.data.sizes.split(','),
      coloursArr = that.data.colours.split(',');
    let skuList = that.cartesianProductOf(sizesArr, coloursArr)

    skuList.map(item => {
      item.push(0)
    })

    //skus
    let newArr = skuList.reduce((res, item) => {
      res.push({
        size: item[0],
        colour: item[1],
        stock: item[2]
      });
      return res;
    }, []);

    that.setData({
      isWarehouse: true,
      tdList: newArr
    })

  },
  //sku组合算法
  cartesianProductOf(...args) {
    return args.reduce(
      (total, current) => {
        let ret = [];
        total.forEach(a => {
          current.forEach(b => {
            ret.push(a.concat([b]));
          });
        });
        return ret;
      },
      [
        []
      ]
    );
  },

  /** 入库数量 **/
  ridClilck(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let list = this.data.tdList;
    for (let i in list) {
      if (i == item) {
        if (list[i].stock <= 0 || list[i].stock == "") {
          return
        }
        list[i].stock = list[i].stock - 1
        break
      }
    }
    that.setData({
      tdList: list
    })

  },
  addClilck(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    let list = this.data.tdList;
    for (let i in list) {
      if (i == item && list[i].stock < 100000) {
        list[i].stock = 1 + Number(list[i].stock)
        break
      }
    }
    that.setData({
      tdList: list
    })
  },
  changeNumber(e) {
    console.log(e)
    let that = this;
    let item = e.currentTarget.dataset.item;
    let list = this.data.tdList;
    for (let i in list) {
      if (i == item) {
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
          number = list[i].stock
        } else {
          number = number
        }
        list[i].stock = Number(number)
        break
      }
    }
    that.setData({
      tdList: list
    })
  },

  //保存
  formSubmit(e) {
    let that = this,
      value = e.detail.value;
    console.log(value)
    value.itemPhoto = that.data.itemPhoto;
    if (that.data.itemPhoto == "") {
      wx.showToast({
        title: '请上传货品图片',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!value.itemName) {
      wx.showToast({
        title: '请输入货品名称',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!value.purchasePrice) {
      wx.showToast({
        title: '请输入发货价格',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!value.suggestedPrice) {
      wx.showToast({
        title: '请输入建议售价',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.categoryName == "") {
      wx.showToast({
        title: '请选择分类',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.sizes == "") {
      wx.showToast({
        title: '请选择尺码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.color.length == 0) {
      wx.showToast({
        title: '请选择颜色',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (this.data.year == "") {
      wx.showToast({
        title: '请选择年份',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!value.materialsName) {
      wx.showToast({
        title: '请输入产品成分',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!that.data.itemId) {
      if (this.data.tdList.length == 0) {
        wx.showToast({
          title: '请先新增入库',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    // let obj = this.data.tdList
    // let isTrue = obj.findIndex(value => value.stock == 0 || value.stock == '')
    // if (isTrue !== -1) {
    //   wx.showToast({
    //     title: '请输入正确的入库数量',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

    let body = {}
    if (this.data.itemId !== "" && this.data.itemId !== undefined) {
      body["itemId"] = this.data.itemId
      body["itemNo"] = this.data.itemNo
    }
    body["itemName"] = value.itemName
    /*****************  供应商  ****************/
    body["supplier"] = this.data.supplier
    body["supplierId"] = this.data.supplierId


    body["seasonName"] = value.seasonName
    body['colours'] = this.data.colours
    body['sizes'] = this.data.sizes
    body["purchasePrice"] = value.purchasePrice
    body["status"] = this.data.status || 0
    body["suggestedPrice"] = value.suggestedPrice
    body["categoryName"] = this.data.categoryName
    body["year"] = this.data.year
    body["shopId"] = this.data.shopId
    body["brandName"] = value.brandName
    body["materialsName"] = value.materialsName
    body["styleName"] = value.styleName
    body["itemPhoto"] = value.itemPhoto

    body["productPlace"] = value.addr
    // body["unit"] = ""
    // body["positio"] = ""
    // body["remarks"] = ""


    body["skus"] = that.data.tdList

    if (this.data.itemId !== "" && this.data.itemId !== undefined) {
      this.editProductInfo(body)
    } else {
      this.saveProductInfo(body)
    }
  },
  /** 保存 **/
  saveProductInfo(body) {
    addGoods(body)
      .then(data => {
        wx.showToast({
          title: '提交成功',
          duration: 2000
        })
        this.setData({
          isClick: true
        })
        setTimeout(() => {
          wx.navigateBack({
            complete: (res) => {},
          })
        }, 1000);
      })
      .catch(error => {
        console.log(error);
      })
  },
  /** 修改 **/
  editProductInfo(body) {
    editGoods(body)
      .then(data => {
        wx.showToast({
          title: '提交成功',
          duration: 2000
        })
        this.setData({
          isClick: true
        })
        setTimeout(() => {
          wx.navigateBack({
            complete: (res) => {},
          })
        }, 1000);
      })
      .catch(error => {
        console.log(error);
      })
  },

  /** 商品详情 **/
  getGoodsInfo() {
    let itemId = this.data.itemId
    goodsInfo(itemId)
      .then(data => {
        this.setDefaultData(data.data.item, data.data.skus)
      })
      .catch(error => {
        console.log(error);
      })
  },

  setDefaultData(body, dataSkus) {
    let data = body
    data['addr'] = data.productPlace || ""
    let size = data['sizes'].split(",")
    let color = data['colours'].split(",")
    this.setData({
      itemPhoto: data.itemPhoto || "",
      categoryName: data.categoryName || "",
      size: size,
      sizes: data.sizes || "",
      color: color,
      colours: data.colours || '',
      year: data.year || "",
      brandName: data.brandName || "",
      styleName: data.styleName || "",
      seasonName: data.seasonName || "",
      materialsName: data.materialsName || "",
      itemId: data.itemId || "",
      itemName: data.itemName || "",
      itemNo: data.itemNo || "",
      status: data.status || "",
      data: data,
      tdList: dataSkus,
      // isWarehouse: true,
      isEdit: true,
      //编辑颜色列表
      editCheckedSizes: data.sizes,
      editCheckedColours: data.colours,
      oldSkusList: dataSkus,
      supplier: data.supplier,
      supplierId: data.supplierId

    })
  },

})