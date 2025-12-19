import api from './axios'

const categoryService = {
    // Listar todas las categorias
    getAll() {
        return api.get('/cate/categorias')
    },
    // listar una categoria por id
    getOne(id) {
        return api.get(`/cate/categorias/${id}`)
    },
    // crear una categoria
    create(data) {
        return api.post('/cate/categorias', data)
    },
    // actualizar una categoria
    update(id, data) {
        return api.put(`/cate/categorias/${id}`, data)
    },
    // eliminar una categoria
    delete(id) {
        return api.delete(`/cate/categorias/${id}`)
    }
}

export default categoryService
