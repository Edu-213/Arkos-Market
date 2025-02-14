const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController')

router.get('/', DepartmentController.getDepartments);

router.post('/', body('name').trim().notEmpty(), validateRequest, DepartmentController.createDepartment);

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty()], validateRequest, DepartmentController.updateDepartment);

router.delete('/:id', param('id').isMongoId(), validateRequest, DepartmentController.deleteDepartment);

module.exports = router;