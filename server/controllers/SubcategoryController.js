const SubCategory = require('../models/SubCategorySchema');

exports.getSubcategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.find().populate('category');
    return res.status(200).json(subcategory);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter subcategorias', error: error.message });
  }
};

exports.postSubcategory = async (req, res) => {
  const { name, category, discount } = req.body;
  try {
    const newSubCategory = new SubCategory({ name, category, discount });
    await newSubCategory.save();
    return res.status(201).json({ message: 'SubCategoria criada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar subcategoria', error: error.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { name, discount } = req.body;

  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, { name, discount }, { new: true });
    if (!updatedSubCategory) return res.status(404).json({ message: 'Subcategoria não encontrada' });

    return res.status(200).json({ message: 'SubCategoria atualizada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar subcategoria', error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
    if (!deletedSubCategory) return res.status(404).json({ message: 'SubCategoria não encontrada' });

    return res.status(200).json({ message: 'SubCategoria deletada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar subcategoria', error: error.message });
  }
};
