import mongoose from 'mongoose';;
const ObjectID = mongoose.Schema.Types.ObjectId

const SingleOrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  amount: { type: Number, required: true },
  product: {
    type: ObjectID,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    orderItems: [SingleOrderItemSchema],

    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },

    paymentMode: {
        type: String,
        enum: ['delivery', 'online'],
        default: 'delivery',
    },

    user: {
      type: ObjectID,
      ref: 'User',
      required: true,
    },

    deliveryAddress: {
        type: String,
        required: true,
    },
    
    contactName: {
        type: String,
        required: true,
    },

    contactEmail: {
        type: String,
        required: true,
    },

    contactPhoneNumber: {
        type: Number,
        required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', OrderSchema)

export default Order