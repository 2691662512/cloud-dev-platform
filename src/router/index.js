import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/modules/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/default.vue'),
    redirect: '/dashboard', // 添加重定向
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('../views/projects/index.vue'),
      },
      {
        path: 'ide',
        name: 'IDE',
        component: () => import('../views/ide/index.vue'),
      },
      {
        path: 'ide/:projectId',
        name: 'IDEProject',
        component: () => import('../views/ide/project.vue'),
      },
    ],
  },
  // 添加404路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果未登录且不是登录页，重定向到登录页
  if (!userStore.token && to.path !== '/login') {
    next('/login')
    return
  }

  // 如果已登录且访问登录页，重定向到首页
  if (userStore.token && to.path === '/login') {
    next('/')
    return
  }

  next()
})

export default router
