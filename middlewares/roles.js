// middlewares/roles.js
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        try {
            if (!req.userRol) {
                return res.status(403).json({ message: 'Rol no definido en el token' });
            }

            if (!rolesPermitidos.includes(req.userRol)) {
                return res.status(403).json({ message: 'No tienes permisos para esta acción' });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error en validación de rol', error: error.message });
        }
    };
}

module.exports = { verificarRol };
