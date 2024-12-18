/*
 * @Descripttion: 组件业务名
 * @version:
 * @Author: dty
 * @Date: 2024-12-18 16:02:09
 * @LastEditors: dty
 * @LastEditTime: 2024-12-18 21:58:27
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // API 的基础URL
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果有token，添加到请求头
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // 这里可以根据后端的数据结构进行调整
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求错误',
        type: 'error',
        duration: 5 * 1000,
      })

      // 处理特定的错误码
      if (res.code === 401) {
        // token过期或未登录
        const userStore = useUserStore()
        userStore.logout()
        window.location.reload()
      }
      return Promise.reject(new Error(res.message || '请求错误'))
    }
    return res
  },
  (error) => {
    console.error('响应错误:', error)
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

// 封装GET请求
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params,
  })
}

// 封装POST请求
export function post(url, data) {
  return service({
    url,
    method: 'post',
    data,
  })
}

// 封装PUT请求
export function put(url, data) {
  return service({
    url,
    method: 'put',
    data,
  })
}

// 封装DELETE请求
export function del(url) {
  return service({
    url,
    method: 'delete',
  })
}

export default service
