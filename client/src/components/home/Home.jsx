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
    <div >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight pb-6 text-left">
            Comprehensive Bill Management, <br className="hidden lg:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
              History, and Analytics
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed font-medium mb-10 text-left max-w-4xl">
            BillStack offers an all-inclusive solution for managing all types of bills. Track, view, and analyze your bill history effortlessly with our advanced analytics tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-amber-500 text-slate-900 py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg font-semibold shadow-md hover:bg-amber-400 transition duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/features')}
              className="border-2 border-gray-300 text-white py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg font-semibold hover:bg-slate-700 transition duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 lg:px-20 bg-white">
        <FeaturesSection />
      </section>

      {/* Feedback Form Section */}
      <section className="px-4 sm:px-8 lg:px-20 my-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 sm:p-10 shadow-md border">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">
            We Value Your <span className="text-amber-600">Feedback</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 text-center">
            Help us improve by sharing your thoughts and suggestions
          </p>
          <FeedbackForm />
        </div>
      </section>

      {/* Feedbacks Section */}
      <section className="px-4 sm:px-8 lg:px-20 pb-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 sm:p-10 shadow-md border">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">
            What Our <span className="text-amber-600">Users Say</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 text-center">
            Don't just take our word for it – hear from our community
          </p>
          <Feedbacks />
        </div>
      </section>

      {/* Connect Us Section */}
      <section className="px-4 sm:px-8 lg:px-20 pb-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 sm:p-12 shadow-md border">
          <ConnectUs />
        </div>
      </section>
    </div>
  );
};

export default Home;
