import api from './axios'

const usuarioService = {
    // Listar todos los usuarios
    getAll() {
        return api.get('/admin')
    },
    // listar un usuario por id
    getOne(id) {
        return api.get(`/admin/${id}`)
    },
    // crear un usuario
    create(data) {
        return api.post('/auth/register', data)
    },
    // actualizar un usuario
    update(id, data) {
        return api.put(`/usuarios/${id}`, data)
    },
    // eliminar un usuario
    delete(id) {
        return api.delete(`/usuarios/${id}`)
    }
}

export default usuarioService
