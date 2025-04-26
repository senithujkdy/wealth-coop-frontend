import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Allow only customers and admins
  if (user.role === 'customer' || user.role === 'admin') {
    return <Outlet />;
  }

  // Block staff users
  return <Navigate to="/notfound" />;
};

export default CustomerRoutes;
