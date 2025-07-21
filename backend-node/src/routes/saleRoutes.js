const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const saleController = require('../controllers/saleController');

// Solo vendedores pueden crear ventas
router.post('/', auth, roleCheck(['vendedor', 'administrador']), saleController.createSale);

// Vendedores ven sus ventas, administradores ven todas
router.get('/', auth, roleCheck(['vendedor', 'administrador']), saleController.getSalesBySeller);

// Actualizar estado de venta
router.put('/:id/status', auth, roleCheck(['vendedor', 'administrador']), saleController.updateSaleStatus);

module.exports = router;