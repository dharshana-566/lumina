import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, CartContext } from '../App.jsx';
import { UserRole } from '../types.js';

const Layout = ({ children }) => {
  const auth = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">LUMINA</Link>
              <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
                {auth?.user?.role === UserRole.ADMIN && (
                  <Link to="/admin" className="text-indigo-600 font-semibold underline underline-offset-4">Admin Dashboard</Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCtx?.cart.length ? (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                    {cartCtx.cart.length}
                  </span>
                ) : null}
              </Link>

              {auth?.user ? (
                <div className="flex items-center gap-4">
                  <Link to="/orders" className="text-sm font-medium text-gray-600 hover:text-indigo-600 hidden sm:block">My Orders</Link>
                  <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 hidden sm:block">My Profile</Link>
                  <Link to="/settings" className="text-sm font-medium text-gray-600 hover:text-indigo-600 hidden sm:block">Settings</Link>
                  <button 
                    onClick={() => { auth.logout(); navigate('/'); }}
                    className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2025 Lumina Boutique. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
