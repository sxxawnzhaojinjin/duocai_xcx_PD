//app.js
import {
  HTTP_REQUEST_URL,
  CACHE_TOKEN
} from './config.js';
App({
  onLaunch: function () {

  },

  globalData: {
    userInfo: null,
    urlImages: '',
    url: HTTP_REQUEST_URL,
    token: '',
    supplierName: "",
    supplierId: "",
    shopId:"",
    storeName:""
  }
})