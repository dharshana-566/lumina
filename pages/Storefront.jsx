import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { CartContext } from '../App.jsx';
import { db } from '../services/mockDb.js';

const Storefront = () => {
  const products = db.getProducts().filter(p => p.isActive);
  const cartCtx = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[65vh] bg-gray-900 flex items-center overflow-hidden">
        <img 
          src="https://retail-merchandiser.com/wp-content/uploads/sites/8/2023/09/Online-retail-shops-800x445.jpeg" 
          className="absolute inset-0 w-full h-full object-cover opacity-50" 
          alt="Modern Digital Retail" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              The Future of <br/><span className="text-indigo-400">Digital Retail.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light leading-relaxed">
              Experience Lumina — a curated digital boutique where premium craftsmanship meets next-generation convenience. 
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Curated Essentials</h2>
            <p className="text-gray-500 mt-2">Only the finest selection for the modern home and lifestyle.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <div key={product.id} className="group flex flex-col">
              <Link to={`/product/${product.id}`} className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-square mb-5 block border border-gray-100 shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {product.stock < 5 && product.stock > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                    Only {product.stock} left
                  </span>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <div className="flex justify-between items-start px-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{product.category}</p>
                </div>
                <p className="font-bold text-gray-900 text-lg">${product.price.toFixed(2)}</p>
              </div>

              <button 
                onClick={() => cartCtx?.addToCart(product)}
                disabled={product.stock === 0}
                className={`mt-6 w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  product.stock > 0 
                  ? 'bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-indigo-100' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Storefront;
