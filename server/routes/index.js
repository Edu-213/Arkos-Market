const router = require('express').Router();
router.use('/auth', require('./auth'));
router.use('/products', require('./product'));
router.use('/admin/department', require('./DepartmentRoutes'));
router.use('/admin/category', require('./category'));
router.use('/admin/subcategory', require('./subCategoryRoute'));
router.use('/cart', require('./cartRoute'));
module.exports = router;