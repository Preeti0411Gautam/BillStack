import { useState } from "react";
import { useSelector } from "react-redux";
const baseURL = import.meta.env.VITE_BACKEND_URL;

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
  const [viewImage, setViewImage] = useState(null); // 🆕 For modal view

  const fetchBillByType = async (type) => {
    if (!currentUser) {
      setErrorMessage("Please sign in to view your bills.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(
        `${baseURL}/api/bill/getBillByTypes/${type}?userId=${currentUser._id}`
      );
      if (res.ok) {
        const data = await res.json();
        setFilteredBills(data.bills || []);
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
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Your Bills by Type
        </h1>

        {/* Type Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {list.map((item) => (
            <button
              key={item.id}
              onClick={() => handleButtonClick(item.type)}
              disabled={loading}
              className={`px-6 py-2 text-base font-medium rounded-full border-2 transition-all duration-200 ${
                selectedBillType === item.type
                  ? "bg-gray-700 text-white border-white shadow-md"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item.type}
            </button>
          ))}
        </div>

        {/* Status Title */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          {selectedBillType ? `Showing: ${selectedBillType}` : "No bill type selected"}
        </h2>

        {/* Messages */}
        {currentUser === null ? (
          <p className="text-center text-gray-500 text-xl font-semibold mt-10">
            Please sign in to view your bill list...
          </p>
        ) : loading ? (
          <p className="text-center text-gray-400 text-xl font-medium mt-10">
            Fetching bills...
          </p>
        ) : errorMessage ? (
          <p className="text-center text-gray-500 text-xl font-medium mt-10">
            {errorMessage}
          </p>
        ) : filteredBills.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-medium mt-10">
            No bills found. Please select a type above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBills.map((bill) => (
              <div
                key={bill._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <img
                  src={bill.billImage}
                  alt={bill.billType}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {bill.billType}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Description:</strong> {bill.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Amount:</strong> ₹{bill.amount}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Due Date:</strong>{" "}
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        bill.paymentStatus
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bill.paymentStatus ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <button
                    onClick={() => setViewImage(bill.billImage)}
                    className="mt-3 text-sm font-semibold text-blue-800 px-3 py-1 rounded-full bg-blue-200"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🖼️ View Bill Modal */}
        {viewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="relative max-w-3xl w-full px-4">
              <button
                onClick={() => setViewImage(null)}
                className="absolute top-2 right-2 text-white text-3xl hover:text-red-400"
              >
                &times;
              </button>
              <img
                src={viewImage}
                alt="Bill Full View"
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillList;
