import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Notification = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);

  const fetchBills = async () => {
    try {
      if (!currentUser._id) return;

      setLoading(true);
      setError(null);

      const response = await fetch(`/api/bill/getBillByUserId/${currentUser._id}`, { 
        method: "GET"
       });

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }

      const data = await response.json();
      // console.log("data", data.data);

      // Calculate target date which is 4 days from current date
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 4);

      // Extract billType and dueDate, and filter based on dueDate
      const filteredBills = data.data.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return (
          dueDate.getFullYear() === targetDate.getFullYear() &&
          dueDate.getMonth() === targetDate.getMonth() &&
          dueDate.getDate() === targetDate.getDate()
        );
      }).map(bill => ({
        billType: bill.billType,
        dueDate: bill.dueDate
      }));

      setFilteredData(filteredBills);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [currentUser._id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* <h1>Notifications</h1> */}
      <ul>
          {filteredData.length !== 0 ? (
            filteredData.map((bill, index) => (
              <li key={index} className='font-semibold text-xl'>
                <p className='text-red-800 font-bold pb-4 text-2xl'>Upcoming due date :</p>
                <p>{bill.billType} bill due on <em className='text-red-400'>{bill.dueDate.slice(0, 10)}</em></p>
              </li>
            ))
          ) : (
            <p>Nothing to Show</p>
          )}
       </ul>

    </div>
  );
};

export default Notification;
