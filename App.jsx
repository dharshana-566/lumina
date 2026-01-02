import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { UserRole, OrderStatus } from './types.js';
import { db } from './services/mockDb.js';

// --- Contexts ---
const AuthContext = createContext(null);

const CartContext = createContext(null);

// --- Pages ---
import Storefront from './pages/Storefront.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';

// --- Guards ---
const ProtectedRoute = ({ children, role }) => {
  const auth = useContext(AuthContext);
  if (!auth?.user) return <Navigate to="/login" />;
  if (role && auth.user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('lumina_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // Sync with DB on load
      const dbUser = db.getUsers().find(u => u.id === parsed.id);
      if (dbUser) {
        setUser(dbUser);
        localStorage.setItem('lumina_current_user', JSON.stringify(dbUser));
      }
    }
    
    const savedCart = localStorage.getItem('lumina_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const refreshUser = () => {
    if (!user) return;
    const dbUser = db.getUsers().find(u => u.id === user.id);
    if (dbUser) {
      setUser({ ...dbUser });
      localStorage.setItem('lumina_current_user', JSON.stringify(dbUser));
    }
  };

  const login = (email, pass) => {
    const found = db.getUsers().find(u => u.email === email && u.password === pass);
    if (found) {
      setUser(found);
      localStorage.setItem('lumina_current_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = (name, email, pass) => {
    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      role: UserRole.USER, 
      password: pass,
      addresses: [],
      paymentMethods: []
    };
    db.addUser(newUser);
    setUser(newUser);
    localStorage.setItem('lumina_current_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumina_current_user');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('lumina_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('lumina_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id, q) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, q) } : item);
      localStorage.setItem('lumina_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('lumina_cart');
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
        <HashRouter>
          <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              <Route path="/admin" element={<ProtectedRoute role={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute role={UserRole.ADMIN}><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute role={UserRole.ADMIN}><AdminOrders /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </HashRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
export { AuthContext, CartContext };
