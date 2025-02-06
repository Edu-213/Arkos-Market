const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    discount: { type: Number, default: 0 },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true}
});

module.exports = mongoose.model('Category', CategorySchema);
