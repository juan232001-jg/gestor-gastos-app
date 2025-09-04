// routes/gastos.js
const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastosController');
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    try {
        let token = req.headers['authorization'];

        if (!token) {
            return res.status(403).json({ message: 'Token requerido' });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next(); // Pasa a la siguiente función solo si el token es válido
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

router.post('/', verificarToken, gastosController.agregarGasto);
router.get('/', verificarToken, gastosController.obtenerGastos);
router.delete('/:id', verificarToken, gastosController.eliminarGasto);
router.put('/:id',verificarToken,gastosController.editarGatos)
router.get('/:id', verificarToken,gastosController.odtenerGatosId)

module.exports = router;
