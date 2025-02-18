import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Pencil, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Briefcase,
  Image as ImageIcon,
  X,
  Search,
  User,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api/staff';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    joining_date: '',
    salary: '',
    image: null
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load staff data. Please try again later.');
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staffList.filter(staff => 
    staff.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formDataToSend.append('image', formData[key]);
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = selectedStaff ? `${API_BASE_URL}/${selectedStaff.id}` : API_BASE_URL;
      const method = selectedStaff ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save staff member');
      }
      
      await fetchStaff();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving staff:', error);
      setSubmitError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete staff member');
        }
        await fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        setError('Failed to delete staff member. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: '',
      joining_date: '',
      salary: '',
      image: null
    });
    setSelectedStaff(null);
    setSubmitError(null);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Staff Management</h1>
          <button 
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={20} />
            Add New Staff
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      )}

      {/* Staff Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No staff members found
            </div>
          ) : (
            filteredStaff.map(staff => (
              <div key={staff.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    {staff.image_url ? (
  <img 
    src={`${API_BASE_URL}${staff.image_url}`} 
    alt={`${staff.first_name} ${staff.last_name}`}
    className="w-full h-full rounded-full object-cover"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = 'https://via.placeholder.com/150'; // Fallback image
    }}
  />
) : (
  <User size={32} className="text-gray-400" />
)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {staff.first_name} {staff.last_name}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Briefcase size={16} />
                        {staff.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {staff.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {staff.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(staff.joining_date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      ${staff.salary}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedStaff(staff);
                        setFormData(staff);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-800">
                  {selectedStaff ? 'Edit Staff' : 'Add New Staff'}
                </h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedStaff ? 'Update' : 'Add'} Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;