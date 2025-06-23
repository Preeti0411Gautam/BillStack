import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signoutSuccess
} from '../../redux/user/userSlice';
const baseURL = import.meta.env.VITE_BACKEND_URL;


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

      const res = await fetch(`${baseURL}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data));
        setUpdationError(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdationSuccess("Profile updated successfully!");
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      setUpdationError(err.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${baseURL}/api/user/signout`, { method: 'POST' });
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
    try {
      const res = await fetch(`${baseURL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Failed to delete user.');
        return;
      }

      alert('Account deleted successfully.');
      dispatch(signoutSuccess());
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-gray-800 mb-8">
          <CgProfile size={80} />
          <h1 className="text-3xl font-bold mt-2">Your Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              defaultValue={currentUser.username}
              placeholder="Enter username"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={currentUser.email}
              placeholder="Enter email"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Update Profile
          </button>
        </form>

        {updationSuccess && (
          <p className="mt-6 text-green-600 font-medium text-center">
            ✅ {updationSuccess}
          </p>
        )}
        {updationError && (
          <p className="mt-6 text-red-600 font-medium text-center">
            ❌ {updationError}
          </p>
        )}

        <div className="flex justify-between items-center mt-10 text-gray-800 font-semibold text-md sm:text-base">
          <button onClick={handleDelete} className="hover:underline">
            ❌ Delete Account
          </button>
          <button onClick={handleSignout} className="hover:underline">
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
