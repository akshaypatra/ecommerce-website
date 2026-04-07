# Spiritual Harmony - Frontend

A beautiful, light-colored React ecommerce frontend with spiritual vibes for the Spiritual Harmony wellness platform.

## 🎨 Design Features

### Color Palette
- **Primary Colors**: Soft creams, light lavenders, pale mint greens
- **Accent Colors**: Sage green, lavender, sky blue, warm sand, blush pink
- **Spiritual Tones**: Purple, teal, gold, rose

### Components
- Light gradient backgrounds
- Smooth animations and transitions
- Rounded corners for a soft, welcoming feel
- Spiritual emoji designations (✨, 🧘, 💎, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the Frontend directory**
```bash
cd Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file** (optional)
```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Start the development server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navigation.js          # Navigation bar with cart & user menu
│   │   ├── Footer.js              # Footer with links & contact info
│   │   └── ProductCard.js         # Reusable product card component
│   ├── pages/
│   │   ├── HomePage.js            # Landing/home page
│   │   ├── ProductsPage.js        # Products listing with filters
│   │   ├── ProductDetailPage.js   # Individual product details
│   │   ├── CartPage.js            # Shopping cart with discount codes
│   │   ├── CheckoutPage.js        # Checkout form
│   │   ├── OrdersPage.js          # User orders history
│   │   └── LoginPage.js           # Login/Register
│   ├── services/
│   │   └── api.js                 # API client configuration
│   ├── styles/
│   │   ├── variables.css          # CSS variables & color palette
│   │   └── global.css             # Global styles & Bootstrap overrides
│   ├── App.js                     # Main app component & routing
│   ├── index.js                   # Entry point
│   └── index.html                 # HTML template
├── package.json
├── .gitignore
└── README.md
```

## 🎯 Pages & Features

### Home Page
- Hero section with spiritual messaging
- Feature highlights
- Product category showcase
- Newsletter subscription

### Products Page
- Product grid with cards
- Search functionality
- Price range filtering
- Sort options (name, price)
- Product quantity selector

### Product Detail
- Detailed product information
- Specifications table
- Spiritual benefits list
- Quantity selector
- Add to cart functionality

### Shopping Cart
- Cart items display
- Quantity adjustment
- Remove items
- Order summary
- Discount code application
  - Try: **SPIRITUAL10** (10% off)
  - Try: **WELLNESS20** (20% off)
- Free shipping on orders over $50

### Checkout
- Shipping information form
- Payment information form
- Order review
- Mock order placement

### Orders Page
- User order history
- Order status tracking
- Order details

### Authentication
- Login form
- Register form
- Mock authentication (for demo purposes)
- User profile menu

## 🎨 Customization

### Color Scheme
Edit `src/styles/variables.css` to customize the spiritual color palette:

```css
:root {
  --primary-cream: #f5f3f0;
  --spiritual-purple: #9966cc;
  --spiritual-teal: #66b3a1;
  --spiritual-gold: #d4af37;
  /* ... more colors ... */
}
```

### Typography
The app uses system fonts for optimal performance. Customize in `global.css`:

```css
body {
  font-family: 'Your Font Here', sans-serif;
}
```

## 🔗 API Integration

The frontend is designed to work with the Django backend. Configure the API URL:

```bash
# .env
REACT_APP_API_URL=http://localhost:8000/api
```

Update `src/services/api.js` to match your backend endpoints.

## 🛒 Features

- ✅ Product browsing with search & filter
- ✅ Shopping cart management
- ✅ Discount code system
- ✅ Checkout flow
- ✅ User authentication
- ✅ Order tracking
- ✅ Responsive design
- ✅ Light, spiritual UI design

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### Deploy to: 
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your GitHub repo to Netlify
- **AWS S3**: Use AWS CLI to sync the build folder
- **Azure**: Deploy with Azure Static Web Apps

## 🔒 Demo Credentials

For authentication testing:
- Use any username/password combination
- Demo accounts are created on-the-fly

## 📦 Dependencies

- **React 18.2**: UI library
- **React Router 6.8**: Client-side routing
- **Bootstrap 5.2**: CSS framework
- **Axios 1.3**: HTTP client
- **React Icons 4.7**: Icon library

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

This is a frontend template with mock data. To connect with the real Django backend:

1. Update API endpoints in `src/services/api.js`
2. Set the correct `REACT_APP_API_URL` in `.env`
3. Ensure CORS is configured in Django backend

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [React Router Docs](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 💡 Future Enhancements

- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Live chat support
- [ ] Blog/Wellness articles
- [ ] Community forum
- [ ] Subscription products
- [ ] Advanced analytics
- [ ] Email notifications

---

**Built with 💜 for your wellness journey**
