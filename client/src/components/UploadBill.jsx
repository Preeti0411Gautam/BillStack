import React, { useState } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
const UploadBill = () => {


  const navigate = useNavigate(); 
  const handlePlusClick = () => { 
        navigate('/billType'); 
    }; 


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='w-80 h-80 bg-gray-200 m-10 flex flex-col justify-center items-center rounded-lg shadow-lg relative'>
        
    <p className='mb-4 text-lg text-red-800 font-semibold font-mono'>Add Bill</p>
    <span onClick={handlePlusClick} className='cursor-pointer'>
    <CiCirclePlus size={100} color='brown' />
    </span>

        
      </div>
    </div>
  );
}

export default UploadBill;
