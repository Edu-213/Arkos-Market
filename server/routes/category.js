const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();

router.get('/', CategoryController.getCategory);

router.post('/', CategoryController.postCategory ,[body('name').trim().notEmpty(), body('discount').isFloat({ min: 0}), body('department').isMongoId() ], validateRequest);

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty(), body('discount').optional().isFloat({ min: 0 }), body('department').optional().isMongoId()], validateRequest, CategoryController.updateCategory);

router.delete('/:id', param('id').isMongoId(), validateRequest, CategoryController.deleteCategory);

module.exports = router;