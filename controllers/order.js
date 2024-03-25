import Order from '../models/order.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import checkPermissions from '../utils/checkPermissions.js';

export const getAllOrders = async (req, res) => {
      try {
        const orders = await Order.find({});
        return res.status(200).json({ status: 200, message: "operation successful!", data: orders, count: orders.length});
      } catch (error) {
        return res.status(400).json({status: 400, message: error.message});        
      }
};

export const getSingleOrder = async (req, res) => {
   try {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const order= await Order.findById(id);
        if(!order){
            return res.status(404).json({ status: 404, message: 'order not found' });
        }
        checkPermissions(req.user,order.user);
        return res.status(200).json({ status: 200, message: "operation successful!", data: order});
    }
    return res.status(400).json({ status: 400, message: 'wrong order id passed!' });
   } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
   }
};

export const getCurrentUserOrders = async (req, res) => {
    const orders= await Order.find({user:req.user.userId});
    if(!orders){
        return res.status(404).json({ status: 404, message: 'no order found for this user' });
    }
    return res.status(200).json({ status: 200, message: "operation successful!", data: orders, count: orders.length});
};

  
// need to revise this
export const createOrder = async (req, res) => {
    try {
        const { deliveryAddress, contactName, contactEmail, contactPhoneNumber, paymentMode, tax, shippingFee } = req.body;

        if(paymentMode != 'delivery'){
            return res.status(400).json({ status: 400, message: 'only payment on delivery is currently accepted!' });
        }

        const carts = await Cart.find({ user: req.user.userId });
    
        if (carts.length < 1) {
            return res.status(400).json({ status: 400, message: 'No item in cart' });
        }
        if (!tax || !shippingFee || !deliveryAddress || !contactName || !contactEmail || !contactPhoneNumber || !paymentMode) {
            return res.status(400).json({ status: 400, message: 'All fields are required' });
        }
    
        let orderItems = [];
        let subtotal = 0;
    
        for (const item of carts) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(400).json({ status: 400, message: `No product with id : ${item.product}` });
            }
            const { name, price, image, _id } = dbProduct;
            const singleOrderItem = {
                amount: item.total,
                name,
                quantity: item.quantity,
                price: item.price,
                product: _id,
            };
            orderItems = [...orderItems, singleOrderItem];
            // calculate subtotal

            // price of the items
            subtotal += item.total;
        }

        // totol price including tax and shipping fee
        const total = tax + shippingFee + subtotal;

        // creating the order 
        const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        deliveryAddress: deliveryAddress,
        contactName: contactName,
        contactEmail: contactEmail,
        contactPhoneNumber: contactPhoneNumber,
        paymentMode: paymentMode,
        user: req.user.userId,
        });

        await Cart.deleteMany({user: req.user.userId})
    
        return res.status(200).json({ status: 200, message: "operation successful!", data: order});
    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }
};

export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const { id } = req.params;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ status: 404, message: `No order with id : ${id} found` });
            }
            checkPermissions(req.user, order.user);  
            order.status = status;
            await order.save();
        
            return res.status(200).json({ status: 200, message: "operation successful!", data: order});
        }
        return res.status(400).json({ status: 400, message: 'wrong order id passed!' });
    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});        
    }
}



export default (
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrderStatus
)