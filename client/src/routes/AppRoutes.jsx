import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./Loading";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../components/common/NotFound";
import AboutUs from "../components/common/AboutUs";
import FAQ from "../components/common/FAQ";
import ConnectUs from "../components/home/ConnectUs";

// Lazy load all route components
const Home = lazy(() => import("../components/home/Home"));
const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const BillType = lazy(() => import("../components/dashboard/BillType"));
const Notification = lazy(() => import("../components/dashboard/Notification"));
const Analytics = lazy(() => import("../components/dashboard/Analytics"));
const BillList = lazy(() => import("../components/dashboard/BillList"));

const Profile = lazy(() => import("../components/dashboard/Profile"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ/>} />
        <Route path="/contact" element={<ConnectUs />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/billType" element={<BillType />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billList" element={<BillList />} />
        </Route>
        {/* Catch-All Route (Public) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
