import mongoose from 'mongoose';
const ObjectID = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    user : {
      type: ObjectID,
       required: true,
       ref: 'User'
    },
    product: {
        type: ObjectID,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
}, {
     timestamps: true
})

    export const Cart = mongoose.model('Cart', cartSchema)
    
    export default Cart