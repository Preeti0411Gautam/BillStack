import React from 'react'
import FeedbackForm from './FeedbackForm'
import Feedbacks from './Feedbacks'
import ConnectUs from './ConnectUs'
import FeaturesSection from './FeatureSection'
import { useNavigate } from 'react-router-dom'
const Home = () => {
const navigate = useNavigate();
const handleGetStarted=()=>{
  navigate('/login')
}


  return (
    <div>
      <div className=" py-16 px-10">
  <h1 className="text-5xl font-extrabold leading-tight text-gray-800 pb-6">
    Comprehensive Bill Management, History, and Analytics
  </h1>
  <p className="text-lg text-gray-600 leading-relaxed max-w-3xl font-medium">
    BillStack offers an all-inclusive solution for managing all types of bills. Track, view, and analyze your bill history effortlessly with our advanced analytics tools. Keep all your bill information in one secure place and gain insights to manage your finances better.
  </p>
  <div className="mt-8">
    <button onClick={handleGetStarted} className="bg-red-800 text-white py-3 px-6 rounded-lg text-lg font-medium">
      Get Started
    </button>

  </div>
</div>

      <div><FeaturesSection/></div>
      <div><FeedbackForm/></div>
      <div><Feedbacks/></div>
      <div><ConnectUs/></div>

    </div>
  )
}

export default Home