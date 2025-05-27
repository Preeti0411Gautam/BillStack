import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] =useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   if(!formData.username || !formData.email || !formData.password){
           return setErrorMessage("Please provide all details")
   }
    try {

      setLoading(true);
      setErrorMessage(null);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success ===false) {
         return setErrorMessage(data.message)

      } 
    if(response.ok){
      navigate("/login"); // Redirect to login page on success
    }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="border p-8 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-4xl font-bold mb-10 text-center text-red-800">
          Sign Up
        </h2>

      

       
        <div className="mb-8">
          <label  className="block  text-red-800 font-semibold text-xl pb-4">
          Username
            </label>
    
          <input
            name="username"
            type="text"
            placeholder="Enter Your Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-800"
            required
          />
        </div>

      
        <div className="mb-8">
          <label  className="block  text-red-800 font-semibold text-xl pb-4">Name</label>
          
          <input
            name="name"
            type="text"
            placeholder="Enter Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-800"
            required
          />
        </div>

 
        <div className="mb-8">
          <label className="block  text-red-800 font-semibold text-xl pb-4">Email</label>
           
          <input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-800"
            required
          />
        </div>

       
        <div className="mb-8">
          <label className="block  text-red-800 font-semibold text-xl pb-4">Password</label>
           
          <input
            name="password"
            type="password"
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
          className="mb-8 w-full bg-red-800 text-white py-2 rounded-lg transition duration-200 hover:bg-red-700"
        >
          {
            loading ? ("loading..."): "Sign Up"
          }
        </button>

        {
          errorMessage && (
            <p className="mt-5 ">{errorMessage}</p>
          )
        }
         {/* Redirect to Login */}
      <div className="text-center">
          Already Have An Account?{" "}
          <Link to="/login">
            <strong className="underline text-red-800">Login</strong>
          </Link>
        </div>
      </form>

     

       
    </div>
  );
};

export default Signup;
