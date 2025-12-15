// src/api/categorias.js
import api from './axios'

// Obtener todas las categorías
export const obtenerCategorias = () => api.get('/cate/categorias')
