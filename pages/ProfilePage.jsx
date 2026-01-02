import React, { useState, useContext, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { AuthContext } from '../App.jsx';
import { db } from '../services/mockDb.js';
import { UserRole } from '../types.js';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ brand: 'Visa', last4: '', expiry: '', isDefault: false });

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (!user) return null;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    db.updateUser(user.id, { name });
    auth?.refreshUser();
    setMsg({ type: 'success', text: 'Identity updated successfully.' });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newAddress = {
      id: `addr-${Date.now()}`,
      label: addressForm.label || 'Home',
      street: addressForm.street || '',
      city: addressForm.city || '',
      state: addressForm.state || '',
      zip: addressForm.zip || '',
      isDefault: addressForm.isDefault || false
    };

    let updatedAddresses = [...(user.addresses || [])];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    db.updateUser(user.id, { addresses: updatedAddresses });
    auth?.refreshUser();
    setShowAddressModal(false);
    setAddressForm({ label: '', street: '', city: '', state: '', zip: '', isDefault: false });
  };

  const deleteAddress = (id) => {
    const updated = (user.addresses || []).filter(a => a.id !== id);
    db.updateUser(user.id, { addresses: updated });
    auth?.refreshUser();
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    const newPayment = {
      id: `pm-${Date.now()}`,
      type: 'card',
      brand: paymentForm.brand || 'Visa',
      last4: paymentForm.last4 || '0000',
      expiry: paymentForm.expiry || '01/99',
      isDefault: paymentForm.isDefault || false
    };

    let updatedPayments = [...(user.paymentMethods || [])];
    if (newPayment.isDefault) {
      updatedPayments = updatedPayments.map(p => ({ ...p, isDefault: false }));
    }
    updatedPayments.push(newPayment);

    db.updateUser(user.id, { paymentMethods: updatedPayments });
    auth?.refreshUser();
    setShowPaymentModal(false);
    setPaymentForm({ brand: 'Visa', last4: '', expiry: '', isDefault: false });
  };

  const deletePayment = (id) => {
    const updated = (user.paymentMethods || []).filter(p => p.id !== id);
    db.updateUser(user.id, { paymentMethods: updated });
    auth?.refreshUser();
  };

  const PageContent = (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Account Center</h1>
        <p className="text-gray-500 mt-1">Manage your identity, shipping, and saved payments.</p>
      </div>

      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        {(['profile', 'addresses', 'payments']).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {msg.text && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          <span className="text-sm font-semibold">{msg.text}</span>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Email Address</label>
              <input disabled type="email" value={email} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed" />
            </div>
            <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors">Update Profile</button>
          </form>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Address Book</h2>
            <button onClick={() => setShowAddressModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">Add New Address</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(user.addresses || []).map(addr => (
              <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{addr.label}</span>
                    {addr.isDefault && <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Default</span>}
                  </div>
                  <button onClick={() => deleteAddress(addr.id)} className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                <p className="text-gray-900 font-medium">{addr.street}</p>
                <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
              </div>
            ))}
            {(user.addresses || []).length === 0 && (
              <p className="col-span-2 text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 font-medium italic">No addresses saved yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Saved Payment Methods</h2>
            <button onClick={() => setShowPaymentModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">Add Card</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(user.paymentMethods || []).map(pm => (
              <div key={pm.id} className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                  <div className="flex justify-between items-start">
                    <span className="text-xl font-black italic tracking-tighter">{pm.brand}</span>
                    <button onClick={() => deletePayment(pm.id)} className="text-white/40 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div>
                    <p className="font-mono tracking-widest text-lg mb-1">•••• •••• •••• {pm.last4}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-white/60">Expires {pm.expiry}</p>
                      {pm.isDefault && <span className="bg-indigo-500 text-[9px] font-bold uppercase px-2 py-0.5 rounded">Default</span>}
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </div>
            ))}
            {(user.paymentMethods || []).length === 0 && (
              <p className="col-span-3 text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 font-medium italic">No payment methods saved.</p>
            )}
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">New Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <input required type="text" placeholder="Label (Home, Work, etc.)" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <input required type="text" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                <input required type="text" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <input required type="text" placeholder="Zip Code" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Set as default address</span>
              </label>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-4 bg-gray-50 font-bold rounded-xl text-gray-500 border border-gray-100">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 font-bold rounded-xl text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Save New Card</h3>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <select value={paymentForm.brand} onChange={e => setPaymentForm({...paymentForm, brand: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
              </select>
              <input required maxLength={4} type="text" placeholder="Last 4 Digits" value={paymentForm.last4} onChange={e => setPaymentForm({...paymentForm, last4: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <input required placeholder="Expiry (MM/YY)" value={paymentForm.expiry} onChange={e => setPaymentForm({...paymentForm, expiry: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={paymentForm.isDefault} onChange={e => setPaymentForm({...paymentForm, isDefault: e.target.checked})} className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Set as default payment method</span>
              </label>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-4 bg-gray-50 font-bold rounded-xl text-gray-500 border border-gray-100">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-gray-900 font-bold rounded-xl text-white shadow-lg hover:bg-indigo-600 transition-all">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return user.role === UserRole.ADMIN ? (
    <AdminLayout>{PageContent}</AdminLayout>
  ) : (
    <Layout>
      <div className="py-16 px-4">
        {PageContent}
      </div>
    </Layout>
  );
};

export default ProfilePage;
