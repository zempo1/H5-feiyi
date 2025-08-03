import request from '../utils/request';
//注册
export const apiRegister = (data = {}) => {
  return request({
    url: '/api/auth/register',
    method: 'POST',
    data,
  });
};
//发送验证码
export const apiSendCode = (data = {}) => {
    return request({
        url: '/api/auth/send-sms-code',
        method: 'POST',
        data,
    })
}
//账号登录
export const apiLogin = (data = {}) => {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data
  })
}
//验证码登录
export const apiLoginByCode = (data = {}) => {
  return request({
    url: '/api/auth/mobile-login',
    method: 'POST',
    data
  })
}
//退出登录
export const apiLogout = () => {
  return request({
    url: '/api/auth/logout',
    method: 'POST',
  })
}
//刷新token
export const apiRefreshToken = (data = {}) => {
  return request({
    url: '/api/auth/refresh-token',
    method: 'POST',
    data
  })
}