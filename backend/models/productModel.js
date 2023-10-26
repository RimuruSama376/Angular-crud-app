const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product', productSchema);

module.exports = Product;