import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaUpload } from 'react-icons/fa';
const baseURL = import.meta.env.VITE_BACKEND_URL;

const Notification = () => {
  const [notifications, setNotifications] = useState({
    dueDate: [],
    uploadReminders: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dueDate');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch both types of notifications in parallel
        const [dueDateRes, uploadRemindersRes] = await Promise.all([
          fetch(`${baseURL}/api/notifications/due-date/${currentUser._id}`),
          fetch(`${baseURL}/api/notifications/upload-reminders/${currentUser._id}`)
        ]);

        const dueDateData = await dueDateRes.json();
        const uploadRemindersData = await uploadRemindersRes.json();

        setNotifications({
          dueDate: dueDateData.data || [],
          uploadReminders: uploadRemindersData.data || []
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500 text-xl">
          Please sign in to view notifications
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalNotifications = notifications.dueDate.length + notifications.uploadReminders.length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <FaBell className="text-yellow-400 text-2xl mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications {totalNotifications > 0 && `(${totalNotifications})`}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'dueDate' ? 'text-gray-800 border-b-2 border-gray-600 font-semibold' : 'text-gray-500 font-semibold'}`}
          onClick={() => setActiveTab('dueDate')}
        >
      
          Upcoming Payments ({notifications.dueDate.length})
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${activeTab === 'uploadReminders' ? 'text-gray-800 border-b-2 border-gray-600 font-semibold' : 'text-gray-500 font-semibold'}`}
          onClick={() => setActiveTab('uploadReminders')}
        >
          
          Upload Reminders ({notifications.uploadReminders.length})
        </button>
      </div>

      {/* Notification Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'dueDate' ? (
          <DueDateNotifications notifications={notifications.dueDate} />
        ) : (
          <UploadReminderNotifications notifications={notifications.uploadReminders} />
        )}
      </div>
    </div>
  );
};

const DueDateNotifications = ({ notifications }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FaCheckCircle className="mx-auto text-3xl text-green-500 mb-3" />
        <p className="text-lg">No upcoming bill due dates</p>
        <p className="text-sm mt-1">You're all caught up!</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {notifications.map((bill, index) => (
        <li key={`due-${index}`} className="p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <FaExclamationTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {bill.billType} bill due soon
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(bill.dueDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Amount: ₹{bill.amount.toFixed(2)}
              </p>
              {!bill.paymentStatus && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Payment pending
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const UploadReminderNotifications = ({ notifications }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FaCheckCircle className="mx-auto text-3xl text-green-500 mb-3" />
        <p className="text-lg">No bill upload reminders</p>
        <p className="text-sm mt-1">All bills are uploaded!</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((reminder, index) => (
          <li key={`upload-${index}`} className="p-4 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <FaUpload className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {reminder.billType} bill not uploaded
                  </p>
                  <span className="text-xs text-gray-500">
                    Due by {new Date(reminder.expectedDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Please upload your {reminder.billType.toLowerCase()} bill
                </p>
                <div className="mt-3">
                  <button
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={() => {
                      // Navigate to upload page with bill type pre-selected
                      window.location.href = `/billType`;
                    }}
                  >
                    Upload Now
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Tip: Upload your bills by the 10th of each month to avoid reminders
        </p>
      </div>
    </div>
  );
};

export default Notification;