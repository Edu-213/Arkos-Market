const SubCategory = require('../models/SubCategorySchema');
const SubCategoryController = require('../controllers/SubcategoryController');

jest.mock('../models/SubCategorySchema');

describe('SubCategory Controller tests', () => {
  let req;
  let res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  describe('GET /subcategories', () => {
    test('should return a list of subcategories', async () => {
      const mockSubcategories = [
        { _id: '1', name: 'SubCategory 1', category: 'Category 1' },
        { _id: '2', name: 'SubCategory 2', category: 'Category 2' }
      ];

      SubCategory.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSubcategories)
      });

      await SubCategoryController.getSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should return 500 if there is a database error', async () => {
      SubCategory.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Erro ao acessar o banco de dados'))
      });

      await SubCategoryController.getSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao obter subcategorias',
        error: 'Erro ao acessar o banco de dados'
      });
    });
  });

  describe('POST /subcategories', () => {
    test('should create a new subcategory and return 201', async () => {
      const mockSubCategory = {
        name: 'New SubCategory',
        category: 'Category 1',
        discount: 10
      };

      SubCategory.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSubCategory)
      }));

      req = {
        body: {
          name: 'New SubCategory',
          category: 'Category 1',
          discount: 10
        }
      };

      await SubCategoryController.postSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'SubCategoria criada com sucesso' });
    });

    test('should return 500 if there is a database error', async () => {
      SubCategory.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Erro ao salvar a subcategoria'))
      }));

      req = {
        body: {
          name: 'New SubCategory',
          category: 'Category 1',
          discount: 10
        }
      };

      await SubCategoryController.postSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar subcategoria', error: 'Erro ao salvar a subcategoria' });
    });
  });

  describe('PUT /subcategories', () => {
    test('should update the subcategory and return 200', async () => {
      const mockUpdatedSubCategory = {
        _id: '1234',
        name: 'Updated SubCategory',
        discount: 20
      };

      SubCategory.findByIdAndUpdate.mockResolvedValue(mockUpdatedSubCategory);

      req = {
        params: {
          id: '1234'
        },
        body: {
          name: 'Updated SubCategory',
          discount: 20
        }
      };

      await SubCategoryController.updateSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'SubCategoria atualizada com sucesso' });
    });

    test('should return 404 if subcategory not found', async () => {
      SubCategory.findByIdAndUpdate.mockResolvedValue(null);

      await SubCategoryController.updateSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({ message: 'Subcategoria não encontrada' });
    });

    test('should return 500 if there is a database error', async () => {
      SubCategory.findByIdAndUpdate.mockRejectedValue(new Error('Erro ao atualizar subcategoria'));
      req = {
        params: {
          id: '1234'
        },
        body: {
          name: 'Updated SubCategory',
          discount: 20
        }
      };

      await SubCategoryController.updateSubcategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar subcategoria', error: 'Erro ao atualizar subcategoria' });
    });
  });

  describe('DELETE /subcategories', () => {
    test('should delete a subcategory successfully', async () => {
        const mockSubCategory = { _id: '123', name: 'Subcategoria Teste' };
      
        SubCategory.findByIdAndDelete.mockResolvedValue(mockSubCategory);
      
        req = { params: { id: '123' } }; 
      
        await SubCategoryController.deleteSubCategory(req, res);
      
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'SubCategoria deletada com sucesso' });
    });

    test('should return 404 if subcategory is not found', async () => {
        SubCategory.findByIdAndDelete.mockResolvedValue(null); 
      
        req = { params: { id: '123' } }; 

        await SubCategoryController.deleteSubCategory(req, res);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'SubCategoria não encontrada' });
      });

    test('should return 500 if there is an error deleting a subcategory', async () => {
        SubCategory.findByIdAndDelete.mockRejectedValue(new Error('Erro ao acessar o banco de dados'));
      
        req = { params: { id: '123' } };
      
        await SubCategoryController.deleteSubCategory(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar subcategoria', error: 'Erro ao acessar o banco de dados' });
      });
  })
});
