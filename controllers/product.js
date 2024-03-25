import Product from '../models/product.js';

// var multer = require('multer');
// var upload = multer({limits: {fileSize: 1064960 },dest:'../views/uploads/products/'}).single('image');
import path from "path";
// var fs = require('fs-extra');


export const createProduct = async (req,res)=>{
    const { name, price, description, category, colors, featured, freeShipping } = req.body;
    if (!name || !price || !description || !category) {
        return res.status(422).json({ 
            status: 422, message: 'name, price, description and category fields are required!',
        })
    }

    let ProductToCreate = {
        name,
        price,
        description,
        category,
        colors,
        featured,
        freeShipping,
        user: req.user.userId,
    }
    try {
        const product = await Product.create(ProductToCreate);

        if (req.files) {
            if (req.files.image) {
                return saveImage(product._id, req);
            }
        }
        
        return res.status(200).json({ status: 200, message: 'operation successful!', data: product });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const getAllProducts = async (req,res)=>{
    try{
        const products = await Product.find({});
        return res.status(200).json({ status: 200, message: 'operation successful!', data: products });

    }
    catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}

// let uploadImage = async (req,res)=>{
//     upload(req, res, function (err) {
//         if (err) {
//             res.status(500).json({ error: 'message -'+err.message });
//         }
        
//         if (req.file == null) {
//             // If Submit was accidentally clicked with no file selected...
//             res.send('boo');
//         } else {
//             // read the img file from tmp in-memory location
//             var newImg = fs.readFileSync(req.file.path);
//             // encode the file as a base64 string.
//             var encImg = newImg.toString('base64');
//             // define your new document
//             var newItem = {
//                 contentType: req.file.mimetype,
//                 size: req.file.size,
//                 img: Buffer(encImg, 'base64')
//             };

//             db.collection('images').insert(newItem)
//             .then(function() {
//                 console.log('image inserted!');
//             });
        
//             res.send('yo');
//         }
//     });
// };

export const uploadImage = async (req,res)=>{
    const {id} = req.params;
    try{
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            if (!req.files) {
                return res.status(400).json({ status: 400, message: 'no file sent!' });
            }
            const productImage = req.files.image;

            const product = await Product.findById(id);
            if(!product){
                return res.status(404).json({ status: 404, message: 'product not found'});
            }

            if (!productImage.mimetype.startsWith('image')) {
                return res.status(400).json({ status: 400, message: 'It must be an image!' });
            }

            const maxSize = 1024 * 1024;

            if (productImage.size > maxSize) {
                return res.status(400).json({ status: 400, message: 'image larger then 1 mb!' });
            }

            const imagePath = path.join(__dirname, '../views/uploads/products/' + `${productImage.name}`);
            await productImage.mv(imagePath);

            product.image = `/views/uploads/products/${productImage.name}`;
            await product.save();

            return res.status(200).json({ status: 200, message: 'operation successful!', data: product });
        }
        return res.status(400).json({ status: 400, message: 'wrong product id passed!' });
    } catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}

let saveImage = async (id, req)=>{
    try{
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            if (!req.files) {
                return res.status(400).json({ status: 400, message: 'no file sent!' });
            }
            const productImage = req.files.image;

            const product = await Product.findById(id);
            if(!product){
                return res.status(404).json({ status: 404, message: 'product not found'});
            }

            if (!productImage.mimetype.startsWith('image')) {
                return res.status(400).json({ status: 400, message: 'It must be an image!' });
            }

            const maxSize = 1024 * 1024;

            if (productImage.size > maxSize) {
                return res.status(400).json({ status: 400, message: 'image larger then 1 mb!' });
            }

            const imagePath = path.join(__dirname, '../views/uploads/products/' + `${productImage.name}`);
            await productImage.mv(imagePath);

            product.image = `/views/uploads/products/${productImage.name}`;
            await product.save();

            return res.status(200).json({ status: 200, message: 'operation successful!', data: product });
        }
        return res.status(400).json({ status: 400, message: 'wrong product id passed!' });
    } catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const getSingleProduct = async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('reviews');
        if(!product){
            return res.status(404).json({ status: 404, message: 'product not found'});
        }
        return res.status(200).json({ status: 200, message: 'operation successful!', data: product });

    } catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const updateProduct = async (req,res)=>{
    const {id} = req.params;
    try {
        
        let product = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            });
        if(!product){
            return res.status(404).json({ status: 404, message: 'product not found'});
        }
        
        return res.status(200).json({ status: 200, message: 'operation successful!', data: product });

    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message});
    }
}

export const deleteProduct = async (req,res)=>{
    const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await Product.findById(id);
    
        if (!product) {
            return res.status(404).json({ status: 404, message: 'product not found!' });
        }
    
        await Product.findOneAndRemove({_id: product._id})
            return res.status(200).json({ status: 200, message: "operation successful!"});
    }
    return res.status(400).json({ status: 400, message: 'wrong product id passed!' });
  } catch (error) {
    return res.status(400).json({status: 400, message: error.message});
  }
}

export default (
    createProduct,
    getAllProducts,
    uploadImage,
    getSingleProduct,
    updateProduct,
    deleteProduct
)