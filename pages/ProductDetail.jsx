import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { CartContext } from '../App.jsx';
import { db } from '../services/mockDb.js';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const product = db.getProducts().find(p => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate('/')} className="text-indigo-600 font-semibold underline">Back to shop</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Single Image Section */}
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-2xl shadow-indigo-50 border border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Product Info */}
          <div className="sticky top-28">
            <nav className="flex text-sm font-medium text-gray-500 mb-6 space-x-2">
              <button onClick={() => navigate('/')} className="hover:text-indigo-600">Store</button>
              <span>/</span>
              <span className="text-gray-400 capitalize">{product.category}</span>
            </nav>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-light text-indigo-600 mb-8">${product.price.toFixed(2)}</p>

            <div className="prose prose-sm text-gray-600 mb-8 border-t border-gray-100 pt-8">
              <p className="text-lg leading-relaxed font-light">{product.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Currently Unavailable'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => cartCtx?.addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] ${
                    product.stock > 0 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center space-x-3 text-xs font-medium text-gray-500">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-medium text-gray-500">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  <span>30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
