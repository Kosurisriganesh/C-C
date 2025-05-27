import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import Home from './Pages/Home/home';
import {Dashboard} from './Pages/Dashboard';
import Contact from './Pages/Contact/contact';
import UserProfile from './Pages/User-details/user-details';
import Course from './Pages/Course/course';
import About from './Pages/About/about';
import About2 from './Pages/About/about2';
import Admin from './Pages/Admin/admin';
import AdminDashboard from './Pages/DashboardAdmin/dashboardadmin';
import './App.css';



const App = () => {
  // console.log(localStorage.getItem('token'))
  return (
    
    
       <Routes>
        <Route path="/"  exact element={<Home />} />
        <Route path="/home"  exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/register" exact element={<Register />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="/contact" exact element={<Contact />} />
        <Route path="/course" exact element={<Course />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/about2" exact element={<About2 />} />
        <Route path="/profile" exact element={<UserProfile />} />  
        <Route path="/admin" exact element={<Admin />} />  
        <Route path="/dashboardadmin" exact element={<AdminDashboard />} />  
         
        {/* Other routes */}
      </Routes>
    
  );
}

export default App;
