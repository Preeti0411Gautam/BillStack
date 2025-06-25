import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoIosNotifications } from 'react-icons/io';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserId = currentUser?._id;
  const currentUserName = currentUser?.name;
  const isLoggedIn = Boolean(currentUserId);

  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const requireLogin = (callback) => {
    if (!isLoggedIn) navigate('/login');
    else callback();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      if (!currentUserId) return;
      try {
        const res = await fetch(`${baseURL}/api/bill/getBillByUserId/${currentUserId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (!Array.isArray(data.data)) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 4);

        const dueSoon = data.data.filter((bill) => {
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
        console.error('Error fetching bills:', err);
      }
    };

    fetchBills();
  }, [currentUserId]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-800 text-gray-300 shadow-lg py-2'
          : 'bg-gray-800 text-gray-300 shadow-md py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div
            onClick={() => navigate('/')}
            className="text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-indigo-100 flex items-center"
          >
            <span className="bg-white text-indigo-900 px-2 py-1 rounded mr-2 font-extrabold">
              Bill
            </span>
            <span className="font-extrabold">Stack</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => requireLogin(() => navigate('/billType'))}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100"
                >
                  Upload Bill
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/billList'))}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100"
                >
                  Bill List
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/analytics'))}
                  className="px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100"
                >
                  Analytics
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/notification'))}
                  className="relative p-2 text-white hover:text-indigo-100"
                >
                  <IoIosNotifications size={24} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-indigo-800 text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/profile'))}
                  className="flex items-center space-x-2 px-3 py-2 text-sm lg:text-base font-medium text-white hover:text-indigo-100"
                >
                  <FaUserCircle size={20} />
                  <span>{currentUserName}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 hover:text-indigo-700 shadow-lg text-sm lg:text-base font-medium"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && (
              <button
                onClick={() => requireLogin(() => navigate('/notification'))}
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
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-white hover:text-indigo-100"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => requireLogin(() => navigate('/billType'))}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 rounded-md"
                >
                  Upload Bill
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/billList'))}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 rounded-md"
                >
                  Bill List
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/analytics'))}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 rounded-md"
                >
                  Analytics
                </button>
                <button
                  onClick={() => requireLogin(() => navigate('/profile'))}
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 text-white hover:bg-indigo-400/20 rounded-md"
                >
                  <FaUserCircle size={18} />
                  <span>{currentUserName}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 bg-white text-indigo-600 rounded-md hover:bg-indigo-100 text-center font-medium shadow-lg"
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
