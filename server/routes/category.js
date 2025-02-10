const express = require('express');
const Category = require('../models/Category');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

router.post('/', [body('name').trim().notEmpty(), body('discount').isFloat({ min: 0}), body('department').isMongoId() ], validateRequest, async (req,res) => {
    const { name, discount, department } = req.body;
    try {
        const newCategory = new Category({ name, discount, department });
        await newCategory.save();
        res.status(201).json({ message: 'Categoria criada com sucesso', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar categoria', error });
    }
});

router.get('/', async (req, res ) => {
    try {
        const categories = await Category.find().populate('department');
        res.status(200).json(categories);
    }  catch (error) {
        res.status(500).json({ message: 'Erro ao obter categorias', error });
    }
});

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty(), body('discount').optional().isFloat({ min: 0 }), body('department').optional().isMongoId()], validateRequest, async (req, res) => {
    const {id} = req.params;
    const { name, discount, department } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, discount, department },
            { new: true }
        );
        res.status(200).json({ message: 'Categoria atualizada com sucesso', category: updatedCategory });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erro ao atualizar categoria', error });
    }
});

router.delete('/:id', param('id').isMongoId(), validateRequest, async (req, res) => {
    const { id } = req.params;

    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar categoria', error });
    }
});

module.exports = router;