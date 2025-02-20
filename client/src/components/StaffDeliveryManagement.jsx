import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  MapPin
} from 'lucide-react';

const StaffDeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/staff/assigned-orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleDeliveryStatusUpdate = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/delivery-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus: status }),
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleDeliveryProofUpload = async (orderId, file) => {
    const formData = new FormData();
    formData.append('deliveryProof', file);

    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}/delivery-proof`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error uploading delivery proof:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Truck size={24} />
        <h1 className="text-2xl font-bold">Delivery Management</h1>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package size={20} />
                  <h2 className="font-semibold text-lg">{order.product_name}</h2>
                </div>
                <p className="text-gray-600">Quantity: {order.quantity}</p>
                
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <div>
                    <p className="text-gray-600">
                      {order.customer_house_number}, {order.customer_postal_code}
                    </p>
                    <p className="text-gray-600">{order.customer_name}</p>
                    <p className="text-gray-600">{order.customer_phone}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Status and Proof */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={20} />
                    <h3 className="font-semibold">Delivery Status</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.delivery_status)}
                    <select
                      className="w-full p-2 border rounded"
                      value={order.delivery_status || 'pending'}
                      onChange={(e) => handleDeliveryStatusUpdate(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Upload size={20} />
                    <span className="font-semibold">Delivery Proof</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDeliveryProofUpload(order.id, e.target.files[0])}
                    className="w-full"
                  />
                  {order.delivery_proof_url && (
                    <img
                      src={order.delivery_proof_url}
                      alt="Delivery Proof"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDeliveryManagement;