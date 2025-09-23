
// controllers/authController.js
// -----------------------------------------------------------------------------
// Controlador para el manejo de autenticación de usuarios
// Incluye: registro de nuevos usuarios y login
// -----------------------------------------------------------------------------
const db = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// -----------------------------------------------------------------------------
// Registro de nuevo usuario
// -----------------------------------------------------------------------------
exports.register = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;

        // Validar campos obligatorios
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({ message: 'El formato del correo no es válido' });
        }

        // Verificar si el correo ya existe
        const [existingUsers] = await db.query(
            'SELECT id FROM usuarios WHERE correo = ?',
            [correo]
        );
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 10);

        // Insertar el nuevo usuario
        const [insertResult] = await db.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',[nombre, correo, hashedPassword]);

        // Consultar el usuario recién insertado
        const [newUser] = await db.query('SELECT id, nombre, correo, fecha_registro FROM usuarios WHERE id = ?',[insertResult.insertId]);

        // Devolver respuesta con el usuario
        return res.status(201).json({message: 'Usuario registrado correctamente',user: newUser[0]});

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
            // Evitar error si req.body está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No se recibieron datos' });
    }
    //valida que  valla la contaseña y  usurio en consulta 
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }
        // Buscar usuario por correo
           const [users] = await db.query(
            `SELECT u.*, r.nombre AS rol_nombre
             FROM usuarios u
             JOIN roles r ON u.rol_id = r.id
             WHERE u.correo = ?`,
            [correo]
        );
        
    
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
         // ✅ Validar estado ANTES de la contraseña
        if (Number(user.estado) !== 1) {
            return res.status(403).json({ message: 'Usuario inactivo. Contacte al administrador.' });
        }


        // Verificar contraseña
        const isMatch = await bcrypt.compareSync(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
           // Generar token con rol_id y rol_nombre
        const token = jwt.sign(
            { id: user.id, correo: user.correo, rol_id: user.rol_id, rol: user.rol_nombre },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login exitoso',
            token: `Bearer ${token}`,
            user: {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo,
                estado: user.estado,
                rol_id: user.rol_id,
                rol: user.rol_nombre
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno en el login' });
    }

}
