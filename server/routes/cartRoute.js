const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const CartController = require('../controllers/CartController');
const router = express.Router();

router.get('/', CartController.getCart, verifyToken);

// Adiciona item no carrinho
router.post('/add', CartController.addCartItem, [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, verifyToken);

//Atualiza quantidade de um item no carrinho
router.put('/update', CartController.updateCartItem,  [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, verifyToken);

//Remove um item do carrinho
router.delete('/remove', CartController.removeCartItem, body('productId').isMongoId(), validateRequest, verifyToken);

// Sincronizar carrinho ao logar
router.post('/sync', CartController.syncCart, [body('cart').isArray(), body('cart.*.productId').isMongoId(), body('cart.*.quantity').isInt({ min: 1 })], validateRequest, verifyToken);

module.exports = router;
