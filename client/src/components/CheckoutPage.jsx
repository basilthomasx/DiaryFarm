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
  Wallet
} from 'lucide-react';

// Payment Selection Modal Component
const PaymentModal = ({ isOpen, onClose, onSelectPayment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => onSelectPayment('cod')}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-gray-600" />
              <span>Cash on Delivery</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => onSelectPayment('online')}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Online Payment</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    postal_code: "679333",
    house_number: "",
    quantity: 1,
    delivery_date: "",
    delivery_time: "morning" // Default to morning
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  // Get tomorrow's date as the minimum selectable date
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    if (name === "quantity") {
      setTotalPrice(product.rate * parseInt(value || 1, 10));
    }
  };

  const handleQuantityChange = (increment) => {
    const newQuantity = Math.max(1, customer.quantity + increment);
    setCustomer({ ...customer, quantity: newQuantity });
    setTotalPrice(product.rate * newQuantity);
  };

  const handleProceedToPayment = () => {
    // Validate required fields
    if (!customer.name || !customer.phone || !customer.email || 
        !customer.house_number || !customer.delivery_date) {
      alert('Please fill in all required fields');
      return;
    }

    setIsPaymentModalOpen(true);
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
          alert('Order created successfully with Cash on Delivery!');
        } else {
          alert('Order created successfully!');
          // Here you would typically handle the online payment flow
        }
        navigate('/products');
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Failed to process order. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading checkout details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-red-500">
        <AlertCircle className="w-12 h-12" />
        <p>{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Checkout Details</h2>
        </div>

        {/* Product Details Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-lg">₹{totalPrice}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <input
                type="number"
                name="quantity"
                value={customer.quantity}
                onChange={handleChange}
                className="w-16 text-center border rounded-md py-1"
                min="1"
              />
              <button 
                onClick={() => handleQuantityChange(1)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full Name"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Phone Number"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email Address"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <select
              name="postal_code"
              value={customer.postal_code}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="679333">679333 - vazhikadavu, Kerala</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="house_number"
              value={customer.house_number}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="House Number"
            />
          </div>

          {/* Delivery Details Section */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="delivery_date"
              value={customer.delivery_date}
              onChange={handleChange}
              min={minDate}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <select
              name="delivery_time"
              value={customer.delivery_time}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="Morning">Morning (7:00 AM)</option>
              <option value="Evening">Evening (3:00 PM)</option>
            </select>
          </div>
        </div>

        <button
        className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
        onClick={handleProceedToPayment}
      >
        <CreditCard className="w-5 h-5" />
        Proceed to Payment
      </button>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handlePaymentSelection}
      />
      </div>
    </div>
  );
};

export default CheckoutPage;