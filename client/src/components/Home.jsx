import React from 'react';
import FeedbackForm from './FeedbackForm';
import Feedbacks from './Feedbacks';
import ConnectUs from './ConnectUs';
import FeaturesSection from './FeatureSection';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-gray-400 text-white py-20 px-6 sm:px-10 rounded-b-3xl rounded-t-3xl shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight pb-6 text-left">
          Comprehensive Bill Management, History, and Analytics
        </h1>
        <p className="text-lg sm:text-xl text-gray-100 leading-relaxed max-w-full sm:max-w-3xl font-medium mb-8 text-left">
          BillStack offers an all-inclusive solution for managing all types of bills. Track, view, and analyze your bill history effortlessly with our advanced analytics tools. Keep all your bill information in one secure place and gain insights to manage your finances better.
        </p>
        <div className="flex justify-start">
          <button
            onClick={handleGetStarted}
            className="bg-white text-red-800 py-3 px-8 rounded-3xl text-lg font-medium shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 sm:px-10 text-left">
        <FeaturesSection />
      </div>

      {/* Feedback Form Section */}
      <div className="py-16 px-6 sm:px-10 text-left">
        <FeedbackForm />
      </div>

      {/* Feedbacks Section */}
      <div className="py-16 px-6 sm:px-10 text-left">
        <Feedbacks />
      </div>

      {/* Connect Us Section */}
      <div className="py-16 px-6 sm:px-10 text-left">
        <ConnectUs />
      </div>
    </div>
  );
};

export default Home;
