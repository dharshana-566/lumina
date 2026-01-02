import React, { useContext } from 'react';
import Layout from '../components/Layout.jsx';
import { AuthContext } from '../App.jsx';
import { db } from '../services/mockDb.js';
import { OrderStatus } from '../types.js';

const OrderHistory = () => {
  const auth = useContext(AuthContext);
  const orders = db.getOrders().filter(o => o.userId === auth?.user?.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Total</p>
                      <p className="text-sm font-medium text-gray-700">${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                     <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                       order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                       order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' :
                       order.status === OrderStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                       'bg-gray-100 text-gray-700'
                     }`}>
                       {order.status}
                     </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                    <button className="text-sm text-indigo-600 font-medium hover:underline">View Details</button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center relative">
                        <img src={`https://picsum.photos/seed/${item.productId}/100`} className="w-12 h-12 object-cover rounded" alt={item.name} />
                        <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;
