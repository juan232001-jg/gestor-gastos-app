const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middlewares/roles');
const jwt = require('jsonwebtoken');

const adminGastos = require('../controllers/adminGastosController');
const adminCategorias = require('../controllers/adminCategoriasController');
const adminPresupuestos = require('../controllers/adminPresupuestoController');
const usuariosController = require('../controllers/usuariosController')
const {verificarToken}= require('../middlewares/auth')
const { verificarUsuarioActivo } = require('../middlewares/usuarioActivo');



// Gastos
router.get('/gastos', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminGastos.obtenerTodosLosGastos);
router.put('/gastos/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminGastos.editarGastoAdmin);
router.delete('/gastos/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminGastos.eliminarGastoAdmin);

// Categorías
router.get('/categorias', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminCategorias.obtenerTodasLasCategorias);
router.put('/categorias/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminCategorias.editarCategoriaAdmin);
router.delete('/categorias/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminCategorias.eliminarCategoriaAdmin);

// Presupuestos
router.get('/presupuestos', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminPresupuestos.obtenerTodosLosPresupuestos);
router.put('/presupuestos/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminPresupuestos.editarPresupuestoAdmin);
router.delete('/presupuestos/:id', verificarToken,verificarUsuarioActivo, verificarRol(['admin']), adminPresupuestos.eliminarPresupuestoAdmin);

// Usuarios
// Obtener todos los usuarios
router.get('/',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),usuariosController.obtenerUsuarios);
// Obtener un usuario por ID
router.get('/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),usuariosController.obtenerUsuarioPorId);
// Actualizar rol de un usuario
router.put('/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),usuariosController.actualizarRol);
// Activar / desactivar usuario
router.put('/:id/estado',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),usuariosController.actualizarEstado);

module.exports = router;
