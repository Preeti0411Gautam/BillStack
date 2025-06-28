import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  if (loading) return <div>Loading...</div>;

  return currentUser ? <Navigate to="/profile" /> : <Outlet />;
};

export default PublicRoute;
