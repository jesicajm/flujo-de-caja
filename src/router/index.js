import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
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

export default router 