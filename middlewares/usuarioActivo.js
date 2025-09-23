// middlewares/usuarioActivo.js
const db = require('../db');

async function verificarUsuarioActivo(req, res, next) {
    try {
        // 1) Validar que verificarToken ya haya corrido y dejó el userId
        if (!req.userId) {
            console.error("❌ ERROR: req.userId no está definido. ¿Olvidaste poner verificarToken antes?");
            return res.status(401).json({ message: 'Token inválido o no autenticado' });
        }

        // 2) Consultar usuario por id
        const [rows] = await db.query(
            'SELECT id, estado FROM usuarios WHERE id = ?',
            [req.userId]
        );

        console.log("DEBUG verificarUsuarioActivo -> rows:", rows);

        // 3) Si no existe: 404
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 4) Convertir estado a número
        const estado = Number(rows[0].estado);

        // 5) Validar estado
        if (estado !== 1) {
            return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.' });
        }

        // 6) Usuario existe y está activo
        next();

    } catch (error) {
        console.error('Error en verificarUsuarioActivo:', error);
        return res.status(500).json({ message: 'Error al validar usuario activo', error: error.message });
    }
}

module.exports = { verificarUsuarioActivo };
