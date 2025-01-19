import mongoose from "mongoose";

const { Schema, model } = mongoose;

const paymentSchema = new Schema(
  {
    userId:{
      type:Schema.Types.ObjectId,
      red:'User',
      required: true
    },
    billId: {
      type: Schema.Types.ObjectId,
      ref: "Bill",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    created_on: {
      type: String, // Store created date as a string (ensure proper formatting)
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true, // Ensure this is always provided
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
