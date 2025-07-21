const { authenticateUser, generateToken } = require('../services/authService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const user = await authenticateUser(email, password);
    const token = generateToken(user);
    
    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      rol: user.rol,
      token
    });
  } catch (err) {
    res.status(401).json({ error: err.message + 'g' });
  }
};

// Registrar nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, metadata } = req.body;
    
    // Validar existencia de usuario
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El email o usuario ya está registrado' });
    }
    
    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      metadata,
      rol: 'usuario'
    });
    
    await newUser.save();
    
    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      rol: newUser.rol
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};