import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import StaffLogin from './components/StaffLogin';
import BProduct from './components/BProduct';
import AdminDashboard from './components/AdminDashboard';
import CustomerSignUp from './components/CustomerSignUp';
import CustomerLogin from './components/CustomerLogin';



const App = () => {
  return (
    <Router>
      <main className="flex-grow">
      
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/admin-login" element={<AdminLogin/>}></Route>
            <Route path="/staff-login" element={<StaffLogin/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/products" element={<BProduct/>}></Route>
      
            <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
            <Route path="/customer/signup" element={<CustomerSignUp />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            
        </Routes>
      </main>
    </Router>
  );
};

export default App;