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
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/projects/index.vue'),
      },
      {
        path: '/ide',
        name: 'IDE',
        component: () => import('../views/ide/index.vue'),
      },
      {
        path: '/ide/:projectId',
        name: 'IDEProject',
        component: () => import('../views/ide/project.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
    return
  }

  if (to.meta.roles && !to.meta.roles.includes(userStore.userInfo?.role)) {
    next('/')
    return
  }

  next()
})

export default router
