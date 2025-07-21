const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  vendedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del vendedor es obligatorio']
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del cliente es obligatorio']
  },
  fechaVenta: {
    type: Date,
    default: Date.now
  },
  fechaEntregaEstimada: Date,
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'El subtotal no puede ser negativo']
  },
  impuestos: {
    type: Number,
    required: true,
    min: [0, 'Los impuestos no pueden ser negativos']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'paypal', 'transferencia'],
    required: true
  },
  transaccionId: String,
  items: [{
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
    },
    descuento: {
      type: Number,
      default: 0,
      min: [0, 'El descuento no puede ser negativo']
    }
  }],
  direccionEnvio: {
    calle: String,
    ciudad: String
  }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;