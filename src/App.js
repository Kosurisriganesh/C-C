import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';
import Dashboard from './Pages/Dashboard/dashboard';
import Contact from './Pages/Contact/contact';
import UserProfile from './Pages/User-details/user-details';
import Course from './Pages/Course/course';
import About from './Pages/About/about';
import About2 from './Pages/About/about2';
import Admin from './Pages/Admin/admin';
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
        <Route path="/course" element={<Course />} />
        <Route path="/about" element={<About />} />
        <Route path="/about2" element={<About2 />} />
        <Route path="/profile" element={<UserProfile />} />  
        <Route path="/admin" element={<Admin />} />  
         
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
