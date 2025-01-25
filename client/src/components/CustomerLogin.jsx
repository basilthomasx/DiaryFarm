import React, { useState } from 'react';
import { User, Eye, EyeOff, Lock, Store, Leaf, BarChart } from 'lucide-react';
import axios from 'axios';

const CustomerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (username.trim() === '' || password.trim() === '') {
      alert('Username and password are required.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username: username.trim(),
        password,
      });
  
      localStorage.setItem('token', response.data.token);
      window.location.href = '/products';
    } catch (error) {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };
  


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <Store className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Farmer Dashboard
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-8">
            Manage your dairy business and connect directly with customers
          </p>
          <div className="hidden lg:block">
            <div className="bg-green-700/30 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">Dashboard Features</h3>
              <ul className="space-y-3 text-green-100">
                <li className="flex items-center">
                  <BarChart className="h-5 w-5 mr-3" />
                  Track sales and inventory
                </li>
                <li className="flex items-center">
                  <Store className="h-5 w-5 mr-3" />
                  Manage product listings
                </li>
                <li className="flex items-center">
                  <Leaf className="h-5 w-5 mr-3" />
                  Connect with local buyers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, Farmer!</h2>
            <p className="mt-2 text-gray-600">Sign in to manage your dairy business</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="Enter your farm username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In 
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                New to the platform?{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Register your Account
                </a>
              </p>
            </div>

            {/* Quick Help Section */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">Need Help?</h3>
              <p className="text-sm text-green-600">
                Contact our farmer support team for assistance with account setup or management.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;



