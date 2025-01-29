import React from 'react';
import { Facebook, Instagram, Youtube, Send, MessageCircle, MapPin } from 'lucide-react';

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

  return (
    <footer className="bg-gradient-to-b from-green-50 to-emerald-50 shadow-lg mt-auto border-t border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 hover:text-green-700 transition-colors">
                Dairy Farm
              </h2>
              <p className="text-sm text-green-700">Vazhikadavu</p>
              <div className="flex items-center space-x-3 text-green-600 hover:text-green-800 transition-colors group">
                <MapPin size={20} className="group-hover:text-green-800" />
                <span className="text-sm">Vazhikadavu, Kerala, India</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-800">Connect With Us</h3>
              <div className="flex space-x-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-green-600 transition-all duration-300 ease-in-out transform ${social.className}`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-sm text-green-600">
                Join our community and stay updated with our latest initiatives
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-green-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-green-600">
                © {new Date().getFullYear()} Dairy Farm, Vazhikadavu. All rights reserved.
              </p>
              <div className="flex space-x-8">
                <a 
                  href="/privacy" 
                  className="text-sm text-green-600 hover:text-green-800 transition-colors hover:underline"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="text-sm text-green-600 hover:text-green-800 transition-colors hover:underline"
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
   