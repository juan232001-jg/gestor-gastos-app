import api from './axios'

const rolesService = {
    // Listar todos los roles
    getAll() {
        return api.get('/roles')
    },
    // listar un rol por id
    getOne(id) {
        return api.get(`/roles/${id}`)
    },
    // crear un rol
    create(data) {
        return api.post('/roles', data)
    },
    // actualizar un rol
    update(id, data) {
        return api.put(`/roles/${id}`, data)
    },
    // eliminar un rol
    delete(id) {
        return api.delete(`/roles/${id}`)
    }
}

export default rolesService
