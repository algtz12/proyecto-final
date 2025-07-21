const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productoId: {
    type: Number,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;