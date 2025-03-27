import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Statistics from "./pages/Statistics/Statistics";
import Prediction from "./pages/Prediction/Prediction";
import Services from "./pages/Services/Services";
import Dashboard from './pages/Dashboard/Dashboard';

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
      </Routes>
    </Router>
    
  )
}

export default App

