import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowLeft, 
  Droplet, 
  Thermometer, 
  CircleAlert,
  BarChart, 
  Beaker, 
  ClipboardList 
} from 'lucide-react';

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

  // Get quality indicator color based on parameter and value
  const getQualityColor = (param, value) => {
    // These thresholds are examples and can be adjusted based on dairy standards
    const thresholds = {
      fat: { low: 3.0, high: 4.5 },
      protein: { low: 3.0, high: 3.5 },
      lactose: { low: 4.5, high: 5.0 },
      snf: { low: 8.5, high: 9.0 },
      temperature: { low: 3.0, high: 5.0 }, // for raw milk storage
      ph: { low: 6.6, high: 6.8 } // normal milk pH
    };
    
    if (!thresholds[param]) return 'bg-gray-100';
    
    const { low, high } = thresholds[param];
    const numValue = parseFloat(value);
    
    if (numValue < low) return 'bg-red-50';
    if (numValue > high) return (param === 'temperature' ? 'bg-red-50' : 'bg-yellow-50');
    return 'bg-green-50';
  };

  // Get icon for each parameter
  const getParameterIcon = (param) => {
    switch(param) {
      case 'fat':
        return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'protein':
        return <BarChart className="w-5 h-5 text-green-500" />;
      case 'lactose':
        return <Beaker className="w-5 h-5 text-purple-500" />;
      case 'snf':
        return <BarChart className="w-5 h-5 text-yellow-500" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-red-500" />;
      case 'ph':
        return <CircleAlert className="w-5 h-5 text-indigo-500" />;
      default:
        return <ClipboardList className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800">Milk Quality Management</h1>
            <p className="text-gray-500 mt-1">Monitor and update milk quality parameters</p>
          </div>
          
          {/* Today's Milk Quality Display Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
              Today's Milk Quality
            </h2>
            
            {todayData ? (
              <div>
                <div className="text-center mb-4 text-gray-600">
                  <span className="font-medium">{formatDate(new Date().toISOString().split('T')[0])}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {['fat', 'protein', 'lactose', 'snf', 'temperature', 'ph'].map(param => (
                    <div key={param} className={`${getQualityColor(param, todayData[param])} rounded-lg p-4 transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-700 capitalize">{param}</div>
                        {getParameterIcon(param)}
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {todayData[param]}
                        {param === 'temperature' ? '°C' : param === 'ph' ? '' : '%'}
                      </div>
                    </div>
                  ))}
                </div>
                
                {todayData.remarks && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center mb-2 text-gray-700">
                      <ClipboardList className="w-4 h-4 mr-2" />
                      <span className="font-medium">Remarks:</span>
                    </div>
                    <div className="text-gray-700">{todayData.remarks}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
                <div className="text-gray-500 mb-2">No milk quality data recorded for today.</div>
                {date === new Date().toISOString().split('T')[0] && 
                  <div className="text-blue-600 font-medium">Use the form below to add today's data.</div>
                }
              </div>
            )}
          </div>
        </div>
        
        {/* Update Form Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-green-500" />
              Update Milk Quality Data
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {message && (
              <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['fat', 'protein', 'lactose', 'snf', 'temperature', 'ph'].map(param => (
                  <div key={param} className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2 capitalize flex items-center">
                      {getParameterIcon(param)}
                      <span className="ml-2">
                        {param} {param === 'temperature' ? '(°C)' : '(%)'}:
                      </span>
                    </label>
                    <input
                      type="number"
                      step={constraints[param].step}
                      min={constraints[param].min}
                      max={constraints[param].max}
                      name={param}
                      value={milkQuality[param]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                      placeholder={`Range: ${constraints[param].min}-${constraints[param].max}`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2 text-gray-500" />
                  Remarks:
                </label>
                <textarea
                  name="remarks"
                  value={milkQuality.remarks}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="3"
                  maxLength="500"
                  placeholder="Add any observations or notes about the milk quality"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:bg-blue-300 font-medium text-lg"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Milk Quality'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkQualityUpdate;