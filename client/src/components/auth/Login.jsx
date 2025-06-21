import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

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

      const response = await fetch("/api/auth/login", {
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
    <div className="flex justify-center items-center min-h-screen font-mono">
      <form
        className="w-full max-w-sm bg-white border rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-red-800">
          Login
        </h2>

        <div className="mb-8">
          <label className="block text-red-800 font-semibold text-xl mb-4">
            Username / Email
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username or Email"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-800"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-red-800 font-semibold text-xl mb-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-800"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-red-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-900 transition-colors disabled:opacity-70"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="p-2 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-red-800 font-bold">
            Create an Account
          </Link>
        </p>

        {error && (
          <p className="p-2 mt-2 text-red-800 text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;