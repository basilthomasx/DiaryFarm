import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { Home, Package, Info, UserPlus2Icon, User2, Milk, ChevronUp, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', text: 'Home', icon: <Home className="w-5 h-5" /> },
    { href: '/products', text: 'Products', icon: <Package className="w-5 h-5" /> },
    { href: '/about', text: 'About', icon: <Info className="w-5 h-5" /> },
    { href: '/customer/signup', text: 'Sign Up', icon: <UserPlus2Icon className="w-5 h-5" /> },

  ];
  

  return (
    <div>
      <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Milk className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-blue-800">FreshFarm</h1>
                <p className="text-sm font-medium text-green-600">Freshness Delivered to Your Doorstep</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-300"
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span className="font-medium">{link.text}</span>
                </a>
              ))}

                {/* Desktop Login Dropdown*/}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-200"
              >
                <User2 size={20} />
                <span className="font-medium">Login</span>
                {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {['Customer', 'Staff', 'Admin'].map((userType) => (
                      <a
                        key={userType}
                        href={`/${userType.toLowerCase()}-login`}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        onClick={closeAll}
                      >
                        {userType}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                    onClick={closeAll}
                  >
                    {link.icon && <span>{link.icon}</span>}
                    <span className="font-medium">{link.text}</span>
                  </a>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  {['Customer', 'Staff', 'Admin'].map((userType) => (
                    <a
                      key={userType}
                      href={`/${userType.toLowerCase()}-login`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                      onClick={closeAll}
                    >
                      <User2 className="w-5 h-5" />
                      <span className="font-medium">{userType} Login</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          )}
        </div>
      </header>

      
    </div>
  );
};


export default Header;