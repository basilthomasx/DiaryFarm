import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens, state, etc.)
    
    // Navigate back to the previous page instead of home page
    navigate(-1);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold hover:bg-green-700 transition-colors"
          >
            A
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;