// importacion del modelo de bases de datos 
const db = require('../db');
// Bloque de codigo que permite Guardar Categorias 
exports.agregarcategoria= async (req,res)=>{
try {
    // Validadcion de body traiga infromacion
    if (!req.body) {
        return res.status(400).json({message: 'No se envió información en el body'})
    }
    // validacion del campo que va llegar por el body
    const {nombre}=req.body;
    const usuario_id =req.userId;
    if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }
    if ( !nombre) {
       return res.status(400).json({message: 'Todos los campos son obligatorios'})
    }


     // 🔎 Verificar si la categoría ya existe para ese usuario
    const [existe] = await db.query(
      `SELECT id FROM categorias WHERE usuario_id = ? AND LOWER(nombre) = LOWER(?)`,
      [usuario_id, nombre.trim()]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        message: 'La categoría ya existe, no se puede duplicar'
      });
    }
    // insercion de datos 
    const [result]=await db.query(
        `INSERT INTO categorias (usuario_id, nombre) VALUES (?, ?)`,
            [usuario_id,nombre]
    )
    // Consulta de la categoaria guardada
    const [nuevaCategoria]=await db.query(
        `SELECT * FROM categorias WHERE id = ?`,
            [result.insertId]
    );


    return res.status(201).json({
            message: 'Categoria registrada con éxito',
            Categoria: nuevaCategoria[0]
        });
 } catch (error) {
        console.error('Error al obtener categoria por ID:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
}
// Bloque de codigo que permite Odtener las categorias de cada usuario
exports.Odtenercategorias = async(req,res)=>{
    try {
        const usuario_id = req.userId
        // Valida  que venga el usuario id 
        if (!usuario_id) {
            return res.status(401).json({message:"Debe iniciar sesion"})
        }
        // Consulta de categorias a  la bases de datos
        const [categorias] =await db.query(
            'SELECT id ,usuario_id, nombre  FROM categorias WHERE usuario_id=?  ORDER BY nombre DESC',
            [usuario_id]
        )
        // Valida si el usuario tieno o no tiene  categorias 
        if (categorias.length===0) {
            return res.status(200).json({message: 'No se encontraro Categorias registradas', categorias: []})
        }
    // Muestra todas la categorias 
         return res.status(200).json({
            message:'Categorias Obtenoiadas Correctamente',
            total: categorias.length,
            categorias
         })
    } catch (error) {
         console.error('Error al obtener categorias:', error);
        return res.status(500).json({
            message: 'Error al obtener categorias',
            error: error.message
        });
    }
}

// Bloque de codigo que permite editar una categoria 
exports.editarCategoria =async(req,res)=>{
    try {
        // Constantes que llegan  al hora de editar 
        const usuario_id = req.userId;
        const {id}=req.params;
        const {nombre}=req.body
        if (!req.body) {
        return res.status(400).json({message: 'No se envió información en el body'})
    }
    // Validad la seccion
    if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }
    // valida que el campo llege con el nombre 
    if ( !nombre) {
       return res.status(400).json({message: 'Todos los campos son obligatorios'})
    }
    //  Verificar que la categoría exista y pertenezca al usuario
        const [categoriaExistente] = await db.query(
            'SELECT * FROM categorias WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        if (categoriaExistente.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada o no pertenece al usuario' });
        }
    // verifica que el  nombre que se valla a editar no esta ya en base de  datos 
    const [categoriaDuplicada] = await db.query(
            'SELECT id FROM categorias WHERE nombre = ? AND usuario_id = ? AND id <> ?',
            [nombre, usuario_id, id]
        );

        if (categoriaDuplicada.length > 0) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
        }
    // editar Categorias
    const [CategoriaEditada]= await db.query(
        'UPDATE categorias SET nombre = ? WHERE id = ? AND usuario_id = ?',
            [nombre, id, usuario_id]
    )
    if (CategoriaEditada.affectedRows==0) {
            return res.status(404).json({ message: 'Categoria no encontrado o no pertenece al usuario' });
        }

// Mmuestra el regitero que se edito dentro de la base de datos
    const [categoriaActualizada] = await db.query(
                'SELECT * FROM categorias WHERE id = ? AND usuario_id = ?',
                [id, usuario_id]
            );
         return res.status(200).json({
            message: 'Categoria actualizada con éxito',
            categorias: categoriaActualizada[0]
        });
    
    } catch (error) {
        console.error('Error al Editar Categoria:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
}

// Bloque de codigo que me permite Borra categorias de la base de datos 
exports.eliminarCategorias = async(req,res)=>{
    try {
        // validacion de usuario id  y del id que se quiere eliminar 
        const usuario_id=req.userId;
        const {id}=req.params;
        // validacai que hay usuario 
        if (!usuario_id) {
            return res.status(401).json({message:'Debe iniciar sesión'})
        }
          const [categoriaExistente] = await db.query(
            'SELECT * FROM categorias WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );
        const [eliminarCategorias]=await db.query(
             'DELETE FROM categorias WHERE id =? AND usuario_id =?',
            [id,usuario_id]
        )
        if (eliminarCategorias.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }

        const [categoriaeliminada]=await db.query(
             `SELECT * FROM categorias WHERE id = ?`,
            [req.params.id]
        )
        res.status(200).json({
            message: "Categoria eliminada correctamente",
            Categoria: categoriaExistente[0]
        });
    } catch (error) {
         console.error('Error al eliminar Categoria:', error);
        return res.status(500).json({ message: 'Error interno al eliminar Categoria', error: error.message });
    
    }
}
