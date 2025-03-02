// src/components/DeliveryList.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeliveryList() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, [status]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/deliveries?status=${status}`);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryClick = (id) => {
    navigate(`/staff/delivery/${id}`);
  };

  const getStatusClass = (status) => {
    return status === 'completed' 
      ? 'bg-green-500 text-white' 
      : 'bg-yellow-400 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getTitle = () => {
    if (status === 'all') return 'All Deliveries';
    if (status === 'completed') return 'Completed Deliveries';
    return 'Pending Deliveries';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{getTitle()}</h2>
      
      {loading ? (
        <p className="text-gray-600">Loading deliveries...</p>
      ) : deliveries.length === 0 ? (
        <p className="text-gray-600">No deliveries found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr 
                  key={delivery.id} 
                  onClick={() => handleDeliveryClick(delivery.id)}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                >
                  <td className="py-3 px-4">{delivery.id}</td>
                  <td className="py-3 px-4">{delivery.customer_name}</td>
                  <td className="py-3 px-4">{delivery.product_name}</td>
                  <td className="py-3 px-4">{formatDate(delivery.delivery_due_date)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(delivery.delivery_status)}`}>
                      {delivery.delivery_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button 
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
        onClick={() => navigate('/staff/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default DeliveryList;
