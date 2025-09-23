// controllers/adminCategoriasController.js
const db = require('../db');

// Obtener todas las categorías de todos los usuarios
exports.obtenerTodasLasCategorias = async (req, res) => {
    try {
        const [categorias] = await db.query(
            `SELECT c.id, c.nombre, c.usuario_id, u.nombre AS usuario_nombre
             FROM categorias c
             JOIN usuarios u ON c.usuario_id = u.id
             ORDER BY c.nombre ASC`
        );

        res.status(200).json({
            message: 'Categorías obtenidas (admin)',
            total: categorias.length,
            categorias
        });
    } catch (error) {
        console.error('Error al obtener categorías (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Editar cualquier categoría
exports.editarCategoriaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const [result] = await db.query(
            'UPDATE categorias SET nombre = ? WHERE id = ?',
            [nombre, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const [categoriaActualizada] = await db.query(
            'SELECT * FROM categorias WHERE id = ?',
            [id]
        );

        res.status(200).json({ message: 'Categoría actualizada (admin)', categoria: categoriaActualizada[0] });
    } catch (error) {
        console.error('Error al editar categoría (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

// Eliminar cualquier categoría
exports.eliminarCategoriaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.status(200).json({ message: 'Categoría eliminada (admin)' });
    } catch (error) {
        console.error('Error al eliminar categoría (admin):', error);
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

