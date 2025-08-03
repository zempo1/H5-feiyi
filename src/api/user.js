import request from '../utils/request';
//获取当前用户信息
export function getMyInfo() {
    return request({
        url: '/api/auth/me',
        method: 'get'
    })
}