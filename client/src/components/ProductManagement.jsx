import React, { useState, useEffect } from 'react';
import { Milk, ImageIcon, Trash2, Edit, Plus, X, Search } from 'lucide-react';

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '/placeholder-image.jpg';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `http://localhost:3000${imageUrl}`;
};


const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    stock_quantity: 0,
    rate: 0,
    is_milk_product: false,
    subscription_amount: 0,
    quantity: 0,
    unit: 'ml,l'
  });

  useEffect(() => {
    fetchProducts();
  }, []);


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
};

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'image_url') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (uploadedImage) {
        formDataToSend.append('image', uploadedImage);
      }

      if (selectedProduct && selectedProduct.image_url) {
        formDataToSend.append('current_image', selectedProduct.image_url);
      }

      const url = selectedProduct
        ? `http://localhost:3000/api/products/${selectedProduct.id}`
        : 'http://localhost:3000/api/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        fetchProducts();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      stock_quantity: 0,
      rate: 0,
      is_milk_product: false,
      subscription_amount: 0,
      quantity: 0,
      unit: 'ml'
    });
    setImagePreview(null);
    setUploadedImage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      rate: product.rate,
      is_milk_product: product.is_milk_product,
      subscription_amount: product.subscription_amount || 0,
      quantity: product.quantity,
      unit: product.unit || 'ml'
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Product Management</h1>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Product
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {product.is_milk_product && <Milk className="text-blue-500" />}
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Stock</span>
                    <span className="font-medium">{product.stock_quantity} units</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-medium">₹{product.rate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{product.quantity} {product.unit}</span>
                  </div>
                  {product.is_milk_product && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subscription Amount</span>
                      <span className="font-medium">₹{product.subscription_amount}/month</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  {product.is_milk_product ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Milk className="w-4 h-4 mr-1" /> Milk Product
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Regular Product
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <div className="mt-1 flex rounded-lg shadow-sm">
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        className="block w-full rounded-l-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="rounded-r-lg border-gray-300 bg-gray-50 px-3 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ml">Mili Liter</option>
                        <option value="l">Liter</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <input
                      type="number"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="relative">
                        {imagePreview || (selectedProduct && selectedProduct.image_url) ? (
                          <div className="w-32 h-32 rounded-lg overflow-hidden">
                            <img 
                              src={imagePreview || `http://localhost:3000${selectedProduct.image_url}`}
                              alt="Product preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setUploadedImage(null);
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                        htmlFor="image-upload"
                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </label>
                    </div>
                  </div>
                 </div>

                 <div className="col-span-full">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_milk_product"
                      checked={formData.is_milk_product}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        is_milk_product: e.target.checked,
                        subscription_amount: e.target.checked ? formData.subscription_amount : 0
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_milk_product" className="text-sm text-gray-700">
                      This is a milk product
                    </label>
                  </div>
                 </div>

                 {formData.is_milk_product && (
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Subscription Amount (per month)
                    </label>
                    <input
                      type="number"
                      value={formData.subscription_amount}
                      onChange={(e) => setFormData({ ...formData, subscription_amount: parseFloat(e.target.value) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.01"
                      required={formData.is_milk_product}
                    />
                  </div>
                 )}

                 <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedProduct ? 'Update Product' : 'Add Product'}
                  </button>
                 </div>
                 </div>
                 </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;