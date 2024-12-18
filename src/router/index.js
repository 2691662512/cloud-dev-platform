import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/dashboard/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/index.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/index.vue'),
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/project/index.vue'),
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('../views/workspace/index.vue'),
  },
  // 404 页面配置
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取 token
  const token = localStorage.getItem('token')

  // 如果访问的是登录或注册页面，直接放行
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 其他页面需要验证 token
  if (!token) {
    next('/login')
    return
  }

  next()
})
export default router
