const express = require('express');
const SubCategory = require('../models/SubCategorySchema');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

router.post('/', [body('name').trim().notEmpty(), body('category').isMongoId(), body('discount').isFloat({ min: 0 })], validateRequest, async (req,res) => {
    const { name, category, discount } = req.body;
    try {
        const newSubCategory = new SubCategory({ name, category, discount });
        await newSubCategory.save();
        res.status(201).json({ message: 'SubCategoria criada com sucesso', category: newSubCategory });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar subcategoria', error });
    }
});

router.get('/', async (req, res ) => {
    try {
        const subcategories = await SubCategory.find().populate('category');
        res.status(200).json(subcategories);
    }  catch (error) {
        res.status(500).json({ message: 'Erro ao obter csubategorias', error });
    }
});

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty(), body('discount').optional().isFloat({ min: 0 })], validateRequest, async (req, res) => {
    const {id} = req.params;
    const { name, discount } = req.body;

    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            { name, discount },
            { new: true }
        );
        res.status(200).json({ message: 'SubCategoria atualizada com sucesso', category: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar subcategoria', error });
    }
});

router.delete('/:id', param('id').isMongoId(), validateRequest, async (req, res) => {
    const { id } = req.params;

    try {
        await SubCategory.findByIdAndDelete(id);
        res.status(200).json({ message: 'SubCategoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar subcategoria', error });
    }
});

module.exports = router;