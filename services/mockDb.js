const STORAGE_KEY = 'lumina_shop_db_v7';

const generateProducts = (categories) => {
  const curatedData = {
    'Accessories': [
      { 
        name: 'Floral Diamond Studs', 
        material: '18K Yellow Gold & Diamonds', 
        color: 'Gold/White', 
        finish: 'Glossy', 
        keyword: 'floral,earrings,gold',
        primaryImage: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800&h=800',
        price: 850.00
      },
      { 
        name: 'Chronograph Classic', 
        material: 'Brushed Steel', 
        color: 'Midnight Blue', 
        finish: 'Metallic', 
        keyword: 'watch,luxury',
        price: 1200.00
      }
    ],
    'Books': [
      { 
        name: 'Modernist Architecture', 
        material: 'Hardcover Linen', 
        color: 'Stone Grey', 
        finish: 'Textured', 
        keyword: 'architecture,book',
        price: 85.00
      }
    ],
    'Electronics': [
      { 
        name: 'Slate Pro Tablet', 
        material: 'Recycled Aluminum', 
        color: 'Obsidian', 
        finish: 'Matte', 
        keyword: 'tablet,tech',
        price: 999.00
      }
    ],
    'Bags': [
      { 
        name: 'Heritage Weekender', 
        material: 'Full-Grain Leather', 
        color: 'Tobacco', 
        finish: 'Textured', 
        keyword: 'duffle,leather',
        price: 550.00
      }
    ],
    'Clothes': [
      { 
        name: 'Pure Cashmere Sweater', 
        material: '100% Mongolian Cashmere', 
        color: 'Oatmeal', 
        finish: 'Soft', 
        keyword: 'sweater,fashion',
        price: 295.00
      }
    ]
  };

  const items = [];
  categories.forEach(cat => {
    if (curatedData[cat]) {
      curatedData[cat].forEach((item, i) => {
        const imageUrl = item.primaryImage || `https://loremflickr.com/800/800/${cat.toLowerCase()},${item.keyword.split(',')[0]}?lock=${cat.length + i + 100}`;
        items.push({
          id: `p-${cat.toLowerCase()}-${i}`,
          name: item.name,
          price: item.price,
          description: `A masterclass in design, the ${item.name} is crafted from ${item.material}.`,
          category: cat,
          stock: 12,
          material: item.material,
          color: item.color,
          finish: item.finish,
          image: imageUrl,
          images: [imageUrl],
          isActive: true
        });
      });
    }
  });
  return items;
};

const INITIAL_CATEGORIES = ['Accessories', 'Books', 'Electronics', 'Bags', 'Clothes'];

const INITIAL_DATA = {
  users: [
    { 
      id: '1', name: 'Admin User', email: 'admin@lumina.com', role: 'admin', password: 'password123',
      addresses: [{ id: 'a1', label: 'Main Office', street: '123 Tech Ave', city: 'San Francisco', state: 'CA', zip: '94103', isDefault: true }],
      paymentMethods: [{ id: 'pm1', type: 'card', last4: '4242', expiry: '12/26', brand: 'Visa', isDefault: true }]
    },
    { 
      id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', password: 'password123',
      addresses: [{ id: 'a2', label: 'Home', street: '456 Oak St', city: 'Portland', state: 'OR', zip: '97201', isDefault: true }],
      paymentMethods: [{ id: 'pm2', type: 'card', last4: '5555', expiry: '05/25', brand: 'Mastercard', isDefault: true }]
    }
  ],
  categories: INITIAL_CATEGORIES,
  products: generateProducts(INITIAL_CATEGORIES),
  orders: []
};

class MockDB {
  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    this.save();
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getUsers() { return this.data.users; }
  addUser(user) { this.data.users.push({ ...user, addresses: [], paymentMethods: [] }); this.save(); }
  updateUser(id, updates) {
    this.data.users = this.data.users.map(u => u.id === id ? { ...u, ...updates } : u);
    this.save();
  }
  updateUserPassword(id, newPassword) {
    this.data.users = this.data.users.map(u => u.id === id ? { ...u, password: newPassword } : u);
    this.save();
  }

  getProducts() { return this.data.products; }
  addProduct(product) { this.data.products.push(product); this.save(); }
  updateProduct(id, updates) {
    this.data.users = this.data.users;
    this.data.products = this.data.products.map(p => p.id === id ? { ...p, ...updates } : p);
    this.save();
  }
  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
  }

  getCategories() { return this.data.categories; }
  addCategory(name) {
    if (!this.data.categories.includes(name)) {
      this.data.categories.push(name);
      this.save();
    }
  }
  renameCategory(oldName, newName) {
    this.data.categories = this.data.categories.map(cat => cat === oldName ? newName : cat);
    this.data.products = this.data.products.map(p => p.category === oldName ? { ...p, category: newName } : p);
    this.save();
  }
  deleteCategory(name) {
    this.data.categories = this.data.categories.filter(cat => cat !== name);
    this.data.products = this.data.products.map(p => p.category === name ? { ...p, category: 'Uncategorized' } : p);
    this.save();
  }

  getOrders() { return this.data.orders; }
  addOrder(order) { this.data.orders.push(order); this.save(); }
  updateOrderStatus(id, status) {
    this.data.orders = this.data.orders.map(o => o.id === id ? { ...o, status } : o);
    this.save();
  }
}

export const db = new MockDB();
