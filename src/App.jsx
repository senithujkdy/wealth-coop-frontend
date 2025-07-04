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

import LoanDefault from "./pages/Predictions/LoanDefault";
import LoanAmountForecast from "./pages/Predictions/LoanForcast";
import LoanRepaymentPrediction from "./pages/Predictions/LoanRepayment";
import UDashboard from './pages/UserDashboard/UDashboard'; 
import Transaction from './pages/UserDashboard/Transaction'; 
import TransactionPortal from './pages/UserDashboard/TransactionPortal';
import BillPayment from './pages/UserDashboard/BillPayment';
import RecurringTransfer from './pages/UserDashboard/RecurringTransfer';
import NotFound from './pages/NotFound/NotFound';
import UserManagement from './components/layout/UserManagement/UserManagement';

import AdminRoutes from './routes/AdminRoutes';
import CustomerRoutes from './routes/CutomerRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👤 User (Customer/Staff) Area */}
        <Route element={<CustomerRoutes />}>
          <Route path="/" element={<UserDashboard />}>
            <Route index element={<UDashboard />} />
            <Route path="overview" element={<UDashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="loans" element={<Loan />} />
            <Route path="settings" element={<Settings />} />
            <Route path="transaction" element={<Transaction />} />
            <Route path="/transaction/transactionportal" element={<TransactionPortal/>} />
            <Route path="/transaction/bill-payment" element={<BillPayment />} />
            <Route path="/transaction/recurring" element={<RecurringTransfer />} />
          </Route>
        </Route>

        {/* 🛡️ Admin/Staff-only Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="predictions" element={<Prediction />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<NotFound />} />

        {/* Prediction Model Pages */}
        <Route path="/default" element={<LoanDefault />} />
        <Route path="/forecast" element={<LoanAmountForecast />} />
        <Route path="/repayment" element={<LoanRepaymentPrediction />} />
        </Routes>
    </Router>
  )
}


export default App

