// routes/gastos.js
const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastosController');
const jwt = require('jsonwebtoken');
const {verificarRol} =  require('../middlewares/roles')
const {verificarToken}= require('../middlewares/auth')
const { verificarUsuarioActivo } = require('../middlewares/usuarioActivo');




router.post('/', verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']), gastosController.agregarGasto);
router.get('/', verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario','invitado']), gastosController.obtenerGastos);
router.delete('/:id', verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']), gastosController.eliminarGasto);
router.put('/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']), gastosController.editarGasto)
router.get('/:id', verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario','invitado']),gastosController.obtenerGastoPorId)

module.exports = router;
