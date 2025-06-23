import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
const baseURL = import.meta.env.VITE_BACKEND_URL;


const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"));
      return;
    }

    try {
      dispatch(signInStart());

      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8 sm:p-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
          Login
        </h2>

        <div className="mb-8">
          <label className="block text-lg font-semibold mb-2 text-gray-800">
            Username / Email
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username or email"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-lg font-semibold mb-2 text-gray-800">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-gray-800 text-white py-2 font-semibold rounded-lg hover:bg-gray-900 transition disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-800 font-semibold underline hover:text-gray-900"
          >
            Create an Account
          </Link>
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
