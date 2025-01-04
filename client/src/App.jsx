import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import UploadBill from './components/UploadBill';
import BillType from './components/BillType';
import Login from './components/Login';
import Signup from "./components/Signup";
import BillList from './components/BillList';
import Home from './components/Home';
import Profile from './components/Profile';
import About from './components/About';
import PrivateRoute from './components/PrivateRoute';
import Analytics from './components/Analytics';

const App = () => {
  return (
    <BrowserRouter>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow p-6'>
          
          <Routes>
            <Route path='/upload-bill' element={<UploadBill/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path="/billType" element={<BillType />} />
            <Route path="/login" element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route element= {<PrivateRoute/>}>
                <Route path='/profile' element={<Profile/>}/>
            </Route>
            <Route path='/billList' element={<BillList/>}/>
          </Routes>
        
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
