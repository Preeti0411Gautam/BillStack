import PreferencesForm from "./PreferencesForm";
import Profile from "./Profile";
import Sidebar from "./Sidebar";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

const SettingsPage = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("preferences")) return "Preferences";
    return "Profile";
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="sm:w-64 p-4">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {getTitle()}
          </h2>
          <div className="bg-white p-6 rounded-lg">
            <Routes>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="preferences" element={<PreferencesForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
