import axios from 'axios'
// ruta de conexion de los empoints de la api
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

// Interceptor para añadir token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export default api