import request from '../utils/request';
//获取当前用户信息
export function apiGetMyInfo() {
    return request({
        url: '/api/user/info',
        method: 'get'
    })
}

//更新用户信息
export function apiUpdateMyInfo(data) {
    return request({
        url: '/api/user/info',
        method: 'put',
        data
    })
}