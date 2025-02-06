const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    discount: {type: Number, default: 0}
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);