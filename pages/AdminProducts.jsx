import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { db } from '../services/mockDb.js';
import { generateProductDescription, generateProductImage } from '../services/gemini.js';

const AdminProducts = () => {
  const [products, setProducts] = useState(db.getProducts());
  const [categories, setCategories] = useState(db.getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: categories[0] || '',
    description: '',
    stock: 0,
    isActive: true,
    image: '',
    images: [],
    material: '',
    color: '',
    finish: 'Matte'
  });

  const handleOpenModal = (p) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        category: categories[0] || '',
        description: '',
        stock: 0,
        isActive: true,
        image: '',
        images: [],
        material: '',
        color: '',
        finish: 'Matte'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      images: [formData.image || ''], // Ensure images array matches primary image
      image: formData.image || `https://loremflickr.com/600/800/${formData.category?.toLowerCase() || 'product'}?lock=${Date.now()}`
    };

    if (editingProduct) {
      db.updateProduct(editingProduct.id, dataToSave);
    } else {
      db.addProduct({ ...dataToSave, id: `p-new-${Date.now()}` });
    }
    setProducts([...db.getProducts()]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    db.deleteProduct(id);
    setProducts([...db.getProducts()]);
    setIsDeleting(null);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    db.addCategory(newCategoryInput.trim());
    setCategories([...db.getCategories()]);
    setNewCategoryInput('');
  };

  const handleRenameCategory = (oldName) => {
    if (!categoryNameInput.trim() || categoryNameInput === oldName) {
      setEditingCategory(null);
      return;
    }
    db.renameCategory(oldName, categoryNameInput.trim());
    setCategories([...db.getCategories()]);
    setProducts([...db.getProducts()]);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (name) => {
    if (!window.confirm(`Are you sure? Products in "${name}" will be moved to "Uncategorized".`)) return;
    db.deleteCategory(name);
    setCategories([...db.getCategories()]);
    setProducts([...db.getProducts()]);
  };

  const handleAIGenerateDesc = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category || 'General');
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleAIGenerateImage = async () => {
    if (!formData.name) return;
    setIsGeneratingImage(true);
    
    const prompt = `
Generate a high-accuracy e-commerce catalog product image.

STRICT REQUIREMENTS:
- Show ONLY the product itself
- NO humans, NO hands, NO models
- NO lifestyle or usage context
- NO environment props
- NO text, NO watermark, NO branding overlay
- Product must be centered and fully visible

PRODUCT DETAILS:
Product name: ${formData.name}
Category: ${formData.category}
Material: ${formData.material || 'Premium Quality'}
Color: ${formData.color || 'True to life'}
Finish: ${formData.finish || 'Matte'}
Shape & proportions: realistic, manufacturing-accurate

IMAGE STYLE:
- Background: pure white (#FFFFFF)
- Lighting: soft studio lighting, shadow-free
- Camera: straight-on front view
- Resolution: ultra-high resolution, sharp edges
- Style: professional catalog / packshot photography
- Neutral color balance, true-to-life colors

DO NOT:
- Add people or hands
- Show the product being used
- Add accessories not mentioned
- Change colors or proportions
      `.trim();

    const img = await generateProductImage(prompt);
    if (img) {
      setFormData(prev => ({
        ...prev,
        image: img,
        images: [img]
      }));
    }
    setIsGeneratingImage(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Inventory Catalog</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/></svg>
            Manage Categories
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      <span className="font-semibold text-sm text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${product.stock < 5 ? 'text-rose-600' : 'text-gray-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                       {product.isActive ? 'Visible' : 'Hidden'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => setIsDeleting(product.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl overflow-y-auto no-scrollbar max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Manage Categories</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-8">
              <input 
                type="text" 
                value={newCategoryInput} 
                onChange={e => setNewCategoryInput(e.target.value)}
                placeholder="New Category Name"
                className="flex-grow px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
              <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Add</button>
            </form>

            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group">
                  {editingCategory === cat ? (
                    <div className="flex-grow flex gap-2">
                      <input 
                        autoFocus
                        type="text" 
                        value={categoryNameInput} 
                        onChange={e => setCategoryNameInput(e.target.value)}
                        className="flex-grow px-3 py-1.5 bg-transparent border border-indigo-300 rounded-lg focus:outline-none" 
                      />
                      <button onClick={() => handleRenameCategory(cat)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Save</button>
                      <button onClick={() => setEditingCategory(null)} className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-700">{cat}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingCategory(cat); setCategoryNameInput(cat); }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-4 h-[50px] items-center">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded" />
                     <span className="text-sm">Active & Visible</span>
                   </label>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 md:col-span-2">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">High-Accuracy Generation Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Material</label>
                    <input type="text" placeholder="e.g. Oak Wood, Silk" value={formData.material || ''} onChange={e => setFormData({...formData, material: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Exact Color</label>
                    <input type="text" placeholder="e.g. Midnight Blue" value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Finish</label>
                    <select value={formData.finish || 'Matte'} onChange={e => setFormData({...formData, finish: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                      <option value="Matte">Matte</option>
                      <option value="Glossy">Glossy</option>
                      <option value="Textured">Textured</option>
                      <option value="Metallic">Metallic</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Product Image</label>
                  <button 
                    type="button"
                    onClick={handleAIGenerateImage}
                    disabled={isGeneratingImage || !formData.name}
                    className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <svg className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    {isGeneratingImage ? 'Generating High-Accuracy Image...' : 'Magic Generate with AI'}
                  </button>
                </div>
                <div className="aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden max-w-[200px] mx-auto mb-4">
                   {formData.image ? (
                     <img src={formData.image} className="w-full h-full object-cover" alt="Product" />
                   ) : (
                     <span className="text-xs text-gray-400 font-bold uppercase">No Image</span>
                   )}
                </div>
                {isGeneratingImage && (
                  <div className="text-center space-y-1">
                    <p className="text-[10px] text-indigo-500 font-medium animate-pulse">Generating catalog-standard image...</p>
                    <p className="text-[9px] text-gray-400 italic">Pure white background, professional lighting.</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button 
                    type="button" 
                    onClick={handleAIGenerateDesc}
                    disabled={isGenerating || !formData.name}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <svg className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    {isGenerating ? 'Generating...' : 'Magic Write with AI'}
                  </button>
                </div>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-100">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-8">This will permanently remove the product from your catalog.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleting(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Cancel</button>
              <button onClick={() => handleDelete(isDeleting)} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
