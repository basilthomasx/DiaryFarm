import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    stock_quantity: 0,
    rate: 0,
    is_milk_product: false,
    subscription_amount: 0,
    subscription_duration_days: 30
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('stock_quantity', productData.stock_quantity);
    formData.append('rate', productData.rate);
    formData.append('is_milk_product', productData.is_milk_product);
    formData.append('subscription_amount', productData.subscription_amount);
    formData.append('subscription_duration_days', productData.subscription_duration_days);
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      if (editingProduct) {
        formData.append('current_image', editingProduct.image_url || '');
        await axios.put(`/api/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEditingProduct(null);
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setProductData({
        name: '',
        description: '',
        stock_quantity: 0,
        rate: 0,
        is_milk_product: false,
        subscription_amount: 0,
        subscription_duration_days: 30
      });
      setSelectedImage(null);
      setPreviewUrl('');
      fetchProducts();
      alert(editingProduct ? 'Product Updated Successfully' : 'Product Added Successfully');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      stock_quantity: product.stock_quantity,
      rate: product.rate,
      is_milk_product: product.is_milk_product,
      subscription_amount: product.subscription_amount || 0,
      subscription_duration_days: product.subscription_duration_days || 30
    });
    setPreviewUrl(product.image_url || '');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productData.name}
            onChange={(e) => setProductData({...productData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          
          <textarea
            placeholder="Description"
            value={productData.description}
            onChange={(e) => setProductData({...productData, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-xs h-auto rounded"
                />
              </div>
            )}
          </div>

          <input
            type="number"
            placeholder="Stock Quantity"
            value={productData.stock_quantity}
            onChange={(e) => setProductData({...productData, stock_quantity: parseInt(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="number"
            placeholder="Rate"
            value={productData.rate}
            onChange={(e) => setProductData({...productData, rate: parseFloat(e.target.value)})}
            className="w-full p-2 border rounded"
            required
          />
          
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={productData.is_milk_product}
                onChange={(e) => setProductData({...productData, is_milk_product: e.target.checked})}
                className="form-checkbox"
              />
              <span>Milk Product</span>
            </label>
          </div>

          {productData.is_milk_product && (
            <>
              <input
                type="number"
                placeholder="Subscription Amount"
                value={productData.subscription_amount}
                onChange={(e) => setProductData({...productData, subscription_amount: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Subscription Duration (Days)"
                value={productData.subscription_duration_days}
                onChange={(e) => setProductData({...productData, subscription_duration_days: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded p-4">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm">{product.description}</p>
            <p>Stock: {product.stock_quantity}</p>
            <p>Rate: ₹{product.rate}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;