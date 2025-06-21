import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./Loading";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../components/common/NotFound";

// Lazy load all route components
const Home = lazy(() => import("../components/home/Home"));
const Login = lazy(() => import("../components/auth/Login"));
const Signup = lazy(() => import("../components/auth/Signup"));
const UploadBill = lazy(() => import("../components/dashboard/UploadBill"));
const BillType = lazy(() => import("../components/dashboard/BillType"));
const Notification = lazy(() => import("../components/dashboard/Notification"));
const Analytics = lazy(() => import("../components/dashboard/Analytics"));
// const History = lazy(() => import("../components/dashboard/History"));
const BillList = lazy(() => import("../components/dashboard/BillList"));

const Profile = lazy(() =>import("../components/dashboard/Profile"));

// const Profile = lazy(() =>
//   wait(1000).then(() => import("../components/dashboard/Profile"))
// );


// const wait = (time) => {
//   return new Promise(resolve => {
//     setTimeout(resolve, time);
//   });
// };
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload-bill" element={<UploadBill />} />
        <Route path="/billType" element={<BillType />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* <Route path="/history" element={<History />} /> */}
        <Route path="/billList" element={<BillList />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
           <Route path="*" element={<NotFound/>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
