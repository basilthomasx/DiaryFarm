import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // 1. Create order in backend
      const orderResponse = await axios.post('/api/orders/create', {
        product_id: state.product.id,
        quantity: state.quantity,
        customer_name: state.customer.name,
        customer_phone: state.customer.phone,
        customer_email: state.customer.email,
        customer_postal_code: state.customer.postalCode,
        customer_house_number: state.customer.houseNumber
      });

      const { orderId, razorpayOrderId, amount } = orderResponse.data;

      // 2. Initialize Razorpay payment
      const options = {
        key: process.env.RAZORPAY_SECRET_KEY,
        amount: amount, // Amount in paise
        currency: "INR",
        name: "Your Company Name",
        description: `Order ${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          // 3. Verify payment
          const verifyResponse = await axios.post('/api/payment/verify', {
            orderId: orderId,
            payment_id: response.razorpay_payment_id,
            payment_signature: response.razorpay_signature
          });

          if (verifyResponse.data.success) {
            navigate('/success', { 
              state: { 
                orderId: orderId,
                amount: amount/100 
              }
            });
          }
        },
        prefill: {
          name: state.customer.name,
          email: state.customer.email,
          contact: state.customer.phone
        },
        theme: {
          color: "#3399cc"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <p className="font-medium">Product: {state.product.name}</p>
          <p>Quantity: {state.quantity}</p>
          <p>Total Amount: ₹{state.totalPrice}</p>
        </div>
        <button 
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;

