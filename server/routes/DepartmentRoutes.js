const express = require('express');
const Department = require('../models/DepartmentSchema');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();

router.post('/', body('name').trim().notEmpty(), validateRequest, async (req,res) => {
    const { name } = req.body;
    try {
        const newDepartment = new Department({ name });
        await newDepartment.save();
        res.status(201).json({ message: 'Department criada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar Department', error });
    }
});

router.get('/', async (req, res ) => {
    try {
        const department = await Department.find();
        res.status(200).json(department);
    }  catch (error) {
        res.status(500).json({ message: 'Erro ao obter Department', error });
    }
});

router.put('/:id', [param('id').isMongoId(), body('name').optional().trim().notEmpty()], validateRequest, async (req, res) => {
    const {id} = req.params;
    const { name } = req.body;

    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        res.status(200).json({ message: 'Department atualizada com sucesso', category: updatedDepartment });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar Department', error });
    }
});

router.delete('/:id', param('id').isMongoId(), validateRequest, async (req, res) => {
    const { id } = req.params;

    try {
        await Department.findByIdAndDelete(id);
        res.status(200).json({ message: 'Department deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar Department', error });
    }
});

module.exports = router;