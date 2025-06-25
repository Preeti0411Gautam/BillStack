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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ⬅ modal state

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center text-gray-800 mb-8">
          <CgProfile size={80} />
          <p className="text-2xl font-bold mt-2">{formData.username}</p>
          <p>{formData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
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
          <p className="mt-6 text-green-600 font-medium text-center">{updationSuccess}</p>
        )}
        {updationError && (
          <p className="mt-6 text-red-600 font-medium text-center">{updationError}</p>
        )}

        <div className="flex justify-between items-center mt-10 text-gray-800 font-semibold text-md sm:text-base">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="border px-2 py-2 rounded-md bg-red-200 text-red-600"
          >
            Delete Account
          </button>
          <button
            onClick={handleSignout}
            className="border px-2 py-2 rounded-md bg-gray-300 text-gray-800"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your account? This action is irreversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
