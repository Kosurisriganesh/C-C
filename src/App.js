import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/login';
import Register from './Components/Register/register';
import Home from './Components/Home/home';
import Dashboard from './Components/Dashboard/dashboard';
import Contact from './Components/Contact/contact';
import UserProfile from './Components/User-details/user-details';
import './App.css';

function App() {
  return (
    <Router>
       <Routes>
          <Route path="/" element={<Home />} /> 
         <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/profile" element={<UserProfile />} />  
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
