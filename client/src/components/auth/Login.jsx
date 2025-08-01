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
  const [formData, setFormData] = useState({ loginId: "", password: "" });
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "password" ? value : value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.loginId || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"));
      return;
    }

    try {
      dispatch(signInStart()); // start loading

      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: formData.loginId,
          password: formData.password,
        }),
      });

      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(signInSuccess({ user: data.user })); 
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {/* ERROR MESSAGE BOX */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            <strong className="font-semibold">Error: </strong> {error}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-lg font-semibold mb-2 text-gray-800">
            Username / Email
          </label>
          <input
            type="text"
            name="loginId"
            placeholder="Enter your username or email"
            value={formData.loginId}
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
      </form>
    </div>
  );
};

export default Login;
