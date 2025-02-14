const express = require('express');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();
const SubCategoryController = require('../controllers/SubcategoryController');

router.get('/', SubCategoryController.getSubcategory);

router.post('/', [body('name').trim().notEmpty(), body('category').isMongoId(), body('discount').isFloat({ min: 0 })], validateRequest, SubCategoryController.postSubcategory);

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty(), body('discount').optional().isFloat({ min: 0 })], validateRequest, SubCategoryController.updateSubcategory);

router.delete('/:id',param('id').isMongoId(), validateRequest, SubCategoryController.deleteSubCategory);

module.exports = router;