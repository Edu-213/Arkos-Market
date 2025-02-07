const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Department = require('../models/DepartmentSchema');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategorySchema');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Criar produto
router.post(
  '/',
  upload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('brand').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('category').isMongoId(),
    body('subcategory').isMongoId(),
    body('maxInstallments').isInt({ min: 1 }),
    body('maxPurchesedLimit').isInt({ min: 1 }),
    body('pixDiscount').isFloat({ min: 0, max: 100 }),
    body('stock').isInt({ min: 0 })
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const slug = slugify(name, {lower: true, remove: /[*+.()'"!:@]/g});

      const product = new Product({ name, slug, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock, image });

      await product.save();
      res.status(201).json({ message: 'Produto criado com sucesso', product });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
  }
);

// Buscar produtos com pesquisa
router.get('/', [query('search').optional().trim()], async (req, res) => {
  try {
    const searchQuerry = req.query.search || '';
    let products = [];

    if (searchQuerry) {
      const regex = new RegExp(`^${searchQuerry}$`, 'i');
      const subcategory = await SubCategory.findOne({ name: regex }).populate('category');
      const category = subcategory
        ? await Category.findById(subcategory.category).populate('department')
        : await Category.findOne({ name: regex }).populate('department');
      const department = category ? await Department.findById(category.department) : await Department.findOne({ name: regex });

      const filter = {};
      if (subcategory) filter.subcategory = subcategory._id;
      else if (category) filter.category = category._id;
      else if (department) filter.department = department._id;
      else filter.$or = [{ name: { $regex: searchQuerry, $options: 'i' } }, { description: { $regex: searchQuerry, $options: 'i' } }];

      products = await Product.find(filter).populate('department category subcategory');
    } else {
      products = await Product.find().populate('department category subcategory');
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

//Buscar produto por ID
router.get('/id/:id', param('id').isMongoId(), validateRequest, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: error.message });
  }
})

// Buscar produtos por departamento, categoria e subcategoria
router.get('/:departmentName/:categoryName?/:subcategoryName?', async (req, res) => {
  try {
    const { departmentName, categoryName, subcategoryName } = req.params;

    const department = await Department.findOne({ name: departmentName });
    if (!department) return res.status(404).json({ message: 'Departamento não encontrado' });

    const category = categoryName ? await Category.findOne({ name: categoryName, department: department._id }).populate('department') : null;
    if (categoryName && !category) return res.status(404).json({ message: 'Categoria não encontrada' });

    const subcategory = subcategoryName
      ? await SubCategory.findOne({ name: subcategoryName, category: category._id }).populate({ path: 'category', populate: { path: 'department' } })
      : null;
    if (subcategoryName && !subcategory) return res.status(404).json({ message: 'Subcategoria não encontrada' });

    const filter = { department: department._id };
    if (category) filter.category = category._id;
    if (subcategory) filter.subcategory = subcategory._id;

    const products = await Product.find(filter).populate('department category subcategory');
    return res.status(products.length ? 200 : 400).json(products.length ? products : { message: 'Nenhum produto encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
});

//Adicionar comentário ao produto
router.post(
  '/comment/:id',
  [param('id').isMongoId(), body('rating').isInt({ min: 1, max: 5 }), body('commentText').trim().notEmpty(), body('author').trim().notEmpty()],
  validateRequest,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('department category subcategory');
      if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

      product.comments.push(req.body);
      await product.save();

      res.status(200).json({ message: 'Comentário adicionado com sucesso', product });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao adicionar comentário', error: error.message });
    }
  }
);

module.exports = router;
