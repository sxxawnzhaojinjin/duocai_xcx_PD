import request from "./../utils/request.js";
//收入统计
export function getSaleCount(supplierId) {
  return request.get("/appletStock/sale/order/summary?supplierId="+supplierId);
}
//收入列表
export function getSaleList(data) {
  return request.get("/appletStock/sale/order/list/finance?pageNum=" + data.pageNum + '&pageSize=' + data.pageSize + '&supplierId=' + data.supplierId);
}
//支出统计
export function getReturnCount(supplierId) {
  return request.get("/appletStock/return/order/summary?supplierId="+supplierId);
}
//支出列表
export function getReturnList(data) {
  return request.get("/appletStock/return/order/list?pageNum=" + data.pageNum + '&pageSize=' + data.pageSize + '&supplierId=' + data.supplierId);
}