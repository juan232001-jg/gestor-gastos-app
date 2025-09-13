// src/api/auth.js
import api from './axios'

// función para login
export const login = (correo, contrasena) => {
  return api.post('/auth/login', { correo, contrasena })
}

// función para registro
export const register = (nombre, correo, contrasena) => {
  return api.post('/auth/register', { nombre, correo, contrasena })
}
