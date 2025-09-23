const jwt = require('jsonwebtoken');
function verificarToken(req, res, next) {
    try {
        let token = req.headers['authorization'];
        if (!token) return res.status(403).json({ message: 'Token requerido' });

        if (token.startsWith('Bearer ')) token = token.slice(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.userRol = decoded.rol; 
        req.userRolId = decoded.rol_id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = {verificarToken}