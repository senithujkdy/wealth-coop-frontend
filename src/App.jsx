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

function App() {
  

  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Wrapper */}
        <Route path="/" element={<AdminDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="predictions" element={<Prediction />} />
          <Route path="services" element={<Services />} />
        </Route>

         {/* Landing page */}
         <Route path="/landing" element={<Landing />}>
        
        </Route>

        {/* Register */}
        <Route path='/register' element={<Register />}>
        
        </Route>

        {/* Login */}
        <Route path='/login' element={<Login />}>
        
        </Route>



      </Routes>
    </Router>
    
  )
}

export default App

