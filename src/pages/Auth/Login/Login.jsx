import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AccountCreationPopup from '../../AccountCreattionPopUp/AccountCreationPopup';
import Logo from '../../../assets/Logo.png'

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3 max-w-md`}>
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  // Initialize popup state to false - will be set to true if user has no accounts
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Function to show toast notifications
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Function to close toast
  const closeToast = () => {
    setToast(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        
        // For customer, check if they have any accounts
        if (data.role === 'customer') {
          try {
            console.log('Checking accounts for user_id:', data.user_id);
            
            const accountRes = await fetch(`http://localhost:3000/api/accounts/user/${data.user_id}`, {
              headers: { 
                'Authorization': `Bearer ${data.token}` 
              }
            });
            
            if (!accountRes.ok) {
              throw new Error(`API returned ${accountRes.status}: ${accountRes.statusText}`);
            }
            
            const accountData = await accountRes.json();
            console.log('Account data received:', accountData);
            
            // Different ways the API might structure the response
            const accounts = accountData.accounts || accountData.data || accountData;
            const hasAccounts = accounts && (Array.isArray(accounts) ? accounts.length > 0 : Object.keys(accounts).length > 0);
            
            if (!hasAccounts) {
              console.log('No accounts found, showing popup');
              setShowAccountPopup(true);
            } else {
              console.log('Accounts found, navigating to dashboard');
              showToast('Login successful! Welcome back.', 'success');
              setTimeout(() => navigate('/'), 1000); // Small delay to show success message
            }
          } catch (err) {
            console.error('Error checking accounts:', err);
            console.log('Error occurred, showing popup as fallback');
            // If error occurs when checking accounts, show popup to be safe
            setShowAccountPopup(true);
          }
        } else if (data.role === 'admin' || data.role === 'staff') {
          showToast('Login successful! Redirecting to admin dashboard.', 'success');
          setTimeout(() => navigate('/admin/dashboard'), 1000);
        }
      } else {
        showToast(data.error || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Something went wrong. Please try again later.', 'error');
    }
  };
  
  // Handle successful account creation
  const handleAccountCreated = () => {
    setShowAccountPopup(false); // First hide the popup
    showToast('Account created successfully! Welcome to your dashboard.', 'success');
    setTimeout(() => navigate('/'), 1000); // Navigate after showing success message
  };
  
  // Debug effect to track popup state changes
  useEffect(() => {
    console.log('showAccountPopup state changed:', showAccountPopup);
  }, [showAccountPopup]);

  return (
    <div className="bg-white min-h-screen flex">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col">
        {/* Logo */}
        <div className="mb-10">
          <img src={Logo} 
          className='h-15 w-15'
          alt="" />
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <p className="text-gray-400 mb-8">
            Enter your credentials to access your account and manage your finances.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-gray-700">Enter your Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Type your password here"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot Password */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded accent-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <div>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full p-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-16 h-16 border-2 border-blue-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 right-40 w-24 h-24 border-2 border-blue-400 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-blue-400 rounded-full opacity-30"></div>
        </div>

        {/* Financial illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5 flex items-center justify-center">
            {/* Phone with security illustration */}
            <div className="relative">
              <div className="w-64 h-96 bg-pink-400 rounded-3xl shadow-2xl transform rotate-12 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white">
                    <div className="flex justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        <circle cx="12" cy="16" r="1"></circle>
                      </svg>
                    </div>
                    <div className="text-center text-xl font-bold">Secure Banking</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Money/cash illustration */}
            <div className="absolute top-20 left-20">
              <div className="w-32 h-20 bg-green-400 rounded shadow-md transform -rotate-6 mb-1"></div>
              <div className="w-32 h-20 bg-green-500 rounded shadow-md transform -rotate-3 mb-1"></div>
              <div className="w-32 h-20 bg-green-600 rounded shadow-md"></div>
            </div>

            {/* Credit card */}
            <div className="absolute bottom-24 right-24">
              <div className="w-48 h-28 bg-gray-800 rounded-lg shadow-xl transform rotate-12 p-3">
                <div className="w-10 h-6 bg-yellow-500 rounded"></div>
                <div className="w-32 h-4 bg-gray-600 mt-10 rounded"></div>
                <div className="flex justify-end mt-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 mr-1"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Charts/graph illustration */}
            <div className="absolute bottom-16 left-24">
              <div className="flex items-end space-x-2">
                <div className="w-6 h-12 bg-yellow-400 rounded-t"></div>
                <div className="w-6 h-16 bg-yellow-500 rounded-t"></div>
                <div className="w-6 h-24 bg-yellow-600 rounded-t"></div>
                <div className="w-6 h-16 bg-yellow-500 rounded-t"></div>
              </div>
              <div className="mt-1">
                <div className="flex">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <div className="w-10 h-1 bg-green-500 rounded mt-1"></div>
                </div>
                <div className="flex mt-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <div className="w-8 h-1 bg-red-500 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Creation Popup - Using React Portal for better modal rendering */}
      {showAccountPopup && (
        <AccountCreationPopup 
          onAccountCreated={handleAccountCreated} 
        />
      )}
    </div>
  );
};

export default Login;