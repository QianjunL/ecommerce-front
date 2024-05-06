import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    desc: String,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: [{type: String}],
    },
    properties: {
        type: Object,
    },
},
{
    timestamps: true,

});

export const Product = models.Product || model('Product', ProductSchema);