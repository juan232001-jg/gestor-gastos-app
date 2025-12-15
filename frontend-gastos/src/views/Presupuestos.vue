<template>
    <div class="presupuestos-container">
        <h1>📊 Mis Presupuestos</h1>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Cargando presupuestos...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-box">
            <p>❌ {{ error }}</p>
            <button @click="fetchPresupuestos" class="btn-retry">Reintentar</button>
        </div>

        <!-- Empty -->
        <div v-else-if="presupuestos.length === 0" class="empty">
            <p>📦 No tienes presupuestos aún</p>
            <button @click="openModal" class="btn-primary">Crear Primer Presupuesto</button>
        </div>

        <!-- Presupuestos Table -->
        <div v-else class="table-container">
            <table class="presupuestos-table">
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Nombre</th>
                        <th>Monto</th>
                        <th>Fechas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in presupuestos" :key="item.id">
                        <td>
                            <div class="color-indicator" :style="{ backgroundColor: item.color || '#667eea' }">
                            </div>
                        </td>
                        <td class="name-cell">{{ item.nombre || item.name || '-' }}</td>
                        <td class="money-cell">{{ formatMoney(item.monto || item.amount || 0) }}</td>
                        <td class="date-cell">
                            {{ formatDate(item.fecha_inicio) }} - {{ formatDate(item.fecha_fin) }}
                        </td>
                        <td>
                            <span class="status-badge">Activo</span>
                        </td>
                        <td class="actions-cell">
                            <button @click="editItem(item)" class="btn-edit" title="Editar">✏️</button>
                            <button @click="deleteItem(item)" class="btn-delete" title="Eliminar">
                                🗑️
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button v-if="!loading && presupuestos.length > 0" @click="openModal" class="btn-float">
            ➕
        </button>

        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <h2>{{ isEditing ? 'Editar' : 'Nuevo' }} Presupuesto</h2>
                <form @submit.prevent="saveItem">
                    <div class="form-group">
                        <label>Nombre *</label>
                        <input v-model="formData.nombre" type="text" required placeholder="Ej: Mensual General" />
                    </div>

                    <div class="form-group">
                        <label>Monto Objetivo *</label>
                        <input v-model="formData.monto" type="number" required placeholder="0" />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Fecha Inicio</label>
                            <input v-model="formData.fecha_inicio" type="date" />
                        </div>
                        <div class="form-group">
                            <label>Fecha Fin</label>
                            <input v-model="formData.fecha_fin" type="date" />
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
import { ref, onMounted } from 'vue'
import presupuestoService from '../api/presupuestos.js'

// estados
const presupuestos = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// formulario
const formData = ref({
    nombre: '',
    monto: '',
    fecha_inicio: '',
    fecha_fin: '',
    color: '#667eea'
})

// datos UI
const colors = ['#667eea', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4']

// utilidades
const formatMoney = (amount) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount)

const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'short'
    })
}

// 🔥 CRUD
const fetchPresupuestos = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await presupuestoService.getAll()
        // Ajustar según estructura real de tu API
        presupuestos.value = response.data.presupuestos || response.data || []
    } catch (err) {
        console.error('❌ Error al cargar presupuestos:', err)
        error.value = 'No se pudieron cargar los presupuestos'
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditing.value = false
    editingId.value = null
    formData.value = {
        nombre: '', monto: '', fecha_inicio: '', fecha_fin: '', color: '#667eea'
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const editItem = (item) => {
    isEditing.value = true
    editingId.value = item.id
    formData.value = {
        nombre: item.nombre || item.name,
        monto: item.monto || item.amount,
        fecha_inicio: item.fecha_inicio ? item.fecha_inicio.split('T')[0] : '',
        fecha_fin: item.fecha_fin ? item.fecha_fin.split('T')[0] : '',
        color: item.color || '#667eea'
    }
    showModal.value = true
}

const saveItem = async () => {
    saving.value = true
    try {
        if (isEditing.value) {
            await presupuestoService.update(editingId.value, formData.value)
        } else {
            await presupuestoService.create(formData.value)
        }
        await fetchPresupuestos()
        closeModal()
    } catch (err) {
        console.error('❌ Error al guardar:', err)
        alert('Error al guardar: ' + (err.response?.data?.message || err.message))
    } finally {
        saving.value = false
    }
}

const deleteItem = async (item) => {
    if (!confirm(`¿Eliminar presupuesto "${item.nombre || item.name}"?`)) return
    try {
        await presupuestoService.delete(item.id)
        fetchPresupuestos()
    } catch (err) {
        console.error(err)
        alert('Error al eliminar')
    }
}

onMounted(fetchPresupuestos)
</script>

<style scoped>
/* Estilos reutilizados con ajustes */
.presupuestos-container {
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

.btn-retry {
    padding: 0.5rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

/* Tabla */
.table-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.presupuestos-table {
    width: 100%;
    border-collapse: collapse;
}

.presupuestos-table thead {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.presupuestos-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
}

.presupuestos-table tbody tr {
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.presupuestos-table tbody tr:hover {
    background-color: #f8f9ff;
}

.presupuestos-table td {
    padding: 1rem;
    vertical-align: middle;
}

.color-indicator {
    width: 24px;
    height: 24px;
    border-radius: 6px;
}

.name-cell {
    font-weight: 600;
    color: #333;
}

.money-cell {
    font-weight: 600;
    color: #10B981;
}

.date-cell {
    color: #666;
    font-size: 0.9rem;
}

.status-badge {
    background: #def7ec;
    color: #03543f;
    padding: 0.25rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
}

.actions-cell {
    display: flex;
    gap: 0.5rem;
}

.btn-edit,
.btn-delete {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn-edit {
    background: #e0e7ff;
}

.btn-delete {
    background: #fee2e2;
}

/* Modal y Forms */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 480px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.form-row .form-group {
    flex: 1;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
}

.color-btn {
    height: 36px;
    border-radius: 6px;
    border: 2px solid #ddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
}

.color-btn.active {
    border-color: #333;
    transform: scale(1.1);
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-secondary {
    flex: 1;
    padding: 0.75rem;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.modal-actions .btn-primary {
    flex: 1;
}

.btn-float {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Spinner */
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #eee;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
