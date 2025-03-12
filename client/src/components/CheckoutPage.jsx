import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home,
  Package,
  CreditCard,
  Loader2,
  AlertCircle,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  IndianRupee,
  ChevronDown,
  Calendar,
  Clock,
  X,
  Wallet,
  CheckCircle
} from 'lucide-react';
import Header from './Header';



const AlertModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative animate-fadeIn shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close alert"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          {type === 'success' ? (
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
          
          <h3 className="text-2xl font-bold mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg text-white font-medium 
              ${type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} 
              transition-colors shadow-md`}
          >
            {type === 'success' ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Payment Selection Modal Component
const PaymentModal = ({ isOpen, onClose, onSelectPayment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-gray-800">Select Payment Method</h3>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectPayment('cod')}
            className="w-full flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-lg font-medium">Cash on Delivery</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </button>

          <button
            onClick={() => onSelectPayment('online')}
            className="w-full flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-lg font-medium">Online Payment</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    postal_code: "679333",
    house_number: "",
    quantity: 1,
    delivery_date: "",
    delivery_time: "morning"
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  
  
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });
 
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setTotalPrice(data.rate);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!customer.name.trim()) errors.name = "Name is required";
    if (!customer.phone.trim()) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(customer.phone)) errors.phone = "Please enter a valid 10-digit phone number";
    
    if (!customer.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(customer.email)) errors.email = "Please enter a valid email address";
    
    if (!customer.house_number.trim()) errors.house_number = "House number is required";
    if (!customer.delivery_date) errors.delivery_date = "Delivery date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
   
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: null});
    }
    
    if (name === "quantity") {
      const qty = parseInt(value || 1, 10);
      if (qty > 0) {
        setTotalPrice(product.rate * qty);
      }
    }
  };

  const handleQuantityChange = (increment) => {
    const newQuantity = Math.max(1, customer.quantity + increment);
    setCustomer({ ...customer, quantity: newQuantity });
    setTotalPrice(product.rate * newQuantity);
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setIsPaymentModalOpen(true);
    } else {
     
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  const handlePaymentSelection = async (paymentMethod) => {
    setIsPaymentModalOpen(false);

    try {
      const response = await fetch('http://localhost:3000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          customer_postal_code: customer.postal_code,
          customer_house_number: customer.house_number,
          product_id: parseInt(id),
          quantity: parseInt(customer.quantity),
          delivery_due_date: customer.delivery_date,
          actual_delivery_date: new Date(`${customer.delivery_date} ${
            customer.delivery_time === 'morning' ? '09:00:00' : '17:00:00'
          }`).toISOString(),
          payment_method: paymentMethod
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (paymentMethod === 'cod') {
          
          setAlertModal({
            isOpen: true,
            title: 'Order Successful!',
            message: 'Your order has been placed successfully with Cash on Delivery option. You will receive a confirmation email shortly.',
            type: 'success'
          });
        } else {
          
          setAlertModal({
            isOpen: true,
            title: 'Order Created!',
            message: 'Your order has been created successfully. You will be redirected to the payment gateway.',
            type: 'success'
          });
        }
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
     
      setAlertModal({
        isOpen: true,
        title: 'Order Failed',
        message: error.message || 'Failed to process order. Please try again.',
        type: 'error'
      });
    }
  };
  
  const handleCloseAlert = () => {
    setAlertModal({...alertModal, isOpen: false});
    if (alertModal.type === 'success') {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
        <p className="text-gray-600 text-lg">Loading checkout details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-red-500">
        <AlertCircle className="w-16 h-16" />
        <p className="text-lg">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Products
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen mx-auto grid grid-cols-1 md:grid-cols-3 gap-11 p-11">
        <Header/>
        
        <div className="md:col-span-5">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to product details</span>
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
            Checkout
          </h1>
        </div>
        {/* Main Form Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Customer Information</h2>
          
          {/* Customer Details Form */}
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="Your full name"
                />
              </div>
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="10-digit mobile number"
                />
              </div>
              {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="yourname@example.com"
                />
              </div>
              {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="postal_code"
                    name="postal_code"
                    value={customer.postal_code}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="679333">679331 - Pathiripadam, Kerala</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="house_number" className="block text-sm font-medium text-gray-700 mb-1">House/Building Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Home className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="house_number"
                    type="text"
                    name="house_number"
                    value={customer.house_number}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.house_number ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="House/Apt/Building number"
                  />
                </div>
                {formErrors.house_number && <p className="mt-1 text-sm text-red-600">{formErrors.house_number}</p>}
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-8 text-gray-800">Delivery Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="delivery_date"
                    type="date"
                    name="delivery_date"
                    value={customer.delivery_date}
                    onChange={handleChange}
                    min={minDate}
                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.delivery_date ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  />
                </div>
                {formErrors.delivery_date && <p className="mt-1 text-sm text-red-600">{formErrors.delivery_date}</p>}
              </div>

              <div>
                <label htmlFor="delivery_time" className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="delivery_time"
                    name="delivery_time"
                    value={customer.delivery_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="morning">Morning (6:00 AM - 7:00 AM)</option>
                    <option value="evening">Evening (2:30 PM - 4:00 PM)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-blue-800">
                <Package className="w-5 h-5" />
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Unit Price:</span>
                <div className="flex items-center gap-1 font-medium">
                  <IndianRupee className="w-4 h-4" />
                  <span>{product.rate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle className="w-6 h-6" />
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    value={customer.quantity}
                    onChange={handleChange}
                    className="w-16 text-center border rounded-md py-1 font-medium"
                    min="1"
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-1 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <PlusCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="h-px bg-gray-200 my-4"></div>
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <div className="flex items-center gap-1 text-blue-800">
                  <IndianRupee className="w-5 h-5" />
                  <span>{totalPrice}</span>
                </div>
              </div>
            </div>
            
            <button
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
              onClick={handleProceedToPayment}
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Payment
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handlePaymentSelection}
      />

      {/* New Alert Modal */}
      <AlertModal 
        isOpen={alertModal.isOpen}
        onClose={handleCloseAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default CheckoutPage;