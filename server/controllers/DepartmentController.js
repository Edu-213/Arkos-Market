const Department = require('../models/DepartmentSchema');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter Department', error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  try {
    const newDepartment = new Department({ name });
    await newDepartment.save();
    return res.status(201).json({ message: 'Department criada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar Department', error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedDepartment = await Department.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedDepartment) return res.status(404).json({ message: 'Department não encontrado' });
    return res.status(200).json({ message: 'Department atualizada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar Department', error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) return res.status(404).json({ message: 'Department não encontrado' });
    return res.status(200).json({ message: 'Department deletada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao deletar Department', error: error.message });
  }
};
