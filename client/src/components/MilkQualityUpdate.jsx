import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';

const MilkQualityUpdate = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayData, setTodayData] = useState(null);
  const [milkQuality, setMilkQuality] = useState({
    fat: '',
    protein: '',
    lactose: '',
    snf: '',
    temperature: '',
    ph: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Input field constraints based on database schema
  const constraints = {
    fat: { min: 0, max: 99.99, step: 0.01 },
    protein: { min: 0, max: 99.99, step: 0.01 },
    lactose: { min: 0, max: 99.99, step: 0.01 },
    snf: { min: 0, max: 99.99, step: 0.01 },
    temperature: { min: 0, max: 999.9, step: 0.1 },
    ph: { min: 0, max: 14.00, step: 0.01 }
  };

  // Fetch both today's data for display and the selected date's data for editing
  useEffect(() => {
    fetchSelectedDateRecord();
    fetchTodayRecord();
  }, [date]);
  
  const fetchTodayRecord = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:3000/api/milk-quality/${today}`);
      if (response.data) {
        setTodayData(response.data);
      } else {
        setTodayData(null);
      }
    } catch (error) {
      console.error('Error fetching today\'s record:', error);
      setTodayData(null);
    }
  };

  const fetchSelectedDateRecord = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/milk-quality/${date}`);
      if (response.data) {
        setMilkQuality(response.data);
      } else {
        // Reset form if no record found
        setMilkQuality({
          fat: '',
          protein: '',
          lactose: '',
          snf: '',
          temperature: '',
          ph: '',
          remarks: ''
        });
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      setMessage('Error fetching record. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Input validation based on constraints
    if (name in constraints) {
      const numValue = parseFloat(value);
      const { min, max } = constraints[name];
      
      // Allow empty string for clearing fields
      if (value === '') {
        setMilkQuality({
          ...milkQuality,
          [name]: value
        });
        return;
      }
      
      // Check if value is within allowed range
      if (isNaN(numValue) || numValue < min || numValue > max) {
        // Don't update state if invalid
        return;
      }
    }
    
    setMilkQuality({
      ...milkQuality,
      [name]: value
    });
  };

  const validateBeforeSubmit = () => {
    for (const field in constraints) {
      const value = parseFloat(milkQuality[field]);
      const { min, max } = constraints[field];
      
      if (isNaN(value) || value < min || value > max) {
        setMessage(`Invalid value for ${field}. Must be between ${min} and ${max}.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateBeforeSubmit()) {
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:3000/api/milk-quality/${date}`, milkQuality);
      setMessage('Milk quality data updated successfully!');
      
      // If we're updating today's data, refresh the today display
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        fetchTodayRecord();
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating record:', error);
      setMessage(`Error updating milk quality data: ${error.response?.data?.error || error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen">
     <AdminHeader/>
     <div className="container  px-4 mt-4 mb-2">
    <button 
      onClick={() => window.history.back()} 
      className="flex items-center text-blue-600 hover:text-blue-800"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      Back
    </button>
  </div>
      <h1 className="text-3xl font-bold mb-5 text-center">Milk Quality Dashboard</h1>
      
      {/* Today's Milk Quality Display Section */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Today's Milk Quality</h2>
        
        {todayData ? (
          <div>
            <div className="text-center mb-2 text-gray-600">
              <span className="font-medium">{formatDate(new Date().toISOString().split('T')[0])}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">Fat</div>
                <div className="text-xl font-semibold">{todayData.fat}%</div>
              </div>
              <div className="bg-green-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">Protein</div>
                <div className="text-xl font-semibold">{todayData.protein}%</div>
              </div>
              <div className="bg-purple-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">Lactose</div>
                <div className="text-xl font-semibold">{todayData.lactose}%</div>
              </div>
              <div className="bg-yellow-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">SNF</div>
                <div className="text-xl font-semibold">{todayData.snf}%</div>
              </div>
              <div className="bg-red-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">Temperature</div>
                <div className="text-xl font-semibold">{todayData.temperature}°C</div>
              </div>
              <div className="bg-indigo-50 rounded p-3 text-center">
                <div className="text-sm text-gray-500">pH Level</div>
                <div className="text-xl font-semibold">{todayData.ph}</div>
              </div>
            </div>
            
            {todayData.remarks && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-500 mb-1">Remarks:</div>
                <div className="text-gray-700">{todayData.remarks}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No milk quality data recorded for today.
            {date === new Date().toISOString().split('T')[0] && 
              <div className="mt-2 text-blue-600">Use the form below to add today's data.</div>
            }
          </div>
        )}
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-8"></div>
      
      {/* Update Form Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Update Milk Quality Data</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {message && (
          <div className={`p-3 mb-4 rounded ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Fat (%):</label>
              <input
                type="number"
                step={constraints.fat.step}
                min={constraints.fat.min}
                max={constraints.fat.max}
                name="fat"
                value={milkQuality.fat}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.fat.min}-${constraints.fat.max}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Protein (%):</label>
              <input
                type="number"
                step={constraints.protein.step}
                min={constraints.protein.min}
                max={constraints.protein.max}
                name="protein"
                value={milkQuality.protein}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.protein.min}-${constraints.protein.max}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Lactose (%):</label>
              <input
                type="number"
                step={constraints.lactose.step}
                min={constraints.lactose.min}
                max={constraints.lactose.max}
                name="lactose"
                value={milkQuality.lactose}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.lactose.min}-${constraints.lactose.max}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">SNF (%):</label>
              <input
                type="number"
                step={constraints.snf.step}
                min={constraints.snf.min}
                max={constraints.snf.max}
                name="snf"
                value={milkQuality.snf}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.snf.min}-${constraints.snf.max}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Temperature (°C):</label>
              <input
                type="number"
                step={constraints.temperature.step}
                min={constraints.temperature.min}
                max={constraints.temperature.max}
                name="temperature"
                value={milkQuality.temperature}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.temperature.min}-${constraints.temperature.max}`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">pH Level:</label>
              <input
                type="number"
                step={constraints.ph.step}
                min={constraints.ph.min}
                max={constraints.ph.max}
                name="ph"
                value={milkQuality.ph}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                placeholder={`Range: ${constraints.ph.min}-${constraints.ph.max}`}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Remarks:</label>
            <textarea
              name="remarks"
              value={milkQuality.remarks}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
              maxLength="500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Milk Quality'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MilkQualityUpdate;