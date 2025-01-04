import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const BillList = () => {
  const list = [
    { id: 1, type: "Electricity" },
    { id: 2, type: "Water" },
    { id: 3, type: "Gas" },
    { id: 4, type: "Internet" },
    { id: 5, type: "Rent" },
    { id: 6, type: "Other" },
  ];

  const { currentUser } = useSelector((state) => state.user);
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedBillType, setSelectedBillType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBillByType = async (type) => {
    if (!currentUser) {
      setErrorMessage("Please sign in to view your bills.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`/api/bill/getBillByTypes/${type}?userId=${currentUser._id}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setFilteredBills(data.bills || []); // Default to an empty array if no bills are found
      } else {
        setFilteredBills([]);
        setErrorMessage("No bills found for this type.");
      }
    } catch (error) {
      console.error("Error fetching bills by type:", error);
      setErrorMessage("Error fetching bills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (type) => {
    setSelectedBillType(type);
    fetchBillByType(type);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-5">
      <h1 className="text-4xl font-bold mb-10">Bill Types</h1>
      <ul className="flex flex-row space-x-4">
        {list.map((item) => (
          <li key={item.id}>
            <button
              className={`border-2 rounded px-4 py-2 font-semibold font-mono ${
                selectedBillType === item.type ? "bg-red-800 text-white" : "bg-gray-100"
              }`}
              onClick={() => handleButtonClick(item.type)}
              disabled={loading}
            >
              {item.type}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-10 w-full max-w-5xl">
        <h2 className="text-2xl font-mono font-semibold mb-5">
          Fetched Bills - {selectedBillType || "None"}
        </h2>
        {currentUser === null ? (
          <p className="font-bold text-4xl text-gray-400 text-center">
            Please sign in to view your bill list...
          </p>
        ) : loading ? (
          <p className="text-gray-400 font-semibold text-2xl">Loading bills...</p>
        ) : errorMessage ? (
          <p className="text-red-500 font-semibold text-2xl">{errorMessage}</p>
        ) : filteredBills.length > 0 ? (
          <ul className="bg-white  p-4 grid grid-cols-3 md:grid-cols-4 gap-4 ">
            {filteredBills.map((bill) => (
              <li key={bill._id} className="border px-5 py-4  rounded  ">
                <div>
                  <div>
                      <div className='mb-4'>
                        <img className="h-40 rounded" src={bill.billImage} alt={bill.billType} />
                      </div>
                        <p><strong>description:</strong> {bill.description} </p>
                        <p ><strong>Amount:</strong>  ₹{bill.amount}</p>
                        <p><strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>
                
                  
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 font-semibold text-2xl">
            No bills found. Select a type from the options above.
          </p>
        )}
      </div>
    </div>
  );
};

export default BillList;
