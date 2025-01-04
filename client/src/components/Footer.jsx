import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaRegCopyright } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-40 text-gray-800 p-8">
      {/* Social Media Links */}
       <div className="flex justify-center space-x-6 mb-8">
                      <FaFacebook
                          size={40}
                          className="text-blue-600 cursor-pointer "
                      />
                      <FaInstagram
                          size={40}
                          className="text-pink-600 cursor-pointer hover:scale-110 hover:text-pink-700 transition duration-300"
                      />
                      <FaLinkedin
                          size={40}
                          className="text-blue-800 cursor-pointer hover:scale-110 hover:text-blue-900 transition duration-300"
                      />
                      <MdOutlineMail
                          size={40}
                          className="text-red-600 cursor-pointer hover:scale-110 hover:text-red-700 transition duration-300"
                      />
                  </div>
      {/* Brand Name */}
      <div className="text-4xl font-extrabold text-center text-red-800 mb-4">
        BillStack
      </div>

      {/* Copyright Information */}
      <div className="text-center text-red-800 font-bold text-xl">
        <span>Copyright</span>
        <FaRegCopyright size={14} className="inline-block mx-1" />
        <span>2024 BillStack, Inc. All rights reserved.</span>
      </div>

      {/* Footer Links */}
      <div className="mt-6">
        <ul className="flex flex-wrap text-red-800 justify-center space-x-4 text-md font-bold">
          <li className="hover:text-red-800 hover:underline cursor-pointer">
            Legal Stuff
          </li>
          <li>|</li>
          <li className="hover:text-red-800 hover:underline cursor-pointer">
            Privacy Policy
          </li>
          <li>|</li>
          <li className="hover:text-red-800 hover:underline cursor-pointer">
            Security
          </li>
          <li>|</li>
          <li className="hover:text-red-800 hover:underline cursor-pointer">
            Website Accessibility
          </li>
          <li>|</li>
          <li className="hover:text-red-800 hover:underline cursor-pointer">
            Manage Cookies
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
