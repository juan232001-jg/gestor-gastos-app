// controllers/gastosController.js
const db = require('../db');

// Agregar gasto
exports.agregarGasto = async (req, res) => {
    try {
        const usuario_id = req.userId;
        const { descripcion, monto, fecha_gasto, categoria_id } = req.body;

        if (!usuario_id) return res.status(401).json({ message: 'Debe iniciar sesión' });
        if (!descripcion || !monto || !fecha_gasto) 
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        const [insertResult] = await db.query(
            `INSERT INTO gastos (usuario_id, categoria_id, descripcion, monto, fecha_gasto)
             VALUES (?, ?, ?, ?, ?)`,
            [usuario_id, categoria_id || null, descripcion, monto, fecha_gasto]
        );

        const [nuevoGasto] = await db.query(
            `SELECT id, usuario_id, categoria_id, descripcion, monto, fecha_gasto 
             FROM gastos WHERE id = ?`,
            [insertResult.insertId]
        );

        return res.status(201).json({
            message: 'Gasto registrado con éxito',
            gasto: nuevoGasto[0]
        });

    } catch (error) {
        console.error('Error al agregar gasto:', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Obtener todos los gastos
exports.obtenerGastos = async (req, res) => {
    try {
        const usuario_id = req.userId;
        if (!usuario_id) return res.status(401).json({ message: 'Debe iniciar sesión' });

        const [gastos] = await db.query(
            `SELECT id, categoria_id, descripcion, monto, fecha_gasto 
             FROM gastos WHERE usuario_id = ? ORDER BY fecha_gasto DESC`,
            [usuario_id]
        );

        return res.status(200).json({
            message: 'Gastos obtenidos con éxito',
            total: gastos.length,
            gastos
        });

    } catch (error) {
        console.error('Error al obtener gastos:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Eliminar gasto
exports.eliminarGasto = async (req, res) => {
    try {
        const usuario_id = req.userId;
        const { id } = req.params;
        if (!usuario_id) return res.status(401).json({ message: 'Debe iniciar sesión' });

        const [result] = await db.query(
            'DELETE FROM gastos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }

        return res.status(200).json({ message: 'Gasto eliminado correctamente' });

    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Editar gasto
exports.editarGasto = async (req, res) => {
    try {
        const usuario_id = req.userId;
        const { id } = req.params;
        const { descripcion, monto, fecha_gasto, categoria_id } = req.body;

        if (!usuario_id) return res.status(401).json({ message: 'Debe iniciar sesión' });
        if (!descripcion || !monto || !fecha_gasto) 
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        const [result] = await db.query(
            `UPDATE gastos SET descripcion = ?, monto = ?, fecha_gasto = ?, categoria_id = ?
             WHERE id = ? AND usuario_id = ?`,
            [descripcion, monto, fecha_gasto, categoria_id || null, id, usuario_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }

        const [gastoActualizado] = await db.query(
            'SELECT id, categoria_id, descripcion, monto, fecha_gasto FROM gastos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        return res.status(200).json({
            message: 'Gasto actualizado con éxito',
            gasto: gastoActualizado[0]
        });

    } catch (error) {
        console.error('Error al editar gasto:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Obtener gasto por ID
exports.obtenerGastoPorId = async (req, res) => {
    try {
        const usuario_id = req.userId;
        const { id } = req.params;
        if (!usuario_id) return res.status(401).json({ message: 'Debe iniciar sesión' });

        const [gasto] = await db.query(
            'SELECT id, categoria_id, descripcion, monto, fecha_gasto FROM gastos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        if (gasto.length === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }

        return res.status(200).json({
            message: 'Gasto obtenido con éxito',
            gasto: gasto[0]
        });

    } catch (error) {
        console.error('Error al obtener gasto por ID:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
};