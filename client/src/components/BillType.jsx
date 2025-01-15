import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BillType = () => {
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    dueDate: "",
    description: "",
    billImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const handlePaymentStatusChange = (event) => {
    setPaymentStatus(event.target.checked);
  };
  


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
      formWithUserId.append("description", formData.description);
      formWithUserId.append("billImage", formData.billImage);
      formWithUserId.append("paymentStatus" ,paymentStatus ?"true" :"false");


      const res = await fetch(`/api/bill/upload`, {
        method: "POST",
        body: formWithUserId,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to upload the bill.");
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/billList");
    } catch (error) {
      setErrorMessage("An error occurred while uploading the bill.");
      setLoading(false);
    }
  };

  return (
    <div>
      {currentUser === null ? (
        <p className="mt-10 font-bold text-4xl text-center text-gray-400">
          Please sign in to upload your bill...
        </p>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <form
            className="w-full max-w-lg bg-white p-6 rounded-lg"
            onSubmit={handleSubmit}
          >
            <h2 className="text-5xl font-bold mb-20 text-center">Upload Bill</h2>
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}
            <div className="mb-8">
              <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="billType">
                Select Bill Type
              </label>
              <select
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="billType"
                onChange={handleChange}
                value={formData.billType}
              >
                <option value="" disabled>
                  Select a type
                </option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Gas">Gas</option>
                <option value="Internet">Internet</option>
                <option value="Rent">Rent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                id="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="dueDate">
                Due Date
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="date"
                id="dueDate"
                placeholder="Enter Due Date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="description">
                Description
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="billImage">
                Image
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                id="billImage"
                onChange={handleFileChange}
              />
            </div>
            <div className="mb-8">
            <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="paymentStatus">
              Payment Status
            </label>
            <div className="flex justify-around">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentStatus"
                  value={true}
                  checked={paymentStatus}
                  onChange={() => setPaymentStatus(true)}
                />
                <span className="ml-2">True</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentStatus"
                  value={false}
                  checked={!paymentStatus}
                  onChange={() => setPaymentStatus(false)}
                />
                <span className="ml-2">False</span>
              </label>
            </div>
         </div>

            <div className="flex items-center justify-between">
              <button
                className="w-full bg-red-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {loading ? "Loading..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BillType;
