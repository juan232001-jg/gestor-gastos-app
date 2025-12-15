import api from './axios'

const usuarioService = {
    getAll() {
        return api.get('/admin')
    },
    create(data) {
        return api.post('/auth/register', data)
    },
    update(id, data) {
        return api.put(`/usuarios/${id}`, data)
    },
    delete(id) {
        return api.delete(`/usuarios/${id}`)
    }
}

export default usuarioService
