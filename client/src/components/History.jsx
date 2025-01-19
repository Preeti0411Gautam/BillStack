import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch(`/api/payment/history/${currentUser._id}`, {
        method: "GET",
      });
      const data = await res.json();

      if (data.success) {
        setPaymentHistory(data.history); // Assuming the response contains the 'history' key
      } else {
        setError("Failed to fetch payment history.");
      }
    } catch (err) {
      setError("An error occurred while fetching payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPaymentHistory();
    }
  }, [currentUser]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {currentUser === null ? (
        <div className="text-center text-3xl font-semibold text-gray-400">
          Please sign in to view Transaction History...
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Transaction History
          </h1>
  
          {loading && <div className="text-center text-gray-600">Loading...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
  
          {!loading && !error && (!paymentHistory || paymentHistory.length === 0) && (
            <div className="text-center text-gray-500">
              No payment history available.
            </div>
          )}
  
          {!loading && !error && paymentHistory && paymentHistory.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th scope="col" className="border px-4 py-2 text-left">
                      Payment ID
                    </th>
                    <th scope="col" className="border px-4 py-2 text-left">
                      Method
                    </th>
                    <th scope="col" className="border px-4 py-2 text-left">
                      Created On
                    </th>
                    <th scope="col" className="border px-4 py-2 text-left">
                      Amount
                    </th>
                    <th scope="col" className="border px-4 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="border px-4 py-2 font-mono">
                        {payment.transactionId || "N/A"}
                      </td>
                      <td className="border px-4 py-2 uppercase">
                        {payment.paymentMethod || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {payment.created_on
                          ? new Date(payment.created_on).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="border px-4 py-2 font-semibold text-gray-800">
                        {payment.amount} {payment.currency || "INR"}
                      </td>
                      <td
                        className={`border px-4 py-2 font-semibold ${
                          payment.status === "Completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {payment.status || "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default History;
