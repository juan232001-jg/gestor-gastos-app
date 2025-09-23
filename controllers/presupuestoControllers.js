// Impotaciones  obligatorias 
const db = require('../db.js');

// Bloque de codigo que permite guardar  presupuesto 
exports.agrgarPresupuesto=async(req,res)=>{
    try {
        const usuario_id = req.userId;
        const { categoria_id, monto_limite, anio, mes_numero } = req.body
        // Validacion del que body llegue con infromacion
        if (!req.body) {
            return res.status(400).json({ message: 'No se envió información en el body' })
        }
        // Valida que haya un seccion activa
        if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión'} )
        }
        // valñida que hay venga cada unao de los campos requridos 
         if (!categoria_id || !monto_limite || !anio || !mes_numero) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
     //  Verificar si ya existe un presupuesto para esa categoría, mes y año
    const [existe] = await db.query(
      `SELECT id FROM presupuestos 
       WHERE usuario_id = ? AND categoria_id = ? AND anio = ? AND mes_numero = ?`,
      [usuario_id, categoria_id, anio, mes_numero]
    );
     if (existe.length > 0) {
      return res.status(400).json({ message: 'Ya existe un presupuesto para esa categoría en ese mes y año' });
    }
    const [result] = await db.query(
      `INSERT INTO presupuestos (usuario_id, categoria_id, monto_limite, anio, mes_numero) 
       VALUES (?, ?, ?, ?, ?)`,
      [usuario_id, categoria_id, monto_limite, anio, mes_numero]
    );
    const [nuevoPresupuesto] = await db.query(
      `SELECT * FROM presupuestos WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      message: 'Presupuesto agregado con éxito',
      presupuesto: nuevoPresupuesto[0]
    });
    
    } catch (error) {
        console.error('Error al agregar presupuesto:', error);
    return res.status(500).json({ message: 'Error interno', error: error.message });
    }
}

// Bloque de codgico que permite listar todos los presupuetos
exports.odtenerPresupuestos =async(req,res)=>{
      try {
    const usuario_id = req.userId;
    if (!usuario_id) {
      return res.status(401).json({ message: 'Debe iniciar sesión' });
    }
    // Consulta SQL: obtiene presupuestos del usuario con nombre de la categoría
    const [presupuestos] = await db.query(
      `SELECT p.*, c.nombre AS categoria_nombre 
       FROM presupuestos p 
       JOIN categorias c ON p.categoria_id = c.id
       WHERE p.usuario_id = ?
       ORDER BY anio DESC, mes_numero DESC`,
      [usuario_id]
    );

    // Si no hay presupuestos, retorna mensaje informativo
    if (presupuestos.length === 0) {
      return res.status(200).json({ message: 'No hay presupuestos registrados', presupuestos: [] });
    }

    return res.status(200).json({
      message: 'Presupuestos obtenidos correctamente',
      total: presupuestos.length,
      presupuestos
    });
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return res.status(500).json({ message: 'Error interno', error: error.message });
  }
};

// Bolque  de codigo que permite  editar presupuesto 
exports.editarPresupuesto=async(req,res)=>{
    try {
    const usuario_id = req.userId;
    const { id } = req.params;
    const { monto_limite, anio, mes_numero, categoria_id } = req.body;

    if (!usuario_id) {
      return res.status(401).json({ message: 'Debe iniciar sesión' });
    }

    // Verificar que el presupuesto exista
    const [existe] = await db.query(
      `SELECT * FROM presupuestos WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );

    if (existe.length === 0) {
      return res.status(404).json({ message: 'Presupuesto no encontrado o no pertenece al usuario' });
    }

    // Verificar que no duplique otro presupuesto en el mismo mes/año/categoría
    const [duplicado] = await db.query(
      `SELECT id FROM presupuestos 
       WHERE usuario_id = ? AND categoria_id = ? AND anio = ? AND mes_numero = ? AND id <> ?`,
      [usuario_id, categoria_id, anio, mes_numero, id]
    );

    if (duplicado.length > 0) {
      return res.status(400).json({ message: 'Ya existe otro presupuesto con esos datos' });
    }

    const [update] = await db.query(
      `UPDATE presupuestos 
       SET monto_limite = ?, anio = ?, mes_numero = ?, categoria_id = ? 
       WHERE id = ? AND usuario_id = ?`,
      [monto_limite, anio, mes_numero, categoria_id, id, usuario_id]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ message: 'No se pudo actualizar el presupuesto' });
    }

    const [presupuestoActualizado] = await db.query(
      `SELECT * FROM presupuestos WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      message: 'Presupuesto actualizado con éxito',
      presupuesto: presupuestoActualizado[0]
    });
  } catch (error) {
    console.error('Error al editar presupuesto:', error);
    return res.status(500).json({ message: 'Error interno', error: error.message });
  }
}

// Eliminar presupuesto
exports.eliminarPresupuesto = async (req, res) => {
  try {
    const usuario_id = req.userId;
    const { id } = req.params;

    if (!usuario_id) {
      return res.status(401).json({ message: 'Debe iniciar sesión' });
    }

    // Obtener el presupuesto antes de eliminarlo
    const [presupuesto] = await db.query(
      `SELECT * FROM presupuestos WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );

    if (presupuesto.length === 0) {
      return res.status(404).json({ message: 'Presupuesto no encontrado o no pertenece al usuario' });
    }

    await db.query(
      `DELETE FROM presupuestos WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );

    return res.status(200).json({
      message: 'Presupuesto eliminado con éxito',
      presupuestoEliminado: presupuesto[0]
    });
  } catch (error) {
    console.error('Error al eliminar presupuesto:', error);
    return res.status(500).json({ message: 'Error interno', error: error.message });
  }
}; 