import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';

const StarRating = ({ rating, setRating }) => {
  const handleClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="flex justify-center sm:justify-start space-x-2">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          className={`cursor-pointer text-3xl sm:text-4xl transition duration-200 ${
            index < rating ? 'text-amber-400 hover:scale-125' : 'text-gray-400 hover:text-amber-200'
          }`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({ feedback: '', name: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://billstack.onrender.com/api/feedback/upload/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser._id,
          rating,
          name: currentUser.name,
          date: new Date().toLocaleDateString('en-GB'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        setRating(0);
        setFormData({ feedback: '', name: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sm:py-16 px-6  min-h-[90vh]">
      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in">
          <IoCheckmarkDoneCircle className="mr-2 text-xl" />
          Feedback submitted successfully!
        </div>
      )}

      {/* Feedback Section */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row bg-white rounded-2xl  border border-indigo-100 overflow-hidden">
        {/* Left Side */}
        <div className="sm:w-1/2 bg-gradient-to-br from-yellow-50 via-gray-200 to-white p-8 sm:p-12 flex flex-col justify-center text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            We Value Your Opinion{currentUser?.name ? `, ${currentUser.name}` : ''}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Your feedback helps us improve and serve you better. Please take a moment to share your thoughts.
          </p>
        
        </div>

        {/* Right Side (Form) */}
        <form
          onSubmit={handleSubmit}
          className="sm:w-1/2 w-full bg-white p-6 sm:p-10 transition-all duration-300"
        >
          <div className="mb-2">
            <label className="block font-semibold text-lg sm:text-xl text-gray-800 mb-3">
              How would you rate your overall experience?
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-lg sm:text-xl text-gray-800 mb-2">
              Kindly take a moment to tell us what you think
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows="5"
              value={formData.feedback}
              placeholder="Share your feedback here..."
              onChange={handleChange}
              className="w-full p-4 border border-indigo-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition duration-300 ${
              rating === 0
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            Share My Feedback
          </button>
        </form>
      </div>

      {/* Custom Animation for Success Toast */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            top: 0;
          }
          to {
            opacity: 1;
            top: 5rem;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackForm;
