import { HEADER } from './../config.js';

/**
 * 发送请求
 */

export default function request(api, method, data){
  let Url = getApp().globalData.url, header = HEADER;
 
  if (getApp().globalData.token) {
    header['Authorization-stock'] = 'Bearer ' + getApp().globalData.token;
  }

  return new Promise((reslove, reject) => {
    wx.request({
      url: Url + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        wx.stopPullDownRefresh({
          complete: (res) => {},
        })  
        if (res.data.code == 599){
          
          wx.showToast({
            title: res.data.msg||"登录异常",
            duration:4000,
            icon:"none"
          })
          reject(res.data.msg || '系统错误');
          setTimeout(()=>{
            wx.reLaunch({
              url: '../login/index',
            })
          },4000)
          return
        }
        if (res.data.code == 200){
          reslove(res.data, res);
        }
        else{
          wx.showToast({
            title: res.data.msg || '系统错误',
            icon:"none"
          })
    
          reject(res.data.msg || '系统错误');
        }
      },
      fail: (msg) => {
        wx.stopPullDownRefresh({
          complete: (res) => {},
        })
        wx.showToast({
          title: '请求失败',
          icon:"none"
        })
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});

