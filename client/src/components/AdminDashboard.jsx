import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, PhoneCall, Clock } from 'lucide-react';
import AdminHeader from './AdminHeader';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [callbackRequests, setCallbackRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const fetchCallbackRequests = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/callback-requests');
        if (!response.ok) {
          throw new Error('Failed to fetch callback requests');
        }
        const data = await response.json();
        setCallbackRequests(data);
      } catch (error) {
        console.error('Error fetching callback requests:', error);
      }
    };

    if (showRequests) {
      fetchCallbackRequests();
    }
  }, [showRequests]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/callback-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedRequest = await response.json();
      setCallbackRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <AdminHeader />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Dairy Farm Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/product-management')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
            </div>
            <p className="text-gray-600">
              Manage your dairy products inventory, track stock levels, and update product information.
            </p>
          </div>

          <div 
            onClick={() => navigate('/staffs')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Staff Management</h2>
            </div>
            <p className="text-gray-600">
              Manage farm staff, track schedules, and handle employee information.
            </p>
          </div>

          <div 
            onClick={() => navigate('/orders')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            </div>
            <p className="text-gray-600">
              View and manage customer orders and deliveries.
            </p>
          </div>

          <div 
            onClick={() => navigate('/admin/milk-quality')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-yellow-500"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 text-yellow-600 mr-3 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2h8"></path>
                  <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Milk Quality</h2>
            </div>
            <p className="text-gray-600">
              Track and analyze milk quality metrics and testing results.
            </p>
          </div>

          <div 
            onClick={() => setShowRequests(true)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow relative border-l-4 border-orange-500"
          >
            <div className="flex items-center mb-4">
              <PhoneCall className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Callback Requests</h2>
              
              {callbackRequests.filter(req => req.status === 'pending').length > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {callbackRequests.filter(req => req.status === 'pending').length}
                </span>
              )}
            </div>
            <p className="text-gray-600">
              View and manage customer callback requests
            </p>
          </div>
          
        
        </div>

        {showRequests && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Callback Requests</h2>
                <button 
                  onClick={() => setShowRequests(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {callbackRequests.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No callback requests available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {callbackRequests.map((request) => (
                        <tr key={request.id} className={request.status === 'pending' ? 'bg-yellow-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">{request.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{request.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              {new Date(request.requested_at).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  'bg-gray-100 text-gray-800'}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {request.status === 'pending' ? (
                              <button
                                onClick={() => handleStatusChange(request.id, 'completed')}
                                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200"
                              >
                                Mark as completed
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStatusChange(request.id, 'pending')}
                                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
                              >
                                Reopen
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;