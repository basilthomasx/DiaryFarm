// import React, { useState } from 'react';
// import { Link } from 'lucide-react';
// import { Home, Package, Info, UserPlus2Icon, User2, Milk, ChevronUp, ChevronDown } from 'lucide-react';

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const closeAll = () => {
//     setIsDropdownOpen(false);
//     setIsMobileMenuOpen(false);
//   };

//   const navLinks = [
//     { href: '/', text: 'Home', icon: <Home className="w-5 h-5" /> },
//     { href: '/products', text: 'Products', icon: <Package className="w-5 h-5" /> },
//     { href: '/about', text: 'About', icon: <Info className="w-5 h-5" /> },
    

//   ];
  

//   return (
    
//     <div>
//       <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           <div className="flex items-center justify-between h-20">
//             <div className="flex-shrink-0 flex items-center space-x-3">
//               <Milk className="w-8 h-8 text-blue-600" />
//               <div>
//                 <h1 className="text-2xl font-bold text-blue-800">God’s Own Dairy</h1>
//                 <p className="text-sm font-bold text-green-600">ദൈവത്തിന്റെ നാട്ടിൽ നിന്ന്, ശുദ്ധിയുടെ അമൃത്</p>
//               </div>
//             </div>

//             <nav className="hidden md:flex items-center space-x-10">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.href}
//                   href={link.href}
//                   className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-300"
//                 >
//                   {link.icon && <span>{link.icon}</span>}
//                   <span className="font-medium">{link.text}</span>
//                 </a>
//               ))}

//                 {/* Desktop Login Dropdown*/}
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-200"
//               >
//                 <User2 size={20} />
//                 <span className="font-medium">Login</span>
//                 {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//               </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
//                     {['Customer', 'Staff', 'Admin'].map((userType) => (
//                       <a
//                         key={userType}
//                         href={`/${userType.toLowerCase()}-login`}
//                         className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
//                         onClick={closeAll}
//                       >
//                         {userType}
//                       </a>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </nav>

//             <button
//               className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? '✕' : '☰'}
//             </button>
//           </div>

//           {isMobileMenuOpen && (
//             <div className="md:hidden py-4">
//               <div className="flex flex-col space-y-4">
//                 {navLinks.map((link) => (
//                   <a
//                     key={link.href}
//                     href={link.href}
//                     className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
//                     onClick={closeAll}
//                   >
//                     {link.icon && <span>{link.icon}</span>}
//                     <span className="font-medium">{link.text}</span>
//                   </a>
//                 ))}

//                 <div className="border-t border-gray-200 pt-4">
//                   {['Customer', 'Staff', 'Admin'].map((userType) => (
//                     <a
//                       key={userType}
//                       href={`/${userType.toLowerCase()}-login`}
//                       className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
//                       onClick={closeAll}
//                     >
//                       <User2 className="w-5 h-5" />
//                       <span className="font-medium">{userType} Login</span>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>

//           )}
//         </div>
//       </header>

      
//     </div>
//   );
// };


// export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Info, UserPlus2Icon, User2, Milk, 
  ChevronUp, ChevronDown, LogOut, UserCircle, HelpCircle 
} from 'lucide-react';
import HelpAndSupport from './HelpAndSupport';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // For demonstration, we're using the first letter of "Customer"
      // In a real app, you would decode the token or fetch user info
      setUserName('C');
    }
  }, []);

  useEffect(() => {
    // Add event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate('/');
    // Add page reload
    window.location.reload();
  };

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Define navLinks based on login status
  const getNavLinks = () => {
    const baseLinks = [
      { href: '/', text: 'Home', icon: <Home className="w-5 h-5" /> },
      { href: '/about', text: 'About', icon: <Info className="w-5 h-5" /> },
    ];
    
    if (isLoggedIn) {
      baseLinks.splice(1, 0, { 
        href: '/products', 
        text: 'Products', 
        icon: <Package className="w-5 h-5" /> 
      });
    }
    
    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <div>
      <header className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Milk className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-blue-800">God's Own Dairy</h1>
                <p className="text-lg font-bold text-green-600">പാലിന്റെ മേന്മ, നാടിന്റെ നന്മ...</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-300"
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span className="font-medium">{link.text}</span>
                </a>
              ))}

              {/* Dynamic Login/User section */}
              <div className="relative" ref={dropdownRef}>
                {isLoggedIn ? (
                  // User icon with first letter after login
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                  >
                    {userName}
                  </button>
                ) : (
                  // Login dropdown before login
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-green-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <User2 size={20} />
                    <span className="font-medium">Login</span>
                    {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {isLoggedIn ? (
                      // After login options
                      <>
                        <a
                          href="/profile"
                          className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          onClick={closeAll}
                        >
                          <UserCircle size={18} />
                          <span>Profile</span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      // Before login options
                      ['Customer', 'Staff', 'Admin'].map((userType) => (
                        <a
                          key={userType}
                          href={`/${userType.toLowerCase()}-login`}
                          className="block px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          onClick={closeAll}
                        >
                          {userType}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
            </nav>

            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                    onClick={closeAll}
                  >
                    {link.icon && <span>{link.icon}</span>}
                    <span className="font-medium">{link.text}</span>
                  </a>
                ))}

                <div className="border-t border-gray-200 pt-4">
                  {isLoggedIn ? (
                    <>
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                        onClick={closeAll}
                      >
                        <UserCircle className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full text-left text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    ['Customer', 'Staff', 'Admin'].map((userType) => (
                      <a
                        key={userType}
                        href={`/${userType.toLowerCase()}-login`}
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 px-4 py-2.5 rounded-md transition-colors duration-200"
                        onClick={closeAll}
                      >
                        <User2 className="w-5 h-5" />
                        <span className="font-medium">{userType} Login</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
            
          )}
          <HelpAndSupport/>
        </div>
      </header>
    </div>
  );
};

export default Header;





