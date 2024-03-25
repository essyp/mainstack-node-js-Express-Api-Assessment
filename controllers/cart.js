import Cart from '../models/cart.js';
import Product from '../models/product.js';


export const addToCart = async (req,res)=>{
    try {
        const { product, quantity } = req.body;
        if (product.match(/^[0-9a-fA-F]{24}$/)) {
            if (!product || !quantity) {
                return res.status(422).json({ 
                    status: 422, message: 'product and quantity fields are required!',
                })
            }

            const productExist = await Product.findById(product);
            if(!productExist){
                return res.status(404).json({ status: 404, message: 'product not found'});
            }

            const cartExist = await Cart.findOne({ user: req.user.userId, product: productExist._id });
            if(cartExist){
                return res.status(400).json({ status: 400, message: 'product already in your cart'});
            }

            let ProductToAdd = {
                product,
                price: productExist.price,
                quantity,
                total: quantity * productExist.price,
                user: req.user.userId,
            }
        
            const cart = await Cart.create(ProductToAdd);
            
            return res.status(200).json({ status: 200, message: 'operation successful!', data: cart });
        }
        return res.status(400).json({ status: 400, message: 'wrong product id passed!' });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const getCartItems = async (req,res)=>{
    try{
        const carts = await Cart.find({ user: req.user.userId }).populate({
            path: 'product',
            select: 'name image',
        });
        return res.status(200).json({ status: 200, message: 'operation successful!', data: carts });

    }
    catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}

export const removeFromCart = async (req,res)=>{
    const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await Cart.findById(id);
    
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'cart item not found!' });
        }
    
        await Cart.findOneAndRemove({_id: cart._id})
            return res.status(200).json({ status: 200, message: "operation successful!"});
    }
    return res.status(400).json({ status: 400, message: 'wrong cart item id passed!' });
  } catch (error) {
    return res.status(400).json({status: 400, message: error.message});
  }
}

export const increaseCart = async (req,res)=>{
    const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await Cart.findById(id);
    
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'cart item not found!' });
        }
    
        cart.quantity = cart.quantity + 1;
        await cart.save();
            return res.status(200).json({ status: 200, message: "operation successful!"});
    }
    return res.status(400).json({ status: 400, message: 'wrong cart item id passed!' });
  } catch (error) {
    return res.status(400).json({status: 400, message: error.message});
  }
}

export const decreaseCart = async (req,res)=>{
    const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const cart = await Cart.findById(id);
    
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'cart item not found!' });
        }

        if(cart.quantity == 1){
            return res.status(400).json({ status: 400, message: 'quantity can not be below 1!' });
        }
    
        cart.quantity = cart.quantity - 1;
        await cart.save();
            return res.status(200).json({ status: 200, message: "operation successful!"});
    }
    return res.status(400).json({ status: 400, message: 'wrong cart item id passed!' });
  } catch (error) {
    return res.status(400).json({status: 400, message: error.message});
  }
}

export default (
    addToCart,
    getCartItems,
    removeFromCart,
    increaseCart,
    decreaseCart
)