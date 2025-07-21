// Middleware para verificar roles
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado. No tienes permiso para esta acción'
      });
    }
    next();
  };
};

module.exports = roleCheck;