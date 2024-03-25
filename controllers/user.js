/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import User from '../models/user.js';
import createTokenUser from '../utils/createTokenUser.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req,res)=>{
    try {
        const users = await User.find({role:"user"}).select(["-password", "-tokens"]);
        return res.status(200).json({ status: 200, message : "operation successful!", data: users });
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message});
    }
}

export const getUserById = async (req,res)=>{
    try {
        const user = await User.findById(req.params.id).select(["-password", "-tokens"]);
        if(!user){
            return res.status(400).json({ status: 400, message: 'no user found' })
        }

        return res.status(200).json({ status: 200, message: "operation successful!", data: user });
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message});
    }
}


export const UpdateUserPassword = async (req,res)=>{
    try {
        const { currentPassword, newPassword } = req.body;
        if(!currentPassword || !newPassword){
            return res.status(400).json({ status: 400, message: 'current and new password fields are required' })
        }
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(400).json({ status: 400, message: 'no user found' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if(!isMatch) {
            return res.status(400).json({ status: 400, message: 'incorrect current password!' })
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ status: 200, message: "operation successful!", data: user });

    } catch (error) {
        return res.status(500).json({status: 500, message: error.message});
    }

}

export const UpdateUser = async (req,res)=>{
    try {
        const { firstName, lastName, phoneNumber, email } = req.body;
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(400).json({ status: 400, message: 'no user found' })
        }

        if(user.phoneNumber != phoneNumber){
            const check_if_phone_exist = await User.findOne({phoneNumber});
            if(check_if_phone_exist){
                return res.status(400).json({ status: 400, message: 'Phone number already exist for a different user.' })
            }
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.phoneNumber = phoneNumber;
        await user.save();
        const tokenUser = createTokenUser(user);
        return res.status(200).json({status: 200, message:"user updated successfully", data:tokenUser});

    } catch (error) {
        return res.status(500).json({status: 500, message: error.message});
    }
}

export const getCurrentUser = async (req,res)=>{
    try {
        const user = await User.findById(req.user.userId).select(["-password","-tokens"]);
        return res.status(200).json({ status: 200, message : "operation successful!", data: user });
    } catch (error) {
        return res.status(500).json({status: 500, message: error.message});
    }
}




export default ( 
    getAllUsers,
    getUserById,
    UpdateUserPassword,
    UpdateUser,
    getCurrentUser
)