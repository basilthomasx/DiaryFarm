import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const HelpAndSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const helpPanelRef = useRef(null);
  const faqRefs = useRef({});

  const faqs = [
    {
      id: 1,
      question: "What products do you offer?",
      answer: "We offer a variety of fresh dairy products including milk, yogurt, cheese, and butter. All our products come directly from local farms."
    },
    {
      id: 2,
      question: "How do I place an order?",
      answer: "You can place an order by logging into your account, browsing our products section, and adding items to your cart. Then proceed to checkout to complete your purchase."
    },
    {
      id: 3,
      question: "What are your delivery areas?",
      answer: "We currently deliver to most areas within 50km of our main facility. You can check if we deliver to your area by entering your pincode during checkout."
    }
  ];

  // Initialize faq refs
  useEffect(() => {
    faqs.forEach(faq => {
      faqRefs.current[faq.id] = React.createRef();
    });
  }, []);

  // Handle click outside to close help panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the help panel if clicked outside
      if (helpPanelRef.current && !helpPanelRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      // Close any open FAQ if clicked outside that FAQ
      if (expandedQuestion !== null) {
        const currentFaqRef = faqRefs.current[expandedQuestion];
        if (currentFaqRef && currentFaqRef.current && !currentFaqRef.current.contains(event.target)) {
          setExpandedQuestion(null);
        }
      }
    };

    if (isOpen || expandedQuestion !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, expandedQuestion]);

  const toggleQuestion = (id, e) => {
    e.stopPropagation(); // Prevent bubbling to document click handler
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  const validatePhone = (phoneNumber) => {
    // Check if phone contains exactly 10 digits
    return /^\d{10}$/.test(phoneNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCallbackData({ ...callbackData, [name]: value });
    
    // Clear error when editing phone field
    if (name === 'phone' && errors.phone) {
      setErrors({...errors, phone: null});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhone(callbackData.phone)) {
        setErrors({...errors, phone: 'Phone number must be exactly 10 digits'});
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/callback-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(callbackData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit callback request');
        }

        setIsSubmitted(true);
    } catch (error) {
        console.error('Error:', error);
        setErrors({...errors, submit: 'Failed to submit request. Please try again.'});
    }
  };

  const resetForm = () => {
    setCallbackData({ name: '', phone: '' });
    setShowCallbackForm(false);
    setIsSubmitted(false);
    setIsOpen(false);
    setErrors({});
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={helpPanelRef}>
      {/* Help Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent click from bubbling to document
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="font-medium">Help & Support</span>
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-green-600 text-white">
            <h3 className="text-lg font-semibold">How can we help?</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {!showCallbackForm && !isSubmitted ? (
              <>
                <div className="space-y-3 mb-6">
                  {faqs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="border rounded-lg overflow-hidden"
                      ref={faqRefs.current[faq.id]}
                    >
                      <button
                        onClick={(e) => toggleQuestion(faq.id, e)}
                        className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {expandedQuestion === faq.id ? 
                          <ChevronUp className="w-5 h-5 text-green-600" /> : 
                          <ChevronDown className="w-5 h-5 text-green-600" />
                        }
                      </button>
                      {expandedQuestion === faq.id && (
                        <div className="p-3 bg-gray-50 border-t">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="w-full py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Need more help? Request a callback</span>
                </button>
              </>
            ) : isSubmitted ? (
              <div className="text-center py-6">
                <div className="mb-4 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-4">Our customer care team will call you back soon.</p>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={callbackData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={callbackData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter 10 digit number"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Phone number must be exactly 10 digits
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCallbackForm(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpAndSupport;