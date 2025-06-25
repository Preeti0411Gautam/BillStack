import React from "react";
import { BsLightningCharge } from "react-icons/bs";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16  transition-all duration-300">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-indigo-100 dark:bg-gray-700 p-4 rounded-full mb-4 shadow-md">
          <BsLightningCharge size={40} className="text-gray-600 dark:text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-center text-gray-700 dark:text-gray-500">
          About Us
        </h1>
        <span className="mt-2 inline-block bg-indigo-200 text-blue-700 text-sm font-medium px-4 py-1 rounded-full tracking-wide shadow-sm">
          Empowering Your Bill Management
        </span>
      </div>

      <p className="text-lg  leading-8 mb-6 text-justify">
        Welcome to{" "}
        <span className="font-semibold bg-gradient-to-r from-gray-500 to-indigo-300 text-white px-1.5 py-0.5 rounded">
          BillStack
        </span>
        , your all-in-one bill management platform. Our mission is to simplify your life by helping
        you organize and track all your bills in one place — whether it’s electricity, rent, or
        subscriptions. We make sure you never miss a due date again.
      </p>

      <p className="text-lg leading-8 text-justify">
        At <span className="font-semibold text-indigo-600 dark:text-indigo-400">BillStack</span>, we
        believe in simplicity, transparency, and a user-first approach. Powered by modern web
        technologies and driven by a passion for productivity, we empower users to take control of
        their financial commitments — effortlessly and efficiently.
      </p>
    </div>
  );
};

export default AboutUs;
