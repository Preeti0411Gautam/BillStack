import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
   name:{
    type:String,
    required: true
   },
   email:{
    type:String, 
    required: true
   },
   message :{
    type: String,
    required: true
   }
})
   
  const contactUsModel = mongoose.model('contactUs' ,contactSchema);


  export default contactUsModel;
