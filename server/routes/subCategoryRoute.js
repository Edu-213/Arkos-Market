const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();
const SubCategoryController = require('../controllers/SubcategoryController');

router.get('/', SubCategoryController.getSubcategory);

router.post('/', SubCategoryController.postSubcategory, [body('name').trim().notEmpty(), body('category').isMongoId(), body('discount').isFloat({ min: 0 })], validateRequest);

router.put('/:id', SubCategoryController.updateSubcategory, [param('id').isMongoId(), body('name').optional().trim().notEmpty(), body('discount').optional().isFloat({ min: 0 })], validateRequest);

router.delete('/:id', SubCategoryController.deleteSubCategory ,param('id').isMongoId(), validateRequest);

module.exports = router;