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

    <!-- Contenedor Principal -->
    <div class="relative w-full max-w-6xl">

      <!-- Header con Logo -->
      <div class="text-center mb-8 animate-fade-in">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300 logo-glow">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
          Mis Gastos
        </h1>
        <p class="text-purple-200 text-sm">
          Controla y administra tus finanzas de manera inteligente
        </p>
      </div>

      <!-- Card Principal de Gastos -->
      <div
        class="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in"
        style="animation-delay: 0.2s">

        <!-- Barra superior con estadísticas (opcional) -->
        <div
          class="bg-gradient-to-r from-fuchsia-500/20 via-purple-600/20 to-indigo-600/20 px-8 py-6 border-b border-white/10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white mb-1">Panel de Gastos</h2>
              <p class="text-white/60 text-sm">Gestiona todos tus movimientos</p>
            </div>
            <button @click="$router.push('/gastos/nuevo')"
              class="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Gasto</span>
            </button>
          </div>
        </div>

        <!-- Tabla de Gastos -->
        <div class="p-8">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="px-6 py-4 text-left text-sm font-bold text-fuchsia-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th class="px-6 py-4 text-right text-sm font-bold text-fuchsia-300 uppercase tracking-wider">
                    Monto
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-bold text-fuchsia-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-4 text-center text-sm font-bold text-fuchsia-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in gastos" :key="item.id"
                  class="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">

                  <!-- Descripción -->
                  <td class="px-6 py-5">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-fuchsia-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span class="text-white font-medium">{{ item.descripcion }}</span>
                    </div>
                  </td>

                  <!-- Monto -->
                  <td class="px-6 py-5 text-right">
                    <span class="text-fuchsia-300 font-bold text-lg">
                      ${{ Number(item.monto).toLocaleString('es-CO') }}
                    </span>
                  </td>

                  <!-- Fecha -->
                  <td class="px-6 py-5 text-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatearFecha(item.fecha_gasto) }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-5">
                    <div class="flex items-center justify-center space-x-2">
                      <!-- Botón Editar -->
                      <button @click="editar(item)"
                        class="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all duration-200 group/btn">
                        <svg class="w-5 h-5 text-white/70 group-hover/btn:text-white transition-colors" fill="none"
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <!-- Botón Eliminar -->
                      <button @click="eliminar(item.id)"
                        class="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-200 group/btn">
                        <svg class="w-5 h-5 text-white/70 group-hover/btn:text-red-300 transition-colors" fill="none"
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Mensaje cuando no hay gastos -->
                <tr v-if="gastos.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center space-y-3">
                      <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p class="text-white/60 text-lg">No hay gastos registrados</p>
                      <p class="text-white/40 text-sm">Comienza agregando tu primer gasto</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
import { ref, onMounted } from 'vue'
import { obtenerGastos, eliminarGasto } from '../api/gastos'

const gastos = ref([])

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const cargar = async () => {
  const res = await obtenerGastos()
  gastos.value = res.data.gastos
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este gasto?')) {
    await eliminarGasto(id)
    cargar()
  }
}

const editar = (item) => {
  console.log('Editar', item)
  // Aquí puedes agregar la lógica para editar
}

onMounted(cargar)
</script>

<style scoped>
/* Animación de los fondos decorativos */
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

/* Animación de entrada */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* Logo con efecto glow */
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

/* Efecto hover en las filas */
tr.group:hover {
  transform: scale(1.005);
}

/* Scroll personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(244, 114, 182, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(244, 114, 182, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  table {
    font-size: 0.875rem;
  }

  th,
  td {
    padding: 0.75rem 0.5rem;
  }

  .text-4xl {
    font-size: 2rem;
  }
}
</style>