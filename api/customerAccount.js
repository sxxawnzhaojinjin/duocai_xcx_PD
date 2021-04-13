import request from "./../utils/request.js";
//客户对账统计
export function getSaleOrderSummary(supplierId) {
  return request.get("/appletStock/sale/order/summary?supplierId="+supplierId);
}

//客户对账列表
export function getCustomerAccountList(parameter) {
  return request.get("/appletStock/sale/order/statements?" + parameter);
}


//客户对账详情
export function getCustomerAccountInfo(pageNum, customerId, settlementMethod = '') {
  return request.get("/appletStock/sale/order/pagesByCust?pageNum=" + pageNum + "&pageSize=20" + "&customerId=" + customerId + "&settlementMethod=" + settlementMethod);
}

//销账
export function customerWriteOff(data) {
  return request.post("/appletStock/sale/order/writeOff", data);
}