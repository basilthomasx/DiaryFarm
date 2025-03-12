import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, ShoppingCart, Package, IndianRupee, Box, Calendar, 
  Milk, Send, MessageSquare, User, AlertCircle, Loader2,
  ChevronDown, ChevronUp, ArrowLeft, Award, ThumbsUp
} from "lucide-react";
import Header from "./Header";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-image.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    reviewText: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/products/${id}`),
          fetch(`http://localhost:3000/api/products/${id}/reviews`)
        ]);

        const productData = await productRes.json();
        const reviewsData = await reviewsRes.json();

        setProduct(productData);
        setReviews(reviewsData);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const addedReview = await response.json();
        setReviews([...reviews, addedReview]);
        setNewReview({ userName: "", rating: 5, reviewText: "" });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-red-500 bg-blue-50">
        <AlertCircle className="w-12 h-12" />
        <p>{error}</p>
      </div>
    );
  }

  if (!product) return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 text-gray-500 bg-blue-50">
      <Package className="w-12 h-12" />
      <p>Product not found</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Header/>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Back Button - Fixed to be clearly visible */}
        <button 
          onClick={goBack}
          className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group"
        >
          <div className="relative">
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Product Image - Centered with max-width */}
        <div className="w-full max-w-4xl mx-auto mt-8">
          <img 
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
              e.target.onerror = null;
            }}
          />
        </div>

        {/* Checkout Button */}
        <div className="w-full max-w-4xl mx-auto mt-4">
          <button
            onClick={() => navigate(`/checkout/${product.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg transition-colors shadow-md"
          >
            <ShoppingCart className="w-6 h-6" />
            Proceed to Checkout
          </button>
        </div>

        {/* Product Details */}
        <div className="w-full max-w-4xl mx-auto mt-6 space-y-6">
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold flex items-center gap-2">
                <IndianRupee className="w-6 h-6" />
                {product.rate}
              </span>
              <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <Box className="w-5 h-5 text-gray-600" />
                {product.stock_quantity} in stock
              </span>
            </div>

            {product.is_milk_product && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600">
                  <Milk className="w-5 h-5" />
                  <Calendar className="w-5 h-5" />
                  <p>
                    Subscribe for ₹{product.subscription_amount} / {product.subscription_duration_days} days
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Quality Section */}
          <div className="w-full bg-gradient-to-r from-blue-400 to-green-400 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Our Quality Promise</h2>
            </div>
            <p className="mb-4">
              Every {product.name} is carefully selected and vetted for the highest quality standards. 
              We pride ourselves on delivering only the best products to your doorstep.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <ThumbsUp className="w-6 h-6 mb-2" />
                <h3 className="font-semibold">Premium Selection</h3>
                <p className="text-center text-sm">Handpicked for excellence</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <Box className="w-6 h-6 mb-2" />
                <h3 className="font-semibold">Safe Packaging</h3>
                <p className="text-center text-sm">Delivered with care</p>
              </div>
              <div className="flex flex-col items-center p-3 bg-white bg-opacity-20 rounded-lg">
                <Star className="w-6 h-6 mb-2" />
                <h3 className="font-semibold">Satisfaction Guarantee</h3>
                <p className="text-center text-sm">100% customer happiness</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-md">
            <button 
              onClick={() => setIsReviewsOpen(!isReviewsOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">Customer Reviews</h2>
              </div>
              {isReviewsOpen ? (
                <ChevronUp className="w-6 h-6 text-gray-500" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-500" />
              )}
            </button>

            {isReviewsOpen && (
              <div className="p-4 border-t">
                {/* Reviews List */}
                <div className="space-y-4 mb-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{review.user_name}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 ml-7">{review.review_text}</p>
                        <span className="text-sm text-gray-400 ml-7 block mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleSubmitReview} className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        value={newReview.userName}
                        onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                        className="w-full pl-10 p-2 border rounded-md"
                        required
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`${
                            star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Review</label>
                    <textarea
                      value={newReview.reviewText}
                      onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      rows="4"
                      required
                      placeholder="Share your thoughts about the product..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;