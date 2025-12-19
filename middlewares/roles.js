// middlewares/roles.js
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        // verificar que el usuario tenga el rol correcto
        try {
            // verificar que el usuario tenga el rol  definido y no venga undefined
            if (!req.userRol) {
                return res.status(403).json({ message: 'Rol no definido en el token' });
            }
            // Codicion que verifica que el usuario tenga el rol correcto definidos para cuana de la rutas 
            if (!rolesPermitidos.includes(req.userRol)) {
                return res.status(403).json({ message: 'No tienes permisos para esta acción' });
            }
            // continuar con la siguiente funcion
            next();

        } catch (error) {
            // error en validacion de rol
            return res.status(500).json({ message: 'Error en validación de rol', error: error.message });
        }
    };
}
// exportar la funcion verificarRol
module.exports = { verificarRol };
