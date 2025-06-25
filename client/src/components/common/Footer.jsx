import React from 'react';
import { FaRegCopyright } from "react-icons/fa";
     import { Link } from "react-router-dom";


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
     

<div className="mt-6">
  <ul className="flex flex-wrap justify-center space-x-6 text-sm font-medium text-gray-400">
    <li>
      <Link to="/about" className="hover:text-white hover:underline">
        About Us
      </Link>
    </li>
    <li>
      <Link to="/contact" className="hover:text-white hover:underline">
        Contact Us
      </Link>
    </li>
    <li>
      <Link to="/faq" className="hover:text-white hover:underline">
        FAQ
      </Link>
    </li>
    
  </ul>
</div>

    </footer>
  );
};

export default Footer;