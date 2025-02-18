import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    image_url: '',
    stock_quantity: 0,
    rate: 0,
    is_milk_product: false,
    subscription_amount: 0,
    subscription_duration_days: 30
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, productData);
        setEditingProduct(null);
      } else {
        await axios.post('/api/products', productData);
      }
      
      setProductData({
        name: '',
        description: '',
        image_url: '',
        stock_quantity: 0,
        rate: 0,
        is_milk_product: false,
        subscription_amount: 0,
        subscription_duration_days: 30
      });
      
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
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      rate: product.rate,
      is_milk_product: product.is_milk_product,
      subscription_amount: product.subscription_amount || 0,
      subscription_duration_days: product.subscription_duration_days || 30
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
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
          <input
            type="text"
            placeholder="Image URL"
            value={productData.image_url}
            onChange={(e) => setProductData({...productData, image_url: e.target.value})}
            className="w-full p-2 border rounded"
          />
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