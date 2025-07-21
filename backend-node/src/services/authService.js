const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Autenticar usuario
exports.authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Credenciales inválidas');
  }
  
  if (!user.activo) {
    throw new Error('Cuenta desactivada');
  }
  
  return user;
};

// Generar token JWT
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      rol: user.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};