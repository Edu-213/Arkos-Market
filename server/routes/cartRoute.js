const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({ path: 'items.product', populate: { path: 'category' } });

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar o carrinho.', error: err.message });
  }
});

// Adiciona item no carrinho
router.post('/add', [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });

    let cart = await Cart.findOneAndUpdate({ user: req.user.id, 'items.product': productId }, { $inc: { 'items.$.quantity': quantity } }, { new: true }).populate(
      'items.product'
    );
    if (!cart) {
      cart = await Cart.findOneAndUpdate({ user: req.user.id }, { $push: { items: { product: productId, quantity } } }, { new: true, upsert: true }).populate(
        'items.product'
      );
    }

    res.json(cart);
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
    res.status(500).json({ message: 'Erro ao adicionar ao carrinho.', error: err.message });
  }
});

//Atualiza quantidade de um item no carrinho
router.put('/update',  [body('productId').isMongoId(), body('quantity').isInt({ min: 1 })], validateRequest, verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user.id, 'items.product': productId }, { $set: { 'items.$.quantity': quantity } }, { new: true }).populate(
        'items.product'
      );

    if (!cart) return res.status(404).json({ message: 'Produto não encontrado no carrinho.' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar o carrinho.', error: err.message });
  }
});

//Remove um item do carrinho
router.delete('/remove', body('productId').isMongoId(), validateRequest, verifyToken, async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user.id }, { $pull: { items: { product: productId } } }, { new: true }).populate(
        'items.product'
      );

    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado.' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover do carrinho.', error: err.message });
  }
});

// Sincronizar carrinho ao logar
router.post('/sync', [body('cart').isArray(), body('cart.*.productId').isMongoId(), body('cart.*.quantity').isInt({ min: 1 })], validateRequest, verifyToken, async (req, res) => {
  const { cart } = req.body;

  try {
    let userCart = await Cart.findOne({ user: req.user.id });
    if (!userCart) {
      userCart = new Cart({ user: req.user.id, items: [] });
    }

    if (Array.isArray(cart)) {
      for (const item of cart) {
        const product = await Product.findById(item.productId);
        if (!product) {
          continue;
        }
        let maxQuantity = product.maxPurchesedLimit;

        const existingItem = userCart.items.find(i => i.product.equals(item.productId));

        if (existingItem) {
          if (existingItem.quantity <= maxQuantity) {
            const newQuantity = existingItem.quantity + item.quantity;
            existingItem.quantity = Math.min(newQuantity, maxQuantity);
          } else {
            existingItem.quantity = maxQuantity;
          }
        } else {
          userCart.items.push({ product: item.productId, quantity: item.quantity });
        }
      }
    }

    await userCart.save();
    res.json(userCart);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao sincronizar o carrinho.', error: err.message });
  }
});

module.exports = router;
