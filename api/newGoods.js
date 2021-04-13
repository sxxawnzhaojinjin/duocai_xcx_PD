import request from "./../utils/request.js";
let api = '/appletStock';


// 货品列表
export function goodsList(parameter) {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/item/pagesPlus?"+ parameter +"&shopId="+shopId);
}


// 新增货品
export function addGoods(data) {
  return request.post(api +"/item/addPlus", data);
}

// 修改货品
export function editGoods(data) {
  return request.post(api +"/item/editPlus", data);
}
