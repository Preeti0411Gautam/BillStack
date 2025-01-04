import React, { useState } from "react";
import axios from "axios";
import {useSelector} from 'react-redux';

const BillType = () => {

  const {currentUser} = useSelector(state=>state.user);


  const [bills, setBills] = useState([
    { id: 1, billType: "Electricity", amount: "", dueDate: "", description: "", image: null },
    { id: 2, billType: "Water", amount: "", dueDate: "", description: "", image: null },
    { id: 3, billType: "Gas", amount: "", dueDate: "", description: "", image: null },
    { id: 4, billType: "Internet", amount: "", dueDate: "", description: "", image: null },
    { id: 5, billType: "Rent", amount: "", dueDate: "", description: "", image: null },
    { id: 6, billType: "Other", amount: "", dueDate: "", description: "", image: null },
  ]);

  const handleChange = (id, field, value) => {
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, [field]: value } : bill
      )
    );
  };

  const handleUpload = async (bill) => {
    try {
      // Validation to match backend requirements
      if (!bill.billType || !bill.amount || !bill.dueDate || !bill.image) {
        alert("Please provide all required details (bill type, amount, due date, and image).");
        return;
      }

      if (bill.billType.toLowerCase() === "other" && !bill.description) {
        alert("Please provide a description for 'Other' bill type.");
        return;
      }

      const formData = new FormData();
      formData.append("userId" , currentUser._id);
      formData.append("billType", bill.billType);
      formData.append("amount", bill.amount);
      formData.append("dueDate", bill.dueDate);
      formData.append("description", bill.description);
      formData.append("billImage", bill.image);

      const response = await axios.post("http://localhost:5000/bill/uploadBill", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Bill saved successfully!");
      } else {
        alert(response.data.message || "Failed to save the bill.");
      }
    } catch (error) {
      console.error("Error uploading bill:", error);
      alert("Internal server error while saving the bill.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="grid grid-cols-3 gap-6">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="bg-white w-60 p-4 flex flex-col items-center rounded-lg shadow-md font-mono font-semibold"
          >
            <div className="text-lg mb-4">{bill.billType}</div>
            <label className="w-full text-left">Amount</label>
            <input
              type="number"
              className="w-full mb-4 px-2 py-1 border border-gray-300 rounded"
              value={bill.amount}
              onChange={(e) => handleChange(bill.id, "amount", e.target.value)}
            />
            <label className="w-full text-left">Due Date</label>
            <input
              type="date"
              className="w-full mb-4 px-2 py-1 border border-gray-300 rounded"
              value={bill.dueDate}
              onChange={(e) => handleChange(bill.id, "dueDate", e.target.value)}
            />
            <label className="w-full text-left">Description</label>
            <input
              type="text"
              className="w-full mb-4 px-2 py-1 border border-gray-300 rounded"
              value={bill.description}
              onChange={(e) => handleChange(bill.id, "description", e.target.value)}
              placeholder={bill.billType.toLowerCase() === "other" ? "Required for 'Other'" : "Optional"}
            />
            <label className="w-full text-left">Image</label>
            <input
              type="file"
              className="w-full mb-4 px-2 py-1 border border-gray-300 rounded"
              onChange={(e) => handleChange(bill.id, "image", e.target.files[0])}
            />
            <button
              className="w-full bg-red-800 py-2 rounded text-white"
              onClick={() => handleUpload(bill)}
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillType;
