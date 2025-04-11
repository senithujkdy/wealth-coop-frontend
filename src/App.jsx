import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Statistics from "./pages/AdminDashboard/Statistics";
import Prediction from "./pages/AdminDashboard/Prediction";
import Services from "./pages/AdminDashboard/Services";
import Dashboard from './pages/AdminDashboard/Dashboard';
import Landing from './pages/Landing/Landing';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import UserDashboard from './pages/UserDashboard/UserDashboard';  // layout
import Accounts from './pages/UserDashboard/Accounts';
import Loan from './pages/UserDashboard/Loan';
import Settings from './pages/Settings/Setttings';
import UDashboard from './pages/UserDashboard/UDashboard'; 
import Transaction from './pages/UserDashboard/Transaction'; 

function App() {
  

  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Wrapper */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="predictions" element={<Prediction />} />
          <Route path="services" element={<Services />} />
        </Route>

         {/* User Dashboard wrapper */}
         <Route path="/" element={<UserDashboard />}>
         <Route index element={<UDashboard />} />
          <Route path="overview" element={<UDashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="loans" element={<Loan />} />
          <Route path="settings" element={<Settings />} /> 
          <Route path="transaction" element={<Transaction />} /> 
        </Route>

        {/* Register */}
        <Route path='/register' element={<Register />}>
        
        </Route>

        {/* Login */}
        <Route path='/login' element={<Login />}>
        
        </Route>

        <Route path='/landing' element={<Landing />}>
        
        </Route>



      </Routes>
    </Router>
    
  )
}

export default App

