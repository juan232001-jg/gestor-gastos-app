const express = require('express');
const router = express.Router();
const presupuestoController = require('../controllers/presupuestoControllers');
const jwt = require('jsonwebtoken');
const {verificarRol} =  require('../middlewares/roles')
const {verificarToken}= require('../middlewares/auth')
const { verificarUsuarioActivo } = require('../middlewares/usuarioActivo');


router.post('/',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']),presupuestoController.agrgarPresupuesto)
router.get('/',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario','invitado']),presupuestoController.odtenerPresupuestos)
router.put('/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']),presupuestoController.editarPresupuesto)
router.delete('/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),presupuestoController.eliminarPresupuesto)



module.exports = router;
