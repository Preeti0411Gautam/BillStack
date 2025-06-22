import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoIosNotifications } from "react-icons/io";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const currentUser = useSelector(state => state.user?.currentUser || {});
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClick = () => navigate('/login');
  const handleBillList = () => navigate("/billList");
  const handleProfile = () => navigate("/profile");
  const handleUploadBill = () => navigate("/billType");
  // const handleHistory = () => navigate("/history");
  const handleLogo = () => navigate("/");
  const handleNotification = () => navigate("/notification");
  const handleAnalytics = () => navigate("/analytics");
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!currentUser._id) return;

        const res = await fetch(`https://billstack.onrender.com/api/bill/getBillByUserId/${currentUser._id}`);
        const data = await res.json();

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 4);

        const dueSoon = data.data.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return (
            !bill.paymentStatus &&
            dueDate.getFullYear() === targetDate.getFullYear() &&
            dueDate.getMonth() === targetDate.getMonth() &&
            dueDate.getDate() === targetDate.getDate()
          );
        });

        setNotificationCount(dueSoon.length);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };

    fetchBills();
  }, [currentUser._id]);

  return (
     <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r bg-gray-800 text-gray-300 shadow-lg py-2' : 'bg-gradient-to-r bg-gray-800 text-gray-300  shadow-md py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            onClick={handleLogo} 
            className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-indigo-100 transition-colors duration-200 flex items-center"
          >
            <span className="bg-white text-indigo-900 px-2 py-1 rounded mr-2 font-extrabold">Bill</span>
            <span className="font-extrabold">Stack</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-6">
            {currentUser._id ? (
              <>
                <button 
                  onClick={handleUploadBill}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100 transition-colors duration-200"
                >
                  Upload Bill
                </button>
                <button 
                  onClick={handleBillList}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100 transition-colors duration-200"
                >
                  Bill List
                </button>
                <button 
                  onClick={handleAnalytics}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100 transition-colors duration-200"
                >
                  Analytics
                </button>

                <button 
                  onClick={handleNotification}
                  className="relative p-2 text-white hover:text-indigo-100 transition-colors duration-200"
                >
                  <IoIosNotifications size={24} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-indigo-800 text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={handleProfile}
                  className="flex items-center space-x-2 px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100 transition-colors duration-200"
                >
                  <FaUserCircle size={20} />
                  <span>{currentUser.name}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleClick}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 text-sm lg:text-base font-medium shadow-lg"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {currentUser._id && (
              <button 
                onClick={handleNotification}
                className="relative p-2 mr-2 text-white hover:text-indigo-100"
              >
                <IoIosNotifications size={24} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-indigo-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            <button 
              onClick={toggleMobileMenu}
              className="text-white hover:text-indigo-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {currentUser._id ? (
              <>
                <button 
                  onClick={handleUploadBill}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 hover:text-white rounded-md transition-colors duration-200 font-medium"
                >
                  Upload Bill
                </button>
                <button 
                  onClick={handleBillList}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 hover:text-white rounded-md transition-colors duration-200 font-medium"
                >
                  Bill List
                </button>
                <button 
                  onClick={handleAnalytics}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 hover:text-white rounded-md transition-colors duration-200 font-medium"
                >
                  Analytics
                </button>
                <button 
                  onClick={handleProfile}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 hover:text-white rounded-md transition-colors duration-200 font-medium"
                >
                  <FaUserCircle size={18} />
                  <span>{currentUser.name}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleClick}
                className="w-full px-4 py-3 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-200 text-center font-medium shadow-lg"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;