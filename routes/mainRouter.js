import express from "express";
import User from "../models/userModel.js";


const router=express.Router();


//CRUD API
//Get All Users
router.get("/allusers",async (req,res)=>{
    try {
        const alluser=await User.find();
        return res.status(200).json(alluser);
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
})

//Add user with register or another method
router.post("/user",async(req,res)=>{
    try {
        const {userID,firstName,lastName,email,password} = req.body;
        const newUser=new User({
            userID,firstName,lastName,email,password
        });
        await newUser.save();
        return res.status(200).json({msg:'Added a new product.'});
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
})

//Get User by id
router.get("/user/:id",async (req,res)=>{
    try {
        const user_find=await User.findById(req.params.id);
            if(!user_find)
            {
                return res.status(404).json({msg:'This user does not exist.'});
            }
            return res.status(200).json(user_find);
    } catch (error) {
        return res.statuts(500).json({msg:error.message});
    }
})


//Update User
router.put("/user/:id",async (req,res)=>{
    try {
        const {userID,firstName,lastName,email,password} = req.body;

        const user=await User.findByIdAndUpdate(req.params.id,{
            userID,firstName,lastName,email,password
        },{new:true});

        if(!user){
            return res.status(404).json({msg: "This user does not exist."});
        }

        return res.status(200).json({msg:"Updated this user."})
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
})

//Delete User
router.delete("/user/:id",async (req,res)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.id);

        if(!user){
            return res.status(404).json({msg: "This user does not exist."});
        }

        return res.status(200).json({msg:"Deleted this user."})
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
})

export default router;