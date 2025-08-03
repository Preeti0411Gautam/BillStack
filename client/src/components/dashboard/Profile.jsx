import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  signoutSuccess,
} from "../../redux/user/userSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    username: currentUser.username || "",
    email: currentUser.email || "",
    password: "",
  });

  const [updationSuccess, setUpdationSuccess] = useState(null);
  const [updationError, setUpdationError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "password" ? value : value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdationError(null);
    setUpdationSuccess(null);

    const updatedFields = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value && value !== currentUser[key]) acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(updatedFields).length === 0) {
      return setUpdationError("No changes made.");
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`${baseURL}/api/user/update/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": Cookies.get("csrf_token"),
        },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        setUpdationError(data.message || "Failed to update.");
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
      const res = await fetch(`${baseURL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": Cookies.get("csrf_token"),
        },
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message || "Signout failed");
      } else {
        dispatch(signoutSuccess());
        navigate("/login");
      }
    } catch (err) {
      console.log("Error during signout:", err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${baseURL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": Cookies.get("csrf_token"),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setShowDeleteModal(false);
        return alert(data.message || "Failed to delete user.");
      }

      dispatch(signoutSuccess());
      navigate("/signup");
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen  py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl overflow-hidden">
        <div className="p-8 flex items-center space-x-6">
          <CgProfile size={80} className="text-gray-800" />
          <div className="text-gray-800">
            <h2 className="text-3xl font-bold">{formData.username}</h2>
            <p className="text-sm">{formData.email}</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition duration-200"
              >
                Update Profile
              </button>

              {updationSuccess && <p className="mt-4 text-green-600">{updationSuccess}</p>}
              {updationError && <p className="mt-4 text-red-600">{updationError}</p>}
            </div>
          </form>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Delete Account
            </button>
            <button
              onClick={handleSignout}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;