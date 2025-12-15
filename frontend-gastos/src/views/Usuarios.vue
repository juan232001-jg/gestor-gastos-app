<template>
    <div class="usuarios-container">
        <h1>👥 Gestión de Usuarios</h1>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-box">
            <p>❌ {{ error }}</p>
            <button @click="fetchUsuarios" class="btn-retry">Reintentar</button>
        </div>

        <!-- Usuarios Table -->
        <div v-else class="table-container">
            <table class="usuarios-table">
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in usuarios" :key="user.id">
                        <td>
                            <div class="avatar-cell">
                                <span class="avatar-initial">{{ getInitial(user.nombre) }}</span>
                            </div>
                        </td>
                        <td class="name-cell">{{ user.nombre || user.name }}</td>
                        <td class="email-cell">{{ user.correo || user.email }}</td>
                        <td>
                            <span class="role-badge">{{ user.rol_nombre || getRoleName(user.id_rol) }}</span>
                        </td>
                        <td>
                            <span :class="['status-badge', isUserActive(user.activo) ? 'active' : 'inactive']">
                                {{ isUserActive(user.activo) ? 'Activo' : 'Inactivo' }}
                            </span>
                        </td>
                        <td class="actions-cell">
                            <button @click="editUser(user)" class="btn-edit" title="Editar">✏️</button>
                            <button @click="deleteUser(user)" class="btn-delete" title="Eliminar">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button v-if="!loading" @click="openModal" class="btn-float">
            ➕
        </button>

        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <h2>{{ isEditing ? 'Editar' : 'Nuevo' }} Usuario</h2>
                <form @submit.prevent="saveUser">
                    <div class="form-group">
                        <label>Nombre *</label>
                        <input v-model="formData.nombre" type="text" required />
                    </div>

                    <div class="form-group">
                        <label>Correo *</label>
                        <input v-model="formData.correo" type="email" required />
                    </div>

                    <div v-if="!isEditing" class="form-group">
                        <label>Contraseña *</label>
                        <input v-model="formData.password" type="password" required />
                    </div>

                    <div class="form-group">
                        <label>Rol</label>
                        <select v-model="formData.id_rol" required>
                            <option v-for="role in rolesList" :key="role.id" :value="role.id">
                                {{ role.nombre }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group checkbox-group">
                        <label>
                            <input type="checkbox" v-model="formData.activo">
                            Usuario Activo
                        </label>
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
import usuarioService from '../api/usuarios.js'
import rolesService from '../api/roles.js'

// estados
const usuarios = ref([])
const rolesList = ref([]) // Lista dinámica de roles
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// formulario
const formData = ref({
    nombre: '',
    correo: '',
    password: '',
    activo: true,
    id_rol: ''
})

// utilities
const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?'
}

const getRoleName = (roleId) => {
    // Buscar en la lista dinámica
    const role = rolesList.value.find(r => r.id === Number(roleId))
    return role ? role.nombre : 'invitado' // Default display if not found loading
}

// Función helper para verificar estado
const isUserActive = (status) => {
    // Si es 0, '0' o false, es inactivo.
    if (status === 0 || status === '0' || status === false || status === 'false') return false
    return true
}

// Cargar Roles
const fetchRoles = async () => {
    try {
        const response = await rolesService.getAll()

        // Respuesta esperada del backend:
        // { success: true, data: [ { id, nombre } ] }
        rolesList.value = response.data.data || []

        if (!Array.isArray(rolesList.value)) {
            rolesList.value = []
        }

        console.log('🎭 Roles cargados correctamente:', rolesList.value)
    } catch (error) {
        console.error('❌ Error cargando roles:', error)
        rolesList.value = [] // NO fallback hardcodeado
    }
}


// CRUD
const fetchUsuarios = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await usuarioService.getAll()
        console.log('🔍 API Usuarios Response:', response) // Debug

        let data = response.data.usuarios || response.data || []

        // Si data no es array (ej: viene en otra propiedad), intentamos encontrarlo
        if (!Array.isArray(data) && typeof data === 'object') {
            data = data.data || data.body || []
        }

        console.log('📋 Lista de usuarios procesada:', data) // Debug
        // Normalizar datos para asegurar que 'activo' tenga valor
        usuarios.value = (Array.isArray(data) ? data : []).map(u => {
            // Buscamos propiedad de estado si 'activo' no existe
            const rawStatus = u.activo !== undefined ? u.activo
                : u.estado !== undefined ? u.estado
                    : u.status !== undefined ? u.status
                        : u.is_active !== undefined ? u.is_active
                            // Default activo si no se encuentra nada
                            : 1

            // Normalizar Rol (id_rol, rol_id, role_id, id_role)
            const rawRole = u.id_rol || u.rol_id || u.role_id || u.role || 2 // Default Usuario Operativo

            return {
                ...u,
                activo: rawStatus,
                id_rol: rawRole,
                rol_nombre: u.rol_nombre // Asegurar que pase directo
            }
        })

    } catch (err) {
        console.error('Error cargando usuarios:', err)
        error.value = 'No se pudieron cargar los usuarios'
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditing.value = false
    editingId.value = null
    // Default Role: 2 (Usuario Operativo)
    formData.value = { nombre: '', correo: '', password: '', activo: true, id_rol: 2 }
    showModal.value = true
}

const closeModal = () => showModal.value = false

const editUser = (user) => {
    isEditing.value = true
    editingId.value = user.id

    // Usar la función helper para determinar estado inicial
    const isActivo = isUserActive(user.activo)

    formData.value = {
        nombre: user.nombre || user.name,
        correo: user.correo || user.email,
        activo: isActivo,
        id_rol: user.id_rol || 2
        // No cargamos password por seguridad
    }
    showModal.value = true
}

const saveUser = async () => {
    saving.value = true
    try {
        // Preparar datos para la API
        // Mapeamos a los nombres que espera el backend (basado en la respuesta que nos diste)
        const dataToSend = {
            nombre: formData.value.nombre,
            correo: formData.value.correo,
            contrasena: formData.value.password, // Backend espera 'contrasena'
            estado: formData.value.activo ? 1 : 0,
            rol_id: formData.value.id_rol
        }

        if (isEditing.value) {
            delete dataToSend.password // No enviamos password en edición simple
            await usuarioService.update(editingId.value, dataToSend)
        } else {
            await usuarioService.create(dataToSend)
        }
        await fetchUsuarios()
        closeModal()
    } catch (err) {
        console.error(err)
        alert('Error al guardar usuario: ' + (err.response?.data?.message || err.message))
    } finally {
        saving.value = false
    }
}

const deleteUser = async (user) => {
    if (!confirm(`¿Eliminar usuario "${user.nombre}"?`)) return
    try {
        await usuarioService.delete(user.id)
        fetchUsuarios()
    } catch (err) {
        console.error(err)
        alert('Error al eliminar usuario')
    }
}

onMounted(async () => {
    await fetchRoles()
    await fetchUsuarios()
})
</script>

<style scoped>
/* Reutilizando estilos base */
.usuarios-container {
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

.table-container {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.usuarios-table {
    width: 100%;
    border-collapse: collapse;
}

.usuarios-table thead {
    background: linear-gradient(135deg, #10B981, #059669);
    /* Verde para usuarios */
    color: white;
}

.usuarios-table th,
.usuarios-table td {
    padding: 1rem;
    text-align: left;
}

.usuarios-table tbody tr {
    border-bottom: 1px solid #eee;
}

.usuarios-table tbody tr:hover {
    background-color: #f8f9ff;
}

.avatar-cell {
    width: 40px;
    height: 40px;
    background: #e0e7ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f46e5;
    font-weight: bold;
}

.role-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
    background: #f3f4f6;
    color: #4b5563;
    border: 1px solid #e5e7eb;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-badge.active {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.inactive {
    background: #fee2e2;
    color: #991b1b;
}

.actions-cell {
    display: flex;
    gap: 0.5rem;
}

.btn-edit,
.btn-delete {
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn-edit {
    background: #e0e7ff;
}

.btn-delete {
    background: #fee2e2;
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: white;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    border-radius: 12px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-group input {
    width: auto;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-secondary,
.btn-primary {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.btn-secondary {
    background: #f3f4f6;
}

.btn-primary {
    background: #10B981;
    color: white;
}

.btn-float {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #10B981;
    color: white;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #eee;
    border-top-color: #10B981;
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
