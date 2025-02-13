const Cart = require('../models/Cart');
const Product = require('../models/Product');
const CartController = require('../controllers/CartController');
const { default: mongoose } = require('mongoose');

jest.mock('../models/Cart');
jest.mock('../models/Product');

describe('Cart Controller Tests', () => {
  let req;
  let res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  describe('GET /cart', () => {
    test('should return cart user', async () => {
      const mockCart = { user: '123', _id: new mongoose.Types.ObjectId(), items: [{ product: 'p1', quantity: 2 }] };
      //Cart.findOne.mockResolvedValue(mockCart);
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCart)
      });

      req = {
        user: { id: '123' }
      };

      await CartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Cart.findOne).toHaveBeenCalledWith({ user: '123' });
    });

    test('should return 500 if a database error occurs in GET /cart', async () => {
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      req = {
        user: { id: '123' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar o carrinho.',
        error: 'Erro ao acessar o banco de dados'
      });
    });
  });

  describe('POST /cart', () => {
    test('Should add a product to the cart', async () => {
      const mockProduct = { _id: 'p1', name: 'Produto Teste' };
      const mockCart = { user: '123', items: [{ product: 'p1', quantity: 2 }] };

      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProduct)
      });

      Cart.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCart)
      });

      req.user = { id: '123' };
      req.body = { productId: 'p1', quantity: 2 };

      await CartController.addCartItem(req, res);

      expect(res.status).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    test('Should return 404 if no products are found', async () => {
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      req.user = { id: '123' };
      req.body = { productId: 'p1', quantity: 2 };

      await CartController.addCartItem(req, res);

      expect(res.status).toHaveBeenCalledTimes(3);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado.' });
    });

    test('Should return 500 if a database error occurs in POST /cart', async () => {
      const mockProduct = { _id: 'p1', name: 'Produto Teste' };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProduct)
      });
      Cart.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      req = {
        user: { id: '123' },
        body: {
          productId: 'p1',
          quantity: 2
        }
      };

      await CartController.addCartItem(req, res);

      expect(res.status).toHaveBeenCalledTimes(4);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar ao carrinho.', error: 'Erro ao acessar o banco de dados' });
    });
  });

  describe('PUT /cart', () => {
    test('Deve atualizar a quantidade de um item no carrinho', async () => {
      const mockCart = { user: '123', items: [{ product: 'p1', quantity: 5 }] };
      Cart.findOneAndUpdate.mockResolvedValue(mockCart);
  
      req = { 
        user: {id: '123'},
        body: {
          productId: 'p1', quantity: 5
        }
      };
  
      await CartController.updateCartItem(req, res);
  
      expect(res.status).toHaveBeenCalledTimes(5);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Should return 500 if a database error occurs in PUT /cart', async () => {
      Cart.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      req = {
        user: { id: '123' },
        body: {
          productId: 'p1',
          quantity: 2
        }
      };

      await CartController.updateCartItem(req, res);

      expect(res.status).toHaveBeenCalledTimes(6);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar o carrinho.', error: 'Erro ao acessar o banco de dados' });
    });
  });

  describe('DELETE /cart', () => {
    test('Should remove an item from the cart', async () => {
      const mockCart = { user: '123', items: [] };
      Cart.findOneAndUpdate.mockResolvedValue(mockCart);
  
      req = { 
        user: {id: '123'},
        body: { productId: 'p1'}
      };
  
      await CartController.removeCartItem(req, res);
  
      expect(res.status).toHaveBeenCalledTimes(7);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Should return 500 if a database error occurs in DELETE /cart', async () => {
      Cart.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      req = {
        user: { id: '123' },
        body: {
          productId: 'p1',
          quantity: 2
        }
      };

      await CartController.removeCartItem(req, res);

      expect(res.status).toHaveBeenCalledTimes(8);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao remover do carrinho.', error: 'Erro ao acessar o banco de dados' });
    });
  })
});
