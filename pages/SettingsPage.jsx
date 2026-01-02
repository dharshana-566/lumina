import React, { useState, useContext } from 'react';
import Layout from '../components/Layout.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { AuthContext } from '../App.jsx';
import { UserRole } from '../types.js';

const SettingsPage = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: false,
    twoFactor: false,
    publicProfile: false,
  });

  const [isSaved, setIsSaved] = useState(false);

  if (!user) return null;

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const PageContent = (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Application Settings</h1>
        <p className="text-gray-500 mt-1">Customize your notifications and platform preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <h2 className="text-xl font-bold">Notification Channels</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-bold text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive order updates and marketing news via email.</p>
              </div>
              <button onClick={() => handleToggle('emailNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotif ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.emailNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-bold text-gray-800">SMS Alerts</p>
                <p className="text-sm text-gray-400">Get real-time shipment updates on your mobile phone.</p>
              </div>
              <button onClick={() => handleToggle('smsNotif')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.smsNotif ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.smsNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h2 className="text-xl font-bold">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-bold text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your Lumina account.</p>
              </div>
              <button onClick={() => handleToggle('twoFactor')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactor ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.twoFactor ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
              <div>
                <p className="font-bold text-gray-800">Public Shopping History</p>
                <p className="text-sm text-gray-400">Allow friends to see your curated shopping collections.</p>
              </div>
              <button onClick={() => handleToggle('publicProfile')} className={`w-12 h-6 rounded-full transition-colors relative ${settings.publicProfile ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.publicProfile ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
           {isSaved && <span className="text-emerald-600 font-bold self-center animate-pulse">All changes saved!</span>}
           <button onClick={handleSave} className="bg-gray-900 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all">Save All Preferences</button>
        </div>
      </div>
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

export default SettingsPage;
