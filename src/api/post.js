import request from '@/utils/request'

//分页查询帖子列表
export function apiGetPostList(params) {
  return request({
    url: '/api/posts',
    method: 'get',
    params
  })
}

//发布帖子
export function apiCreatePost(data) {
  return request({
    url: '/api/posts',
    method: 'post',
    data
  })
}

//点赞/取消点赞帖子
export function apiPostLike(postId) {
  return request({
    url: `/api/posts/${postId}/like`,
    method: 'post'
  })
}

