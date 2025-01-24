import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signoutSuccess
} from '../redux/user/userSlice';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updationSuccess, setUpdationSuccess] = useState(null);
  const [updationError, setUpdationError] = useState(null);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdationError(null);
    setUpdationSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdationError('No changes made');
      return;
    }

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data));
        setUpdationError(data.message);
        return;
      } else {
        dispatch(updateUserSuccess(data));
        setUpdationSuccess("User's profile updated successfully");
      }
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      setUpdationError(err.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
 

  const handleDelete = async () => {
    console.log(currentUser)
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const data = await res.json();
        console.error(`Error ${res.status}: ${data.message || 'An error occurred'}`);
        alert(data.message || 'Failed to delete user. Please try again.');
        return;
      }
  
      // If the API call is successful
      alert('User deleted successfully');
      dispatch(signoutSuccess());
    } catch (err) {
      console.error('Network error:', err.message);
      alert('Network error. Please check your connection and try again.');
    }
  };
  
  
  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="bg-white rounded-lg p-6 w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-red-800">Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border p-6 sm:p-10 w-full"
        >
          <div className="flex justify-center mb-7">
            <CgProfile size={100} className="text-red-800" />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-4 text-xl">Username</label>
            <input
              defaultValue={currentUser.username}
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-4 text-xl">Email</label>
            <input
              defaultValue={currentUser.email}
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-4 text-xl">Password</label>
            <input
              type="password"
              name="password"
              placeholder="*********"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Update
          </button>
        </form>

        {updationSuccess && (
          <p className="mt-5 text-green-600 font-semibold">{updationSuccess}</p>
        )}
        {updationError && (
          <p className="mt-5 text-red-600 font-semibold">{updationError}</p>
        )}

        <div className="text-red-800 font-bold text-lg flex justify-between mt-8">
          <span 
          onClick={handleDelete}
          className="hover:underline mr-10 cursor-pointer">Delete Account</span>
          <span
            onClick={handleSignout}
            className="hover:underline ml-10 cursor-pointer"
          >
            Sign out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
