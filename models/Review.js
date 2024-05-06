import { Schema, model, models } from "mongoose"


const ReviewSchema = new Schema({
    subject: String,
    desc: String,
    stars: Number,
    product: {type: Schema.Types.ObjectId},
}, {timestamps: true});

export const Review = models?.Review || model('Review', ReviewSchema);