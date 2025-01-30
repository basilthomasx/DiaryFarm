import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import StaffLogin from './components/StaffLogin';
import ProductDisplay from './components/ProductDisplay';
import AdminDashboard from './components/AdminDashboard';
import CustomerSignUp from './components/CustomerSignUp';
import CustomerLogin from './components/CustomerLogin';
import About from './components/About';
import ProductsManagement from './components/ProductsManagement';



const App = () => {
  return (
    <Router>
      <main className="flex-grow">
      
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/admin-login" element={<AdminLogin/>}></Route>
            <Route path="/staff-login" element={<StaffLogin/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/About" element={<About/>}></Route>      
            <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
            <Route path="/customer/signup" element={<CustomerSignUp />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/admin/product-management" element={<ProductsManagement />} />
            <Route path="/products" element={<ProductDisplay />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;