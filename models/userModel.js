import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


//Create schema for user
const userSchema=new mongoose.Schema({
    userID:{type: Number,default:0},
    firstName:{type: String,required: true},
    lastName:{type: String,required: true},
    email:{type: String,required: true},
    password:{type: String,default:""},
    role: {type: Number, default: 0},
    blocked: {type: Number, default: 0}
},{timestamps:true});

//Authentication token Generator
// userSchema.methods.generateAuthToken = function () {
// 	const token = jwt.sign({ _id: this._id,role:this.role},process.env.JWTPRIVATEKEY, {
// 		expiresIn: "7d",
// 	});
// 	return token;
// };

var User=mongoose.model("user",userSchema);
export default User;

