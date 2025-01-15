import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file at the very beginning

export const createRazorpayInstance = () => {
  // Check if key_id and key_secret are properly loaded
  if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
    throw new Error('`key_id` and `key_secret` are mandatory');
  }

  // Create a Razorpay instance using the environment variables
  return new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
};
