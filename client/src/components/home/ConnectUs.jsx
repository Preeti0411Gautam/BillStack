import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

const ConnectUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { name, email, message } = formData;

    try {
      const res = await fetch(`https://billstack.onrender.com/api/contact-us/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setFormData({ name: "", email: "", message: "" });
      setSuccessMessage("Message sent successfully!");
    } catch (error) {
      setErrorMessage(error.message || "Network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-gray-200 to-white py-10 px-4 sm:px-8 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 sm:mb-10">
          Connect With Us!
        </h1>

        {/* Social Icons */}
        <div className="flex justify-center flex-wrap gap-6 mb-10">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={30} className="text-blue-600 cursor-pointer hover:scale-110 transition-transform" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={30} className="text-pink-600 cursor-pointer hover:scale-110 transition-transform" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} className="text-blue-800 cursor-pointer hover:scale-110 transition-transform" />
          </a>
          <a href="mailto:contact@example.com">
            <MdOutlineMail size={30} className="text-red-600 cursor-pointer hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 md:p-10 border border-indigo-100">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-6 sm:mb-8">
            Get in Touch Now
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <input
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              type="text"
              placeholder="Name"
              required
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-base sm:text-lg"
            />
            <input
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-base sm:text-lg"
            />
            <textarea
              name="message"
              id="message"
              onChange={handleChange}
              value={formData.message}
              placeholder="Message"
              rows="5"
              required
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-400 outline-none text-base sm:text-lg"
            ></textarea>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gray-700 text-white font-semibold py-3 sm:py-3.5 rounded-md shadow hover:shadow-lg transition-all duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {successMessage && (
              <p className="text-green-600 text-center font-semibold text-sm sm:text-base">
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p className="text-red-600 text-center font-semibold text-sm sm:text-base">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectUs;
