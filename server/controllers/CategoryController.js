const Category = require('../models/Category');

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find().populate('department');

        if (categories.length === 0) {
            return res.status(404).json({ message: 'Nenhuma categoria encontrada' });
        }

        res.status(200).json(categories);
    }  catch (error) {
        res.status(500).json({ message: 'Erro ao obter categorias', error: error.message });
    }
};

exports.postCategory = async (req, res) => {
  const { name, discount, department } = req.body;
  try {
    const newCategory = new Category({ name, discount, department });
    await newCategory.save();
    res.status(201).json({ message: 'Categoria criada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
    const { name, discount, department } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, discount, department },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Categoria não encontrada' }) 

        res.status(200).json({ message: 'Categoria atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Categoria não encontrada' })
        res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar categoria', error: error.message });
    }
}
