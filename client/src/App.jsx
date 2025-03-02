import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import StaffLogin from './components/StaffLogin';
import CustomerSignUp from './components/CustomerSignUp';
import CustomerLogin from './components/CustomerLogin';
import About from './components/About';
import ProductManagement from './components/ProductManagement';
import StaffManagement from './components/StaffManagement';
import ProductListing from './components/ProductListing';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './components/AdminDashboard';
import PaymentPage from './components/PaymentPage';
import ProductDetails from './components/ProductDetails';
import OrderDetails from './components/OrderDetails';
import OrdersList from './components/OrderList';
import HelpAndSupport from './components/HelpAndSupport';
import MilkQualityUpdate from './components/MilkQualityUpdate';
import AdminHeader from './components/AdminHeader';
import DeliveryDetails from './components/DeliveryDetails';
import DeliveryList from './components/DeliveryList';
import StaffDashboard from './components/StaffDashboard'
// import PasswordResetForm from './components/PasswordResetForm';


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
            <Route path="/customer/signup" element={<CustomerSignUp />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/staffs" element={<StaffManagement/>} />
            <Route path="/products" element={<ProductListing/>} />
            <Route path="/checkout/:id" element={<CheckoutPage/>} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/payment" element={<PaymentPage/>} />
            <Route path="/product-details/:id" element={<ProductDetails/>} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/help/and/support" element={<HelpAndSupport />} />
            <Route path="/admin/milk-quality" element={<MilkQualityUpdate />} />
            <Route path="/admin/header" element={<AdminHeader/>} />
           

            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/staff/deliveries/:status" element={<DeliveryList />} />
            <Route path="/staff/delivery/:id" element={<DeliveryDetails />} />
          
        </Routes>
        
      </main>
      
    </Router>
  );
};

export default App;