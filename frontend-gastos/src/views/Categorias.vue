<template>
    <div class="categories-container font-sans text-white">
        <!-- Background Animations -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse">
            </div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
                style="animation-delay: 1s"></div>
        </div>

        <div class="relative z-10 w-full max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight mb-2">📂 Mis Categorías</h1>
                    <p class="text-white/60 text-sm">Gestiona las categorías para tus gastos</p>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <div
                    class="w-10 h-10 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4">
                </div>
                <p class="text-white/50 animate-pulse">Cargando categorías...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <p class="text-red-300 mb-4">❌ {{ error }}</p>
                <button @click="fetchCategories"
                    class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors">
                    Reintentar
                </button>
            </div>

            <!-- Empty -->
            <div v-else-if="categories.length === 0" class="glass-panel p-12 text-center">
                <div class="text-6xl mb-4 opacity-50">📦</div>
                <h3 class="text-xl font-medium text-white mb-2">No tienes categorías aún</h3>
                <p class="text-white/50 mb-6">Crea tu primera categoría para organizar tus gastos</p>
                <button @click="openModal" class="btn-primary">
                    Crear Primera Categoría
                </button>
            </div>

            <!-- Categories Table -->
            <div v-else class="glass-panel overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-white/10 bg-white/5">
                            <th class="p-4 text-white/60 font-medium text-sm">Icono</th>
                            <th class="p-4 text-white/60 font-medium text-sm">Nombre</th>
                            <th class="p-4 text-white/60 font-medium text-sm text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        <tr v-for="category in categories" :key="category.id"
                            class="group hover:bg-white/5 transition-colors">
                            <td class="p-4 w-20">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ring-1 ring-white/10"
                                    :style="{ backgroundColor: (category.color || '#667eea') + '20', color: category.color || '#667eea' }">
                                    {{ category.icon || '📊' }}
                                </div>
                            </td>
                            <td class="p-4">
                                <span
                                    class="font-medium text-lg text-white group-hover:text-fuchsia-300 transition-colors">
                                    {{ category.nombre || category.name || '-' }}
                                </span>
                            </td>
                            <td class="p-4 text-right">
                                <div
                                    class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="editCategory(category)"
                                        class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        title="Editar">
                                        ✏️
                                    </button>
                                    <button @click="deleteCategory(category)"
                                        class="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        title="Eliminar">
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button v-if="!loading && categories.length > 0" @click="openModal"
                class="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform z-20">
                ➕
            </button>

            <!-- Modal -->
            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                @click.self="closeModal">
                <div class="glass-modal w-full max-w-md p-6 animate-fade-in relative">
                    <button class="absolute top-4 right-4 text-white/40 hover:text-white" @click="closeModal">✕</button>

                    <h2 class="text-xl font-bold text-white mb-6">
                        {{ isEditing ? 'Editar' : 'Nueva' }} Categoría
                    </h2>

                    <form @submit.prevent="saveCategory" class="space-y-6">
                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Nombre *</label>
                            <input v-model="formData.nombre" type="text" required placeholder="Ej: Alimentación"
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all" />
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Icono</label>
                            <div class="grid grid-cols-6 gap-2">
                                <button v-for="emoji in emojis" :key="emoji" type="button"
                                    class="h-10 rounded-lg flex items-center justify-center text-lg border border-transparent hover:bg-white/10 transition-colors"
                                    :class="{ 'bg-fuchsia-500/20 border-fuchsia-500': formData.icon === emoji, 'bg-white/5 border-white/5': formData.icon !== emoji }"
                                    @click="formData.icon = emoji">
                                    {{ emoji }}
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Color</label>
                            <div class="grid grid-cols-8 gap-2">
                                <button v-for="color in colors" :key="color" type="button"
                                    class="w-full aspect-square rounded-full border-2 transition-transform hover:scale-110"
                                    :style="{ backgroundColor: color, borderColor: formData.color === color ? 'white' : 'transparent' }"
                                    @click="formData.color = color">
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-4 mt-8 pt-4 border-t border-white/10">
                            <button type="button" @click="closeModal"
                                class="flex-1 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-colors font-medium">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                                :disabled="saving">
                                {{ saving ? 'Guardando...' : 'Guardar' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import categoryService from '../api/categorias.js'

// estados
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// formulario
const formData = ref({
    nombre: '',
    icon: '📊',
    color: '#667eea'
})

// datos UI
const emojis = ['🍕', '🚗', '🎮', '💡', '🏥', '📚', '🏠', '👕', '🎬', '✈️', '💰', '🎵']
const colors = ['#667eea', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']

const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await categoryService.getAll()
        categories.value = response.data.categorias || response.data || []
    } catch (err) {
        console.error('❌ Error al cargar categorías:', err)
        error.value = 'No se pudieron cargar las categorías'
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditing.value = false
    editingId.value = null
    formData.value = { nombre: '', icon: '📊', color: '#667eea' }
    showModal.value = true
}

const closeModal = () => showModal.value = false

const editCategory = (category) => {
    isEditing.value = true
    editingId.value = category.id
    formData.value = {
        nombre: category.nombre || category.name || '',
        icon: category.icon || '📊',
        color: category.color || '#667eea'
    }
    showModal.value = true
}

const saveCategory = async () => {
    if (!formData.value.nombre || formData.value.nombre.trim() === '') {
        alert('El nombre de la categoría es requerido')
        return
    }

    saving.value = true
    try {
        const dataToSend = {
            nombre: formData.value.nombre.trim(),
            icon: formData.value.icon,
            color: formData.value.color
        }

        if (isEditing.value) {
            await categoryService.update(editingId.value, dataToSend)
        } else {
            await categoryService.create(dataToSend)
        }
        await fetchCategories()
        closeModal()
    } catch (err) {
        console.error(err)
        alert('Error al guardar: ' + (err.response?.data?.message || err.message))
    } finally {
        saving.value = false
    }
}

const deleteCategory = async (category) => {
    const categoryName = category.nombre || category.name || 'esta categoría'
    if (!confirm(`¿Eliminar "${categoryName}"?`)) return

    try {
        await categoryService.delete(category.id)
        await fetchCategories()
    } catch (err) {
        console.error(err)
        alert('Error al eliminar: ' + (err.response?.data?.message || err.message))
    }
}

onMounted(fetchCategories)
</script>

<style scoped>
.categories-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0720 0%, #1e1b4b 100%);
    padding: 2rem;
    position: relative;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1.5rem;
}

.glass-modal {
    background: #1a1625;
    background: linear-gradient(145deg, #1a1625, #13101c);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #a855f7, #7c3aed);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>
