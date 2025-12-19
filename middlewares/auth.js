// importar jwt de la libreria jsonwebtoken
const jwt = require('jsonwebtoken');
// funcion verificar token
function verificarToken(req, res, next) {
    try {
        // obtener el token del header
        let token = req.headers['authorization'];
        // validad si herder viene un token o no
        if (!token) return res.status(403).json({ message: 'Token requerido' });
        // validad si el token viene con Bearer
        if (token.startsWith('Bearer ')) token = token.slice(7);
        // verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // obtener el id del usuario
        req.userId = decoded.id;
        // obtener el rol del usuario
        req.userRol = decoded.rol;
        // obtener el id del rol
        req.userRolId = decoded.rol_id;
        // continuar con la siguiente funcion
        next();
    } catch (error) {
        // si el token es invalido
        return res.status(401).json({ message: 'Token inválido' });
    }
}
// exportar la funcion verificarToken
module.exports = { verificarToken }