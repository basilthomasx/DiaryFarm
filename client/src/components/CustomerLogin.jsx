import React, { useState } from 'react';
import { Store, Leaf, BarChart } from 'lucide-react';

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      window.location.href = '/products';
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:border-green-300"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="mt-2 text-right">
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </a>
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
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
