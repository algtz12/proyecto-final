const Sale = require('../models/Sale');
const User = require('../models/User');
const { createStripePayment, createPayPalPayment } = require('../services/paymentService');

// Crear nueva venta
exports.createSale = async (req, res) => {
  try {
    const { clienteId, items, metodoPago, direccionEnvio } = req.body;
    const vendedorId = req.user.id;
    
    // Validar cliente
    const cliente = await User.findById(clienteId);
    if (!cliente || !cliente.activo) {
      return res.status(400).json({ error: 'Cliente inválido' });
    }
    
    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
    const impuestos = subtotal * 0.16; // 16% de IVA
    const total = subtotal + impuestos;
    
    // Crear venta
    const newSale = new Sale({
      vendedorId,
      clienteId,
      items,
      subtotal,
      impuestos,
      total,
      metodoPago,
      direccionEnvio,
      estado: 'pendiente'
    });
    
    // Procesar pago
    let paymentResult;
    if (metodoPago === 'tarjeta') {
      paymentResult = await createStripePayment(
        Math.round(total * 100), // Convertir a centavos
        'mxn',
        { saleId: newSale._id.toString() }
      );
    } else if (metodoPago === 'paypal') {
      paymentResult = await createPayPalPayment(
        total,
        'MXN',
        { saleId: newSale._id.toString() }
      );
    }
    
    // Guardar ID de transacción
    if (paymentResult && paymentResult.id) {
      newSale.transaccionId = paymentResult.id;
    }
    
    await newSale.save();
    
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener ventas del vendedor actual
exports.getSalesBySeller = async (req, res) => {
  try {
    const sales = await Sale.find({ vendedorId: req.user.id })
      .populate('clienteId', 'username email metadata.nombreCompleto');
    
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

// Actualizar estado de venta
exports.updateSaleStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const validStates = ['pendiente', 'procesando', 'completada', 'cancelada'];
    
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    // Solo el vendedor o admin puede actualizar
    if (sale.vendedorId.toString() !== req.user.id && req.user.rol !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado para modificar esta venta' });
    }
    
    sale.estado = estado;
    await sale.save();
    
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar venta' });
  }
};