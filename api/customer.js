import request from "./../utils/request.js";
let api = '/appletStock';
// 客户列表
// export function customerList(parameter) {
//   const supplierId = getApp().globalData.supplierId
//   return request.get(api +"/customer/list?" + parameter+"&supplierId="+supplierId);
// }
export function customerList(parameter) {
  return request.get(api +"/customer/list?" + parameter);
}


// 删除客户
export function delCustomer(customerId) {
  return request.get(api + "/customer/remove/" + customerId);
}


// 客户详情
export function customerInfo(customerId) {
    return request.get(api + "/customer/" + customerId);
}

// 新增客户
export function addCustomer(data) {
  return request.post(api +"/customer", data);
}

// 修改客户
export function editCustomer(data) {
  return request.post(api +"/customer/edit", data);
}





