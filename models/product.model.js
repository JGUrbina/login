const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    descriptionShort: {
        type: String
    },
    descriptionLong: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    purchasePrice: {
        type: Number,
        required: true,
        trim: true,
        minlength: 3
    },
    salePrice: {
        type: Number,
        required: true,
        trim: true,
        minlength: 3
    },
    img: {
        type: String
    }
},
{
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product