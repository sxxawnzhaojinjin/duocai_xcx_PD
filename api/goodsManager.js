import request from "./../utils/request.js";
let api = '/appletStock';

// 分类列表
export function getTypeList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/category/treePlus?shopId="+shopId);
}

// 分类新增
export function addTypeList(body) {
  return request.post(api +"/category/addAndEidtPlus",body);
}

// 分类item删除
export function deleteTypeItem(parameter) {
  return request.get(api +"/category/removePlus/"+parameter);
}

// 分类group删除
export function deleteTypeGroup(body) {
  return request.post(api +"/category/removeGroupingPlus",body);
}

/******************尺码****************** */

// 尺码列表
export function getSizeList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/size/treePlus?shopId="+shopId);
}

// 尺码新增
export function addSizeList(body) {
  return request.post(api +"/size/addAndEidtPlus",body);
}

// 尺码item删除
export function deleteSizeItem(parameter) {
  return request.get(api +"/size/removePlus/"+parameter);
}

// 尺码group删除
export function deleteSizeGroup(body) {
  return request.post(api +"/size/removeGroupingPlus",body);
}
  /******************色颜****************** */
// 色颜列表
export function getColorList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/colour/treePlus?shopId="+shopId);
}

//色颜新增
export function addColorList(body) {
  return request.post(api +"/colour/addAndEidtPlus",body);
}

//色颜item删除
export function deleteColorItem(parameter) {
  return request.get(api +"/colour/removePlus/"+parameter);
}

// 色颜group删除
export function deleteColorGroup(body) {
  return request.post(api +"/colour/removeGroupingPlus",body);
}

  /******************品牌****************** */
// 品牌列表
export function getSeriesList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/series/treePlus?shopId="+shopId);
}

//品牌新增
export function addSeriesList(body) {
  return request.post(api +"/series/addAndEidtPlus",body);
}

//品牌item删除
export function deleteSeriesItem(parameter) {
  return request.get(api +"/series/removePlus/"+parameter);
}

// 品牌group删除
export function deleteSeriesGroup(body) {
  return request.post(api +"/series/removeGroupingPlus",body);
}
    /******************风格****************** */
// 风格列表
export function getStyleList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/style/treePlus?shopId="+shopId);
}

//风格新增
export function addStyleList(body) {
  return request.post(api +"/style/addAndEidtPlus",body);
}

//风格item删除
export function deleteStyleItem(parameter) {
  return request.get(api +"/style/removePlus/"+parameter);
}

// 风格group删除
export function deleteStyleGroup(body) {
  return request.post(api +"/style/removeGroupingPlus",body);
}

    /******************季节****************** */
// 季节列表
export function getSeasonList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/season/treePlus?shopId="+shopId);
}

//季节新增
export function addSeasonList(body) {
  return request.post(api +"/season/addAndEidtPlus",body);
}

//季节item删除
export function deleteSeasonItem(parameter) {
  return request.get(api +"/season/removePlus/"+parameter);
}

// 季节group删除
export function deleteSeasonGroup(body) {
  return request.post(api +"/season/removeGroupingPlus",body);
}

    /******************面料****************** */
// 面料列表
export function getMaterialsList() {
  const shopId = getApp().globalData.shopId
  return request.get(api +"/materials/treePlus?shopId="+shopId);
}

//面料新增
export function addMaterialsList(body) {
  return request.post(api +"/materials/addAndEidtPlus",body);
}

//面料item删除
export function deleteMaterialsItem(parameter) {
  return request.get(api +"/materials/removePlus/"+parameter);
}

// 面料group删除
export function deleteMaterialsGroup(body) {
  return request.post(api +"/materials/removeGroupingPlus",body);
}