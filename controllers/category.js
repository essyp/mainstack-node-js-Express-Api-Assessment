/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import Category from '../models/category.js';


export const createCategory = async (req,res)=>{
    const { name} = req.body;
    if (!name) {
        return res.status(400).json({ 
            status: 422, message: 'name field is required!',
        })
    }

    try {
        const category =  await Category.create({name});
        return res.status(200).json({ status: 200, message: 'operation successful!', data: category });
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const getAllCategory = async (req,res)=>{
    try{
        const category = await Category.find({});
        return res.status(200).json({ status: 200, message: 'operation successful!', data: category });

    }
    catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const getSingleCategory = async (req,res)=>{
    try{
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({ status: 404, message: 'category not found'});
        }
        return res.status(200).json({ status: 200, message: 'operation successful!', data: category });

    }
    catch(error){
        return res.status(400).json({ status: 400, message: error.message});
    }
}


export const updateCategory = async (req,res)=>{
    const {id} = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ 
            status: 422, message: 'name field is required!',
        })
    }
    try {
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({ status: 404, message: 'category not found' })
        }

        category.name = name;
        await category.save();

        return res.status(200).json({ status: 200, message: "operation successful!", data: category});
    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }
}

export const deleteCategory = async (req,res)=>{
    const { id } = req.params;

  try {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const category = await Category.findById(id);
    
        if (!category) {
            return res.status(404).json({ status: 404, message: 'category not found' });
        }
    
        await Category.findOneAndRemove({_id: category._id})
        return res.status(200).json({ status: 200, message: "operation successful!"});
    }
    return res.status(400).json({ status: 400, message: 'wrong category id passed!' });
  } catch (error) {
    return res.status(400).json({status: 400, message: error.message});
  }
}

export default (
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
)