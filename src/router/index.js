import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cash-flow/:id',
    name: 'CashFlowDetail',
    component: () => import('@/views/CashFlowDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ingresos',
    name: 'Ingresos',
    component: () => import('../views/IncomesView.vue')
  },
  {
    path: '/gastos',
    name: 'Gastos',
    component: () => import('../views/ExpensesView.vue')
  },
  {
    path: '/deudas',
    name: 'Deudas',
    component: () => import('../views/DebtsView.vue')
  },
  {
    path: '/ahorros',
    name: 'Ahorros',
    component: () => import('../views/SavingsView.vue')
  },
  {
    path: '/analisis',
    name: 'Análisis',
    component: () => import('../views/AnalysisView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Navegación guard para proteger rutas
router.beforeEach(async (to, from, next) => {
  const user = await store.dispatch('auth/checkAuth')
  const isAuthenticated = !!user

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 