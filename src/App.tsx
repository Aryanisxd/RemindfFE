import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css'
import LandingPage from './pages/landingPage';
import { Dashboard } from './pages/dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


const App: React.FC = () => {
  return (
   <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
        </Routes>
        
      </div>
    </Router>
    
  )
}

export default App
