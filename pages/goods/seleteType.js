// pages/goods/seleteType.js
import {
  listGoodsType,
  listGoodsSize,
  listTypeAndSize
} from "../../api/goods"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sc_height: 0,
    list: [],
    list_a: [],
    typeSelect: '',
    leftSelect: "",
    rightSelect:"",
    isShowLeft: false,
    sizeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sc_height: wx.getSystemInfoSync().windowHeight,
    })
    console.log("-", );
    this.getCategoryList()

  },
  /** 分类 **/
  getCategoryList() {

    listTypeAndSize()
    .then(data=>{
      console.log('new====',data);
      
      this.setData({
        list:data.rows,
        sizeList:[],
      })
    })
    .catch(error=>{
      console.log(error);
      
    })
    // var that = this
    // listGoodsType().then(data => {
    //   console.log(data);
    //   let list = data.data
    //   for (let index in list) {
    //     list[index]["isSelect"] = false
    //     let list_a = list[index].children
    //     for (let i in list_a) {
    //       list_a["isSelect"] = false
    //     }
    //     list[index].children = list_a
    //   }
    //   console.log(list);

    //   that.setData({
    //     list: list,
    //   })
    // })
  },
  seletType_a(e) {
    console.log(e.currentTarget.dataset.item);

    let item = e.currentTarget.dataset.item


    let list = this.data.list
    for (let index in list) {
      if (item.categoryId == list[index].categoryId) {
        list[index]['isSelect'] = true
        this.setData({
          // list_a: item.children,
          sizeList:[],//item.sizeSkus,
          isSelectType: true
        })
      } else {
        list[index]['isSelect'] = false
      }
    }
    this.setData({
      list: list,
      leftSelect: item.categoryName,
      rightSelect:'',
    })
    // this.requestSize(item.categoryId)
  },

  seletType_b(e) {
    console.log(e.currentTarget.dataset.item);

    let item = e.currentTarget.dataset.item


    let list = this.data.list_a
    for (let index in list) {
      if (item.categoryId == list[index].categoryId) {
        list[index]['isSelect'] = true
        this.setData({
          list_a: item.children,
          isSelectType: true
        })
      } else {
        list[index]['isSelect'] = false
      }
    }
    this.setData({
      list_a: list,
      rightSelect:item.categoryName,
      isShowLeft: true
    })
    this.requestSize(item.categoryId)
  },
  selectSize(e) {
    let item = e.currentTarget.dataset.item


    let list = this.data.sizeList
    for (let index in list) {
      if (item.categoryId == list[index].categoryId) {
        list[index]['isSelect'] = !list[index]['isSelect']
      }
    }
    this.setData({
      sizeList: list,
    })
  },

  requestSize(categoryId) {
    listGoodsSize(categoryId)
      .then(data => {
        console.log(data);
        let list = data.data
        for (let index in list) {
          list[index]['isSelect'] = false
        }
        this.setData({
          sizeList: list
        })
      })
      .catch(error => {
        console.log(error);

      })
  },

  submit(){
    if(this.data.leftSelect == ""){
      wx.showToast({
        title: '请选择分类',
      })
      return;
    }
    let list = this.data.sizeList;
    let newList = []
    let sizes=''
    for(let index in list){
      list[index]["sizeName"]=list[index].name
      if(list[index].isSelect){
        newList.push(list[index]),
        sizes=sizes+","+list[index].name 
      }
    }
    if(newList.length < 1){
      wx.showToast({
        title: '请选择分类下的尺码',
        icon:"none"
      })
      return;
    }
    console.log(this.data.leftSelect);
    sizes = sizes.substr(1)
    console.log(newList,sizes);
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面

    prevPage.setData({
      categoryName:this.data.leftSelect,
      sizes:sizes,
      size:newList,
    })
    wx.navigateBack({
      complete: (res) => {},
    })
  
  },


})