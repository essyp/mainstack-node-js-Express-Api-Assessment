/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import mongoose from 'mongoose';;

 const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide category name'],
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    status: {
      type: Boolean,
      default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', CategorySchema)

export default Category