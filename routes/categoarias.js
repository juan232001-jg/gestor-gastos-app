// Importa Express y crea un enrutador para manejar las rutas de autenticación
const  express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {verificarRol} =  require('../middlewares/roles')
const {verificarToken}= require('../middlewares/auth')
const { verificarUsuarioActivo } = require('../middlewares/usuarioActivo');


// Importacion de el controlado de Categorias 
const categoariaControllers= require('../controllers/categoriasController');



router.post('/categorias',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']),categoariaControllers.agregarcategoria);
router.get('/categorias',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario','invitado']),categoariaControllers.Odtenercategorias);
router.put('/categorias/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin','usuario']),categoariaControllers.editarCategoria);
router.delete('/categorias/:id',verificarToken,verificarUsuarioActivo,verificarRol(['admin']),categoariaControllers.eliminarCategorias);


module.exports=router;