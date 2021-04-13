module.exports = {
  // 请求域名 格式： https://域名
  // HTTP_REQUEST_URL:'http://192.144.214.13:7000', //开发
  HTTP_REQUEST_URL: 'https://games.colorfulmansions.com', //开发
  // HTTP_REQUEST_URL: 'https://color.colorfulmansions.com', //测试
  // HTTP_REQUEST_URL:'https://caiyun.r0life.com', //线上
  // Socket链接 暂不做配置
  WSS_SERVER_URL: '',


  // 以下配置非开发者，无需修改
  // 请求头                                                                                                           
  HEADER: {
    'content-type': 'application/json'
  },
  // Socket调试模式view
  SERVER_DEBUG: true,
  // 心跳间隔
  PINGINTERVAL: 3000,
  // 回话密钥名称 
  TOKENNAME: 'Authori-zation',
  //用户信息缓存名称
  CACHE_USERINFO: 'USERINFO',
  //token缓存名称
  CACHE_TOKEN: 'TOKEN',
  //token过期事件
  CACHE_EXPIRES_TIME: 'EXPIRES_TIME',
  //模板缓存
  CACHE_SUBSCRIBE_MESSAGE: 'SUBSCRIBE_MESSAGE'
}