import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Statistics from "./pages/Statistics/Statistics";
import Prediction from "./pages/Prediction/Prediction";
import Services from "./pages/Services/Services";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdminDashboard/>}/>
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/predictions" element={<Prediction />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      
    </Router>
    
  )
}

export default App

