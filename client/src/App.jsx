import React from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './components/Home';
import CustomerLogin from './components/CustomerLogin';
import AdminLogin from './components/AdminLogin';
import StaffLogin from './components/StaffLogin';

const App = () => {
  return (
    <Router>
      <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/customer-login" element={<CustomerLogin/>}></Route>
            <Route path="/admin-login" element={<AdminLogin/>}></Route>
            <Route path="/staff-login" element={<StaffLogin/>}></Route>
        </Routes>
      </main>
    </Router>
  );
};

export default App;