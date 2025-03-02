// src/components/DeliveryDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchDeliveryDetails();
  }, [id]);

  const fetchDeliveryDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/deliveries/${id}`);
      setDelivery(response.data);
      setUpdatedStatus(response.data.delivery_status);
    } catch (error) {
      console.error('Error fetching delivery details:', error);
      setMessage({ text: 'Failed to load delivery details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (e) => {
    setUpdatedStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (updatedStatus === 'completed' && !selectedFile && !delivery.delivery_proof_url) {
      setMessage({ text: 'Please upload proof of delivery for completed status', type: 'error' });
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('delivery_status', updatedStatus);
    if (selectedFile) {
      formData.append('delivery_proof', selectedFile);
    }
    
    if (updatedStatus === 'completed') {
      formData.append('actual_delivery_date', new Date().toISOString());
    }

    try {
      await axios.put(`http://localhost:3000/api/deliveries/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({ text: 'Delivery updated successfully', type: 'success' });
      fetchDeliveryDetails();
    } catch (error) {
      console.error('Error updating delivery:', error);
      setMessage({ text: 'Failed to update delivery', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getMessageClass = (type) => {
    return type === 'success' 
      ? 'bg-green-100 border-green-400 text-green-700' 
      : 'bg-red-100 border-red-400 text-red-700';
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4 text-gray-600">Loading delivery details...</div>;
  }

  if (!delivery) {
    return <div className="max-w-6xl mx-auto p-4 text-red-600">Delivery not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Delivery Details #{delivery.id}</h2>
      
      {message.text && (
        <div className={`mb-6 p-4 border rounded ${getMessageClass(message.type)}`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Customer Information</h3>
          <p className="mb-2"><span className="font-medium">Name:</span> {delivery.customer_name}</p>
          <p className="mb-2"><span className="font-medium">Phone:</span> {delivery.customer_phone}</p>
          <p className="mb-2"><span className="font-medium">Email:</span> {delivery.customer_email}</p>
          <p className="mb-2"><span className="font-medium">Address:</span> {delivery.customer_house_number}, {delivery.customer_postal_code}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Product Information</h3>
          <p className="mb-2"><span className="font-medium">Product:</span> {delivery.product_name}</p>
          <p className="mb-2"><span className="font-medium">Description:</span> {delivery.product_description || 'No description available'}</p>
          <p className="mb-2"><span className="font-medium">Quantity:</span> {delivery.quantity}</p>
          <p className="mb-2"><span className="font-medium">Rate:</span> ${delivery.rate}</p>
          <p className="mb-2"><span className="font-medium">Total Amount:</span> ${delivery.total_amount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Delivery Information</h3>
          <p className="mb-2"><span className="font-medium">Assigned To:</span> {delivery.assigned_to || 'Not assigned'}</p>
          <p className="mb-2"><span className="font-medium">Due Date:</span> {formatDate(delivery.delivery_due_date)}</p>
          <p className="mb-2"><span className="font-medium">Actual Delivery Date:</span> {formatDate(delivery.actual_delivery_date)}</p>
          <p className="mb-2">
            <span className="font-medium">Status:</span> 
            <span className={`ml-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${delivery.delivery_status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-800'}`}>
              {delivery.delivery_status}
            </span>
          </p>
        </div>
      </div>
      
      {delivery.delivery_proof_url && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Delivery Proof</h3>
          <div className="flex justify-center">
            <img 
              src={delivery.delivery_proof_url} 
              alt="Delivery Proof" 
              className="max-w-full max-h-64 rounded-md shadow" 
            />
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-6 text-blue-600 border-b pb-2">Update Delivery</h3>
        
        <div className="mb-4">
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">Delivery Status:</label>
          <select 
            id="status" 
            value={updatedStatus} 
            onChange={handleStatusChange}
            disabled={uploading}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="proof" className="block mb-2 font-medium text-gray-700">Upload Delivery Proof:</label>
          <input 
            type="file" 
            id="proof" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {previewUrl && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-gray-700">Preview:</h4>
            <div className="flex justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full max-h-64 rounded-md shadow" 
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={uploading}
          >
            {uploading ? 'Updating...' : 'Update Delivery'}
          </button>
          <button 
            type="button" 
            className={`px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-150 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigate(-1)}
            disabled={uploading}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeliveryDetails;