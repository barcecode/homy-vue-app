import { createRouter, createWebHistory } from 'vue-router'
import InitialView from '@/views/InitialView.vue'
import { getCurrentUser } from 'vuefire'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'initial',
      component: InitialView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/register/secondstep',
      name: 'registerSecond',
      component: () => import('../views/RegisterSecondView.vue')
    },
    {
      path: '/',
      component: () => import('../views/UserLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/user/HomeView.vue')
        },
        {
          path: 'shopping',
          name: 'shopping',
          component: () => import('../views/user/ShoppingView.vue')

        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('../views/user/MenuView.vue')
        },
        {
          path: 'task',
          name: 'tasks',
          component: () => import('../views/user/TasksView.vue')
        },
        {
          path: 'announce',
          name: 'announce',
          component: () => import('../views/user/AnnounceView.vue')
        }
      ]
    }
  ],
})

//Guard del router
router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !user) {
    return next('/login')
  }

  if (to.path === '/register/secondstep') {
    if (from.path !== '/register') {
      return next('/register')
    }
    return next()
  }

  const isPublicPath = ['/login', '/register', '/'].includes(to.path)
  if (user && isPublicPath) {
    return next('/home')
  }

  return next()
})

export default router
