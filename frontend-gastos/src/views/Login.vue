import 
<template>

  <!-- Contenedor principal con fondo y centrado -->
  <v-container fluid class="login-container d-flex justify-center align-center">
    
    <!-- Tarjeta (card) que contiene el formulario -->
    <v-card class="login-card pa-8" elevation="10">
      
      <!-- Título del login, centrado y estilizado -->
      <v-card-title class="justify-center text-h5 font-weight-bold mb-6">
        Login
      </v-card-title>

      <!-- Contenido principal del formulario -->
      <v-card-text>
        <!-- Campo de texto para el usuario -->
        <v-text-field 
          v-model="correo" 
          label="Username" 
          prepend-inner-icon="mdi-account" 
          outlined 
          rounded 
          dense
          class="mb-4" 
        />

        <!-- Campo de texto para la contraseña -->
        <v-text-field 
          v-model="contrasena" 
          label="Password" 
          type="password" 
          prepend-inner-icon="mdi-lock" 
          outlined
          rounded 
          dense 
        />

        <!-- Botón para iniciar sesión -->
        <v-btn 
          color="white" 
          class="login-btn" 
          block 
          large 
          rounded 
          @click="doLogin"
        >
          Login
        </v-btn>
      </v-card-text>

    </v-card>
  </v-container>
</template>


<script setup>
import { ref } from "vue";              // Para variables reactivas
import { useAuthStore } from "../store/auth"; // Importa el store de autenticación (Pinia)
import { useRouter } from "vue-router"; // Para redirecciones entre rutas

// Variables reactivas para los campos del formulario
const correo = ref("");
const contrasena = ref("");
const remember = ref(false); // (no usado todavía, podría servir para "Recordar sesión")

// Instancias de la lógica de autenticación y enrutador
const auth = useAuthStore();
const router = useRouter();

// Función que se ejecuta al dar clic en "Login"
const doLogin = async () => {
  try {
    // Intenta iniciar sesión usando el store de autenticación
    await auth.loginUser(correo.value, contrasena.value);

    // Si es exitoso, redirige a la ruta "/gastos"
    router.push("/gastos");
  } catch (error) {
    // Si ocurre un error, muestra un mensaje en pantalla
    alert(error.response?.data?.message || "Error al iniciar sesión");
  }
};
</script>

<style>
/* Contenedor que ocupa toda la pantalla con fondo degradado */
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #5a2d91, #8e44ad);
  background-size: cover;
}

/* Estilo de la tarjeta (card) */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15); /* Transparente tipo "vidrio" */
  backdrop-filter: blur(12px);            /* Efecto glassmorphism */
  color: white;
}

/* Cambia el color del texto dentro de los inputs */
.v-text-field input {
  color: white !important;
}

/* Color del borde de los inputs */
.v-field__outline {
  border-color: rgba(255, 255, 255, 0.6) !important;
}

/* Estilo del botón de login */
.login-btn {
  font-weight: bold;
  color: #5a2d91 !important;
}

/* Enlaces para recuperar contraseña o registrarse (si los usas después) */
.forgot,
.register {
  color: #ffd700;
  font-weight: 500;
  text-decoration: none;
}
</style>