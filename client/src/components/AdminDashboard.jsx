import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, MilkIcon } from 'lucide-react';

const AdminDashboard= () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dairy Farm Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Management Card */}
        <div 
          onClick={() => navigate('/product-management')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
          </div>
          <p className="text-gray-600">
            Manage your dairy products inventory, track stock levels, and update product information.
          </p>
        </div>

        {/* Staff Management Card */}
        <div 
          onClick={() => navigate('/staffs')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Staff Management</h2>
          </div>
          <p className="text-gray-600">
            Manage farm staff, track schedules, and handle employee information.
          </p>
        </div>
        {/* order details Card */}
        <div 
          onClick={() => navigate('/orders')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
          </div>
          <p className="text-gray-600">
           View and Manage Orders
          </p>
        </div>

         {/* Quality of milk Card */}
         <div 
          onClick={() => navigate('/staffs')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <MilkIcon className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">quality of milk</h2>
          </div>
          <p className="text-gray-600">
           View and edit quality of milk
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;