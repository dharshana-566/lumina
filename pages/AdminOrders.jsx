import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { db } from '../services/mockDb.js';
import { OrderStatus } from '../types.js';

const AdminOrders = () => {
  const [orders, setOrders] = useState(db.getOrders().sort((a,b) => b.createdAt.localeCompare(a.createdAt)));

  const handleStatusUpdate = (id, status) => {
    db.updateOrderStatus(id, status);
    setOrders([...db.getOrders()].sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-gray-500">{order.id}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-sm text-gray-900">{order.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${
                    order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                    order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' :
                    order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {[OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].map(status => (
                      <button 
                        key={status}
                        onClick={() => handleStatusUpdate(order.id, status)}
                        className={`text-[9px] px-2 py-1 rounded font-bold uppercase transition-all ${
                          order.status === status 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-gray-400">No orders placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
