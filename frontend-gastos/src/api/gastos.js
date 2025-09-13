// src/api/gastos.js
import api from './axios'

// Obtener todos los gastos
export const obtenerGastos = () => api.get('/gastos')

// Agregar un gasto nuevo
export const agregarGasto = (gasto) => api.post('/gastos', gasto)

// Editar un gasto existente
export const editarGasto = (id, gasto) => api.put(`/gastos/${id}`, gasto)

// Eliminar un gasto
export const eliminarGasto = (id) => api.delete(`/gastos/${id}`)
