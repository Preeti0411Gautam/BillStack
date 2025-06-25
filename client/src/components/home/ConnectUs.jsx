import { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail, MdConnectWithoutContact } from "react-icons/md";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const ConnectUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { name, email, message } = formData;

    try {
      const res = await fetch(`${baseURL}/api/contact-us/upload`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
    <div className="max-w-5xl mx-auto px-6 py-16 transition-all duration-300">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-indigo-100 dark:bg-gray-700 p-4 rounded-full mb-4 shadow-md">
          <MdConnectWithoutContact size={40} className="text-gray-600 dark:text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-center text-gray-500">
          Connect With Us
        </h1>
        <span className="mt-2 inline-block bg-indigo-200 text-blue-800 text-sm font-medium px-4 py-1 rounded-full tracking-wide shadow-sm">
          We'd love to hear from you
        </span>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mb-10">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-blue-600 hover:scale-110 transition-transform duration-150" size={30} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-600 hover:scale-110 transition-transform duration-150" size={30} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-blue-800 hover:scale-110 transition-transform duration-150" size={30} />
        </a>
        <a href="mailto:contact@example.com">
          <MdOutlineMail className="text-red-600 hover:scale-110 transition-transform duration-150" size={30} />
        </a>
      </div>

      {/* Contact Form */}
      <div className=" dark:bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
          Get in Touch Now
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your message..."
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
          ></textarea>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gray-800 text-white font-semibold py-3 rounded-md shadow hover:bg-gray-900 transition-all duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {successMessage && (
            <p className="text-green-600 text-center font-medium animate-fadeIn">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="text-red-600 text-center font-medium animate-fadeIn">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ConnectUs;
