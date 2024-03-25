/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import User from '../models/user.js';
import { createJwt, attachCookiesToResponse } from '../utils/jwt.js';
import createTokenUser from '../utils/createTokenUser.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";;

export const register = async(req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        if (!firstName || !lastName || !phoneNumber || !password || !email) {
            return res.status(422).json({ 
                status: 422, message: 'fill all the credentials',
            })
        }
        const emailExist  = await User.findOne({email});
        if(emailExist){
            return res.status(400).json({ status: 400, message: 'email already exist' });
        }

        const phoneExist  = await User.findOne({phoneNumber});
        if(phoneExist){
            return res.status(400).json({ status: 400, message: 'phone number already exist' });
        }


        // check if he is the first user , if he is the first user , then make him admin
        const isFirstAccount = (await User.countDocuments({})) === 0;


        // ternary operator
        const role = isFirstAccount ? 'admin' : 'user';

        // create the user
        const user =  await User.create({firstName,lastName,email,phoneNumber,password,role});

        return res.status(200).json({ status: 200, message: 'user created', data: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'something went wrong - '+error })
        
    } 
}

export const login = async(req, res) => {  
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 422, message: 'fill all the credentials' })
        }

        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({ status: 400, message: 'no user found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({ status: 400, message: 'incorrect credentials passed' })
        }

        // create the user token  that contains the user id and name and role
        const userForToken = createTokenUser(user);

        // create the jwt token
        let token =  createJwt({payload: userForToken});

        return res.status(200).json({ status: 200, message : "user logged in Successfully ", data: userForToken, token: token})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'something went wrong - '+error })
        
    } 
}

export const logout = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("===========", decoded);
        const user = await User.findOne({ _id: decoded.userId});
        if(!user) {
            return res.status(400).json({ status: 400, message: 'no user found' })
        }
        req.token = token
        req.user = user
        next()
        res.status(200).json({ status: 200, message: 'user logged out!' });
    } catch (error) {
        res.status(500).send({status: 500, message: 'Authentication Required - '+error})
    }
};

export default (login, register, logout)
    
