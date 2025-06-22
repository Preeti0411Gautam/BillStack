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
          className={`cursor-pointer text-2xl sm:text-3xl md:text-4xl transition duration-200 ${
            index < rating
              ? 'text-amber-400 hover:scale-125'
              : 'text-gray-400 hover:text-amber-200'
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
        headers: { 'Content-Type': 'application/json' },
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
    <div className="py-10 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Toast Message */}
      {isSubmitted && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fade-in text-sm sm:text-base">
          <IoCheckmarkDoneCircle className="mr-2 text-xl" />
          Feedback submitted successfully!
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-md">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-yellow-50 via-gray-200 to-white p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            We Value Your Opinion{currentUser?.name ? `, ${currentUser.name}` : ''}
          </h1>
          <p className="text-base sm:text-lg text-gray-700">
            Your feedback helps us improve and serve you better. Please take a moment to share your thoughts.
          </p>
        </div>

        {/* Right Side (Form) */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 bg-white p-6 sm:p-10 space-y-6"
        >
          <div>
            <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-2">
              How would you rate your overall experience?
            </label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div>
            <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-2">
              Kindly take a moment to tell us what you think
            </label>
            <textarea
              id="feedback"
              rows="5"
              value={formData.feedback}
              placeholder="Share your feedback here..."
              onChange={handleChange}
              className="w-full p-4 border border-gray-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className={`w-full py-3 px-6 rounded-lg text-base sm:text-lg font-semibold transition duration-300 ${
              rating === 0
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            Share My Feedback
          </button>
        </form>
      </div>

      {/* Animation for Toast */}
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
