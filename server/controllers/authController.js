import UserModel from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signUp=async(req, res ,next)=>{
    try{
     
    const {username, name, email, password} =req.body;
    
    const hashedPassword = bcryptjs.hashSync(password, 10); 

    const user = await UserModel.findOne({email})
 
    if(user){
       return res.json({
          success: false,
          message: "User already exit , you can login"
       })
    }
    if(!username || !name || !email || !password){
       return res.json({
          success: false,
          message:"Please provide valid data..."
       })
    }

    // Create a new user
     const newUser = new UserModel({ username, name, email, password: hashedPassword }); 
     await newUser.save();

     console.log(newUser);
     res.status(201).json({
       success: true,
       message :"SignUp successfully"
    })
    }catch(err){
        //  console.log(err);
         next(err);
    }
}


export const login =async(req,res ,next)=>{
    try{
 const {username, email , password}=req.body;
 // Check if the user exists using either email or username
//  findOne query uses an $or operator to search for a user by either the provided email or username.
 const validUser = await UserModel.findOne({
    $or: [{email}, {username}]
});

//  const errMsg="username/Email or password is wrong";

 if(!validUser){
    return next(errorHandler(404, 'User not found'))
 }

 const validPassword = bcryptjs.compareSync(password, validUser.password);

 if(!validPassword){
   return next(errorHandler(400, 'Invalid password or Email')) //wrong credentials user ko nhi btana h n ki password galat h
 }

   const token =jwt.sign({
      id: validUser._id
   },
   process.env.JWT_SECRET
 ) ;
   
   const {password:hashedPassword, ...rest} =validUser._doc; //not safe to send hashedPassword to the client side so remmoved it and send rest data to the client side
   
   const expiryDate = new Date(Date.now()+ 3600000); //1 hour

   res.status(200).
   cookie('access_token', token ,{
      httpOnly : true, 
      expires: expiryDate }).json(rest);


    }catch(err){
        console.log(err);
        next(err);
    }
}