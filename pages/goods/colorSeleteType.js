const app = getApp();
import { colorList } from '../../api/goods'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorList:[],
    allChecked: false,
    color:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      color:options.color
    })
      this.getColorList();

  },

  IterationDelateChildren(arr) {
    if (arr.length) {
      for (let i in arr) {
        if (arr[i].children.length) {
          this.IterationDelateChildren(arr[i].children)
        } else {
          delete arr[i].children;
        }
      }
    }
    return arr
  },
  
  /** 获取颜色列表 **/
  getColorList(){
    let that = this;
    colorList().then(response => {
    let  result=that.IterationDelateChildren(response.rows);
    let list=[]
    for (let i in result) {
      let item = result[i]
      item.checkAll = false
      let children=[]
      for(let j in item.children){
        let child=item.children[j];
        child.checked=false
        children.push(child);
      }
      item["selected"] = 0
      list.push(item);
    }

    let arr =this.data.color.split(",")
    console.log(list);
    
    for(let index in arr){
      console.log(arr[index]);
      
      for(let i in list){
        console.log(list[i]);
        for(let j in list[i].children){
          if(list[i].children[j].colourName == arr[index]){
            list[i].children[j].checked = true
            list[i].selected = 1+ list[i].selected
            if(list[i].selected == list[i].children.length){
              list[i].checkAll = true
            }
          }
        }
      }
    }


    console.log(list);
      that.setData({
        colorList: list
      })
    });
  },

  checkboxChange(e) {
    let index = e.currentTarget.dataset.index
    let list= this.data.colorList;
    let childs= list[index].children;
    let select =e.detail.value
    for(let i in childs){
      let child=childs[i];
      let n = select.findIndex(item => item == child.colourId);
      if(n>-1){
        childs[i].checked=true
      }else{
        childs[i].checked=false
      }
    }

    if(childs.length==select.length){
      list[index].checkAll=true
    }else{
      list[index].checkAll=false
    }

    list[index].children=childs
    this.setData({
      colorList: list,
    })
    console.log('checkbox发生change事件，携带value值为：')
    
  },
  selectall(e) {//全选与反全选
    let index=e.currentTarget.dataset.index
    let list= this.data.colorList;
    list[index].checkAll=!list[index].checkAll
    let childs=list[index].children;
    let cs=[]
    for(let i  in  childs){
      let obj=childs[i];
      obj.checked=list[index].checkAll
      cs.push(obj);
    }
    list[index].children=cs;
    this.setData({
      colorList: list,
    })
  },
  
  /** 保存按钮 **/
  submit(){
   let select= this.getSelects();
   let colours=select[0]
   let color=select[1]
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    prevPage.setData({
      colours:colours,
      color:color
    })
    wx.navigateBack({
      complete: (res) => {},
    })
  
      console.log(this.data.colorsCheckedVal)
  },

  getSelects(){
    let list=this.data.colorList;
    let str=''
    let cs=[]
    for(let i in  list){
       let childs= list[i].children;
       for(let j in childs){
         let item=childs[j]
         if(item.checked){
          str=item.colourName+','+str
          cs.push(item); 
         }
       }
    }
    let reg = /,$/gi;
    str = str.replace(reg, "");
    return [str,cs]
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})