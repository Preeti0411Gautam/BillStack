import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';




const Header = () => {
  const {currentUser} = useSelector(state=>state.user)
  const navigate = useNavigate(); 
  const handleClick = () => { 
    navigate('/login'); 
}; 


const handleBillList=()=>{
  navigate("/billList");
}
const handleProfile=()=>{
  navigate("/profile")
}

const handleUploadBill=()=>{
  navigate("/billType");
}

const handleLogo=()=>{
  navigate("/");
}

const handleAnalytics =()=>{
  navigate("/analytics")
}
  return (
    <header className='p-8'>
      <div className='flex justify-between items-center'>
        <div onClick={handleLogo} className='text-4xl font-extrabold text-red-800'>
          BillStack
        </div>
        <nav className='text-2xl'>
          <ul className='flex space-x-8 text-red-800 font-bold'>
        
            <li onClick ={handleUploadBill} className='hover:text-red-600 transition duration-300'>Upload Bill</li>
            <li onClick={handleBillList} className='hover:text-red-600 transition duration-300'>Bill List</li>
            <li onClick={handleAnalytics} className='hover:text-red-600 transition duration-300'>Analytics</li>
            {/* <li onClick={handleClickAbout} className='hover:text-red-600 transition duration-300'>About</li> */}
           <li  className='hover:text-red-600 transition duration-300'>

            {currentUser ? <p onClick={handleProfile}>{(currentUser.name)}</p> : <p onClick={handleClick}>Sign In</p>}
            </li>
           
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
