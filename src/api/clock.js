import request from '@/utils/request';

//签到
export const apiClockIn = (data) => {
  return request({
    url: '/api/user/check-in',
    method: 'post',
    data
  })
}
//获取签到统计
export const apiGetClockInCount = (params) => {
  return request({
    url: '/api/user/check-in/stats',
    method: 'get',
    params
  })
}