<template>
  <div class="min-h-screen bg-[#0a0118] relative overflow-hidden flex items-center justify-center p-6">

    <!-- Grid pattern background -->
     
    <div class="absolute inset-0 bg-grid-pattern opacity-20"></div>

    <!-- Gradient orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-3xl opacity-30 animate-float">
      </div>
      <div
        class="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 animate-float-delayed">
      </div>
    </div>

    <!-- Form Container -->
    <div class="relative z-10 w-full max-w-2xl">

      <!-- Back Button -->
      <button @click="cancelar"
        class="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium">Volver a gastos</span>
      </button>

      <!-- Main Card -->
      <div class="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 border-b border-white/10 p-8">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[2px] shadow-lg shadow-violet-500/50">
              <div class="w-full h-full rounded-2xl bg-[#0a0118] flex items-center justify-center">
                <svg class="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Nuevo Gasto</h1>
              <p class="text-sm text-white/60 mt-1">Registra un nuevo movimiento financiero</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="guardar" class="p-8 space-y-6">

          <!-- Descripción -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-white/80">
              Descripción
              <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <input v-model="descripcion" type="text" placeholder="Ej: Pagos de energía, Compra supermercado..."
                class="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                :class="errorDescripcion ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''" />
            </div>
            <p v-if="errorDescripcion" class="text-xs text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorDescripcion }}
            </p>
          </div>

          <!-- Categoría -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-white/80">
              Categoría
              <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <select v-model="categoria_id"
                class="w-full h-14 pl-12 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none appearance-none cursor-pointer"
                :class="errorCategoria ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''">
                <option value="" disabled selected class="bg-[#1a1a2e] text-white/60">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id" class="bg-[#1a1a2e] text-white">
                  {{ cat.nombre }}
                </option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="errorCategoria" class="text-xs text-red-400 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorCategoria }}
            </p>
          </div>

          <!-- Monto y Fecha en grid -->
          <div class="grid grid-cols-2 gap-6">

            <!-- Monto -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-white/80">
                Monto
                <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span class="text-white/40 font-semibold">$</span>
                </div>
                <input v-model="monto" type="number" step="0.01" placeholder="0.00"
                  class="w-full h-14 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                  :class="errorMonto ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''" />
              </div>
              <p v-if="errorMonto" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errorMonto }}
              </p>
            </div>

            <!-- Fecha -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-white/80">
                Fecha
                <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input v-model="fecha_gasto" type="date"
                  class="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white focus:bg-white/10 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none"
                  :class="errorFecha ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''" />
              </div>
              <p v-if="errorFecha" class="text-xs text-red-400 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errorFecha }}
              </p>
            </div>
          </div>

          <!-- Error general -->
          <div v-if="errorGeneral" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p class="text-sm text-red-400 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorGeneral }}
            </p>
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p class="text-sm text-emerald-400 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ successMessage }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button type="button" @click="cancelar"
              class="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold hover:bg-white/10 hover:text-white transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="loading"
              class="flex-1 h-14 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>{{ loading ? 'Guardando...' : 'Guardar Gasto' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { agregarGasto } from '../api/gastos'
import categoriasService from '../api/categorias.js'

const router = useRouter()

// Form data
const descripcion = ref('')
const categoria_id = ref('')
const monto = ref('')
const fecha_gasto = ref('')
const categorias = ref([])

// UI state
const loading = ref(false)
const errorDescripcion = ref('')
const errorCategoria = ref('')
const errorMonto = ref('')
const errorFecha = ref('')
const errorGeneral = ref('')
const successMessage = ref('')

// Cargar categorías al montar
onMounted(async () => {
  try {
    const response = await categoriasService.getAll()
    categorias.value = response.data.categorias
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    errorGeneral.value = 'No se pudieron cargar las categorías'
  }
})

const validarFormulario = () => {
  let valido = true

  // Limpiar errores
  errorDescripcion.value = ''
  errorCategoria.value = ''
  errorMonto.value = ''
  errorFecha.value = ''
  errorGeneral.value = ''

  if (!descripcion.value.trim()) {
    errorDescripcion.value = 'La descripción es obligatoria'
    valido = false
  }

  if (!categoria_id.value) {
    errorCategoria.value = 'Debes seleccionar una categoría'
    valido = false
  }

  if (!monto.value || monto.value <= 0) {
    errorMonto.value = 'El monto debe ser mayor a 0'
    valido = false
  }

  if (!fecha_gasto.value) {
    errorFecha.value = 'La fecha es obligatoria'
    valido = false
  }

  return valido
}

const guardar = async () => {
  if (!validarFormulario()) return

  loading.value = true
  errorGeneral.value = ''
  successMessage.value = ''

  try {
    await agregarGasto({
      descripcion: descripcion.value,
      categoria_id: categoria_id.value,
      monto: monto.value,
      fecha_gasto: fecha_gasto.value,
    })

    successMessage.value = '¡Gasto agregado con éxito!'

    setTimeout(() => {
      router.push('/gastos')
    }, 1500)
  } catch (error) {
    errorGeneral.value = error.response?.data?.message || 'Error al agregar el gasto. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const cancelar = () => {
  router.push('/gastos')
}
</script>

<style scoped>
/* Grid pattern background */
.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Floating animations */
@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }

  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

@keyframes float-delayed {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(-30px, 30px) rotate(-120deg);
  }

  66% {
    transform: translate(20px, -20px) rotate(-240deg);
  }
}

.animate-float {
  animation: float 25s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 30s ease-in-out infinite;
}

/* Custom date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(0.4);
  cursor: pointer;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  filter: invert(1) opacity(0.8);
}

/* Custom select arrow */
select option {
  padding: 12px;
}
</style>
