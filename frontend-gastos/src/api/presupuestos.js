import api from './axios'

const presupuestoService = {
    getAll() {
        return api.get('/presupuesto')
    },
    create(data) {
        return api.post('/presupuesto', data)
    },
    update(id, data) {
        return api.put(`/presupuesto/${id}`, data)
    },
    delete(id) {
        return api.delete(`/presupuesto/${id}`)
    }
}

export default presupuestoService
