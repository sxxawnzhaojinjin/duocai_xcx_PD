import request from "./../utils/request.js";
let api = '/appletStock';

/** 打印列表查询 **/
export function getPrintList(parameter) {
  return request.get(api+ "/print/list?" + parameter);
}

/** 货品选择 **/
export function getPrintGoodsChoiceList(parameter) {
  return request.get(api+ "/print/goods/choice?" + parameter);
}


/** 添加打印商品 **/
export function addPrintGoods(data) {
  return request.post(api+ "/print/add", data);
}


/** 删除打印商品 **/
export function removePrintGoods(id) {
  return request.get(api+ "/print/remove/" + id);
}


/** 清除打印商品 **/
export function clearPrintGoods() {
  return request.get(api+ "/print/clear");
}


/** 商品详情 **/
export function getPrintGoodsInfo(skuId) {
  return request.get(api+ "/print/goods/" + skuId);
}





