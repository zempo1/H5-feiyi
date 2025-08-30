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

//获取帖子详情
export function apiGetPostDetail(postId) {
  return request({
    url: `/api/posts/${postId}`,
    method: 'get'
  })
}

//获取帖子评论列表
export function apiGetPostComments(postId, params) {
  return request({
    url: `/api/comments/post/${postId}`,
    method: 'get',
    params
  })
}

//获取评论的回复列表
export function apiGetCommentReplies(commentId, params) {
  return request({
    url: `/api/comments/${commentId}/replies`,
    method: 'get',
    params
  })
}

//发表评论
export function apiAddComment( data) {
  return request({
    url: '/api/comments',
    method: 'post',
    data
  })
}

//点赞/取消点赞评论
export function apiCommentLike(commentId) {
  return request({
    url: `/api/comments/${commentId}/like`,
    method: 'post'
  })
}

//获取热门评论
export function apiGetHotComments(params) {
  return request({
    url: '/api/comments/hot',
    method: 'get',
    params
  })
}

//获取最新评论
export function apiGetLatestComments(params) {
  return request({
    url: '/api/comments/latest',
    method: 'get',
    params
  })
}
