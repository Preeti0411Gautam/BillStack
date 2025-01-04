import React, { useState } from "react";
import axios from "axios";

const BillType = () => {
  const [billTypes, setBillTypes] = useState([
    { id: 1, name: "Electricity" },
    { id: 2, name: "Water" },
    { id: 3, name: "Gas" },
    { id: 4, name: "Internet" },
    { id: 5, name: "Rent" },
    { id: 6, name: "Other" },
  ]);

  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBillType, setSelectedBillType] = useState(null);

  const fetchBillsByType = async (billType) => {
    try {
      const response = await axios.get(`http://localhost:5000/bill/bills/${billType}`);
      if (response.data.success) {
        setFilteredBills(response.data.bills);
        setSelectedBillType(billType);
      } else {
        alert("No bills found for this type.");
      }
    } catch (error) {
      console.error("Error fetching bills by type:", error);
      alert("Error fetching bills.");
    }
  };

  const handleFileOpen = (fileUrl) => {
    const win = window.open(fileUrl, "_blank");
    if (win) {
      win.focus();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar: Bill Types */}
      <div className="w-1/4 p-6 ">
        <h2 className="text-xl font-bold mb-6">Bill Types</h2>
        <ul className="space-y-4">
          {billTypes.map((type) => (
            <li key={type.id}>
              <button
                className={`block w-full py-3 px-4 rounded text-left transition-colors ${
                  selectedBillType === type.name ? "bg-red-800" : "bg-gray-200"
                }`}
                onClick={() => fetchBillsByType(type.name)}
              >
                {type.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Filtered Bills */}
      <div className="w-3/4 p-6 overflow-y-auto">
        {selectedBillType && (
          <>
            <h2 className="text-2xl font-bold mb-6">Bills for {selectedBillType}</h2>
            {filteredBills.length > 0 ? (
              <div className="space-y-4">
                {filteredBills.map((bill) => (
                  <div
                    key={bill._id}
                    className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
                  >
                    <p className="mb-2">
                      <strong>Amount:</strong> {bill.amount}
                    </p>
                    <p className="mb-2">
                      <strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}
                    </p>
                    <p className="mb-2">
                      <strong>Description:</strong> {bill.description || "N/A"}
                    </p>
                    {bill.billImage && (
                      <img
                        src={`http://localhost:5000/server/uploads/${bill.billImage}`}
                        alt={`${bill.billType} bill`}
                        className="w-full h-32 object-cover rounded mt-2 cursor-pointer"
                        onClick={() => handleFileOpen(`http://localhost:5000/server/uploads/${bill.billImage}`)}
                      />
                    )}
                    {bill.billImg && (
                      <button
                        className="mt-2 text-blue-500 underline"
                        onClick={() => handleFileOpen(`http://localhost:5000/server/uploads/${bill.billImg}`)}
                      >
                        View or Download PDF
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No bills available for this type.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BillType;
