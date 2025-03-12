import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

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
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchDeliveryDetails();
  }, [id]);

  useEffect(() => {
    if (message.text) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
  const handleBackClick = () => {
    navigate('/staff/dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getMessageClass = (type) => {
    return type === 'success' 
      ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
      : 'bg-red-100 border-l-4 border-red-500 text-red-700';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <button 
            onClick={handleBackClick}
            className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading delivery details...</span>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <button 
                    onClick={handleBackClick}
                    className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Delivery not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {/* Back button in top left corner */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      
      {/* Page title with centered alignment */}
      <h2 className="text-center text-2xl font-bold mb-6 pt-10 text-gray-800">Delivery Details #{delivery.id}</h2>
      
      {/* Toast notifications */}
      {showMessage && message.text && (
        <div 
          className={`fixed top-6 right-6 p-4 rounded-lg shadow-md ${getMessageClass(message.type)} transform transition-transform duration-300 z-50 flex items-center`}
          style={{ maxWidth: '400px' }}
        >
          {message.type === 'success' ? (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          )}
          <div className="flex-1">{message.text}</div>
          <button 
            onClick={() => setShowMessage(false)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Customer Information</h3>
          <p className="mb-2"><span className="font-medium">Name:</span> {delivery.customer_name}</p>
          <p className="mb-2"><span className="font-medium">Phone:</span> {delivery.customer_phone}</p>
          <p className="mb-2"><span className="font-medium">Email:</span> {delivery.customer_email}</p>
          <p className="mb-2"><span className="font-medium">Address:</span> {delivery.customer_house_number}, {delivery.customer_postal_code}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Product Information</h3>
          <p className="mb-2"><span className="font-medium">Product:</span> {delivery.product_name}</p>
          <p className="mb-2"><span className="font-medium">Description:</span> {delivery.product_description || 'No description available'}</p>
          <p className="mb-2"><span className="font-medium">Quantity:</span> {delivery.quantity}</p>
          <p className="mb-2"><span className="font-medium">Rate:</span> ${delivery.rate}</p>
          <p className="mb-2"><span className="font-medium">Total Amount:</span> ${delivery.total_amount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Delivery Information</h3>
          <p className="mb-2"><span className="font-medium">Assigned To:</span> {delivery.assigned_to || 'Not assigned'}</p>
          <p className="mb-2"><span className="font-medium">Due Date:</span> {formatDate(delivery.delivery_due_date)}</p>
          <p className="mb-2"><span className="font-medium">Actual Delivery Date:</span> {formatDate(delivery.actual_delivery_date)}</p>
          <p className="mb-2 flex items-center">
            <span className="font-medium">Status:</span> 
            <span className={`ml-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
              delivery.delivery_status === 'completed' 
                ? 'bg-green-500 text-white' 
                : delivery.delivery_status === 'pending' 
                  ? 'bg-yellow-400 text-gray-800' 
                  : 'bg-blue-400 text-white'
            }`}>
              {delivery.delivery_status.charAt(0).toUpperCase() + delivery.delivery_status.slice(1)}
            </span>
          </p>
        </div>
      </div>
      
      {delivery.delivery_proof_url && (
        <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">Delivery Proof</h3>
          <div className="flex justify-center">
            <div className="relative group">
              <img 
                src={delivery.delivery_proof_url} 
                alt="Delivery Proof" 
                className="max-w-full max-h-64 rounded-md shadow-md cursor-pointer transition-transform group-hover:scale-[1.01]" 
              />
              <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={delivery.delivery_proof_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-6 text-blue-600 border-b pb-2">Update Delivery</h3>
        
        <div className="mb-4">
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">Delivery Status:</label>
          <select 
            id="status" 
            value={updatedStatus} 
            onChange={handleStatusChange}
            disabled={uploading}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="proof" className="block mb-2 font-medium text-gray-700">Upload Delivery Proof:</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 transition-colors hover:border-blue-400">
            <input 
              type="file" 
              id="proof" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Drag and drop a file here or click to select a file'}
              </p>
            </div>
          </div>
        </div>
        
        {previewUrl && (
          <div className="mb-6">
            <h4 className="font-medium mb-2 text-gray-700">Preview:</h4>
            <div className="flex justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full max-h-64 rounded-md shadow-md border border-gray-200" 
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={uploading}
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : 'Update Delivery'}
          </button>
          <button 
            type="button" 
            className={`px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => navigate(-1)}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeliveryDetails;