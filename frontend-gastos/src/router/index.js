import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Gastos from '../views/Gastos.vue'
import AgregarGasto from '@/views/AgregarGasto.vue'
import Layout from '../views/Layout.vue'  // tu layout
import Dashboard from '../views/Dashboard.vue'
import Categorias from '../views/Categorias.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/', component: Layout,
    children: [
      { path: 'gastos', component: Gastos },
      { path: 'gastos/nuevo', component: AgregarGasto },
      { path: 'dashboard', component: Dashboard },
      { path: 'categorias', component: Categorias }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

