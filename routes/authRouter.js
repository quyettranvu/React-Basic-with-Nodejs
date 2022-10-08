import express from "express";
import Joi from 'joi';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';
import generateAuthToken from '../utils/generateAuthToken.js';
const router=express.Router();

//Login Router
router.post("/",async(req,res)=>{
    try {
        const {error} =validate(req.body); //validate here need only email and password->we call the function below
        if(error) return res.status(400).send({message: error.details[0].message});

        //Check email
        const user=await User.findOne({email: req.body.email});
        if(!user) return res.status(401).json({message: "Invalid Email or Password"});

        //Check password
        const validPassword=await bcrypt.compare(req.body.password,user.password);

        if(!validPassword) return res.status(401).send({message: "Invalid Email or Password"});

        //Otherwise just generate authentication token
        const token=generateAuthToken(user);

        const {_id,firstName,lastName,email,password,role,blocked}=user;

        //send back to client
        res.json({
            token,
            user:{_id,firstName,lastName,email,password,role,blocked}
        })
        //console.log(user);
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})

//User as validation
const validate=(data)=>{
    const schema=Joi.object({
        email:Joi.string().email().required().label("Email"),
        password:Joi.string().label("Password") //Joi.string().pattern(/^([0-9][a-zA-Z])+$/).required().label("Password")
    })

    return schema.validate(data);
}

export default router;