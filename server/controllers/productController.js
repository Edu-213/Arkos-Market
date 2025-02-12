const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategorySchema');
const Department = require('../models/DepartmentSchema');
const slugify = require('slugify');
const { updateImage } = require('../middleware/multer');

exports.getProducts = async (req, res) => {
  try {
    const searchQuerry = req.query.search || '';
    let products = [];
    const filter = {};

    if (searchQuerry) {
      const regex = new RegExp(`^${searchQuerry}$`, 'i');
      const subcategory = await SubCategory.findOne({ name: regex }).populate('category');

      const category = subcategory
        ? await Category.findById(subcategory.category).populate('department')
        : await Category.findOne({ name: regex }).populate('department');

      const department = category ? await Department.findById(category.department) : await Department.findOne({ name: regex });


      if (subcategory) filter.subcategory = subcategory._id;
      else if (category) filter.category = category._id;
      else if (department) filter.department = department._id;
      else {
        filter.$or = [{ name: { $regex: searchQuerry, $options: 'i' } }, { description: { $regex: searchQuerry, $options: 'i' } }];
      }
    }

    products = await Product.find(filter).populate('department category subcategory');

    if (products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado' });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

exports.getProductsById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: error.message });
  }
};

exports.getProductsBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: error.message });
  }
};

exports.getProductsByDepartmentAndCategoryAndSubcategory = async (req, res) => {
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
    return res.status(products.length ? 200 : 404).json(products.length ? products : { message: 'Nenhum produto encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
};

exports.postProducts = async (req, res) => {
  try {
    const { name, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock } = req.body;
    const image = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const slug = slugify(name, { lower: true, remove: /[*+.()'"!:@]/g });

    const product = new Product({ name, slug, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock, image });

    await product.save();
    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

exports.postProductsComments = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('department category subcategory');
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    product.comments.push(req.body);
    await product.save();

    res.status(201).json({ message: 'Comentário adicionado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar comentário', error: error.message });
  }
};

exports.updateProducts = async (req, res) => {
  const { name, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock, imageIndex } = req.body;

  try {
    const product = await Product.findById(req.params.id).populate('department category subcategory');
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (req.file) {
      await updateImage(product, req.file.path, imageIndex);
    }

    await Product.findByIdAndUpdate(
      req.params.id,
      { name, brand, description, price, category, subcategory, maxInstallments, maxPurchesedLimit, pixDiscount, stock, image: product.image },
      { new: true }
    );

    res.status(200).json({ message: 'Produto atualizado com sucesso'});
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o produto', error: error.message });
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' })
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
  }
};
