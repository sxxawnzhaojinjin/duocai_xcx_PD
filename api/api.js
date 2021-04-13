import request from "./../utils/request.js";


/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
// export function login(data) {
//   return request.post("/appletStock/supplier/login", data);
// }

export function login(data) {
  return request.post("/appletStock/supplier/login/user", data);
}
/**
 * 库存管理列表
 * @param {请求连接} parameter 
 */
export function getOrderList(parameter) {
  return request.get("/appletStock/stock/list/items?" + parameter);
}

/**
 * 供应商详情
 * @param {请求连接} supplierId 
 */
export function getSupplierInfo(supplierId) {
  return request.get("/appletStock/supplier/" + supplierId);
}

/**
 * 盘点详情
 * @param {请求连接} itemId 
 */
export function getOrderInfo(itemId) {
  return request.get("/appletStock/stock/item/" + itemId);
}

/**
 * 库存盘点提交更新
 * @param {请求连接} data 
 */
export function upDateOrderInfo(data) {
  return request.post("/appletStock/stock/check", data);
}



/**
 * 库存盘点提交更新
 * @param {请求连接} data 
 */
export function upDatePassword(data) {
  return request.post("/appletStock/supplier/editPwd", data);
}


//****************************----p2---------***************************** */

var middle = "/appletStock/"



/**
 * 销售单列表
 * @param {页码} pageNum 
 * @param {搜索条件}  customerName
 */
export function saleOrderList(pageNum, customerName = '') {
  const supplierId = getApp().globalData.supplierId
  return request.get(middle + "sale/order/list?pageNum=" + pageNum + "&pageSize=20" + "&customerName=" + customerName + "&supplierId=" + supplierId);
}

/**
 * 销售挂单列表
 * @param {页码} pageNum 
 * @param {搜索条件}  customerName
 */
export function saleHangingOrderList(pageNum, customerName = '') {
  const supplierId = getApp().globalData.supplierId
  return request.get(middle + "sale/order/hanging/list?pageNum=" + pageNum + "&pageSize=20" + "&customerName=" + customerName + "&supplierId=" + supplierId);
}

/**
 * 销售单/挂单详情
 * @param {销售单/挂单 id} orderId 
 */
export function saleOrderInfo(orderId) {
  return request.get(middle + "sale/order/" + orderId);
}

/**
 * 销售开单
 * @param {内容} body 
 */
export function saveSaleOrder(body) {
  return request.post(middle + "sale/order/open", body);
}

/**
 * 销售挂单
 * @param {内容} body 
 */
export function saveSaleHangingOrder(body) {
  return request.post(middle + "sale/order/hanging", body);
}

/**
 * 选择货品列表
 * @param {页码} pageNum 
 * @param {搜索条件}  customerName
 */
export function selectGoodsList(parameter) {
  // const supplierId = getApp().globalData.supplierId
  // return request.get(middle + "sale/order/choose/items?pageNum=" + pageNum + "&pageSize=20" + "&supplierId=" + supplierId);
  return request.get(middle + "sale/order/choose/items?"+ parameter)
}

/**
 * 选择货品详情
 * @param {货品详情 id} productCode 
 */
export function selectGoodsInfo(productCode) {
  return request.get(middle + "item/itemsOfPurchaseBilling/details/" + productCode);
}


/**
 * 选择客户列表
 * @param {页码} pageNum 
 * @param {搜索条件}  customerName
 */
export function selectUserList(pageNum, customerName = "") {
  const supplierId = getApp().globalData.supplierId
  return request.get(middle + "customer/list?pageNum=" + pageNum + "&pageSize=20" + "&customerName=" + customerName + "&supplierId=" + supplierId);
}

/**
 * 退货单列表
 * @param {页码} pageNum 
 * @param {搜索条件}  customerName
 */
export function backOrderList(pageNum, customerName = '') {
  const supplierId = getApp().globalData.supplierId
  return request.get(middle + "return/order/list?pageNum=" + pageNum + "&pageSize=20" + "&customerName=" + customerName + "&supplierId=" + supplierId);
}

/**
 * 退货单开单
 * @param {内容} body 
 */
export function saveBackOrder(body) {
  return request.post(middle + "return/order/commit", body);
}

/**
 * 退货单详情
 * @param {退货单 id} orderId 
 */
export function backOrderInfo(orderId) {
  return request.get(middle + "return/order/" + orderId);
}

/**
 * 退货单入库
 * @param {退货单 id} entryId 
 */
export function backOrderToIn(entryId) {
  const supplierId = getApp().globalData.supplierId
  return request.get(middle + "warehousing/operate/entry/" + entryId);
}

/**
 * 选择货品
 * @param {请求连接} parameter 
 */
export function getSelectProduct(parameter) {
  return request.get("/appletStock/purchase/order/choose/items?" + parameter);
}

/**
 * 选择商品
 * @param {请求连接} parameter 
 */
export function getSelectSku(itemId) {
  return request.get("/appletStock/item/itemsOfPurchaseBilling/details/" + itemId);
}

/**
 * 入库
 * @param {内容} body 
 */
export function savePurchaseBill(body) {
  return request.post("/appletStock/purchase/order/open/noPurchaseBill", body);
}


/**
 * 获取入库单列表
 * @param {请求连接} parameter 
 */
export function getWarehousingList(page) {
  return request.get("/appletStock/warehousing/entry/list?channel=4&"+page)
}

/**
 * 获取入库单详情
 * @param {请求连接} parameter 
 */
export function getWarehousingDetail(id) {
  return request.get("/appletStock/warehousing/entry/infoPlus/"+id+'/4')
}

/**
 * 出库
 * @param {内容} body 
 */
export function saveOutBill(body) {
  return request.post("/appletStock/sale/order/open/noSaleOrder", body);
}

/**
 * 获取出库单详情
 * @param {请求连接} parameter 
 */
export function getoutDetail(id) {
  return request.get("/appletStock/warehousing/out/infoPlus/"+id)
}

/**
 * 获取出库单列表
 * @param {请求连接} parameter 
 */
export function getWarehousingOutList(page) {
  return request.get("/appletStock/warehousing/out/listPlus?"+page)
}