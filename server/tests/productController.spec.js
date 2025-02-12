const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategorySchema');
const Department = require('../models/DepartmentSchema');
const ProductController = require('../controllers/productController');

jest.mock('../models/Product');
jest.mock('../models/Category');
jest.mock('../models/SubCategorySchema');
jest.mock('../models/DepartmentSchema');

describe('Product Controller Tests', () => {
  describe('GET /products', () => {
    test('should return all products', async () => {
      const mockProducts = [{ name: 'Product 1' }, { name: 'Product 2' }];

      Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
      });
      const req = {
        query: { search: '' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Product.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    test('should return 404 when no products are found', async () => {
      Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      const req = {
        query: { search: '' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhum produto encontrado' });
    });

    test('should handle database error in GET /products', async () => {
      Product.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      const req = {
        query: { search: '' }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar produtos',
        error: 'Erro ao acessar o banco de dados'
      });
    });

    test('should return product by Id', async () => {
      const productId = new mongoose.Types.ObjectId();
      const mockProducts = { name: 'Product 1', _id: productId };

      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
      });
      const req = {
        params: { id: productId.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsById(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Product.findById).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    test('should return 404 when product by Id is not found', async () => {
      const productId = new mongoose.Types.ObjectId();
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const req = {
        params: { id: productId.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsById(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    test('should handle database error in GET /products by Id', async () => {
      const productId = new mongoose.Types.ObjectId();
      Product.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      const req = {
        params: { id: productId.toString() }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsById(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao obter o produto',
        error: 'Erro ao acessar o banco de dados'
      });
    });

    test('should return product Slug', async () => {
      const slug = 'Product-1';
      const mockProducts = { name: 'Product 1', slug: slug };

      Product.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
      });
      const req = {
        params: { slug: slug }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsBySlug(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    test('should return 404 when product with the given slug is not found', async () => {
      const slug = 'Product-1';

      Product.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      const req = {
        params: { slug: slug }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsBySlug(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    test('should handle database errors in GET /products by slug', async () => {
      const slug = 'Product-1';

      Product.findOne.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });
      const req = {
        params: { slug: slug }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsBySlug(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao obter o produto', error: 'Erro ao acessar o banco de dados' });
    });

    test('should return products when valid department, category, and subcategory are found', async () => {
      const department = { _id: new mongoose.Types.ObjectId(), name: 'Electronics' };
      const category = { _id: new mongoose.Types.ObjectId(), name: 'Phones', department: department._id };
      const subcategory = { _id: new mongoose.Types.ObjectId(), name: 'Smartphones', category: category._id };
      const mockProducts = [{ name: 'iPhone' }];

      Department.findOne.mockResolvedValue(department);
      Category.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(category)
      });

      SubCategory.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(subcategory)
      });
      Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProducts)
      });

      const req = {
        params: {
          departmentName: 'Electronics',
          categoryName: 'Phones',
          subcategoryName: 'Smartphones'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should return 404 if department is not found', async () => {
      Department.findOne.mockResolvedValue(null);

      const req = {
        params: {
          departmentName: 'NaoExiste'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Departamento não encontrado' });
    });

    test('should return 404 if category is not found', async () => {
      const department = { _id: new mongoose.Types.ObjectId(), name: 'Electronics' };
      Department.findOne.mockResolvedValue(department);
      Category.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const req = {
        params: {
          departmentName: 'Electronics',
          categoryName: 'NaoExiste'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria não encontrada' });
    });

    test('should return 404 if subcategory is not found', async () => {
      const department = { _id: new mongoose.Types.ObjectId(), name: 'Electronics' };
      const category = { _id: new mongoose.Types.ObjectId(), name: 'Phones', department: department._id };

      Department.findOne.mockResolvedValue(department);
      Category.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(category)
      });

      SubCategory.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const req = {
        params: {
          departmentName: 'Electronics',
          categoryName: 'Phones',
          subcategoryName: 'NaoExist'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Subcategoria não encontrada' });
    });

    test('should return 400 if no products are found', async () => {
      const department = { _id: new mongoose.Types.ObjectId(), name: 'Electronics' };
      const category = { _id: new mongoose.Types.ObjectId(), name: 'Phones', department: department._id };
      const subcategory = { _id: new mongoose.Types.ObjectId(), name: 'Smartphones', category: category._id };

      Department.findOne.mockResolvedValue(department);
      Category.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(category)
      });

      SubCategory.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(subcategory)
      });
      Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      const req = {
        params: {
          departmentName: 'Electronics',
          categoryName: 'Phones',
          subcategoryName: 'Smartphones'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhum produto encontrado' });
    });

    test('getProductsByDepartment should return 500 if an unexpected error occurs', async () => {
      Department.findOne.mockRejectedValue(new Error('Database error'));

      const req = {
        params: {
          departmentName: 'NaoExiste'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.getProductsByDepartmentAndCategoryAndSubcategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao obter produtos', error: 'Database error' });
    });
  });

  describe('POST /products', () => {
    test('should return post product success', async () => {
      const req = {
        body: {
          name: 'teste',
          brand: 'teste',
          description: 'teste',
          price: 2000,
          category: new mongoose.Types.ObjectId(),
          subcategory: new mongoose.Types.ObjectId(),
          maxInstallments: 10,
          maxPurchesedLimit: 10,
          pixDiscount: 20,
          stock: 1000
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.postProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto criado com sucesso' });
    });

    test('should return 500 if an error occurs while creating product', async () => {
      const req = {
        body: {
          name: 'teste',
          brand: 'teste',
          description: 'teste',
          price: 2000,
          category: new mongoose.Types.ObjectId(),
          subcategory: new mongoose.Types.ObjectId(),
          maxInstallments: 10,
          maxPurchesedLimit: 10,
          pixDiscount: 20,
          stock: 1000
        }
      };

      const product = {
        save: jest.fn().mockRejectedValue(new Error('Erro ao salvar o produto'))
      };

      Product.prototype.save = product.save;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.postProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar produto', error: 'Erro ao salvar o produto' });
    });

    test('should return post product comment success', async () => {
      const productId = new mongoose.Types.ObjectId();
      const product = {
        _id: productId,
        comments: [],
        save: jest.fn().mockResolvedValue(true)
      };

      const req = {
        params: {
          id: productId
        },
        body: {
          rating: 4,
          commentText: 'asdadsadasdasdas',
          author: 'teste'
        }
      };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(product)
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.postProductsComments(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comentário adicionado com sucesso' });
    });

    test('should return error 404 when product not found for comment', async () => {
      const productId = new mongoose.Types.ObjectId();

      const req = {
        params: {
          id: productId
        },
        body: {
          rating: 4,
          commentText: 'asdadsadasdasdas',
          author: 'teste'
        }
      };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.postProductsComments(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    test('should return 500 when failed to add comment to product', async () => {
      const productId = new mongoose.Types.ObjectId();
      const product = {
        _id: productId,
        comments: [],
        save: jest.fn().mockRejectedValue(new Error('Erro ao salvar comentário'))
      };

      const req = {
        params: {
          id: productId
        },
        body: {
          rating: 4,
          commentText: 'asdadsadasdasdas',
          author: 'teste'
        }
      };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(product)
      });
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.postProductsComments(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar comentário', error: 'Erro ao salvar comentário' });
    });
  });

  describe('UPDATE /products', () => {
    test('should return product update success', async () => {
      const productId = new mongoose.Types.ObjectId();
      const product = { name: 'produto', _id: productId };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(product._id)
      });
      const req = {
        params: {
          id: productId
        },
        body: {
          name: 'teste',
          brand: 'teste2'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.updateProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto atualizado com sucesso' });
    });

    test('should return 404 if product not found during update', async () => {
      const productId = new mongoose.Types.ObjectId();
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      const req = {
        params: {
          id: productId
        },
        body: {
          name: 'teste',
          brand: 'teste2'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.updateProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    test('should return 500 if an error occurs during product update', async () => {
      const productId = new mongoose.Types.ObjectId();
      Product.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao salvar o produto'))
      });
      const req = {
        params: {
          id: productId
        },
        body: {
          name: 'teste',
          brand: 'teste2'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.updateProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar o produto', error: 'Erro ao salvar o produto' });
    });
  });

  describe('DELETE /products', () => {
    test('should delete product successfully', async () => {
      const productId = new mongoose.Types.ObjectId();

      Product.findByIdAndDelete.mockResolvedValue(true);

      const req = {
        params: {
          id: productId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.deleteProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto deletado com sucesso' });
    });

    test('should return 404 if product not found during delete', async () => {
      const productId = new mongoose.Types.ObjectId();

      Product.findByIdAndDelete.mockResolvedValue(null);

      const req = {
        params: {
          id: productId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.deleteProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produto não encontrado' });
    });

    test('should return 500 if error occurs during product deletion', async () => {
      const productId = new mongoose.Types.ObjectId();

      Product.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const req = {
        params: {
          id: productId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await ProductController.deleteProducts(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar produto', error: 'Database error' });
    });
  });
});
