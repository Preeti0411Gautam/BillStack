import { createRazorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import dotenv from 'dotenv'; dotenv.config();
const razorpayInstance =createRazorpayInstance();

export const createOrder = async(req, res)=>{
  
  //Do not accept amount from the client side inspect kreke amounct can be modified..
  const {billId} = req.body;

  //Bill id se fetch krenge bill ka data jaise price etc 

  //create an order 
  const options ={
    amount :billId.amount *100, //amount in smallest currency unit
    currency:"INR",
    receipt :'receipt_order_1',
  };

  try{
     razorpayInstance.orders.create(options, (err, order)=>{
      if(err){
        return res.status(500).json({
          success: false, 
          message :"Something went wrong"
        })
      }
     return res.status(200).json(order);

     });
  }catch(err){
  return res.status(500).json({
    success: false, 
    message: "Internal server error"
  });
  }
}

export const verifyPayment = async(req, res)=>{
  const {orderId, paymentId, signature} =req.body;
  
   const secret =process.env.RAZORPAY_API_SECRET;

    //create hmac object 
    const hmac = crypto.createHmac("sha256", secret); //crypto module by default aata h nodejs k andar 

    hmac.update(orderId + "|" +paymentId);

    const generatedSignature =hmac.digest("hex");

    if(generatedSignature === signature){

      //add db operations here
      return res.status(200).json({
        success: true, 
        message : "Payment verified",
      })
    }else{
      return res.status(400).json({
        success: false,
        message: "Payment not verified"
      })
    }


}


// export const createPayment = async (req, res) => {
//   try {
//     const { amount, currency, receipt } = req.body;

//     if (!amount || amount <= 0 || !currency || !receipt) {
//       return res.status(400).json({ message: 'Invalid payment request data' });
//     }

//     const options = {
//       amount, 
//       currency: currency || 'INR',
//       receipt: receipt || `receipt_${Date.now()}`,
//     };

//     console.log('Payment options:', options);
//     console.log('Key:', process.env.RAZORPAY_API_KEY);
//     console.log('Secret:', process.env.RAZORPAY_API_SECRET);
//     // console.log('Current working directory:', process.cwd());
//     // console.log('All environment variables:', JSON.stringify(process.env));

//     const order = await razorpay.orders.create(options);
    
//     if (!order) {
//       return res.status(500).json({ message: 'Error creating Razorpay order' });
//     }

//     return res.status(201).json(order);
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     if (error.response) {
//       console.error('Error response data:', error.response.data);
//     }
//     return res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
