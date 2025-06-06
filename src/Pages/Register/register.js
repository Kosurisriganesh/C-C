import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../Pages/Firebase/firebase';
import './register.css';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false // Add admin flag
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone Number is required";
      isValid = false;
    }

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
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        console.log('Sending registration request...');
        // Register user with backend API
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
            isAdmin: formData.isAdmin // Include admin flag in the request
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
          throw new Error(data.message || 'Registration failed');
        }
        
        // Store token and user role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', formData.isAdmin);
        
        setIsSubmitted(true);
        setTimeout(() => {
          // Navigate to admin dashboard if admin, otherwise to regular dashboard
          if (formData.isAdmin) {
            navigate('/dashboardadmin');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ submit: error.message || 'Registration failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send user data to backend
      const response = await fetch('http://localhost:5000/api/auth/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          fullName: user.displayName,
          uid: user.uid,
          emailVerified: user.emailVerified,
          isAdmin: formData.isAdmin // Include admin flag for Google sign-in too
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
      
      // Store token and user role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.isAdmin); // Store admin status from response
      
      setIsSubmitted(true);
      setTimeout(() => {
        // Navigate based on admin status
        if (data.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ submit: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-split-layout">
        <div className="registration-form-side">
          <div className="registration-form-wrapper">
            <h2>Create an Account</h2>

            {isSubmitted && (
              <div className="success-message">
                Registration successful! Redirecting to {formData.isAdmin ? 'admin dashboard' : 'dashboard'}...
              </div>
            )}

            {errors.submit && (
              <div className="error-message global-error">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={errors.phoneNumber ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
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
                  className={errors.password ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isAdmin"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="isAdmin">Register as Administrator</label>
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="google-signin-container">
              <button
                onClick={handleGoogleSignIn}
                className="google-signin-button"
                disabled={isLoading}
              >
                <img
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  alt="Google logo"
                  className="google-logo"
                />
                Sign up with Google
              </button>
            </div>

            <div className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </div>
        </div>

        <div className="registration-image-side">
          <div className="image-overlay">
            <h2>Welcome to Candles</h2>
            <p>Create your account and start your journey with us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
