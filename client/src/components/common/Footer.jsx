import React from 'react';
import { FaRegCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 p-8 border-t border-gray-700">
      {/* Brand Name */}
      <div className="text-4xl font-bold text-center text-white mb-4">
        BillStack
      </div>

      {/* Copyright Information */}
      <div className="text-center text-gray-400 text-lg mb-6">
        <div className="flex items-center justify-center">
          <FaRegCopyright size={16} className="mr-1" />
          <span>2024 BillStack, Inc. All rights reserved.</span>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6">
        <ul className="flex flex-wrap justify-center space-x-6 text-sm font-medium">
          <li className="hover:text-white hover:underline cursor-pointer">
            Legal Stuff
          </li>
          <li className="hover:text-white hover:underline cursor-pointer">
            Privacy Policy
          </li>
          <li className="hover:text-white hover:underline cursor-pointer">
            Security
          </li>
          <li className="hover:text-white hover:underline cursor-pointer">
            Website Accessibility
          </li>
          <li className="hover:text-white hover:underline cursor-pointer">
            Manage Cookies
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;