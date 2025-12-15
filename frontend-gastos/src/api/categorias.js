import api from './axios'

const categoryService = {
    getAll() {
        return api.get('/cate/categorias')
    },
    create(data) {
        return api.post('/cate/categorias', data)
    },
    update(id, data) {
        return api.put(`/cate/categorias/${id}`, data)
    },
    delete(id) {
        return api.delete(`/cate/categorias/${id}`)
    }
}

export default categoryService
