// src/components/DeliveryList.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Filter } from 'lucide-react';

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

  const handleBackClick = () => {
    navigate('/staff/dashboard');
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

  const getStatusIcon = () => {
    if (status === 'all') return 'bg-blue-100 text-blue-600';
    if (status === 'completed') return 'bg-green-100 text-green-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center mb-6">
        <button 
            onClick={handleBackClick}
            className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${getStatusIcon()}`}>
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deliveries...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No deliveries found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="font-medium text-gray-700">
                Showing {deliveries.length} deliveries
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Filter className="w-4 h-4 mr-1" />
                <span>Status: <span className="font-medium capitalize">{status}</span></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-3 px-4 text-left font-medium">ID</th>
                    <th className="py-3 px-4 text-left font-medium">Customer</th>
                    <th className="py-3 px-4 text-left font-medium">Product</th>
                    <th className="py-3 px-4 text-left font-medium">Due Date</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(delivery => (
                    <tr 
                      key={delivery.id} 
                      onClick={() => handleDeliveryClick(delivery.id)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <td className="py-3 px-4 font-medium text-gray-700">#{delivery.id}</td>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryList;