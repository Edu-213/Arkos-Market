const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AuthController = require('../controllers/AuthController');

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('Auth Controller Tests', () => {

  describe('POST /cadastro', () => {
    test('should return 201 when user is registered successfully', async () => {
      const mockUserData = {
        name: 'Joaozinho',
        email: 'Joaozinho123@example.com',
        password: 'Password123',
        phone: '1234567890',
        cpf: '12345678901',
        birthDate: '1990-01-01',
        gender: 'male'
      };
      User.findOne.mockResolvedValue(null);

      bcrypt.hash.mockResolvedValue('hashedPassword123');

      const mockSave = jest.fn().mockResolvedValue(mockUserData);
      User.prototype.save = mockSave;

      const req = { body: mockUserData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await AuthController.registerUser(req, res);

      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(User.prototype.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário registrado com sucesso' });
    });

    test('should return 400 if user already exists', async () => {
      const mockUserData = {
        name: 'Joaozinho',
        email: 'Joaozinho123@example.com',
        password: 'Password123',
        phone: '1234567890',
        cpf: '12345678901',
        birthDate: '1990-01-01',
        gender: 'male'
      };

      User.findOne.mockResolvedValue(mockUserData);

      const req = { body: mockUserData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await AuthController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário já cadastrado com este email, CPF ou telefone.' });
    });

    test('should return 500 if there is a server error', async () => {
      const mockUserData = {
        name: 'Joaozinho',
        email: 'Joaozinho123@example.com',
        password: 'Password123',
        phone: '1234567890',
        cpf: '12345678901',
        birthDate: '1990-01-01',
        gender: 'male'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword123');
      User.prototype.save.mockRejectedValue(new Error('Erro no servidor'));

      const req = { body: mockUserData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await AuthController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro no servidor' });
    });
  });

  describe('POST /login', () => {
    test('should return 200 when login is successful', async () => {
      const mockUserData = {
        _id: '12345',
        email: 'joaozinho@example.com',
        password: 'Password123',
        name: 'Joaozinho',
        role: 'user'
      };

      bcrypt.compare.mockResolvedValue(true);

      User.findOne.mockResolvedValue(mockUserData);

      jwt.sign.mockReturnValue('mockToken');

      const req = { body: { emailCpf: 'joaozinho@example.com', password: 'Password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn()
      };

      await AuthController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login bem-sucedido' });
    });

    test('should return 400 if credentials are incorrect', async () => {
      User.findOne.mockResolvedValue(null);

      const req = { body: { emailCpf: 'nonexistent@example.com', password: 'WrongPassword' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await AuthController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'E-mail, CPF ou senha incorretos.' });
    });

    test('should return 500 if there is a server error', async () => {
      User.findOne.mockRejectedValue(new Error('Erro no servidor'));

      const req = { body: { emailCpf: 'joaozinho@example.com', password: 'Password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await AuthController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro no servidor', error: 'Erro no servidor' });
    });
  });
});
