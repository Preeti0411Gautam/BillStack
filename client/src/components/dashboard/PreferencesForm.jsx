import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { FaTrashAlt, FaPlus } from 'react-icons/fa';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const PreferencesForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [billPreferences, setBillPreferences] = useState([]);
  const [message, setMessage] = useState('');

  const allBillTypes = ['Electricity', 'Water', 'Gas', 'Internet', 'Rent', 'Other'];

  useEffect(() => {
    if (!currentUser) return;

    const fetchPreferences = async () => {
      try {
        const response = await fetch(`${baseURL}/api/user/preferences/${currentUser._id}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (response.ok) {
          setBillPreferences(data.preferences || []);
        } else {
          console.error(data.message || 'Failed to fetch preferences');
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [currentUser._id]);

  const handleAddPreference = (preferenceToAdd) => {
    if (!billPreferences.includes(preferenceToAdd)) {
      setBillPreferences(prev => [...prev, preferenceToAdd]);
    }
  };
  
  const handleDeletePreference = (preferenceToDelete) => {
    setBillPreferences(prev => prev.filter(pref => pref !== preferenceToDelete));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/api/user/preferences/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": Cookies.get("csrf_token"),
        },
        credentials: "include",
        body: JSON.stringify({ preferences: billPreferences }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Preferences updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Error updating preferences');
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage('Network error occurred');
    }
  };

  const availableOptions = allBillTypes.filter(type => !billPreferences.includes(type));

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl overflow-hidden">

      <div className="p-5 text-gray-700 bg-gray-200 border rounded-lg">
        <h2 className="text-2xl font-bold text-center">Notification Preferences</h2>
      </div>
      
      <div className="p-8">
        <form onSubmit={handleSubmit}>
          {/* My Current Preferences Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-800 p-1.5 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
              My Current Preferences
            </h3>
            {billPreferences.length > 0 ? (
              <ul className="space-y-3">
                {billPreferences.map((type) => (
                  <li key={type} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 transition">
                    <span className="text-gray-800 font-medium">{type}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePreference(type)}
                      className="text-red-500 hover:text-white hover:bg-red-500 rounded-full p-2 transition-all duration-200"
                      aria-label={`Remove ${type}`}
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
                <p className="text-gray-500">No preferences added yet.</p>
              </div>
            )}
          </div>
  
          {/* Available Options Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </span>
              Available Options
            </h3>
            {availableOptions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddPreference(type)}
                    className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 font-medium py-3 px-4 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FaPlus size={14} />
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-dashed border-blue-200 text-center">
                <p className="text-blue-700">All options have been added!</p>
              </div>
            )}
          </div>
  
          <button
            type="submit"
            className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-gray-600 active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            Save All Changes
          </button>
        </form>
        
        {message && (
          <div className={`mt-6 text-center text-sm font-medium p-3 rounded-lg transition-all duration-300 ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default PreferencesForm;