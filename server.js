import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRouter.js';
import authRoutes from './routes/authRouter.js';
import mainRoutes from './routes/mainRouter.js';

//Settings with middlewares
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api",mainRoutes);


//Connect to mongoDB
const URI=process.env.MONGODB_URL;
mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},err=>{
    if(err) throw err;
    console.log('Connected to DB');
});



const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})

