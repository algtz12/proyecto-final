const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingrese un email válido']
  },
  passwordHash: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  rol: {
    type: String,
    required: true,
    enum: ['usuario', 'consultor', 'vendedor', 'administrador'],
    default: 'usuario'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: Date,
  activo: {
    type: Boolean,
    default: true
  },
  metadata: {
    nombreCompleto: {
      type: String,
      trim: true
    },
    telefono: String,
    direccion: {
      calle: String,
      ciudad: String,
      codigoPostal: String
    },
    preferencias: {
      newsletter: Boolean,
      temaOscuro: Boolean
    }
  }
});

// Middleware para actualizar último acceso
userSchema.pre('save', function(next) {
  this.ultimoAcceso = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;