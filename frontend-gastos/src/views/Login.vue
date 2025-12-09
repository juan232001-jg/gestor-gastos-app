<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">

    <!-- Elementos decorativos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse">
      </div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style="animation-delay: 1s"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style="animation-delay: 2s"></div>
    </div>

    <!-- Card Principal -->
    <div class="relative w-full max-w-md">

      <!-- Logo/Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
          Gestor de Gastos
        </h1>
        <p class="text-purple-200 text-sm">
          Controla tus finanzas de manera inteligente
        </p>
      </div>

      <!-- Card de Login -->
      <div class="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40S p-10 animate-fade-in"
        style="animation-delay: 0.2s">

        <!-- Título -->
        <div class="mb-8">
          <h2 class="text-center text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
          <p class="text-center text-white/60 mb-8">Ingresa tus credenciales para continuar</p>
        </div>

        <!-- Mensajes de error/éxito -->
        <transition enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 transform -translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="errorMessage"
            class="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start space-x-3">
            <svg class="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-red-200 text-sm font-medium">{{ errorMessage }}</p>
            </div>
          </div>
        </transition>

        <!-- Formulario -->
        <form @submit.prevent="doLogin" class="space-y-5">

          <!-- Email/Usuario -->
          <div class="group max-w-sm">
            <label
              class="block text-sm font-semibold text-white mb-2 transition-all group-focus-within:text-fuchsia-300">
              Correo electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/70 group-focus-within:text-fuchsia-300 transition-colors" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input v-model="correo" type="email" placeholder="usuario@ejemplo.com" required class="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-4 text-white placeholder-white/60 
         outline-none focus:bg-white/15 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50
         transition-all duration-200" @input="clearError" />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="group">
            <label
              class="block text-sm font-semibold text-white mb-2 transition-all group-focus-within:text-fuchsia-300">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-white/70 group-focus-within:text-fuchsia-300 transition-colors" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input v-model="contrasena" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required
                class="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-11 py-3 text-white placeholder-white/60
         outline-none focus:bg-white/15 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50
         transition-all duration-200" @input="clearError" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white transition-colors">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" v-model="rememberMe"
                class="w-4 h-4 rounded border-white/20 bg-white/10 text-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/50 cursor-pointer" />
              <span class="text-white/80 group-hover:text-white transition-colors">Recordarme</span>
            </label>
            <a href="#" class="text-fuchsia-300 hover:text-fuchsia-200 font-medium transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Botón de Login -->
          <button type="submit" :disabled="isLoading"
            class="w-full py-4 mt-6 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2">
            <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span v-if="!isLoading">Iniciar Sesión</span>
            <span v-else>Iniciando sesión...</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-transparent text-white/60">O continúa con</span>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button"
            class="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 group">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span class="text-white text-sm font-medium">Google</span>
          </button>

          <button type="button"
            class="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 group">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span class="text-white text-sm font-medium">GitHub</span>
          </button>
        </div>

        <!-- Registro -->
        <div class="mt-8 text-center">
          <p class="text-white/70 text-sm">
            ¿No tienes una cuenta?
            <router-link to="/register" class="text-fuchsia-300 hover:text-fuchsia-200 font-semibold transition-colors">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-white/50 text-xs">
        <p>© 2024 Gestor de Gastos. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const correo = ref("");
const contrasena = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const auth = useAuthStore();
const router = useRouter();

const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
};

const doLogin = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await auth.loginUser(correo.value, contrasena.value);

    // Si "recordarme" está activo, guardar en localStorage
    if (rememberMe.value) {
      localStorage.setItem('rememberEmail', correo.value);
    }

    // Pequeño delay para UX
    setTimeout(() => {
      router.push("/gastos");
    }, 500);

  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Usuario o contraseña incorrectos";

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  } finally {
    isLoading.value = false;
  }
};

// Cargar email recordado al montar el componente
const loadRememberedEmail = () => {
  const remembered = localStorage.getItem('rememberEmail');
  if (remembered) {
    correo.value = remembered;
    rememberMe.value = true;
  }
};

loadRememberedEmail();
</script>

<style scoped>
/* Animación decorativa de los fondos */
@keyframes pulse {

  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.35;
  }
}

.animate-pulse {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Mejor definición visual */
input {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

input:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(244, 114, 182, 0.7);
  /* fucsia */
  box-shadow: 0 0 12px rgba(244, 114, 182, 0.4);
}

/* Mejora en los botones sociales */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(244, 114, 182, 0.3);
}

/* Logo más luminoso y con profundidad */
.logo-glow {
  box-shadow: 0 0 25px rgba(244, 114, 182, 0.5),
    0 0 50px rgba(147, 51, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.4s ease;
}

.logo-glow:hover {
  transform: scale(1.08);
  box-shadow: 0 0 40px rgba(244, 114, 182, 0.7),
    0 0 70px rgba(147, 51, 234, 0.4);
}

/* Card efecto cristalino más definido */
.bg-glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
}
</style>
