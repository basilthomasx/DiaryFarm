import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error(err);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API_URL}/staff`);
        setStaff(response.data);
      } catch (err) {
        console.error('Failed to fetch staff:', err);
      }
    };

    Promise.all([fetchOrderDetails(), fetchStaff()])
      .finally(() => setLoading(false));
  }, [id]);

  const handleAssignStaff = async () => {
    if (!selectedStaff) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(
        `${API_URL}/orders/${id}/assign`,
        { staffId: selectedStaff }
      );
      
      setOrder(response.data.order);
      setSuccessMessage('Staff assigned successfully');
      setSelectedStaff('');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign staff');
      console.error(err);
      
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
        Order not found
      </div>
    );
  }

  // Convert rate and total_amount to numbers if they're strings
  const rate = typeof order.rate === 'string' ? parseFloat(order.rate) : order.rate;
  const totalAmount = typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      <button 
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-40 flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group"
      >
        <div className="relative">
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
        </div>
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order #{order.id}</h1>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {order.customer_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {order.customer_email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {order.customer_phone}
            </div>
            <div>
              <span className="font-medium">Address:</span> House No. {order.customer_house_number}, 
              Postal Code: {order.customer_postal_code}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Product Details</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Product ID:</span> {order.product_id}
            </div>
            <div>
              <span className="font-medium">Name:</span> {order.product_name}
            </div>
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-600">{order.product_description || 'No description available'}</p>
            </div>
            <div className="pt-2">
              <span className="font-medium">Quantity:</span> {order.quantity}
            </div>
            <div>
              <span className="font-medium">Rate:</span> ₹{isNaN(rate) ? '0.00' : rate.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Total Amount:</span> ₹{isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Assignment Information</h2>
          
          {order.assigned_to ? (
            <div className="mb-6">
              <span className="font-medium">Currently Assigned To:</span>{' '}
              {order.assigned_to}
            </div>
          ) : (
            <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded">
              Not assigned to any staff member
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Assign/Reassign Staff</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                value={selectedStaff} 
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow max-w-md"
              >
                <option value="">Select a staff member</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {`${s.first_name} ${s.last_name}`}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={handleAssignStaff} 
                disabled={!selectedStaff || loading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  !selectedStaff || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Assigning...
                  </span>
                ) : 'Assign Staff'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetails;