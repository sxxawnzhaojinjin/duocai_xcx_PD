import request from "./../utils/request.js";
let api = '/appletStock';

//采购人员列表
export function purchaseByList() {
  return request.get(api +"/Operator/list");
}


//条码
export function getProductCode(productCode) {
  return request.get(api +"/stock/info/" + productCode);
}