import React, { useState } from 'react';
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
                <a className="text-2xl font-bold text-blue-800">FreshFarm</a>
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

      {/* New centered div under navbar */}
      <div className="w-full bg-blue-50 pt-24">
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Welcome to FreshFarm</h2>
          <p className="text-lg text-gray-600">
            Experience the finest dairy products delivered fresh to your doorstep. 
            We source directly from local farms to ensure quality and freshness.
          </p>
        </div>
      </div>
      {/* individual divs */}
      <main className="mt-24 p-6 space-y-12">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+1"
        alt="Image 1"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>Milk Collection From Healthy Cattles</p>
    </div>
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+2"
        alt="Image 2"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>Quality test</p>
    </div>
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+3"
        alt="Image 3"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>Delivered 6am by home</p>
    </div>
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+4"
        alt="Image 4"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>Ensuring cattle vaxination</p>
    </div>
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+5"
        alt="Image 5"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>Monthly subscriptions for Milk</p>
    </div>
    <div className="flex flex-col items-center space-y-3 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg">
      <img
        src="/api/placeholder/150/150?text=Image+6"
        alt="Image 6"
        className="w-40 h-40 object-cover rounded-lg shadow-md"
      />
      <p>At present delivered within a range of Vazhikadavu Panchayath</p>
    </div>
  </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg text-center leading-relaxed">
            This platform ensuring every farmer to buy and sell their yeild goods for improve stability to customers
          </p>
        </div>
{/* new div with information */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  {/* First Div */}
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-gray-700">Information One</p>
    <p className="text-gray-600 mt-2">
      Additional details about information one can be found here. Click to learn more about our services and offerings.
    </p>
  </div>

{/* Second Div */}
<div className="p-4 bg-gray-50 rounded-lg">
  <p className="text-gray-700">Information Two</p>
  <p className="text-gray-600 mt-2">
    Additional details about information two can be found here. Click to learn more about our services and offerings tailored to your needs.
  </p>
</div>

{/* Third Div */}
<div className="p-4 bg-gray-50 rounded-lg">
  <p className="text-gray-700">Information Three</p>
  <p className="text-gray-600 mt-2">
    Additional details about information three can be found here. Discover how we prioritize quality and sustainability in our services.
  </p>
</div>
</div>


        <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Information</h2>
          <p className="text-gray-700 leading-relaxed">
            Our products are carefully selected to ensure the highest quality and freshness. 
            We work directly with local farmers to bring you the best seasonal produce and 
            dairy products, maintaining strict quality control throughout our supply chain.
          </p>
        </div>

        <footer className="text-center py-6 border-t border-gray-200">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <p className="text-gray-600">support@freshfarm.com</p>
            <p className="text-gray-600">9995496038</p>
          </div>
        </footer>
        </main>  
    </div>
  );
};


export default Header;