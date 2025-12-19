const db  = require('../db.js')

// ✅ Obtener todos los roles
exports.obtenerRoles = async (req, res) => {
  try {
    const [roles] = await db.query(
      'SELECT id, nombre FROM roles ORDER BY id'
    )

    res.json({
      success: true,
      data: roles
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener los roles'
    })
  }
}

// ✅ Obtener rol por ID
exports.obtenerRolPorId = async (req, res) => {
  const { id } = req.params

  try {
    const [rows] = await db.query(
      'SELECT id, nombre FROM roles WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      })
    }

    res.json({
      success: true,
      data: rows[0]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el rol'
    })
  }
}

// ✅ Crear nuevo rol
exports.crearRol = async (req, res) => {
  const { nombre } = req.body

  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El nombre del rol es obligatorio'
    })
  }

  try {
    const [result] = await db.query(
      'INSERT INTO roles (nombre) VALUES (?)',
      [nombre]
    )

    res.status(201).json({
      success: true,
      message: 'Rol creado correctamente',
      data: {
        id: result.insertId,
        nombre
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el rol'
    })
  }
}

// ✅ Editar rol
exports.actualizarRol = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body

  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El nombre del rol es obligatorio'
    })
  }

  try {
    const [result] = await db.query(
      'UPDATE roles SET nombre = ? WHERE id = ?',
      [nombre, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Rol actualizado correctamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el rol'
    })
  }
}

// ✅ Eliminar rol
exports.eliminarRol = async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.query(
      'DELETE FROM roles WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Rol eliminado correctamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el rol'
    })
  }
}