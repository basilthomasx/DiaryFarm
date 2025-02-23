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
    { icon: <Phone size={20} />, text: '+91 7511122770' },
    { icon: <Mail size={20} />, text: 'dairytest03@gmail.com' },
    { icon: <MapPin size={20} />, text: 'Pathiripadam, Kerala, India' }
  ];

  return (
    <footer className="bg-white border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-9">
              <div className="flex items-center space-x-6">
                <img 
                  src="/logo.jpg" 
                  alt="Dairy Farm Logo" 
                  className="w-26 h-20 rounded-full"
                />
                <h2 className="text-2xl font-bold text-gray-800">
                God’s Own Dairy
                </h2>
              </div>
              <p className="text-gray-600  ">
              ശുദ്ധം.വിശ്വസ്തം. സുരക്ഷിതം
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
   