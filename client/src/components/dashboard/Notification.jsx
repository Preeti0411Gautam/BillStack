import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Notification = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const fetchBills = async () => {
    try {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      const response = await fetch(`https://billstack.onrender.com/api/bill/getBillByUserId/${currentUser._id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();

      // Get the current date and target date (4 days from now)
      const currentDate = new Date();
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + 4);

      // Filter bills based on dueDate and paymentStatus
      const filteredBills = data.data
        .filter((bill) => {
          const dueDate = new Date(bill.dueDate);
          return (
            !bill.paymentStatus && // Only unpaid bills
            dueDate >= currentDate && // Due date is in the future
            dueDate <= targetDate // Due date is within 4 days
          );
        })
        .map((bill) => ({
          billType: bill.billType,
          dueDate: new Date(bill.dueDate).toLocaleDateString(), // Format the date
        }));

      setFilteredData(filteredBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Polling to fetch bills every 5 minutes
  useEffect(() => {
    fetchBills();
    const interval = setInterval(fetchBills, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center text-3xl font-semibold text-gray-400">
        Please Sign in to see notifications...
      </div>
    );
  }

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <ul className="space-y-6">
        {filteredData.length !== 0 ? (
          filteredData.map((bill, index) => (
            <li
              key={index}
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <p className="text-red-800 font-bold text-2xl pb-4">
                Upcoming Due Date:
              </p>
              <p className="text-lg">
                <span className="font-semibold">{bill.billType}</span> bill due on
                <em className="text-red-400 ml-2">{bill.dueDate}</em>
              </p>
            </li>
          ))
        ) : (
          <p className="text-center text-3xl text-gray-400">
            No upcoming bills...
          </p>
        )}
      </ul>
    </div>
  );
};

export default Notification;
