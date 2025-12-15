import api from './axios'

const rolesService = {
    getAll() {
        return api.get('/roles')
    }
}

export default rolesService
