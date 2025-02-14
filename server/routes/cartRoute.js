const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const CartController = require('../controllers/CartController');
const router = express.Router();

router.get('/', verifyToken, CartController.getCart);

// Adiciona item no carrinho
router.post('/add', verifyToken, [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, CartController.addCartItem);

//Atualiza quantidade de um item no carrinho
router.put('/update', verifyToken,  [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, CartController.updateCartItem);

//Remove um item do carrinho
router.delete('/remove', verifyToken, body('productId').isMongoId(), validateRequest, CartController.removeCartItem);

router.delete('/clear', verifyToken, CartController.clearCart);

// Sincronizar carrinho ao logar
router.post('/sync', verifyToken, [body('cart').isArray(), body('cart.*.productId').isMongoId(), body('cart.*.quantity').isInt({ min: 1 })], validateRequest, CartController.syncCart);

module.exports = router;
