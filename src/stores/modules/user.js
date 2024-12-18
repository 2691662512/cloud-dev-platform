import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getUserInfo } from '../../api/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'))
  const userInfo = ref(null)
  const roles = ref([])

  // 登录
  async function handleLogin(loginForm) {
    try {
      const { data } = await login(loginForm)
      setToken(data.token)
      await fetchUserInfo()
      return true
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
      return false
    }
  }

  // 登出
  async function handleLogout() {
    try {
      await logout()
      resetState()
      return true
    } catch (error) {
      ElMessage.error(error.message || '登出失败')
      return false
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const { data } = await getUserInfo()
      userInfo.value = data
      roles.value = data.roles || []
      return data
    } catch (error) {
      ElMessage.error(error.message || '获取用户信息失败')
      return null
    }
  }

  // 设置 token
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 重置状态
  function resetState() {
    token.value = null
    userInfo.value = null
    roles.value = []
    localStorage.removeItem('token')
  }

  // 检查权限
  function hasPermission(permission) {
    return roles.value.some((role) => role.permissions.includes(permission))
  }

  return {
    token,
    userInfo,
    roles,
    handleLogin,
    handleLogout,
    fetchUserInfo,
    hasPermission,
  }
})
