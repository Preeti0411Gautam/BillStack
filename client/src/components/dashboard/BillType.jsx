import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BACKEND_URL;

const BillType = () => {
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    dueDate: "",
    billGeneratedDate: "",
    description: "",
    billImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, billImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.billImage) {
      return setErrorMessage("Please select a bill image to upload.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const formWithUserId = new FormData();
      formWithUserId.append("userId", currentUser._id);
      formWithUserId.append("billType", formData.billType);
      formWithUserId.append("amount", formData.amount);
      formWithUserId.append("dueDate", formData.dueDate);
      formWithUserId.append("billGeneratedDate", formData.billGeneratedDate);
      formWithUserId.append("description", formData.description);
      formWithUserId.append("billImage", formData.billImage);
      formWithUserId.append("paymentStatus", paymentStatus ? "true" : "false");

      const res = await fetch(`${baseURL}/api/bill/upload`, {
        method: "POST",
        body: formWithUserId,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to upload the bill.");
        return;
      }

      navigate("/billList");
    } catch (error) {
      setErrorMessage("An error occurred while uploading the bill.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <p className="mt-20 font-bold text-3xl text-center text-gray-500">
        Please sign in to upload your bill...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-10">
      <form
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 sm:p-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Upload Bill
        </h2>

        {errorMessage && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md text-center mb-6">
            {errorMessage}
          </div>
        )}

        {/* Bill Type */}
        <div className="mb-6">
          <label htmlFor="billType" className="block text-lg font-medium text-gray-700 mb-1">
            Select Bill Type
          </label>
          <select
            id="billType"
            value={formData.billType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="" disabled>Select a type</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Gas">Gas</option>
            <option value="Internet">Internet</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label htmlFor="dueDate" className="block text-lg font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Bill Generated Date */}
        <div className="mb-6">
          <label htmlFor="billGeneratedDate" className="block text-lg font-medium text-gray-700 mb-1">
            Bill Generated Date
          </label>
          <input
            id="billGeneratedDate"
            type="date"
            value={formData.billGeneratedDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="billImage" className="block text-lg font-medium text-gray-700 mb-1">
            Upload Bill Image
          </label>
          <input
            id="billImage"
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Payment Status */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentStatus"
                checked={paymentStatus}
                onChange={() => setPaymentStatus(true)}
              />
              <span className="ml-2">Paid</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentStatus"
                checked={!paymentStatus}
                onChange={() => setPaymentStatus(false)}
              />
              <span className="ml-2">Unpaid</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-200"
        >
          {loading ? "Uploading..." : "Save Bill"}
        </button>
      </form>
    </div>
  );
};

export default BillType;
