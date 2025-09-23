// controllers/adminPresupuestoController.js
const db = require('../db');

// Obtener todos los presupuestos de todos los usuarios
exports.obtenerTodosLosPresupuestos = async (req, res) => {
    try {
        const [presupuestos] = await db.query(
            `SELECT p.*, u.nombre AS usuario_nombre, c.nombre AS categoria_nombre
             FROM presupuestos p
             JOIN usuarios u ON p.usuario_id = u.id
             JOIN categorias c ON p.categoria_id = c.id
             ORDER BY p.anio DESC, p.mes_numero DESC`
        );

        res.status(200).json({
            message: 'Presupuestos obtenidos (admin)',
            total: presupuestos.length,
            presupuestos
        });
    } catch (error) {
        console.error('Error al obtener presupuestos (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Editar cualquier presupuesto
exports.editarPresupuestoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto_limite, anio, mes_numero, categoria_id } = req.body;

        const [result] = await db.query(
            `UPDATE presupuestos SET monto_limite = ?, anio = ?, mes_numero = ?, categoria_id = ?
             WHERE id = ?`,
            [monto_limite, anio, mes_numero, categoria_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Presupuesto no encontrado' });
        }

        const [presupuestoActualizado] = await db.query(
            'SELECT * FROM presupuestos WHERE id = ?',
            [id]
        );

        res.status(200).json({ message: 'Presupuesto actualizado (admin)', presupuesto: presupuestoActualizado[0] });
    } catch (error) {
        console.error('Error al editar presupuesto (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Eliminar cualquier presupuesto
exports.eliminarPresupuestoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM presupuestos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Presupuesto no encontrado' });
        }

        res.status(200).json({ message: 'Presupuesto eliminado (admin)' });
    } catch (error) {
        console.error('Error al eliminar presupuesto (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};
