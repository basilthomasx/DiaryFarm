import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('products');
  const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate();

  const fetchProductCount = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/product-count');
      if (!response.ok) {
        throw new Error('Failed to fetch count');
      }
      const data = await response.json();
      setProductCount(Number(data.count)); // Convert to number explicitly
    } catch (error) {
      console.error('Error fetching product count:', error);
    }
  };

  useEffect(() => {
    fetchProductCount();
  }, []);

  // Define your dashboard sections
  const sections = [
    {
      id: 'products',
      title: 'Product Management',
      content: (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full">
              Total Products: {productCount}
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            Manage your product inventory, add new items, and update existing products.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Active Products</p>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Recent Updates</p>
              <p className="text-2xl font-bold">Today</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/product-management')}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Enter Product Management
          </button>
        </div>
      )
    },
    {
      id: 'buyers',
      title: 'Buyer Details',
      content: (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Buyer Details</h2>
            <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full">
              Active Buyers
            </span>
          </div>
          <p className="text-gray-600 mb-6">
            View and manage customer information, orders, and purchase history.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">--</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Recent Orders</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/buyers')}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Enter Buyer Management
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <span className="text-gray-600">Welcome, Basil</span>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="transition-all">
          {sections.find(section => section.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
