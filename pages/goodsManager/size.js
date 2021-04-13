// pages/goodsManager/type.js

// categoryId categoryName
var typeName = "尺码"
var KEYID = "sizeId"
var KEY = 'sizeName'

//  lastSelect "分类1,分类2" 用于回显
//   oneSelect 1 or 0  是否单选


var shopId 

import {
  deleteSizeGroup,
  deleteSizeItem,
  addSizeList,
  getSizeList
} from "../../api/goodsManager"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeName: typeName,
    isShowGroup: false,
    isShowItem: false,
    isShowDeleteGroup: false,
    isShowDeleteItem: false,

    list: [],
    selectItem: '',
    groupName: "",
    itemName: '',

    lastSelect: ''

  },
//点击确定
  submit() {
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面

    let list = this.data.list
    let selectItem = ''
    let selectArr = []
    for(let i in list){
      for(let  j in list[i].measures){
        if(this.data.oneSelect){
          if(list[i].measures[j]["isSelect"] == true){
            selectItem = list[i].measures[j][KEY]
            break
          }
        }else{
          if(list[i].measures[j]["isSelect"] == true){
            selectItem = selectItem+"," + list[i].measures[j][KEY] 
            selectArr.push(list[i].measures[j][KEY])
          }
        }
      }
    }
    if(selectItem == ""){
      wx.showToast({
        title: '请选择要选的内容',
        icon:"none"
      })
      return
    }
    selectItem = selectItem.replace(",","")

    console.log('selectArr=',selectArr);
    
    prevPage.setData({
      size:selectArr,
      sizes:selectItem
    })
    wx.navigateBack({
      complete: (res) => {},
    })

  },

  //删除分组
  deleteGroupRequest(deleteObj, list) {
    var that = this
    let body = {
      grouping: deleteObj.grouping,
      shopId: shopId
    }
    deleteSizeGroup(body)
      .then(data => {
        console.log(data);
        that.setData({
          isShowDeleteGroup: false,
          deleteGroupItem: '',
          list: list
        })
      })
      .catch(error => {
        console.log(error);
      })
  },
//删除分组元素
  deleteItemRequest(item, list) {
    console.log(item);
    var that = this
    deleteSizeItem(item)
      .then(data => {
        that.setData({
          list: list,
          isShowDeleteItem: false
        })
        console.log(data);

      })
      .catch(error => {
        console.log(error);
        that.setData({
          isShowDeleteItem: false
        })
      })

  },
  //新增分组元素
  addItemRequest(obj, grouping) {
    console.log(obj);

  var that =this
    addSizeList(obj)
      .then(data => {
       let itemObj =data.data
        let list = this.data.list
        for (let i in list) {
          if (grouping == list[i].grouping) {
            list[i].measures.unshift(itemObj)
            break
          }
        }
        that.setData({
          list: list,
          isShowItem: false,
          itemName: '',
        })
      })
      .catch(error => {
    
        that.setData({
          isShowItem: false,
        })
        console.log(error);

      })
  },
  //获取列表
  requestList() {
    var that = this
    getSizeList()
    .then(data=>{
      console.log(data);
      let list = that.forMateData(data.data)
      this.setData({
        list: list
      })
    })
    .catch(error=>{
      console.log(error);
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shopId  = getApp().globalData.shopId
    let lastSelect = options.lastSelect||""
    let oneSelect = options.oneSelect == 1?true:false
    this.setData({
      lastSelect: lastSelect,
      oneSelect: oneSelect
    })
    this.requestList()
  },



  forMateData(listTemp) {
    let arr = this.data.lastSelect.split(',')
    let list = listTemp
    for (let h in arr) {
      for (let i = 0; i < list.length; i++) {
        let groups = list[i].measures
        for (let j = 0; j < groups.length; j++) {
          if (arr[h] == groups[j][KEY]) {
            groups[j]['isSelect'] = true
          }
        }
      }
    }
    return list

  },
  cancelDelete() {
    this.setData({
      isShowDeleteGroup: false,
      isShowDeleteItem: false,
      deleteGroupItem: '',
      deleteItem: '',
    })
  },
  deleteGroup(e) {
    // console.log(e.currentTarget.dataset.group);
    this.setData({
      isShowDeleteGroup: true,
      deleteGroupItem: e.currentTarget.dataset.group
    })
  },
  deleteGroupConfirm() {
    let list = this.data.list
    let deleteGroupItem = this.data.deleteGroupItem
    let deleteList = []
    for (let i in list) {
      if (deleteGroupItem.grouping == list[i].grouping) {

        deleteList = list[i]
        list.splice(i, 1)
        break
      }
    }
    if (deleteList.measures.length < 1) {
      this.setData({
        isShowDeleteGroup: false,
        deleteGroupItem: '',
        list: list
      })
    } else {
      this.deleteGroupRequest(deleteList, list)
    }
  },



 
  deleteItem(e) {
    // console.log(e);

    this.setData({
      isShowDeleteItem: true,
      deleteItem: e.currentTarget.dataset.itemid
    })
  },
  deleteItemConfirm() {
    let list = this.data.list
    let item = this.data.deleteItem
    for (let i in list) {
      for (let j in list[i].measures) {
        if (item == list[i].measures[j][KEYID]) {
          list[i].measures.splice(j, 1)
        }
      }
    }
    this.deleteItemRequest(item, list)


  },
  

  changeGroupName(e) {
    this.setData({
      groupName: e.detail.value
    })
  },
  changeItemName(e) {
    this.setData({
      itemName: e.detail.value
    })
  },
  addGroup() {
    this.setData({
      isShowGroup: true,
      groupName: '',
    })
  },
  addItem(e) {
    this.setData({
      isShowItem: true,
      itemName: '',
      selectItem: e.target.dataset.item,
    })
  },
  cancelModal(e) {
    this.setData({
      isShowGroup: false,
      isShowItem: false,
      selectItem: "",
    })
  },
  groupConfirm(e) {
    if (this.data.groupName == "") {
      wx.showToast({
        title: '请输入分组名',
        icon: 'none'
      })
      return
    }
    let list = this.data.list
    for (let i in list) {
      if (this.data.groupName == list[i].grouping) {
        wx.showToast({
          title: '已存在该分组名',
          icon: 'none'
        })
        return;
      }
    }
    list.unshift({
      "grouping": this.data.groupName,
      "measures": []
    })
    this.setData({
      list: list,
      isShowGroup: false,
      groupName: '',
    })
  },
  itemConfirm(e) {
    if (this.data.itemName == "") {
      wx.showToast({
        title: '请输入' + typeName + "名",
        icon: 'none'
      })
      return
    }
    let list = this.data.list
    let item = this.data.selectItem

    let itemObj = {
      [KEYID]: '',
      [KEY]: this.data.itemName,
      "grouping": item.grouping,
      shopId: shopId
    }

    this.addItemRequest(itemObj, item.grouping)

    // console.log('xxxxx', e);
  },


  allSelect(e) {
    let groupName = e.currentTarget.dataset.group
    let list = this.data.list
    for (let i in list) {
      if (groupName == list[i].grouping) {
        let isAllSelect = 0

        for (let j in list[i].measures) {
          if (list[i].measures[j]["isSelect"]) {
            isAllSelect = isAllSelect + 1
          }
        }
        if (isAllSelect < list[i].measures.length) {
          for (let j in list[i].measures) {
            list[i].measures[j]["isSelect"] = true
          }
        } else {
          for (let j in list[i].measures) {
            list[i].measures[j]["isSelect"] = false
          }
        }
      }
    }
    this.setData({
      list: list
    })

  },
  selectItem(e) {
    // console.log(e);
    let groupName = e.currentTarget.dataset.group
    let itemName = e.currentTarget.dataset.item
    let list = this.data.list
    for (let i in list) {
      if (this.data.oneSelect) {
        for (let j in list[i].measures) {
          list[i].measures[j]["isSelect"] = false
          if (itemName == list[i].measures[j][KEY]) {
            list[i].measures[j]["isSelect"] = true
          }
        }
      }else{
        if (groupName == list[i].grouping) {
          for (let j in list[i].measures) {
  
            if (itemName == list[i].measures[j][KEY]) {
              list[i].measures[j]["isSelect"] = !!!list[i].measures[j]["isSelect"]
            }
          }
  
        }
      }
      
    }

    this.setData({
      list: list
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})