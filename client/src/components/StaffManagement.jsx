import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Edit, Trash2, Plus, Search, X, Upload, Mail, Phone, Tag, Calendar,  Save, Loader2, ArrowLeft, IndianRupee } from 'lucide-react';

// Helper function for image URL handling
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-staff.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};

// Staff Form Component (Modal)
const StaffFormModal = ({ isOpen, onClose, staffToEdit, onSuccess }) => {
  const isEditMode = !!staffToEdit;
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
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

  // Reset form when modal opens/closes or when staffToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && staffToEdit) {
        setFormData({
          first_name: staffToEdit.first_name || '',
          last_name: staffToEdit.last_name || '',
          email: staffToEdit.email || '',
          phone: staffToEdit.phone || '',
          role: staffToEdit.role || '',
          joining_date: staffToEdit.joining_date ? staffToEdit.joining_date.split('T')[0] : '',
          salary: staffToEdit.salary || '',
          image: null
        });
        
        if (staffToEdit.image_url) {
          setPreviewImage(getImageUrl(staffToEdit.image_url));
        } else {
          setPreviewImage(null);
        }
      } else {
        // Reset form for new staff
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
        setPreviewImage(null);
      }
    }
  }, [isOpen, staffToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create a FormData object to handle the file upload
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          data.append('image', formData[key]);
        } else if (key !== 'image') {
          data.append(key, formData[key]);
        }
      });
      
      let response;
      if (isEditMode) {
        response = await axios.put(`http://localhost:3000/api/staff/${staffToEdit.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('http://localhost:3000/api/staff', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Call the success callback
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image upload section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Staff profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-staff.jpg';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              Upload Photo
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Employment Information */}
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <div className="relative">
              <Tag className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-10 p-2 border rounded-md"
                required
              >
                
                <option value="Delivery Staff">Delivery Staff</option>
                
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Joining Date *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Salary *</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors shadow-md disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Staff List Component with integrated modal
const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  
  // Add state or props for navigation if needed
  const handleBackNavigation = () => {
    // You can implement your navigation logic here
    // For example: router.push('/dashboard') or window.history.back()
    console.log('Navigating back...');
    window.history.back(); // Default behavior - go back to previous page
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      alert('Failed to load staff list. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staffMember) => {
    setCurrentStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`http://localhost:3000/api/staff/${id}`);
        // Remove from state without refetching
        setStaff(staff.filter(member => member.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member.');
      }
    }
  };

  const handleFormSuccess = (updatedStaff) => {
    if (currentStaff) {
      // Update existing staff in the list
      setStaff(staff.map(member => 
        member.id === updatedStaff.id ? updatedStaff : member
      ));
    } else {
      // Add new staff to the list
      setStaff([...staff, updatedStaff]);
    }
  };

  const filteredStaff = staff.filter(
    member => 
      member.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto p-4 md:p-8">
        {/* Back Button */}
       <button 
                 onClick={() => window.history.back()}
                 className="fixed top-4 left-4 z-40 flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group"
               >
                 <div className="relative">
                   <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                 </div>
                 <span className="font-medium">Back</span>
               </button>
      
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-2 border rounded-md w-full md:w-64"
              />
            </div>
            
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Staff
            </button>
          </div>
        </div>
        
        {/* Staff List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Loading staff list...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length > 0 ? (
              filteredStaff.map(member => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex items-center p-4 border-b">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                      <img 
                        src={getImageUrl(member.image_url)} 
                        alt={`${member.first_name} ${member.last_name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-staff.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">{`${member.first_name} ${member.last_name}`}</h2>
                      <p className="text-blue-600">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <p>
                        <span className="font-medium">Email:</span> {member.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {member.phone}
                      </p>
                      <p>
                        <span className="font-medium">Joined:</span> {new Date(member.joining_date).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Salary:</span> ₹{member.salary}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex border-t">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 transition-colors text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-gray-100 transition-colors text-red-600 border-l"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Staff Found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? "No staff members match your search criteria." 
                    : "There are no staff members in the database yet."}
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Staff Member
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff Form Modal */}
      <StaffFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffToEdit={currentStaff}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default StaffManagement;