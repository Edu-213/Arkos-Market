const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController')

router.get('/', DepartmentController.getDepartments);

router.post('/', DepartmentController.createDepartment, body('name').trim().notEmpty(), validateRequest);

router.put('/:id', DepartmentController.updateDepartment, [param('id').isMongoId(), body('name').optional().trim().notEmpty()], validateRequest);

router.delete('/:id', DepartmentController.deleteDepartment, param('id').isMongoId(), validateRequest);

module.exports = router;