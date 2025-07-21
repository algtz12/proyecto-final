const validator = require('validator');

// Validar datos de usuario
const validateUserInput = (userData) => {
  const errors = {};
  
  if (!validator.isEmail(userData.email || '')) {
    errors.email = 'Email inválido';
  }
  
  if (!validator.isLength(userData.password || '', { min: 8 })) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }
  
  if (!validator.isLength(userData.username || '', { min: 3 })) {
    errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = { validateUserInput };