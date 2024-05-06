import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'POST') {
        const {subject, desc, stars, product} = req.body;
        res.json(await Review.create({subject, desc, stars, product})); 
    }

    if (req.method === 'GET') {
        const {product} = req.query;
        res.json(await Review.find({product}, null, {sort: {createdAt: -1}}));
    }
}