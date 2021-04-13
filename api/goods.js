import request from "./../utils/request.js";
let api = '/appletStock';

// 货品列表
export function goodsList(parameter) {
  const supplierId = getApp().globalData.supplierId
  return request.get(api +"/item/list?" + parameter+"&supplierId="+supplierId);
}

// 查询货品类别列表
export function listGoodsSize(categoryId) {
  return request.get(api +"/size/selects?categoryId="+categoryId);
}

// 查询货品类别列表
export function listGoodsType() {
  return request.get(api +"/category/tree");
}

//新 ************** 查询货品类别列表
export function listTypeAndSize() {
  return request.get(api +"/size/sku/tree/check");
}

// 颜色列表
export function colorList() {
  return request.get(api +"/colour/list");
}

// 品牌列表
export function brandList() {
  return request.get(api +"/series/list");
}

// 风格列表
export function styleList() {
  return request.get(api +"/style/list");
}
// 季节列表
export function seasonList() {
  return request.get(api +"/season/list");
}
// 季节列表
export function materialsList() {
  return request.get(api +"/materials/list");
}

// 新增货品
export function addGoods(data) {
  return request.post(api +"/item", data);
}

// 修改货品
export function editGoods(data) {
  return request.post(api +"/item/edit", data);
}

// 货品详情
// export function goodsInfo(itemId) {
//   return request.get(api +"/item/" + itemId);
// }

export function goodsInfo(itemId) {
  return request.get(api +"/item/spuSkus/" + itemId);
}

