import React, { useState } from 'react';
import { Home, Package, Info, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="text-xl font-bold text-gray-800">
            Ventures Farm
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <Home size={18} />
              <span>Home</span>
            </a>
            
            <a href="/products" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <Package size={18} />
              <span>Products</span>
            </a>
            
            <a href="/about" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <Info size={18} />
              <span>About</span>
            </a>

            {/* Login Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User size={18} />
                <span>Login</span>
                {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <a 
                    href="/customer-login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Customer
                  </a>
                  <a 
                    href="/login/staff" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Staff
                  </a>
                  <a 
                    href="/admin-login" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Admin
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;