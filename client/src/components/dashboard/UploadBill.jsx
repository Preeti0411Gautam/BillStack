import React, { useState } from 'react'; 
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const UploadBill = () => {
  const navigate = useNavigate(); 
  
  const handlePlusClick = () => { 
    navigate('/billType'); 
  }; 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full sm:w-80 md:w-96 lg:w-1/3 bg-gray-200 p-6 m-4 flex flex-col justify-center items-center rounded-lg shadow-lg relative transition-all duration-300 ease-in-out">
        
        <p className="mb-6 text-xl sm:text-2xl text-red-800 font-semibold font-mono text-center">
          Add Bill
        </p>

        <span onClick={handlePlusClick} className="cursor-pointer transition-transform transform hover:scale-110">
          <CiCirclePlus size={80} className="sm:size-100 text-brown-500" />
        </span>

      </div>
    </div>
  );
};

export default UploadBill;
