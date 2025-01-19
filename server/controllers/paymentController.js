import { createRazorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import Bill from "../models/billModel.js";
import Razorpay from "razorpay";
import Payment from "../models/paymentModel.js";
const razorpayInstance = createRazorpayInstance();

export const createOrder = async (req, res) => {
  //Do not accept amount from the client side inspect kreke amounct can be modified..
  const { billId } = req.body;
  console.log("billId", billId);
  let bill;
  try {
    bill = await Bill.findOne({ _id: billId });
    // console.log("bill", bill);
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bill",
      error: error.message,
    });
  }
  //Bill id se fetch krenge bill ka data jaise price etc

  //create an order
  const options = {
    amount: bill.amount * 100, //amount in smallest currency unit
    currency: "INR",
    receipt: "receipt_order_1",
  };

  try {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature, billId ,userId } = req.body;

  if (!order_id || !payment_id || !signature || !billId) {
    return res
      .status(400)
      .json({ success: false, message: "Incomplete payment data" });
  }

  const secret = process.env.RAZORPAY_API_SECRET;
  const key_id = process.env.RAZORPAY_API_KEY;

  const razorpay = new Razorpay({
    key_id,
    key_secret: secret,
  });

  try {
    // Verify the signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${order_id}|${payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not verified" });
    }

    // Fetch the bill and validate
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(payment_id);

    const created_on_raw = new Date(paymentDetails.created_at * 1000);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    // Save payment record
    const newPayment = new Payment({
      transactionId: paymentDetails.id,
      billId,
      userId,
      paymentMethod: paymentDetails.method || "Unknown",
      status:
        paymentDetails.status === "captured"
          ? "Completed"
          : paymentDetails.status || "Pending",
      created_on: created_on_raw.toLocaleString("en-US", options),
      amount: paymentDetails.amount / 100, // Convert to rupees
    });

    await newPayment.save();

    // Update the bill with payment status
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { paymentStatus: true },
      { new: true }
    );

    if (!updatedBill) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update bill" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentMethod: paymentDetails.method, // Include payment method
      amount: paymentDetails.amount / 100, // Include amount
    });
  } catch (err) {
    console.error("Error in verifying payment:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch payment history.",
      });
    }

    // Fetch all payments related to the user from the database
    const paymentHistory = await Payment.find({ userId }).sort({ date: -1 }); // Sort by date descending

    // If no payments are found, return an appropriate response
    if (!paymentHistory || paymentHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payment history found for this user.",
      });
    }

    // Respond with the fetched payment history
    res.status(200).json({
      success: true,
      message: "Payment history fetched successfully.",
      history: paymentHistory,
    });
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error fetching payment history:", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching payment history.",
    });
  }
};
