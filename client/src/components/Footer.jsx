import React from 'react';
import { Facebook, Instagram, Youtube, Send, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={24} />,
      url: '',
      className: 'hover:text-blue-700 hover:scale-110'
    },
    {
      name: 'YouTube',
      icon: <Youtube size={24} />,
      url: '',
      className: 'hover:text-red-600 hover:scale-110'
    },
    {
      name: 'Instagram',
      icon: <Instagram size={24} />,
      url: '',
      className: 'hover:text-pink-600 hover:scale-110'
    },
    {
      name: 'Telegram',
      icon: <Send size={24} />,
      url: '',
      className: 'hover:text-blue-600 hover:scale-110'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={24} />,
      url: '',
      className: 'hover:text-green-500 hover:scale-110'
    }
  ];

  const contactInfo = [
    { icon: <Phone size={20} />, text: '+91 123 456 7890' },
    { icon: <Mail size={20} />, text: 'contact@dairyfarm.com' },
    { icon: <MapPin size={20} />, text: 'Vazhikadavu, Kerala, India' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/api/placeholder/48/48" 
                  alt="Dairy Farm Logo" 
                  className="w-12 h-12 rounded-full"
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  Dairy Farm
                </h2>
              </div>
              <p className="text-gray-600">
                Providing quality dairy products since 1990. Our commitment to excellence 
                and sustainable farming practices sets us apart.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors">
                    <span className="text-green-600">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Connect With Us</h3>
              <div className="flex space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-600 transition-all duration-300 ease-in-out transform ${social.className}`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Subscribe to our Platforms</h4>
                
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Dairy Farm, Vazhikadavu. All rights reserved.
              </p>
              <div className="flex space-x-8">
                <a 
                  href="/privacy" 
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors hover:underline"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors hover:underline"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
   