const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const userController = require('../controllers/userController');

// Solo administradores pueden listar usuarios y asignar roles
router.get('/', auth, roleCheck(['administrador']), userController.getUsers);
router.put('/:id/role', auth, roleCheck(['administrador']), userController.assignRole);
router.put('/:id/deactivate', auth, roleCheck(['administrador']), userController.deactivateUser);

// Usuarios pueden ver y actualizar su propio perfil
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);

module.exports = router;