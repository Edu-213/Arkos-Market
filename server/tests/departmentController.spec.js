const Department = require('../models/DepartmentSchema');
const DepartmentController = require('../controllers/DepartmentController');

jest.mock('../models/DepartmentSchema');

describe('Department Controller Tests', () => {
  let req;
  let res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  describe('GET /departments', () => {
    test('should return departments successfully', async () => {
      const mockDepartments = [
        { _id: '1', name: 'Electronics', description: 'All electronic items' },
        { _id: '2', name: 'Clothing', description: 'All clothing items' }
      ];

      Department.find.mockResolvedValue(mockDepartments);

      req = {};

      await DepartmentController.getDepartments(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(Department.find).toHaveBeenCalledTimes(1);
    });

    test('should return 500 if there is an error fetching departments', async () => {
      Department.find.mockRejectedValue(new Error('Erro ao obter departamentos'));

      req = {};

      await DepartmentController.getDepartments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao obter Department', error: 'Erro ao obter departamentos' });
    });
  });

  describe('POST /departments', () => {
    test('should create a new department successfully', async () => {
      const mockDepartment = { name: 'Electronics' };

      Department.prototype.save.mockResolvedValue(mockDepartment);

      req = {
        body: { name: 'Electronics' }
      };

      await DepartmentController.createDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department criada com sucesso' });
    });

    test('should return 500 if there is an error creating department', async () => {
      Department.prototype.save.mockRejectedValue(new Error('Erro ao criar departamento'));

      req = {
        body: { name: 'Electronics' }
      };

      await DepartmentController.createDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao criar Department', error: 'Erro ao criar departamento' });
    });
  });

  describe('PUT /departments/:id', () => {
    test('should update the department successfully', async () => {
      const mockDepartment = { _id: '1', name: 'Home Appliances' };

      Department.findByIdAndUpdate.mockResolvedValue(mockDepartment);

      req = {
        params: { id: '1' },
        body: { name: 'Home Appliances' }
      };

      await DepartmentController.updateDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department atualizada com sucesso',});
    });

    test('should return 404 if department is not found', async () => {
      Department.findByIdAndUpdate.mockResolvedValue(null);

      req = {
        params: { id: '1' },
        body: { name: 'Home Appliances' }
      };

      await DepartmentController.updateDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Department não encontrado' });
    });

    test('should return 500 if there is an error updating the department', async () => {
      Department.findByIdAndUpdate.mockRejectedValue(new Error('Erro ao atualizar departamento'));

      req = {
        params: { id: '1' },
        body: { name: 'Home Appliances' }
      };

      await DepartmentController.updateDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar Department',  error: 'Erro ao atualizar departamento' });
    });
  });

  describe('DELETE /departments/:id', () => {
    test('should delete the department successfully', async () => {
      const mockDepartment = { _id: '1', name: 'Home Appliances' };
      
      Department.findByIdAndDelete.mockResolvedValue(mockDepartment);

      req = {
        params: { id: '1' }
      };

      await DepartmentController.deleteDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({  message: 'Department deletada com sucesso' });
    });

    test('should return 404 if department is not found', async () => {
      Department.findByIdAndDelete.mockResolvedValue(null);

      req = {
        params: { id: '1' }
      };

      await DepartmentController.deleteDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Department não encontrado'
      });
    });

    test('should return 500 if there is an error deleting the department', async () => {
      Department.findByIdAndDelete.mockRejectedValue(new Error('Erro ao deletar departamento'));

      req = {
        params: { id: '1' }
      };

      await DepartmentController.deleteDepartment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao deletar Department', error: 'Erro ao deletar departamento' });
    });
  });
});
