import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  Loader2, 
  IndianRupee,
  Box, 
  Calendar,
  Info,
  Milk,
  AlertCircle,
  Eye
} from "lucide-react";

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
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Our Products</h1>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
          <Box className="w-4 h-4" />
          {products.length} Products Available
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {product.is_milk_product && (
                <div className="absolute top-2 right-2">
                  <Badge variant="blue" className="flex items-center gap-2">
                    <Milk className="w-4 h-4" />
                    Subscription
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
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors"
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