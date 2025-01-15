import Bill from "../models/billModel.js";
import uploadOnCloudinary from '../utils/cloudinary.js';
import fs from "fs";

export const uploadBill = async (req, res) => {

    
    try {


      console.log(req.body);
        const { userId, billType, amount, dueDate, description, paymentStatus } = req.body;
        const billImageLocalPath = req.file?.path;
       
        if (!billImageLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Bill Image/file is missing",
            });
        }

        const billImage = await uploadOnCloudinary(billImageLocalPath);

        if (!billImage?.url) {
            fs.unlinkSync(billImageLocalPath); // Ensure local file cleanup
            return res.status(400).json({
                success: false,
                message: "Error while uploading the bill file.",
            });
        }

        if (!billType || !amount || !dueDate || !userId || !paymentStatus) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required details (billType, amount, dueDate, billImage, userId , paymentStatus).",
            });
        }

        if (billType === "Other" && !description) {
            return res.status(400).json({
                success: false,
                message: "Description is required for 'Other' bill type.",
            });
        }

        const newBill = new Bill({
            userId,
            billType,
            amount,
            dueDate,
            description,
            billImage: billImage.url,
            paymentStatus
        });

        await newBill.save();
        fs.unlinkSync(billImageLocalPath); // Remove local file after successful upload

        return res.status(201).json({
            success: true,
            message: "Bill added successfully.",
            bill: newBill,
        });
    } catch (error) {
        console.error("Error saving bill to the database:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};


export const getBillsByType = async (req, res) => {
    try {
      const { billType } = req.params;
      const { userId } = req.query;
  
      if (!billType) {
        return res.status(400).json({
          success: false,
          message: "Bill type is required.",
        });
      }
  
      const bills = await Bill.find({ billType ,userId });
     
      if (bills.length === 0) { 
        return res.status(404).
        json({ 
          success: false,
           message: 'No bills found with this type.' }); 
          }
      return res.status(200).json({
        success: true,
         bills,
      });
    } catch (error) {
      console.error("Error fetching bills by type:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  



//by userId
export const getBill =async(req,res)=>{
 try{
    const {userId} = await req.params;
    if(!userId){
        return res.json({
            success: false, 
            message: "Please provide userId"
        })
    }

    const bills = await Bill.find({userId});
    console.log(bills);
    
    if(bills.length===0){
        return res.json({
            success: false, 
            message: "No bills found with this user or this user doesn't exist"
        })
    }
    res.status(200).json({
        success: true,
        message:"Successfully fetched bill ",
        data: bills
    })
 }catch(err){
    console.log(err); 
    res.status(500).json({ 
        success: false, 
        message: "Internal server Error...", 
    }); 
 }
}


//delete bill by bill id
export const deleteBill = async(req, res)=>{
    try{
       const billId= await req.params.id;
       if(!billId){
        return res.json({
            success: false,
            message: "Invalid billId , Pleasse provide valid billId .."
        })
       }

       const data=await Bill.findById(billId);
        console.log(data);
        if(!data){
            return res.json({
                success: false,
                message: "No bill found with this id or invalid bill id",
                
            })
        }
        
        await Bill.findByIdAndDelete(billId);

       res.status(200).json({
        success: true , 
        message: "Bill deleted successfully",

       })
    }catch(err){
        console.log(err); 
        res.status(500).json({ 
            success: false, 
            message: "Internal server Error...", 
        });
    }
}



