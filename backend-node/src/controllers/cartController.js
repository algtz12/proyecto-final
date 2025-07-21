const Cart = require('../models/Cart');

// Obtener carrito del usuario
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Crear carrito vacío si no existe
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// Agregar item al carrito
exports.addToCart = async (req, res) => {
  try {
    const { productoId, nombre, cantidad, precioUnitario } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }
    
    // Buscar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.productoId === productoId
    );
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      cart.items[existingItemIndex].cantidad += cantidad;
    } else {
      // Agregar nuevo item
      cart.items.push({ productoId, nombre, cantidad, precioUnitario });
    }
    
    cart.fechaActualizacion = new Date();
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Error al agregar al carrito' });
  }
};

// Actualizar item en carrito
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado en carrito' });
    }
    
    item.cantidad = cantidad;
    cart.fechaActualizacion = new Date();
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar carrito' });
  }
};

// Eliminar item del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    cart.items.pull(itemId);
    cart.fechaActualizacion = new Date();
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar del carrito' });
  }
};