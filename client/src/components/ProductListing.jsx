import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Loader2, 
  IndianRupee,
  Box, 
  Calendar,
  Info,
  Milk,
  AlertCircle,
  Eye,
  Award,
  Star,
  ShieldCheck
} from "lucide-react";
import Header from "./Header";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-image.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium";
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ProductsListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/products")
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading products...</p>
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

  return (
    <div className="container mt-14 mx-auto p-9">
      <Header/>
      
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Premium Quality Products</h2>
            <p className="text-gray-700 mb-4">
              We pride ourselves on sourcing and delivering only the finest products, 
              ensuring freshness and quality in every item. Our rigorous standards 
              guarantee excellence with every purchase.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">Premium Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Top Rated Products</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 ml-0 md:ml-6 flex-shrink-0">
            <div className="bg-white p-3 rounded-full shadow-md">
              <div className="bg-blue-100 p-4 rounded-full">
                <Award className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold">Our Products</h2>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
          <Box className="w-4 h-4" />
          {products.length} Products Available
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative overflow-hidden rounded-t-lg group">
              <img 
                src={getImageUrl(product.image_url)}
                alt={product.name}
                className="w-full h-56 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  e.target.onerror = null;
                }}
              />
              {/* Overlay that appears on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                <button
                  className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/90 hover:bg-blue-500 hover:text-white text-blue-700 font-medium py-2 px-4 rounded-md flex items-center gap-2"
                  onClick={() => navigate(`/product-details/${product.id}`)}
                >
                  <Eye className="w-5 h-5" />
                  View Details
                </button>
              </div>
              
              {product.is_milk_product && (
                <div className="absolute top-2 right-2">
                  <Badge variant="blue" className="flex items-center gap-2">
                    <Milk className="w-4 h-4" />
                    Subscription
                  </Badge>
                </div>
              )}
              
              {/* Optional: Add a discount tag or featured tag for some products */}
              {product.id % 3 === 0 && (
                <div className="absolute top-2 left-2">
                  <Badge variant="success" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help" />
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Price:
                  </span>
                  <span className="font-semibold text-lg">₹{product.rate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Stock:
                  </span>
                  <Badge 
                    variant={product.stock_quantity > 10 ? "success" : "destructive"}
                    className="flex items-center gap-2"
                  >
                    {product.stock_quantity} units
                  </Badge>
                </div>
                
                {product.is_milk_product && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="w-4 h-4" />
                      <p className="text-sm">
                        Subscribe for ₹{product.subscription_amount} / {product.subscription_duration_days} days
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 pt-0">
              <button
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors w-full hover:shadow-md duration-300"
                onClick={() => navigate(`/product-details/${product.id}`)}
              >
                <Eye className="w-5 h-5" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsListing;