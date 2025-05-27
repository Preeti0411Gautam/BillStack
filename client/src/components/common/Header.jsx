import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoIosNotifications } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const currentUser = useSelector(state => state.user?.currentUser || {});
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = () => {
    navigate('/login');
  };

  const handleBillList = () => {
    navigate("/billList");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleUploadBill = () => {
    navigate("/billType");
  };

  const handleHistory = () => {
    navigate("/history");
  }

  const handleLogo = () => {
    navigate("/");
  };

  const handleNotification = () => {
    navigate("/notification");
  };

  const handleAnalytics = () => {
    navigate("/analytics");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!currentUser._id) return;

        const response = await fetch(`/api/bill/getBillByUserId/${currentUser._id}`, {
          method: "GET"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bills");
        }

        const data = await response.json();

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 4);

        const filteredBills = data.data.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return (
            bill.paymentStatus !== true &&
            dueDate.getFullYear() === targetDate.getFullYear() &&
            dueDate.getMonth() === targetDate.getMonth() &&
            dueDate.getDate() === targetDate.getDate()
          );
        });

        setNotificationCount(filteredBills.length);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBills();
  }, [currentUser._id]);

  return (
    <header className="p-4 sm:p-8 bg-white shadow-lg">
      <div className="flex justify-between items-center">
        <div onClick={handleLogo} className="text-3xl sm:text-4xl font-bold text-red-800 cursor-pointer pr-6">
          BillStack
        </div>

        <div className="sm:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={25} /> : <FaBars size={30} />}
        </div>

        {/* Merged Navigation */}
        <nav className={`sm:flex ${isMobileMenuOpen ? 'block' : 'hidden'} sm:block transition-all duration-300`}>
          <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 text-red-800 font-medium">
            {currentUser._id ? (
              <>
                <li onClick={handleUploadBill} className="hover:text-red-600">Upload Bill</li>
                <li onClick={handleBillList} className="hover:text-red-600">Bill List</li>
                <li onClick={handleAnalytics} className="hover:text-red-600">Analytics</li>
                <li onClick={handleHistory} className="hover:text-red-600">Expense History</li>
                <li className="relative hover:text-red-600">
                  <p onClick={handleNotification} className="relative cursor-pointer">
                    <IoIosNotifications size={30} />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </p>
                </li>
                <li className="hover:text-red-600">
                  <p onClick={handleProfile}>{currentUser.name}</p>
                </li>
              </>
            ) : (
              <li onClick={handleClick} className="hover:text-red-600">
                Sign In
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
