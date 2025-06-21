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

      const response = await fetch(
        `https://billstack.onrender.com/api/bill/getBillByUserId/${currentUser._id}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();

      const currentDate = new Date();
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + 4);

      const filteredBills = data.data
        .filter((bill) => {
          const dueDate = new Date(bill.dueDate);
          return (
            !bill.paymentStatus &&
            dueDate >= currentDate &&
            dueDate <= targetDate
          );
        })
        .map((bill) => ({
          billType: bill.billType,
          dueDate: new Date(bill.dueDate).toLocaleDateString(),
        }));

      setFilteredData(filteredBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    const interval = setInterval(fetchBills, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center text-3xl font-semibold text-gray-400 mt-10">
        Please sign in to see notifications...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-xl text-gray-500 mt-10">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-xl text-gray-600 mt-10">
        Nothing to show..
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <ul className="space-y-6">
        {filteredData.length > 0 ? (
          filteredData.map((bill, index) => (
            <li
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <p className="text-gray-800 font-bold text-xl mb-2">
                Upcoming Due Date
              </p>
              <p className="text-lg text-gray-700">
                Your <span className="font-semibold">{bill.billType}</span> bill is due on
                <span className="text-red-600 font-semibold ml-2">{bill.dueDate}</span>
              </p>
            </li>
          ))
        ) : (
          <p className="text-center text-2xl font-semibold text-gray-400 mt-10">
            No upcoming bills...
          </p>
        )}
      </ul>
    </div>
  );
};

export default Notification;
