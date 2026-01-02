import React, { useEffect, useState, useContext } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { db } from '../services/mockDb.js';
import { OrderStatus } from '../types.js';
import { analyzeStorePerformance } from '../services/gemini.js';
import { AuthContext } from '../App.jsx';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const products = db.getProducts();
  const orders = db.getOrders();
  const auth = useContext(AuthContext);
  const [insight, setInsight] = useState('Analyzing business performance...');

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  // Category Distribution
  const catStats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    const fetchInsight = async () => {
      if (orders.length === 0) {
        setInsight("No sales data yet. Start marketing your products to see insights!");
        return;
      }
      const orderSummary = orders.slice(-5).map(o => `${o.items.length} items for $${o.totalPrice}`).join(', ');
      const result = await analyzeStorePerformance(orderSummary);
      setInsight(result || "Dashboard active.");
    };
    fetchInsight();
  }, [orders.length]);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Orders', value: orders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Orders', value: pendingOrders, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Out of Stock', value: outOfStock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Gemini AI Insight */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Lumina AI Insight</h2>
           </div>
           <p className="text-indigo-100 text-lg leading-relaxed italic">
             "{insight}"
           </p>
           <div className="mt-8 flex gap-2">
             <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Real-time Analysis</span>
             <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Powered by Gemini</span>
           </div>
        </div>

        {/* Category Overview */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-800 mb-6">Inventory Overview</h3>
           <div className="space-y-4">
             {Object.entries(catStats).map(([cat, count]) => (
               <div key={cat} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                 <p className="text-sm font-semibold text-gray-700">{cat}</p>
                 <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{count} Items</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/products" className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </div>
            <div>
              <p className="font-bold text-indigo-900">Add Product</p>
              <p className="text-xs text-indigo-600">Grow your catalog</p>
            </div>
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
              <p className="font-bold text-blue-900">Manage Orders</p>
              <p className="text-xs text-blue-600">{pendingOrders} pending shipment</p>
            </div>
          </Link>
          <Link to="/profile" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <p className="font-bold text-slate-900">Security Settings</p>
              <p className="text-xs text-slate-600">Secure your account</p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
