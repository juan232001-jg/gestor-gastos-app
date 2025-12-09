// Importamos la función para definir un store desde Pinia
import { defineStore } from 'pinia'

// Importamos las funciones que hacen llamadas a la API de autenticación
import { login, register } from '../api/auth'

// Definimos el store "auth" que manejará la autenticación de usuarios
export const useAuthStore = defineStore('auth', {
  // ---------- STATE ----------
  state: () => ({
    // Datos del usuario autenticado (se guarda cuando inicia sesión)
    user: null,

    // Token de sesión (se carga desde localStorage si ya existe, 
    // así el usuario no pierde la sesión al recargar la página)
    token: localStorage.getItem('token') || null,
  }),

  // ---------- ACTIONS ----------
  actions: {
    // Acción para iniciar sesión
    async loginUser(correo, contrasena) {
      // Llamada a la API de login con correo y contraseña
      const res = await login(correo, contrasena)

      // Guardamos el token y los datos del usuario en el estado global
      this.token = res.data.token
      this.user = res.data.user

      // También guardamos el token en localStorage para persistencia
      localStorage.setItem('token', this.token, this.user)
    },

    // Acción para registrar un nuevo usuario
    async registerUser(nombre, correo, contrasena) {
      // Llamamos a la API de registro
      await register(nombre, correo, contrasena)

      // Nota: aquí no guardamos el usuario en el estado,
      // normalmente el usuario debe loguearse después de registrarse
    },

    // Acción para cerrar sesión
    logout() {
      // Limpiamos los datos del usuario y el token en el estado global
      this.user = null
      this.token = null

      // Borramos también el token del localStorage
      localStorage.removeItem('token')
    },
  },
})

// Mensaje en consola para saber que el store se cargó correctamente
console.log('✅ Store auth.js cargado')



