import { CgProfile } from "react-icons/cg";
import { MdNotificationsNone } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-full sm:w-72 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-7 border-b border-gray-200 bg-gradient-to-r from-gray-100 to-white">
        <CgProfile size={40} className="text-gray-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h2>
          <p className="text-sm text-gray-500">Manage your account</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col py-4 gap-1">
        <NavLink
          to="/settings/profile"
          end
          className={({ isActive }) =>
            `flex items-center px-7 py-4 text-base font-medium rounded-r-full transition-all duration-300 ${
              isActive
                ? "bg-indigo-100 text-gray-700 border-r-4 border-gray-500 shadow-inner"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-600"
            }`
          }
        >
          <CgProfile className="mr-4 text-xl" />
          Profile
        </NavLink>

        <NavLink
          to="/settings/preferences"
          className={({ isActive }) =>
            `flex items-center px-7 py-4 text-base font-medium rounded-r-full transition-all duration-300 ${
              isActive
                ? "bg-indigo-100 text-gray-700 border-r-4 border-gray-500 shadow-inner"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-600"
            }`
          }
        >
          <MdNotificationsNone className="mr-4 text-xl" />
          Notification Preferences
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
