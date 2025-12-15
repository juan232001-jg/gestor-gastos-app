<template>
    <div class="categories-container">
        <h1>📂 Mis Categorías</h1>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Cargando categorías...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-box">
            <p>❌ {{ error }}</p>
            <button @click="fetchCategories" class="btn-retry">Reintentar</button>
        </div>

        <!-- Empty -->
        <div v-else-if="categories.length === 0" class="empty">
            <p>📦 No tienes categorías aún</p>
            <button @click="openModal" class="btn-primary">Crear Primera Categoría</button>
        </div>

        <!-- Categories Grid -->
        <div v-else class="categories-grid">
            <div v-for="category in categories" :key="category.id" class="category-card">
                <div class="category-header">
                    <div class="category-icon"
                        :style="{ backgroundColor: category.color + '30', color: category.color }">
                        {{ category.icon }}
                    </div>
                    <div class="category-info">
                        <h3>{{ category.name }}</h3>
                        <p v-if="category.description">{{ category.description }}</p>
                    </div>
                </div>

                <div class="category-stats">
                    <div class="stat">
                        <span class="stat-label">Gastos</span>
                        <span class="stat-value">{{ category.expense_count || 0 }}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Total</span>
                        <span class="stat-value">{{ formatMoney(category.total_amount || 0) }}</span>
                    </div>
                </div>

                <div class="category-actions">
                    <button @click="editCategory(category)" class="btn-edit">✏️ Editar</button>
                    <button @click="deleteCategory(category)" class="btn-delete" :disabled="category.expense_count > 0">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>

        <button v-if="!loading && categories.length > 0" @click="openModal" class="btn-float">
            ➕
        </button>

        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <h2>{{ isEditing ? 'Editar' : 'Nueva' }} Categoría</h2>
                <form @submit.prevent="saveCategory">
                    <div class="form-group">
                        <label>Nombre *</label>
                        <input v-model="formData.name" type="text" required />
                    </div>

                    <div class="form-group">
                        <label>Icono</label>
                        <div class="icon-grid">
                            <button v-for="emoji in emojis" :key="emoji" type="button" class="icon-btn"
                                :class="{ active: formData.icon === emoji }" @click="formData.icon = emoji">
                                {{ emoji }}
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Color</label>
                        <div class="color-grid">
                            <button v-for="color in colors" :key="color" type="button" class="color-btn"
                                :style="{ backgroundColor: color }" :class="{ active: formData.color === color }"
                                @click="formData.color = color">
                                <span v-if="formData.color === color">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea v-model="formData.description" rows="3"></textarea>
                    </div>

                    <div class="modal-actions">
                        <button type="button" @click="closeModal" class="btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-primary" :disabled="saving">
                            {{ saving ? 'Guardando...' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
// Importar todas las categorías desde un archivo externo
import categorias from '../api/categorias.js'

import { ref, onMounted } from 'vue'
import categoryService from '@/services/categoryService'

const categories = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)


const formData = ref({ name: '', icon: '📊', color: '#667eea', description: '' })

const emojis = ['🍕', '🚗', '🎮', '💡', '🏥', '📚', '🏠', '👕', '🎬', '✈️', '💰', '🎵']
const colors = ['#667eea', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']

const formatMoney = (amount) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)

const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await categoryService.getAll()
        categories.value = response.success ? response.data : []
        if (!response.success) error.value = response.message
    } catch (err) {
        error.value = 'No se pudieron cargar las categorías.'
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditing.value = false
    editingId.value = null
    formData.value = { name: '', icon: '📊', color: '#667eea', description: '' }
    showModal.value = true
}

const editCategory = (category) => {
    isEditing.value = true
    editingId.value = category.id
    formData.value = { ...category }
    showModal.value = true
}

const saveCategory = async () => {
    saving.value = true
    try {
        const response = isEditing.value
            ? await categoryService.update(editingId.value, formData.value)
            : await categoryService.create(formData.value)
        if (response.success) {
            await fetchCategories()
            closeModal()
        }
    } finally {
        saving.value = false
    }
}

const deleteCategory = async (category) => {
    if (category.expense_count > 0) return
    if (!confirm(`¿Eliminar "${category.name}"?`)) return
    await categoryService.delete(category.id)
    fetchCategories()
}

const closeModal = () => (showModal.value = false)

onMounted(fetchCategories)
</script>

<style scoped>
/* ——— estilos resumen ——— */
.categories-container {
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
}

.loading,
.empty,
.error-box {
    text-align: center;
    padding: 2rem;
}

.categories-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.category-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.3rem;
    box-shadow: 0 2px 8px #0001;
}

.category-header {
    display: flex;
    gap: 1rem;
}

.category-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.category-stats {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    display: flex;
    justify-content: space-between;
}

.category-actions button {
    flex: 1;
    padding: 0.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

.btn-float {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    font-size: 1.5rem;
    border: none;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: #0007;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background: #fff;
    padding: 2rem;
    border-radius: 14px;
    width: 90%;
    max-width: 480px;
}

.icon-grid,
.color-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
}

.icon-btn,
.color-btn {
    border-radius: 8px;
    border: 2px solid #ddd;
    cursor: pointer;
}
</style>
