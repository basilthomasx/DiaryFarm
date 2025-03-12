import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, CheckCircle, Clock } from 'lucide-react';
import Navbar from './Navbar'; 

function StaffDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/deliveries/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching delivery stats:', error);
    }
  };
  
  const handleCardClick = (status) => {
    navigate(`/staff/deliveries/${status}`);
  };
  
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Dairy Farm Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick('all')}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Total Deliveries</h3>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-2 text-blue-600">{stats.total}</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              All deliveries in the system
            </div>
          </div>
          
          <div
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick('completed')}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Completed Deliveries</h3>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-2 text-green-600">{stats.completed}</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Successfully delivered orders
            </div>
          </div>
          
          <div
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick('pending')}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Pending Deliveries</h3>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <p className="text-4xl font-bold mb-2 text-yellow-500">{stats.pending}</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Orders awaiting delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;