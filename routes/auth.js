// routes/auth.js
// -----------------------------------------------------------------------------
// Módulo de rutas para autenticación de usuarios.
// Define los endpoints relacionados con el registro y el inicio de sesión,
// delegando la lógica de negocio al controlador correspondiente.
// -----------------------------------------------------------------------------
// Importa Express y crea un enrutador para manejar las rutas de autenticación
const express = require('express');
const router = express.Router();
// Importa el controlador de autenticación que contiene la lógica de cada endpoint
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;