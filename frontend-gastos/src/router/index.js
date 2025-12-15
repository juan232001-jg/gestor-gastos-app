import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Gastos from '../views/Gastos.vue'
import AgregarGasto from '@/views/AgregarGasto.vue'
import Layout from '../views/Layout.vue'  // tu layout
import Dashboard from '../views/Dashboard.vue'
import Categorias from '../views/Categorias.vue'
import Presupuestos from '../views/Presupuestos.vue'
import Usuarios from '../views/Usuarios.vue'

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
      { path: 'categorias', component: Categorias },
      { path: 'presupuestos', component: Presupuestos },
      { path: 'usuarios', component: Usuarios }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

