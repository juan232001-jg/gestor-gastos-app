import api from './axios'

const presupuestoService = {
    // Listar todos los presupuestos
    getAll() {
        return api.get('/presupuesto')
    },
    // listar un presupuesto por id
    getOne(id) {
        return api.get(`/presupuesto/${id}`)
    },
    // crear un presupuesto
    create(data) {
        return api.post('/presupuesto', data)
    },
    // actualizar un presupuesto
    update(id, data) {
        return api.put(`/presupuesto/${id}`, data)
    },
    // eliminar un presupuesto
    delete(id) {
        return api.delete(`/presupuesto/${id}`)
    }
}

export default presupuestoService
