const User = require('../models/User');

// Obtener todos los usuarios (solo admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { username, email, metadata, activo } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar campos permitidos
    if (username) user.username = username;
    if (email) user.email = email;
    if (metadata) user.metadata = { ...user.metadata, ...metadata };
    if (activo !== undefined) user.activo = activo;
    
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      rol: user.rol,
      activo: user.activo
    });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
};

// Asignar rol a usuario (solo admin)
exports.assignRole = async (req, res) => {
  try {
    const { rol } = req.body;
    const validRoles = ['usuario', 'consultor', 'vendedor', 'administrador'];
    
    if (!validRoles.includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    user.rol = rol;
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      rol: user.rol
    });
  } catch (err) {
    res.status(400).json({ error: 'Error al asignar rol' });
  }
};

// Desactivar usuario (solo admin)
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    user.activo = false;
    await user.save();
    
    res.json({
      id: user._id,
      username: user.username,
      activo: user.activo
    });
  } catch (err) {
    res.status(400).json({ error: 'Error al desactivar usuario' });
  }
};