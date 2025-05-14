import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../Components/Firebase/firebase';
import './login.css';
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email if it exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      try {
        // Sign in with email and password
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setErrors({ submit: 'Invalid email or password' });
        } else {
          setErrors({ submit: error.message || 'Login failed. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Sign in with Google popup
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ submit: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login-container">
      {/* Left side - Stock Market Image section */}
      <div className="login-image-section">
        <div className="login-image-overlay"></div>
        <div className="login-image-content">
          <h2 className="login-image-title">Welcome to Candles & Capitals</h2>
          <p className="login-image-text">
            Your gateway to financial markets. Access real-time data, advanced analytics, and expert insights to make informed investment decisions.
          </p>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <h1>Sign in to your account</h1>
          <p className="login-subtitle">Please enter your credentials to continue</p>
          
          {errors.submit && (
            <div className="error-message global-error">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={toggleRememberMe}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#forgot-password" className="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <div className="or-divider">
              <span>OR</span>
            </div>
            
            <div className="google-signin-container">
              <button 
                onClick={handleGoogleSignIn} 
                className="google-signin-button"
                disabled={isLoading}
                type="button"
              >
                <img 
                  src="google img.jpg" 
                  alt="Google logo" 
                  className="google-logo"
                />
                Sign in with Google
              </button>
            </div>
            
            <p className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
