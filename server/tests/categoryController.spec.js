const mongoose = require('mongoose');
const Category = require('../models/Category');
const CategoryController = require('../controllers/CategoryController');

jest.mock('../models/Category');

describe('Category Controller Tests', () => {
  describe('GET /category', () => {
    test('should return all categories', async () => {
      const mockCategory = [{ name: 'Category 1' }, { name: 'Category 2' }];

      Category.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCategory)
      });

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.getCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    test('should return 404 if no categories are found', async () => {
      Category.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.getCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nenhuma categoria encontrada' });
    });

    test('should return 500 if a database error occurs in GET /category', async () => {
      Category.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.getCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao obter categorias',
        error: 'Erro ao acessar o banco de dados'
      });
    });
  });

  describe('POST /category', () => {
    test('should return 201 when category is created successfully', async () => {
      const req = {
        body: {
          name: 'teste',
          discount: 10,
          department: new mongoose.Types.ObjectId()
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.postCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria criada com sucesso' });
    });

    test('should return 500 when an error occurs while creating a category', async () => {
      const req = {
        body: {
          name: 'teste',
          discount: 10,
          department: new mongoose.Types.ObjectId()
        }
      };

      const category = {
        save: jest.fn().mockRejectedValue(new Error('Erro ao salvar o produto'))
      };

      Category.prototype.save = category.save;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.postCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar categoria', error: 'Erro ao salvar o produto' });
    });
  });

  describe('UPDATE /category', () => {
    test('should return category update success', async () => {
      const categoryId = new mongoose.Types.ObjectId();

      Category.findByIdAndUpdate.mockResolvedValue({
        _id: categoryId,
        name: 'teste',
        discount: 10
      });

      const req = {
        params: {
          id: categoryId
        },
        body: {
          name: 'teste',
          discount: 10
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria atualizada com sucesso' });
    });

    test('should return 404 when category does not exist during update', async () => {
      const categoryId = new mongoose.Types.ObjectId();

      Category.findByIdAndUpdate.mockResolvedValue(null);

      const req = {
        params: {
          id: categoryId
        },
        body: {
          name: 'teste',
          discount: 10
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria não encontrada' });
    });

    test('should return 500 if an error occurs during category update', async () => {
      const categoryID = new mongoose.Types.ObjectId();
      Category.findByIdAndUpdate.mockRejectedValue(new Error('Erro ao salvar categoria'));
      const req = {
        params: {
          id: categoryID
        },
        body: {
          name: 'teste',
          discount: 10
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar categoria', error: 'Erro ao salvar categoria' });
    });
  });

  describe('DELETE /category', () => {
    test('should delete category successfully', async () => {
      const categoryId = new mongoose.Types.ObjectId();

      Category.findByIdAndDelete.mockResolvedValue(true);

      const req = {
        params: {
          id: categoryId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    test('should return 404 if category not found during delete', async () => {
      const categoryId = new mongoose.Types.ObjectId();

      Category.findByIdAndDelete.mockResolvedValue(null);

      const req = {
        params: {
          id: categoryId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria não encontrada' });
    });

    test('should return 500 if error occurs during category deletion', async () => {
      const categoryId = new mongoose.Types.ObjectId();

      Category.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const req = {
        params: {
          id: categoryId
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CategoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar categoria', error: 'Database error' });
    });

  });
});
