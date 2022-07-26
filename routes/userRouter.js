import express from "express";
import bcrypt from 'bcrypt';
import Joi from 'joi'; //most powerful schema description language
import passwordComplexity from 'joi-password-complexity';

import User from '../models/userModel.js';
const router=express.Router();

//Register routes
router.post("/",async(req,res)=>{
    try {
        const {error} =validate(req.body);
        if(error) return res.status(400).json({msg:error.message});
    
        //check whether email exists or not
        const user=await User.findOne({email:req.body.email});
        if(user) return res.status(409).json({message: "User with the given email already existed"});
    
        //salt là 1 chuỗi ký tự ngẫu nhiên được đi kèm với mật khẩu băm để tăng tính bảo mật cao hơn
        const salt=await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword=await bcrypt.hash(req.body.password,salt);

        await new User({...req.body,password: hashPassword}).save();
        return res.status(200).json({message: "User created successfully!"});
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
})

//User as validation
const validate=(data)=>{
    const schema = Joi.object({
        userID:Joi.number().required().label("ID"),
        firstName:Joi.string().required().label("First name"),
        lastName: Joi.string().required().label("Last name"),
        email: Joi.string().required().label("Email"),
        password: passwordComplexity().required().label("Password")
    });
    return schema.validate(data);
}

export default router;