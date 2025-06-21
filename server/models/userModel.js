import mongoose from "mongoose";

 const userSchema= mongoose.Schema({

  name:{
    type:String,
    required: true
  },
  username:{
   type: String, 
   required: true,
   unique:true
  },
  password:{
    type: String, 
    required: true ,
    length:8
  },
  email:{
    type: String,
    required: true, 
    unique: true,
    trim: true, 
    lowercase: true,
    unique:true
  },
  familyMembers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
]
  
},
 {
    timestamps: true,
 }
);

 const User = mongoose.model('users', userSchema);
 export default User;