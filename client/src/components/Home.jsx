import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { 
  Milk, 
  ClipboardCheck, 
  Truck, 
  Syringe, 
  Calendar, 
  MapPin,
  Leaf,
  ShieldCheck,
  Users
} from 'lucide-react';

function Home() {
  return (
    <div className="bg-blue-50">
      <Header/>
      {/* Hero section */}
      <div className="w-full bg-gradient-to-b from-green-50 to-blue-50 pt-28">
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h2 className="text-4xl font-bold text-forest-green-800 mb-6">Welcome to FreshFarm</h2>
          <p className="text-xl text-gray-700">
            Experience the finest dairy products delivered fresh to your doorstep. 
            We source directly from local farms to ensure quality and freshness.
          </p>
        </div>
      </div>

      {/* Service cards */}
      <main className="mt-32 p-8 space-y-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <Milk size={32} className="text-forest-green-600" />    
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+1"
              alt="Image 1"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Milk Collection From Healthy Cattles</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <ClipboardCheck size={32} className="text-forest-green-600" />
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+2"
              alt="Image 2"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Quality Test</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <Truck size={32} className="text-forest-green-600" />
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+3"
              alt="Image 3"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Delivered 6am by Home</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <Syringe size={32} className="text-forest-green-600" />
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+4"
              alt="Image 4"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Ensuring Cattle Vaccination</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <Calendar size={32} className="text-forest-green-600" />
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+5"
              alt="Image 5"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Monthly Subscriptions for Milk</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-6 hover:shadow-xl transition-all duration-300 rounded-xl bg-white border border-green-100">
            <div className="p-4 bg-green-50 rounded-full">
              <MapPin size={32} className="text-forest-green-600" />
            </div>
            <img
              src="/api/placeholder/150/150?text=Image+6"
              alt="Image 6"
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
            <p className="text-gray-700 font-medium text-center">Delivery Within Vazhikadavu Panchayath</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-12">
          <p className="text-gray-700 text-xl text-center leading-relaxed bg-white p-8 rounded-xl shadow-md border border-green-100">
            This platform ensures every farmer can buy and sell their yield goods to improve stability for customers
          </p>
        </div>

        {/* Information cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <Leaf className="text-emerald-600" size={24} />
              <p className="text-lg font-semibold text-gray-800">Fresh Products</p>
            </div>
            <p className="text-gray-700">
              We ensure all our products are fresh and naturally sourced from local farms, maintaining the highest quality standards.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="text-forest-green-600" size={24} />
              <p className="text-lg font-semibold text-gray-800">Quality Assured</p>
            </div>
            <p className="text-gray-700">
              Every product undergoes strict quality checks to ensure you receive only the best dairy products for your family.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-100">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="text-forest-green-600" size={24} />
              <p className="text-lg font-semibold text-gray-800">Community Focused</p>
            </div>
            <p className="text-gray-700">
              We work closely with local farmers and communities to support sustainable farming practices and fair trade.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md border border-green-100">
          <h2 className="text-2xl font-bold text-forest-green-800 mb-6">Product Information</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our products are carefully selected to ensure the highest quality and freshness. 
            We work directly with local farmers to bring you the best seasonal produce and 
            dairy products, maintaining strict quality control throughout our supply chain.
          </p>
        </div>
      </main>  
      <Footer/>
    </div>
  );
}

export default Home;
