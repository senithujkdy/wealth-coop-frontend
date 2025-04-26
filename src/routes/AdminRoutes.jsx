import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoutes = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoutes;
