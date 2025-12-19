// express router de  montar
const express = require('express');
// router de express
const router = express.Router();
// controladores de roles todas funciones que vienen del controlador
const rolesControllers = require('../controllers/rolesController.js');
// jwt verifica el token que se genera en el middleware auth de inicio de sesión
const jwt = require('jsonwebtoken');
// verificar rol verifica que el usuario tenga el rol correcto  yb tenga permiso para acceder a la ruta
const { verificarRol } = require('../middlewares/roles')
// verificar token verifica que el token sea valido
const { verificarToken } = require('../middlewares/auth')
// verificar usuario activo verifica que el usuario no este inactivo
const { verificarUsuarioActivo } = require('../middlewares/usuarioActivo');


// Rutas de roles
//  GET traer todos los roles
router.get('/', verificarToken, verificarUsuarioActivo, verificarRol(['admin']), rolesControllers.obtenerRoles)
// GET traer un rol por id
router.get('/:id', verificarToken, verificarUsuarioActivo, verificarRol(['admin']), rolesControllers.obtenerRolPorId)
// POST crear un rol
router.post('/', verificarToken, verificarUsuarioActivo, verificarRol(['admin']), rolesControllers.crearRol)
// PUT actualizar un rol
router.put('/:id', verificarToken, verificarUsuarioActivo, verificarRol(['admin']), rolesControllers.actualizarRol)
// DELETE eliminar un rol
router.delete('/:id', verificarToken, verificarUsuarioActivo, verificarRol(['admin']), rolesControllers.eliminarRol)

// exportar el router para el sus en server.js
module.exports = router
