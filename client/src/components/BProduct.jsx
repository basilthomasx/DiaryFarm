import React, { useState, useEffect } from 'react';

const BProduct = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.relative')) {
        closeAll();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/bproduct', text: 'Products' },
    { href: '/about', text: 'About' },
  ];

  const products = [
    {
      name: 'Ghee',
      description: 'Freshly made organic ghee sourced from our farm.',
      imageUrl: 'https://via.placeholder.com/300?text=Ghee', // Replace with actual image URL
    },
    {
      name: 'Milk',
      description: 'Pure and fresh milk delivered daily.',
      imageUrl: 'https://via.placeholder.com/300?text=Milk', // Replace with actual image URL
    },
    {
      name: 'Curd',
      description: 'Thick and creamy curd made from fresh milk.',
      imageUrl: 'https://via.placeholder.com/300?text=Curd', // Replace with actual image URL
    },
    {
      name: 'Sambaram',
      description: 'Traditional buttermilk to keep you cool and refreshed.',
      imageUrl: 'https://via.placeholder.com/300?text=Sambaram', // Replace with actual image URL
    },
    {
      name: 'Milk Peda',
      description: 'Delicious milk peda crafted with love.',
      imageUrl: 'https://via.placeholder.com/300?text=Milk+Peda', // Replace with actual image URL
    },
    {
      name: 'Cow Manure',
      description: 'High-quality cow manure for your farming needs.',
      imageUrl: 'https://via.placeholder.com/300?text=Cow+Manure', // Replace with actual image URL
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <span className="text-blue-600 text-2xl">🥛</span>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">Ventures Farm</h1>
                <p className="text-sm font-medium text-green-600">Farm to Home</p>
              </div>
            </div>

            {/* Navigation for Desktop */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <span className="font-medium">{link.text}</span>
                </a>
              ))}

              {/* Login Dropdown */}
              <div className="relative">
                <button
                  aria-label="Toggle Dropdown"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-300"
                >
                  <span className="font-medium">Login</span>
                  <span className="text-sm">{isDropdownOpen ? '▲' : '▼'}</span>
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

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle Mobile Menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
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
                      <span className="font-medium">{userType} Login</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Our Products</h2>
        <p className="mb-6 text-gray-700">
          Welcome to Ventures Farm! Explore our range of fresh and organic dairy and farm products.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-800">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                {product.name === 'Cow Manure' ? (
                  <a
                    href="tel:1234567890"
                    className="inline-block mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Contact Admin
                  </a>
                ) : (
                  <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BProduct;
