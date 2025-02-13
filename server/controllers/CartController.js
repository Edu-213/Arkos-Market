const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({ path: 'items.product', populate: { path: 'category' } });

    return res.status(200).json(cart || { items: [] });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar o carrinho.', error: error.message });
  }
};

exports.addCartItem = async (req, res) => {
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

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao adicionar ao carrinho.', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    await Cart.findOneAndUpdate({ user: req.user.id, 'items.product': productId }, { $set: { 'items.$.quantity': quantity } }, { new: true }).populate('items.product');

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar o carrinho.', error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;

  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { $pull: { items: { product: productId } } }, { new: true }).populate('items.product');

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover do carrinho.', error: error.message });
  }
};

exports.syncCart = async (req, res) => {
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
    return res.status(200).json(userCart);
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao sincronizar o carrinho.', error: err.message });
  }
};
