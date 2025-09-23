const db = require('../db');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.nombre, u.correo, u.estado, u.fecha_registro, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en obtenerUsuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.nombre, u.correo, u.estado, u.fecha_registro, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en obtenerUsuarioPorId:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Actualizar rol de usuario
exports.actualizarRol = async (req, res) => {
  try {
    const { rol_id } = req.body;

    const [result] = await db.query(
      'UPDATE usuarios SET rol_id = ? WHERE id = ?',
      [rol_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error en actualizarRol:', error);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

// Activar / desactivar usuario
exports.actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body; // 1 = activo, 0 = inactivo

    const [result] = await db.query(
      'UPDATE usuarios SET estado = ? WHERE id = ?',
      [estado, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: `Usuario ${estado === 1 ? 'activado' : 'inactivado'} correctamente` });
  } catch (error) {
    console.error('Error en actualizarEstado:', error);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};
