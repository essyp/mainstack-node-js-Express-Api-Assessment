/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import Review from "../models/review.js";
import Product from "../models/product.js";
import checkPermissions from "../utils/checkPermissions.js";


export const createReview = async (req,res)=>{
    const { rating, comment, product } = req.body;
    try {

        let productExist = Product.findById(product);
        if(!productExist){
            return res.status(404).json({ status: 404, message: 'product not found' });
        }
        let alreadyReviewed = await Review.findOne({user:req.user.userId,product});
        if(alreadyReviewed){
            return res.status(400).json({ status: 400, message: 'already reviewed' });
        }


        if (!rating || !comment || !product) {
            return res.status(400).json({ status: 400, message: 'all fields are required!' });
        }


        let reviewData = {
            rating,
            comment,
            product,
            user: req.user.userId,
        }
        const review = await Review.create(reviewData);
        return res.status(200).json({ status: 200, message: "operation successful!", data: review});

    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }

}

export const updateReview = async (req,res)=>{
    try {        
        const { id } = req.params;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const { rating, comment } = req.body;
            const review = await  Review.findById(id);
            if(!review){
                return res.status(404).json({ status: 404, message: 'review not found' });
            }
            checkPermissions(req.user,review.user);
            review.rating = rating;
            review.comment = comment;
            await review.save();
            return res.status(200).json({ status: 200, message: "operation successful!", data: review});
        }
        return res.status(400).json({ status: 400, message: 'wrong review id passed!' });

    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }


}

export const deleteReview = async (req, res) => {
    try {
        
        const { id } = req.params;  
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const review = await Review.findById(id);
        
            if (!review) {
                return res.status(404).json({ status: 404, message: 'review not found' });
            }
            checkPermissions(req.user, review.user);
            await Review.findOneAndRemove({_id: review._id})
            return res.status(200).json({ status: 200, message: "operation successful!"});
        }
        return res.status(400).json({ status: 400, message: 'wrong review id passed!' });

    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }
  };
  



  export const getAllReviews = async (req,res)=>{
    try {
      const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name category price description image',
      });
      return res.status(200).json({ status: 200, message: "operation successful!", data: reviews, count: reviews.length});
    
    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }
}

export const getSingleReview = async (req,res)=>{
    try {
        const { id } = req.params;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const review = await Review.findById(id).populate({
                path: 'user',
                select: 'firstName lastName',
              });
            if(!review){
                return res.status(404).json({ status: 404, message: 'review not found!' });
            }
            return res.status(200).json({ status: 200, message: "operation successful!", data: review});
        }
        return res.status(400).json({ status: 400, message: 'wrong review id passed!' });
       } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
       }
}

export const getSingleProductReviews = async (req, res) => {
    const { id } = req.params;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({ status: 404, message: 'product not found'});
        }

        const reviews = await Review.find({ product: id }).populate({
            path: 'user',
            select: 'firstName lastName',
          });
        return res.status(200).json({ status: 200, message: "operation successful!", data: reviews, count: reviews.length});
    }
    return res.status(400).json({ status: 400, message: 'wrong review id passed!' });
  };

export default (
    createReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview,
    getSingleProductReviews
)