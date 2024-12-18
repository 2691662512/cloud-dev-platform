import request from '../utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  })
}

// 用户注册
export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get',
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/api/user/info',
    method: 'put',
    data,
  })
}

// 修改密码
export function changePassword(data) {
  return request({
    url: '/api/user/password',
    method: 'put',
    data,
  })
}

// 登出
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post',
  })
}
