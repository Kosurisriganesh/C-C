import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../Pages/Firebase/firebase';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: 'kosurisriganesh@gmail.com',
    password: '123456789'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on component mount
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
      [name]: value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Function to navigate to dashboard using History API
  const navigateToDashboard = () => {
    console.log("Navigating to dashboard using History API...");
    
    // Push a new entry into the history stack
    // window.history.pushState({}, '', '/dashboard');
    
    // Dispatch a navigation event to trigger route change
    // window.dispatchEvent(new PopStateEvent('popstate'));
    
    // // As a fallback, also use window.location after a short delay
    // setTimeout(() => {
    //   if (window.location.pathname !== '/dashboard') {
    //     console.log("Fallback: Using window.location.replace");
    //     window.location.replace('/dashboard');
    //   }
    // }, 100);

    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Attempting to sign in with:", formData.email);
      
      // Sign in with backend API instead of Firebase directly
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      console.log('Response status:', response.status);
      
      // Handle both JSON and text responses
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        const text = await response.text();
        console.log('Text response:', text);
        data = { message: text || 'Unknown error' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      console.log("Login successful:", data);
      
      // If remember me is checked, store email in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user data if available
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setIsSubmitted(true);
      
      // Navigate using History API
      navigateToDashboard();
    } catch (error) {
      console.error('Login error details:', error);
      
      // Handle specific errors
      if (error.message.includes('Invalid credentials')) {
        setErrors({ submit: 'Invalid email or password.' });
      } else {
        setErrors({ submit: error.message || 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting Google sign-in");
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google sign-in successful:", user.uid);
      
      // Send Google user data to backend
      const response = await fetch('http://localhost:5000/api/auth/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          fullName: user.displayName,
          uid: user.uid,
          emailVerified: user.emailVerified
        }),
      });
      
      // Handle both JSON and text responses
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        data = { message: text || 'Unknown error' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Google sign-in failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Store user data if available
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      setIsSubmitted(true);
      
      // Navigate using History API
      navigateToDashboard();
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ submit: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setErrors({ reset: 'Please enter your email address' });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Sending password reset email to:", resetEmail);
      
      // Use backend API for password reset
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      
      // Handle both JSON and text responses
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        data = { message: text || 'Unknown error' };
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }
      
      console.log("Password reset email sent successfully");
      setResetEmailSent(true);
      setErrors({});
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.message.includes('user-not-found')) {
        setErrors({ reset: 'No account found with this email address.' });
      } else {
        setErrors({ reset: error.message || 'Failed to send reset email. Please try again.' });
      }
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
          <h2 className="login-image-title">Welcome Back to Candles & Capitals</h2>
          <p className="login-image-text">
            {/* Your gateway to financial markets. Access real-time data, advanced analytics, and expert insights to make informed investment decisions. */}
          </p>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <h1>Sign in to your account</h1>
          <p className="login-subtitle">Please enter your credentials to continue</p>
          
          {isSubmitted && (
            <div className="success-message">
              Login successful! Redirecting to dashboard...
            </div>
          )}
          
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
              <a 
                href="#forgot-password" 
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setShowResetForm(!showResetForm);
                }}
              >
                Forgot password?
              </a>
            </div>
            
            {showResetForm && (
              <div className="reset-password-form">
                <h3>Reset Password</h3>
                {resetEmailSent ? (
                  <div className="success-message">
                    Password reset email sent! Check your inbox.
                  </div>
                ) : (
                  <>
                    <p>Enter your email address to receive a password reset link.</p>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className={errors.reset ? 'input-error' : ''}
                        disabled={isLoading}
                      />
                      {errors.reset && <span className="error-message">{errors.reset}</span>}
                    </div>
                    <button 
                      type="button" 
                      className="reset-button"
                      onClick={handleResetPassword}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </>
                )}
              </div>
            )}
            
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
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" 
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