import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Statistics from "./pages/AdminDashboard/Statistics";
import Prediction from "./pages/AdminDashboard/Prediction";
import Services from "./pages/AdminDashboard/Services";
import Dashboard from './pages/AdminDashboard/Dashboard';
import Landing from './pages/Landing/Landing';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import Accounts from './pages/UserDashboard/Accounts';
import Loan from './pages/UserDashboard/Loan';
import Settings from './pages/Settings/Setttings';
import UDashboard from './pages/UserDashboard/UDashboard';
import Transaction from './pages/UserDashboard/Transaction';

import LoanDefault from "./pages/Predictions/LoanDefault";
import LoanAmountForecast from "./pages/Predictions/LoanForcast";
import LoanRepaymentPrediction from "./pages/Predictions/LoanRepayment";

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
        <Route path='/register' element={<Register />} />

        {/* Login */}
        <Route path='/login' element={<Login />} />

        {/* Landing */}
        <Route path='/landing' element={<Landing />} />

        {/* Prediction Model Pages */}
        <Route path="/default" element={<LoanDefault />} />
        <Route path="/forecast" element={<LoanAmountForecast />} />
        <Route path="/repayment" element={<LoanRepaymentPrediction />} />

      </Routes>
    </Router>
  )
}

export default App