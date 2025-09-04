// controllers/gastosController.js
const db = require ('../db');

exports.agregarGasto = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).json({ message: 'No se envió información en el body' });
        }
        
        const { descripcion, monto, fecha_gasto } = req.body;
        const usuario_id = req.userId;

        if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }

        if (!descripcion || !monto || !fecha_gasto) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        //aca insertamos  el gastos 
        const [insertResult] = await db.query(
            `INSERT INTO gastos (usuario_id, descripcion, monto, fecha_gasto) VALUES (?, ?, ?, ?)`,
            [usuario_id, descripcion, monto, fecha_gasto]
        );


        //Cunsulta el gasto  se acabo de guardar 
        const [nuevoGasto] = await db.query(
            `SELECT id, usuario_id, descripcion, monto, fecha_gasto 
             FROM gastos WHERE id = ?`,
            [insertResult.insertId]
        );

        return res.status(201).json({
            message: 'Gasto registrado con éxito',
            gasto: nuevoGasto[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};
// Esta funcion permite odetener gastops ya guradados 
exports.obtenerGastos = async (req, res) => {
    try {
        const usuario_id = req.userId; // viene del middleware de auth

        if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }

        const [gastos] = await db.query(
            'SELECT id, descripcion, monto, fecha_gasto FROM gastos WHERE usuario_id = ? ORDER BY fecha_gasto DESC',
            [usuario_id]
        );

        if (gastos.length === 0) {
            return res.status(200).json({ message: 'No se encontraron gastos registrados', gastos: [] });
        }

        return res.status(200).json({
            message: 'Gastos obtenidos con éxito',
            total: gastos.length,
            gastos
        });

    } catch (error) {
        console.error('Error al obtener gastos:', error);
        return res.status(500).json({
            message: 'Error al obtener gastos',
            error: error.message
        });
    }
};
// Esta funcio permite eliminar gastos 
exports.eliminarGasto =  async (req, res) => {
    try {
        const usuario_id = req.userId;
        const {id}= req.params;
        //validar que   haya usuario 
        if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }
        const [result] = await db.query(
            'DELETE FROM gastos WHERE id =? AND usuario_id =?',
            [id,usuario_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }
   

     const [gastoEliminado] = await db.query(
            `SELECT id, usuario_id, descripcion, monto, fecha_gasto 
             FROM gastos WHERE id = ?`,
            [req.params.id]
        );

        res.status(200).json({
            message: "Gasto eliminado correctamente",
            gasto: gastoEliminado
        });

    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    
    }
};

// Este bloque de codi me permite  editar gastos 
exports.editarGatos = async(req,res) =>{
    try {
        const usuario_id = req.userId;
        const {id}= req.params;
        const {descripcion,monto,fecha_gasto}=req.body
        // Conprobacion de el body no benga vacio 
        if (!req.body) {
            return res.status(400).json({ message: 'No se envió información en el body' });
        }
        // Conprueba de la secccio esta activa 
        if (!usuario_id) {
            return res.status(401).json({ message: 'Debe iniciar sesión' });
        }
        // Comprobacion de que  todson  los campos bengn llenos 
        if (!descripcion || !monto || !fecha_gasto) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        
        const [gatoEditado] = await db.query(
            'UPDATE gastos SET descripcion = ?, monto = ?, fecha_gasto = ? WHERE id = ? AND usuario_id = ?',
            [descripcion, monto, fecha_gasto, id, usuario_id]
        );
        if (gatoEditado.affectedRows==0) {
            return res.status(404).json({ message: 'Gasto no encontrado o no pertenece al usuario' });
        }
        const [gastoActualizado] = await db.query(
            'SELECT id, descripcion, monto, fecha_gasto FROM gastos WHERE id = ? AND usuario_id = ?',
            [id, usuario_id]
        );

        return res.status(200).json({
            message: 'Gasto actualizado con éxito',
            gasto: gastoActualizado[0]
        });


        
        
    } catch (error) {
        console.error('Error al Editar gasto:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
}

// Odtener gastos  por id 
exports.odtenerGatosId = async (req,res)=>{
    try {
        const usuario_id =req.userId
        const {id}=req.params

        if (!usuario_id) {
            return res.status(401).json({message:'Debes Iniciar Seccion '});
        }

        const [gasto]=await db.query(
            'SELECT id, descripcion, monto, fecha_gasto FROM gastos WHERE id =? AND usuario_id=?',
            [id,usuario_id]

        )

        if (gasto.length===0) {
            return res.status(500).json({message:'Gatos no encontrados o no pertenecen al usuario'})
        }
        return res.status(200).json({
            message:'Gatos Odtenidos Con exito',
            gasto:gasto[0]
        })
    } catch (error) {
        console.error('Error al obtener gasto por ID:', error);
        return res.status(500).json({ message: 'Error interno', error: error.message });
    }
}
