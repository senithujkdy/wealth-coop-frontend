import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace/>;

  // Allow both admin and staff to access admin dashboard
  if (user.role === 'admin' || user.role === 'staff') {
    return <Outlet />;
  }

  // Block customers
  return <Navigate to="/notfound" />;
};

export default AdminRoutes;
