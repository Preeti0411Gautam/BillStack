import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, name, email, password } = formData;

    if (!username || !name || !email || !password) {
      return setErrorMessage("Please provide all details");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return setErrorMessage(data.message || "Something went wrong");
      }

      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 shadow-xl p-8 rounded-2xl"
      >
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
          Sign Up
        </h2>



        {errorMessage && (
          <p className="mt-5 text-center text-red-600 font-medium">
            {errorMessage}
          </p>
        )}
        
        <div className="mb-8">
          <label className="block text-xl font-semibold text-gray-800 mb-3">
            Username
          </label>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-xl font-semibold text-gray-800 mb-3">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-xl font-semibold text-gray-800 mb-3">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-xl font-semibold text-gray-800 mb-3">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-gray-800 text-white font-medium py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>


        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline text-gray-800 hover:text-gray-900"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
