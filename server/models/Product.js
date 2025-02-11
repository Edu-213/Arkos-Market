const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    brand: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    pixDiscount: {type: Number, default: 0},
    department: {type: mongoose.Schema.Types.ObjectId, ref: 'Department'},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true},
    image: [{type: String}],
    stock: {type: Number, default: 0},
    maxInstallments: {type: Number},
    maxPurchesedLimit: {type: Number, default: 1},
    createdAt: {type: Date},
    comments: [{
        rating: {type: Number, min: 1, max: 5},
        commentText: {type: String},
        author: {type: String},
        createdAt: {type: Date, default: Date.now}
    }]
}, {toJSON: {virtuals: true}, toObject: {virtuals:true}});

ProductSchema.pre('save', async function(next) {
    if (this.category) {
        const category = await mongoose.model('Category').findById(this.category).populate('department');
        if (category && category.department) {
            this.department = category.department._id;
        }
    }
    next();
});

ProductSchema.virtual('finalPrice').get(function () {
    let finalPrice = this.price;

    if (this.category && this.category.discount) {
        const discountPercentage = this.category.discount / 100;
        finalPrice -= (finalPrice * discountPercentage);
    }

    if (this.subcategory && this.subcategory.discount) {
        const subcategoryDiscount = this.subcategory.discount / 100;
        finalPrice -= (finalPrice * subcategoryDiscount);
    }

    return finalPrice;
});

ProductSchema.virtual('pixPrice').get(function() {
    const discountPercentage = this.pixDiscount / 100;
    return (this.price * (1 - discountPercentage));
});

ProductSchema.virtual('finalPriceWithPix').get(function() {
    const priceWithCategoryDiscount = this.finalPrice;
    const priceWithBothDiscounts = priceWithCategoryDiscount * (1 - this.pixDiscount / 100); 
    return priceWithBothDiscounts;
});

module.exports = mongoose.model('Product', ProductSchema);