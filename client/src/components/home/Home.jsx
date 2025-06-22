import React from 'react';
import FeedbackForm from '../common/FeedbackForm';
import Feedbacks from './Feedbacks';
import ConnectUs from './ConnectUs';
import FeaturesSection from '../common/FeatureSection';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-b">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-24 px-6 sm:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight pb-6 text-left">
            Comprehensive Bill Management, <br className="hidden lg:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
              History, and Analytics
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl font-medium mb-10 text-left">
            BillStack offers an all-inclusive solution for managing all types of bills. Track, view, and analyze your bill history effortlessly with our advanced analytics tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-amber-500 text-slate-900 py-3 px-8 rounded-lg text-lg font-semibold shadow-lg hover:bg-amber-400 transition duration-300 transform hover:scale-[1.02]"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/features')}
              className="border-2 border-gray-300 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-slate-700 transition duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="sm:px-10 lg:px-20 bg-white text-white mx-auto">
        <FeaturesSection />
      </div>

      {/* Feedback Form Section */}
      <div className="sm:px-10 lg:px-20 bg-white text-white mx-4 sm:mx-10 my-10 rounded-xl shadow-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">
            We Value Your <span className="text-amber-600">Feedback</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10 text-center">
            Help us improve by sharing your thoughts and suggestions
          </p>
          <FeedbackForm />
        </div>
      </div>

      {/* Feedbacks Section */}
      <div className="px-6 sm:px-10 lg:px-20 bg-white text-white">
        <div className=" rounded-xl p-8 sm:p-10 border border-slate-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">
            What Our <span className="text-amber-600">Users Say</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10 text-center">
            Don't just take our word for it - hear from our community
          </p>
          <Feedbacks />
        </div>
      </div>

      {/* Connect Us Section */}
      <div className="sm:px-10 lg:px-20 bg-white text-white">
        <div className="max-w-6xl mx-auto rounded-xl p-8 sm:p-12">
          <ConnectUs />
        </div>
      </div>
    </div>
  );
};

export default Home;