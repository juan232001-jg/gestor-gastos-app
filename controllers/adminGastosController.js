// controllers/adminGastosController.js
const db = require('../db');

// Obtener todos los gastos de todos los usuarios
exports.obtenerTodosLosGastos = async (req, res) => {
    try {
        const [gastos] = await db.query(
            `SELECT g.id, g.descripcion, g.monto, g.fecha_gasto, g.usuario_id, u.nombre AS usuario_nombre
             FROM gastos g
             JOIN usuarios u ON g.usuario_id = u.id
             ORDER BY g.fecha_gasto DESC`
        );

        res.status(200).json({
            message: 'Gastos obtenidos (admin)',
            total: gastos.length,
            gastos
        });
    } catch (error) {
        console.error('Error al obtener todos los gastos (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Editar cualquier gasto
exports.editarGastoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, monto, fecha_gasto, categoria_id } = req.body;

        const [result] = await db.query(
            `UPDATE gastos SET descripcion = ?, monto = ?, fecha_gasto = ?, categoria_id = ?
             WHERE id = ?`,
            [descripcion, monto, fecha_gasto, categoria_id || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }

        const [gastoActualizado] = await db.query(
            'SELECT * FROM gastos WHERE id = ?',
            [id]
        );

        res.status(200).json({ message: 'Gasto actualizado (admin)', gasto: gastoActualizado[0] });
    } catch (error) {
        console.error('Error al editar gasto (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Eliminar cualquier gasto
exports.eliminarGastoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM gastos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado' });
        }

        res.status(200).json({ message: 'Gasto eliminado (admin)' });
    } catch (error) {
        console.error('Error al eliminar gasto (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};
