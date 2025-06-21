import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const StarRating = ({ rating, setRating }) => {
  const handleClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="flex justify-center space-x-2">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          className={`cursor-pointer text-4xl transition duration-200 ${
            index < rating ? 'text-yellow-400 hover:scale-125' : 'text-gray-300'
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
      if (!data.success) {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-10 sm:py-16 px-6 sm:px-10">
      <h1 className="text-3xl sm:text-5xl text-center font-bold mb-6 sm:mb-10 text-gray-800">
        We Value Your Opinion {currentUser ? currentUser.name : ''}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-lg sm:max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <label className="block font-semibold text-xl sm:text-2xl text-gray-700 mb-2">
            How would you rate your overall experience?
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div className="mb-6 text-center">
          <label className="block font-semibold text-xl sm:text-2xl text-gray-700 mb-2">
            Kindly take a moment to tell us what you think.
          </label>
          <textarea
            id="feedback"
            name="feedback"
            rows="5"
            placeholder="Share your feedback here..."
            onChange={handleChange}
            className="w-full p-4 border border-black rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-800"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-red-800 text-white font-medium p-3 rounded-md text-lg sm:text-xl hover:bg-red-700 transition duration-300"
        >
          Share My Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
