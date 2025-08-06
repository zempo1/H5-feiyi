import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
     {
      path: '/',
      name: 'loginIndex',
      component: () => import('@/views/login/loginIndex.vue'),
    },
     {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue'),
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index/index.vue')
    },
   
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/login/register.vue'),
    },
    {
      path: '/resources',
      name:'resources',
      component: () => import('@/views/resources/resources.vue')
    },
    {
      path: '/study',
      name:'study',
      component: () => import('@/views/study/study.vue')
    },
    {
      path: '/postBar',
      name: 'postBar',
      component: () => import('@/views/postBar/postBar.vue')
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('@/views/postBar/publish.vue')
    },
    {
      path: '/my',
      name:'my',
      component: () => import('@/views/my/my.vue')
    }
  ]
})

export default router
