import React, { useState, useEffect } from 'react';
import Header from './Header';
const BProduct = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };



   const products = [
    {
      name: 'Ghee',
      description: 'Freshly made organic ghee sourced from our farm.',
      src: 'https://via.placeholder.com/300?text=Ghee', // Replace with actual image URL
      alt: 'Image of Ghee',
    },
    {
      name: 'Milk',
      description: 'Pure and fresh milk delivered daily.',
      src: 'https://via.placeholder.com/300?text=Milk', // Replace with actual image URL
      alt: 'Image of Milk',
    },
    {
      name: 'Curd',
      description: 'Thick and creamy curd made from fresh milk.',
      src: 'https://via.placeholder.com/300?text=Curd', // Replace with actual image URL
      alt: 'Image of Curd',
    },
    {
      name: 'Sambaram',
      description: 'Traditional buttermilk to keep you cool and refreshed.',
      src: 'https://via.placeholder.com/300?text=Sambaram', // Replace with actual image URL
      alt: 'Image of Sambaram',
    },
    {
      name: 'Milk Peda',
      description: 'Delicious milk peda crafted with love.',
      src: 'https://via.placeholder.com/300?text=Milk+Peda', // Replace with actual image URL
      alt: 'Image of Milk Peda',
    },
    {
      name: 'Cow Manure',
      description: 'High-quality cow manure for your farming needs.',
      src: 'https://via.placeholder.com/300?text=Cow+Manure', // Replace with actual image URL
      alt: 'Image of Cow Manure',
    },
  ];
  

 return (
     <div>
      <Header/>
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
