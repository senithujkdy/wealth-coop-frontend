import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'customer') return <Navigate to="/notfound" />;
  
  return <Outlet />;
};

export default CustomerRoutes;
