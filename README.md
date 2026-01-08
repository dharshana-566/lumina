<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Shop - AI-Powered E-Commerce System

A modern, full-featured e-commerce platform built with React and enhanced with Google Gemini AI integration. Lumina Shop provides a complete shopping experience with user authentication, product management, cart functionality, order tracking, and AI-powered features.

## 🚀 Features

### Customer Experience
- **Product Browsing**: Browse products with detailed views and search functionality
- **Shopping Cart**: Add, remove, and manage items in your cart
- **User Authentication**: Secure login and registration system
- **Order Management**: Track order history and current status
- **User Profile**: Manage personal information and preferences
- **Settings**: Customize your shopping experience

### Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Analytics Dashboard**: Monitor sales and business metrics
- **User Management**: Oversee customer accounts

### AI Integration
- **Google Gemini AI**: Powered by `@google/genai` for intelligent features
- **Smart Recommendations**: AI-driven product suggestions
- **Natural Language Processing**: Enhanced search and customer support

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4 with React Router DOM 7.13.0
- **Build Tool**: Vite 6.2.0
- **Language**: JavaScript/TypeScript support
- **AI Integration**: Google Gemini AI API
- **State Management**: React Context API
- **Styling**: Modern CSS with responsive design
- **Data Storage**: LocalStorage with mock database

## 📦 Project Structure

```
lumina/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main application layout
│   └── AdminLayout.jsx # Admin-specific layout
├── pages/              # Page components
│   ├── Storefront.jsx  # Product listing page
│   ├── ProductDetail.jsx # Individual product view
│   ├── CartPage.jsx    # Shopping cart
│   ├── LoginPage.jsx   # User authentication
│   ├── RegisterPage.jsx # User registration
│   ├── OrderHistory.jsx # Order tracking
│   ├── ProfilePage.jsx # User profile management
│   ├── SettingsPage.jsx # User settings
│   ├── AdminDashboard.jsx # Admin main dashboard
│   ├── AdminProducts.jsx # Product management
│   └── AdminOrders.jsx  # Order management
├── services/           # Business logic and APIs
│   ├── mockDb.js       # Mock database service
│   └── gemini.js       # AI integration service
├── types.js            # Type definitions and constants
├── App.jsx             # Main application component
├── index.jsx           # Application entry point
└── index.html          # HTML template
```

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lumina
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 👥 User Roles

The application supports two user roles:

### Customer (User)
- Browse products and view details
- Add items to cart and checkout
- View order history
- Manage profile and settings

### Administrator
- All customer privileges
- Manage products (add, edit, delete)
- View and manage all orders
- Access admin dashboard with analytics

## 🤖 AI Features

Lumina Shop integrates Google Gemini AI to provide:
- **Smart Product Recommendations**: Personalized suggestions based on browsing history
- **Natural Language Search**: Find products using conversational queries
- **Customer Support**: AI-powered assistance for common questions

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet devices
- Mobile phones (iOS and Android)

## 🔒 Security Features

- Secure user authentication
- Role-based access control
- Local storage encryption for sensitive data
- API key protection through environment variables

## 🛒 E-Commerce Functionality

### Product Management
- Product catalog with categories
- Detailed product descriptions and images
- Inventory tracking
- Price management

### Order Processing
- Shopping cart with quantity management
- Order placement and confirmation
- Order status tracking (Pending, Shipped, Delivered, Cancelled)
- Order history for customers

### User Experience
- Guest browsing (no login required for viewing)
- User registration and login
- Profile management
- Order tracking and history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the existing issues on GitHub
- Create a new issue with detailed information
- Contact the development team

## 🔄 Version History

- **v0.0.0** - Initial release with core e-commerce functionality
- AI integration with Google Gemini
- Admin dashboard and user management
- Responsive design implementation

---

**Built with ❤️ using React and Google Gemini AI**
