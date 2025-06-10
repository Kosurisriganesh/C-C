import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';
import { Dashboard } from './Pages/Dashboard';
import Contact from './Pages/Contact/contact';
import UserProfile from './Pages/User-details/user-details';
import Course from './Pages/Course/course';
import About from './Pages/About/about';
import About2 from './Pages/About/about2';
import Admin from './Pages/Admin/admin';
import AdminDashboard from './Pages/DashboardAdmin/dashboardadmin';
import './App.css';

const App = () => {
  return (
    <HashRouter>
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
        <Route path="/dashboardadmin" element={<AdminDashboard />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
