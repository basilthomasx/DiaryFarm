import React, { useState } from 'react';
import { Store, Leaf, BarChart, Lock, EyeOff, Eye } from 'lucide-react';
import Header from './Header';
import { Link } from 'react-router-dom';
const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
    
      localStorage.setItem('token', data.token);
      window.location.href = '/';
      
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordReset) {
    return  ; //password page here
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <Header/>
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

            <form onSubmit={handleLogin}>
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm font-medium text-green-600 hover:text-green-500" 
                >
                  <Link 
                    to="/password-reset-form"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                  Forgot password?
                  </Link>
               
                  
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 mt-6 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
  to="/customer/signup"
  className="font-medium text-green-600 hover:text-green-500"
>
  Sign up
</Link>
                </p>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
