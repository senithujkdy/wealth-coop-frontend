import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountCreationPopup from '../../AccountCreattionPopUp/AccountCreationPopup'; // Import the popup component

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // State for the account creation popup
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // default new registered users to customer
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await res.json();
      console.log(data); // Log the response for debugging

      if (res.ok) {
        // Important: Call login with the response data to ensure AuthContext is updated
        login(data);  // Save user to AuthContext
        
        // Show the account creation popup if the user is a customer
        if (data.role === 'customer') {
          setShowAccountPopup(true);
        } else if (data.role === 'admin' || data.role === 'staff') {
          navigate('/admin/dashboard');
        }
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error('🚨 Registration Error:', err);
      alert('Something went wrong.');
    }
  };

  // Handle successful account creation
  const handleAccountCreated = () => {
    navigate('/'); // Navigate to customer dashboard after account creation
  };

  return (
    <div className="bg-white min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col">
        {/* Logo */}
        <div className="mb-10">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect width="30" height="30" fill="#0A2463" />
            <rect x="30" y="0" width="20" height="20" fill="#E63946" />
          </svg>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">Register</h1>
          <p className="text-gray-400 mb-8">
            Create an account to manage your banking needs.
          </p>


          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block mb-2 text-gray-700">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-2 text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Number */}
            <div>
              <label htmlFor="phone" className="block mb-2 text-gray-700">Phone Number</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
              <div>
              <label htmlFor="password" className="block mb-2 text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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

            {/* Confirm Password */}
              <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded accent-blue-600 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full p-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 relative overflow-hidden">
        {/* Content remains the same */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900">
          <div className="absolute top-10 right-10 w-16 h-16 border-2 border-blue-400 rounded-full opacity-30"></div>
          <div className="absolute bottom-40 right-40 w-24 h-24 border-2 border-blue-400 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-blue-400 rounded-full opacity-30"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5 flex items-center justify-center">
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
                    <div className="transform rotate-180 text-center text-xl font-bold">Secure Payment</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-20 left-20">
              <div className="w-32 h-20 bg-green-400 rounded shadow-md transform -rotate-6 mb-1"></div>
              <div className="w-32 h-20 bg-green-500 rounded shadow-md transform -rotate-3 mb-1"></div>
              <div className="w-32 h-20 bg-green-600 rounded shadow-md"></div>
            </div>

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

      {/* Account Creation Popup */}
      <AccountCreationPopup 
        isOpen={showAccountPopup}
        onClose={() => {
          setShowAccountPopup(false);
          navigate('/'); // Redirect to home if they close the popup without creating an account
        }}
        onSuccess={handleAccountCreated}
      />
    </div>
  );
};

export default Register;