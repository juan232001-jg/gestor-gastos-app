<template>
    <div class="usuarios-container text-white font-sans">
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
                    <h1 class="text-3xl font-bold tracking-tight mb-2">👥 Gestión de Usuarios</h1>
                    <p class="text-white/60 text-sm">Administra los usuarios y sus permisos</p>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <div
                    class="w-10 h-10 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4">
                </div>
                <p class="text-white/50 animate-pulse">Cargando usuarios...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                <p class="text-red-300 mb-4">❌ {{ error }}</p>
                <button @click="fetchUsuarios"
                    class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors">
                    Reintentar
                </button>
            </div>

            <!-- Empty -->
            <div v-else-if="usuarios.length === 0" class="glass-panel p-12 text-center">
                <div class="text-6xl mb-4 opacity-50">👥</div>
                <h3 class="text-xl font-medium text-white mb-2">No hay usuarios registrados</h3>
                <button @click="openModal" class="btn-primary mt-4">
                    Crear Primer Usuario
                </button>
            </div>

            <!-- Usuarios Table -->
            <div v-else class="glass-panel overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-white/10 bg-white/5">
                            <th class="p-4 text-white/60 font-medium text-sm">Usuario</th>
                            <th class="p-4 text-white/60 font-medium text-sm">Correo</th>
                            <th class="p-4 text-white/60 font-medium text-sm">Rol</th>
                            <th class="p-4 text-white/60 font-medium text-sm">Estado</th>
                            <th class="p-4 text-white/60 font-medium text-sm text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        <tr v-for="user in usuarios" :key="user.id" class="group hover:bg-white/5 transition-colors">
                            <td class="p-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg">
                                        {{ getInitial(user.nombre) }}
                                    </div>
                                    <span class="font-medium text-white">{{ user.nombre || user.name }}</span>
                                </div>
                            </td>

                            <td class="p-4 text-white/70 text-sm">
                                {{ user.correo || user.email }}
                            </td>

                            <td class="p-4">
                                <span
                                    class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase border border-indigo-500/20 tracking-wider">
                                    {{ user.rol_nombre || getRoleName(user.id_rol) }}
                                </span>
                            </td>

                            <td class="p-4">
                                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                                    :class="isUserActive(user.activo) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20' : 'bg-red-500/20 text-red-300 border-red-500/20'">
                                    {{ isUserActive(user.activo) ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>

                            <td class="p-4 text-right">
                                <div
                                    class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="editUser(user)"
                                        class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        title="Editar">
                                        ✏️
                                    </button>
                                    <button @click="deleteUser(user)"
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

            <button v-if="!loading" @click="openModal"
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
                        {{ isEditing ? 'Editar' : 'Nuevo' }} Usuario
                    </h2>

                    <form @submit.prevent="saveUser" class="space-y-5">
                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Nombre *</label>
                            <input v-model="formData.nombre" type="text" required
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all" />
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Correo *</label>
                            <input v-model="formData.correo" type="email" required
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all" />
                        </div>

                        <div v-if="!isEditing" class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Contraseña *</label>
                            <input v-model="formData.password" type="password" required
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all" />
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-white/70 mb-2">Rol</label>
                            <div class="relative">
                                <select v-model="formData.id_rol" required
                                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 appearance-none">
                                    <option v-for="role in rolesList" :key="role.id" :value="role.id"
                                        class="bg-gray-900">
                                        {{ role.nombre }}
                                    </option>
                                </select>
                                <div
                                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/40">
                                    ▼</div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative inline-flex items-center">
                                    <input type="checkbox" v-model="formData.activo" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50">
                                    </div>
                                </div>
                                <span
                                    class="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Usuario
                                    Activo</span>
                            </label>
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
import usuarioService from '../api/usuarios.js'
import rolesService from '../api/roles.js'

// estados
const usuarios = ref([])
const rolesList = ref([])
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
    const role = rolesList.value.find(r => r.id === Number(roleId))
    return role ? role.nombre : 'Usuario' // Default fallback
}

const isUserActive = (status) => {
    if (status === 0 || status === '0' || status === false || status === 'false') return false
    return true
}

// Cargar Roles
const fetchRoles = async () => {
    try {
        const response = await rolesService.getAll()
        rolesList.value = response.data.data || []
        if (!Array.isArray(rolesList.value)) rolesList.value = []
    } catch (error) {
        console.error('❌ Error cargando roles:', error)
        rolesList.value = []
    }
}

// CRUD
const fetchUsuarios = async () => {
    loading.value = true
    error.value = null
    try {
        const response = await usuarioService.getAll()
        let data = response.data.usuarios || response.data || []

        if (!Array.isArray(data) && typeof data === 'object') {
            data = data.data || data.body || []
        }

        usuarios.value = (Array.isArray(data) ? data : []).map(u => {
            const rawStatus = u.activo !== undefined ? u.activo
                : u.estado !== undefined ? u.estado
                    : u.status !== undefined ? u.status
                        : u.is_active !== undefined ? u.is_active
                            : 1

            const rawRole = u.id_rol || u.rol_id || u.role_id || u.role || 2

            return {
                ...u,
                activo: rawStatus,
                id_rol: rawRole,
                rol_nombre: u.rol_nombre
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
    formData.value = { nombre: '', correo: '', password: '', activo: true, id_rol: 2 }
    showModal.value = true
}

const closeModal = () => showModal.value = false

const editUser = (user) => {
    isEditing.value = true
    editingId.value = user.id

    // Check active
    const isActive = isUserActive(user.activo)

    formData.value = {
        nombre: user.nombre || user.name,
        correo: user.correo || user.email,
        activo: isActive,
        id_rol: user.id_rol || 2
    }
    showModal.value = true
}

const saveUser = async () => {
    saving.value = true
    try {
        const dataToSend = {
            nombre: formData.value.nombre,
            correo: formData.value.correo,
            contrasena: formData.value.password,
            estado: formData.value.activo ? 1 : 0,
            rol_id: formData.value.id_rol
        }

        if (isEditing.value) {
            delete dataToSend.password
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
.usuarios-container {
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
