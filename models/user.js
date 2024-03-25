import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

 const userSchema = new mongoose.Schema({
    firstName: {
       type: String,
       required: [true, "first name is a required field"],
       trim: true,
    //    lowercase: true
    },
    lastName: {
        type: String,
        required: [true, "last name is a required field"],
        trim: true,
        // lowercase: true
    },
    email: {
       type: String,
       required: [true, "Email is a required field"],
       unique: true,
       lowercase: true,
        validate( value ) {
            if( !validator.isEmail( value )) {
                throw new Error( 'Email is invalid' )
            }
        }
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone Number is a required field"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
           if( value.toLowerCase().includes('password')) {
           throw new Error('password must not contain password')
          }
       }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
}, {
    timestamps: true
}
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  export const User = mongoose.model('User', userSchema)
export default User