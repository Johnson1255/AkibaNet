// src/middleware/auth.js
import jwt from 'jsonwebtoken';
// import database from '../utils/userDatabase.js'; // <--- Eliminar
import User from '../models/User.js'; // <--- Importar modelo

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      // No loguear error aquí, simplemente no está autenticado
      return res.status(401).send({ error: 'Autenticación requerida.', code: 'AUTH_REQUIRED' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario por ID desde el payload del token
    const user = await User.findById(decoded.userId); // Asumiendo 'userId' en el payload

    if (!user) {
       // Podría ser un token válido pero para un usuario eliminado
      return res.status(401).send({ error: 'Usuario no encontrado.', code: 'AUTH_USER_NOT_FOUND' });
    }

    // Adjuntar usuario (sin la contraseña) al request
    // Seleccionar campos específicos o usar toObject y delete
    req.user = user;
    req.token = token; // Puedes mantener esto si alguna lógica lo necesita
    next(); // Pasa al siguiente middleware/ruta
  } catch (error) {
     let errorMessage = 'Autenticación fallida.';
     let errorCode = 'AUTH_FAILED';
     if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Token inválido.';
        errorCode = 'INVALID_TOKEN';
     } else if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expirado.';
        errorCode = 'TOKEN_EXPIRED';
     }
     // Loguear el error real en el servidor
     console.error("Auth Error:", error.message);
     // logger.log('ERROR', 'Authentication middleware error', { error: error.message }); // Descomenta si quieres log detallado
    res.status(401).send({ error: errorMessage, code: errorCode });
  }
};