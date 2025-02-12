const express = require('express');
const { body, param, query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

const ProductController = require('../controllers/productController');
const { upload } = require('../middleware/multer');

// Buscar produtos com pesquisa
router.get('/', [query('search').optional().trim()], ProductController.getProducts);

//Buscar produto por ID
router.get('/id/:id', param('id').isMongoId(), validateRequest, ProductController.getProductsById);

router.get('/slug/:slug', ProductController.getProductsBySlug);

// Buscar produtos por departamento, categoria e subcategoria
router.get('/:departmentName/:categoryName?/:subcategoryName?', ProductController.getProductsByDepartmentAndCategoryAndSubcategory);

// Criar produto
router.post(
  '/',
  upload.array('image', 4),
  [
    body('name').trim().notEmpty(),
    body('brand').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').isMongoId(),
    body('subcategory').isMongoId(),
    body('maxInstallments').isInt({ min: 1 }),
    body('maxPurchesedLimit').isInt({ min: 1 }),
    body('pixDiscount').isFloat({ min: 0, max: 100 }),
    body('stock').isInt({ min: 0 })
  ],
  validateRequest,
  ProductController.postProducts
);

//Adicionar comentário ao produto
router.post(
  '/comment/:id',
  [param('id').isMongoId(), body('rating').isInt({ min: 1, max: 5 }), body('commentText').trim().notEmpty(), body('author').trim().notEmpty()],
  validateRequest,
  ProductController.postProductsComments
);

router.put('/:id', upload.single('image'), ProductController.updateProducts);

router.delete('/:id', validateRequest, ProductController.deleteProducts);

module.exports = router;
