<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="text-h6">Registro</v-card-title>
          <v-card-text>
            <v-text-field label="Nombre" v-model="nombre" />
            <v-text-field label="Correo" v-model="correo" />
            <v-text-field label="Contraseña" v-model="contrasena" type="password" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="doRegister">Crear cuenta</v-btn>
          </v-card-actions>
          <v-card-subtitle>
            ¿Ya tienes cuenta?
            <RouterLink to="/login">Inicia sesión aquí</RouterLink>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const nombre = ref('')
const correo = ref('')
const contrasena = ref('')
const auth = useAuthStore()
const router = useRouter()

const doRegister = async () => {
  try {
    await auth.registerUser(nombre.value, correo.value, contrasena.value)
    alert('Usuario registrado con éxito. Ahora inicia sesión.')
    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Error en el registro')
  }
}
</script>
