import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { CartContext, AuthContext } from '../App.jsx';
import { db } from '../services/mockDb.js';
import { OrderStatus } from '../types.js';

const CartPage = () => {
  const cartCtx = useContext(CartContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState('cart');
  const [selectedAddress, setSelectedAddress] = useState(auth?.user?.addresses?.find(a => a.isDefault) || auth?.user?.addresses?.[0] || null);
  const [selectedPayment, setSelectedPayment] = useState(auth?.user?.paymentMethods?.find(pm => pm.isDefault) || auth?.user?.paymentMethods?.[0] || null);

  const handleNextStep = () => {
    if (!auth?.user) {
      navigate('/login?redirect=cart');
      return;
    }
    setStep('info');
  };

  const handleCheckout = () => {
    if (!auth?.user) return;
    if (!cartCtx?.cart.length) return;
    if (!selectedAddress || !selectedPayment) {
      alert('Please select a shipping address and payment method.');
      return;
    }

    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: auth.user.id,
      customerName: auth.user.name,
      items: cartCtx.cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: cartCtx.total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      shippingAddress: selectedAddress,
      paymentMethod: selectedPayment
    };

    db.addOrder(newOrder);
    cartCtx.clearCart();
    alert('Order placed successfully! Redirecting to your orders.');
    navigate('/orders');
  };

  if (!cartCtx?.cart.length) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-300">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your bag is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200">
            Start Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Checkout Flow</h1>
          <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest">
            <span className={step === 'cart' ? 'text-indigo-600' : 'text-gray-400'}>Bag</span>
            <span className="text-gray-300">/</span>
            <span className={step === 'info' ? 'text-indigo-600' : 'text-gray-400'}>Information</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-8">
            {step === 'cart' ? (
              <div className="space-y-8">
                {cartCtx.cart.map(item => (
                  <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0 group">
                    <div className="w-32 h-40 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </h3>
                          <button onClick={() => cartCtx.removeFromCart(item.id)} className="text-gray-400 hover:text-rose-500 p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-tight">{item.category}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 bg-white">
                          <button onClick={() => cartCtx.updateQuantity(item.id, item.quantity - 1)} className="px-3 hover:bg-gray-50 text-gray-500 font-bold">−</button>
                          <span className="w-10 text-center text-sm font-semibold border-x border-gray-100">{item.quantity}</span>
                          <button onClick={() => cartCtx.updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-gray-50 text-gray-500 font-bold">+</button>
                        </div>
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-10">
                {/* Address Selection */}
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    Shipping Destination
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {auth?.user?.addresses?.map(addr => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`text-left p-6 rounded-3xl border transition-all ${
                          selectedAddress?.id === addr.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-gray-100 hover:border-indigo-200 bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">{addr.label}</p>
                        <p className="font-bold text-gray-900">{addr.street}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                      </button>
                    ))}
                    {!auth?.user?.addresses?.length && (
                       <Link to="/profile" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                         <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                         <span className="font-bold text-sm">Add Shipping Address</span>
                       </Link>
                    )}
                  </div>
                </section>

                {/* Payment Selection */}
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {auth?.user?.paymentMethods?.map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm)}
                        className={`text-left p-6 rounded-3xl border transition-all ${
                          selectedPayment?.id === pm.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-gray-100 hover:border-indigo-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{pm.brand}</span>
                          <span className="text-xs font-mono text-gray-400">•••• {pm.last4}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 uppercase">Saved Secure Card</p>
                      </button>
                    ))}
                    {!auth?.user?.paymentMethods?.length && (
                       <Link to="/profile" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                         <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                         <span className="font-bold text-sm">Add Payment Method</span>
                       </Link>
                    )}
                  </div>
                </section>
                
                <button onClick={() => setStep('cart')} className="text-sm font-bold text-indigo-600 hover:underline">← Back to Bag</button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCtx.cart.length} items)</span>
                  <span className="font-medium text-gray-900">${cartCtx.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">${cartCtx.total.toFixed(2)}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button 
                  onClick={handleNextStep}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Continue to Delivery
                </button>
              ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={!selectedAddress || !selectedPayment}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalize Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
