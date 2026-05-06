# UltraProject Marketplace

A full-stack Next.js marketplace application built with React App Router, NextAuth, MongoDB/Mongoose, and Paystack integration.

## 🌟 Features

### Authentication

- Email/password login with `next-auth`
- Role-aware access for users, vendors, and admins
- Secure server-side session handling

### Marketplace

- Browse products and vendors
- Product details and filtering
- Cart and order flow
- Customer order history

### Vendor Experience

- Vendor dashboard for product management
- Product count, order count, and revenue summary
- Add/edit vendor products through the UI

### Admin Experience

- Admin dashboard access
- User and order visibility
- Platform-level insights and controls

### Payments & Uploads

- Paystack payment integration
- Image upload support via Cloudinary
- API routes for products, orders, reviews, users, and uploads

## 🧱 Tech Stack

- `next` (App Router)
- `react`
- `next-auth`
- `mongoose`
- `mongodb`
- `typescript`
- `cloudinary`
- `paystack`

## 📁 Project Structure

```
marketplace/
├── app/
│   ├── admin/              # Admin dashboard page
│   ├── api/                # API route handlers
│   ├── cart/               # Cart page
│   ├── dashboard/          # User/vendor dashboard
│   ├── login/              # Login page
│   ├── orders/             # Orders page
│   ├── products/           # Product listing and details
│   ├── register/           # Registration page
│   ├── vendor/             # Vendor dashboard and actions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout and metadata
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
├── lib/                    # Auth, DB, and helper utilities
├── models/                 # Mongoose models
├── types/                  # Type declarations
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file from `.env.example` and fill in the values:

- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`

3. Run the development server:

```bash
npm run dev
```

4. Open your browser:

```text
http://localhost:3000
```

## 🚧 App Routes

### Public Routes

- `/` — Home page
- `/products` — Product catalog
- `/products/[id]` — Product details
- `/login` — Login page
- `/register` — Registration page

### Authenticated Routes

- `/dashboard` — User/vendor dashboard
- `/orders` — User order history
- `/cart` — Shopping cart

### Vendor/Admin Routes

- `/vendor` — Vendor dashboard
- `/admin` — Admin dashboard

## 🔌 API Routes

- `/api/auth` — Authentication handlers
- `/api/products` — Product create/read/update/delete
- `/api/orders` — Order processing and retrieval
- `/api/cart` — Cart actions
- `/api/users` — User-related APIs
- `/api/reviews` — Product reviews
- `/api/uploads` — Image upload handling
- `/api/paystack` — Payment initialization and verification

## ⚙️ Environment Variables

Use `.env.local` with these keys:

```env
MONGODB_URI=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
```

## 💡 Notes

- The project now uses the **Next.js App Router** and is database-ready.
- Legacy static HTML/CSS/JS files have been removed in favor of the app-based implementation.
- Make sure MongoDB and Cloudinary credentials are configured before running locally.

## 📦 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build production app
- `npm start` — Start built app

## 📝 License

This repository is provided for development and learning purposes.

- Grid columns
- Font sizes
- Padding and margins
- Button and form widths

## 🛠️ JavaScript Features

### Core Functionality

- Form validation and submission
- Tab navigation in dashboards
- Modal dialog management
- Search and filter implementation
- Add to cart functionality
- Business approval workflow
- Logout functionality

### Data Management

- localStorage for user data
- Demo data storage
- Session management

### User Feedback

- Alert notifications
- Success/Error messages
- Confirmation dialogs

## 🔄 Workflow Examples

### Business Owner Registration & Shop Setup

1. Visit `register.html`
2. Fill registration form with Business Owner role
3. Redirected to `business-owner-dashboard.html`
4. Click "Create New Business Request"
5. Fill business details in modal
6. Submit request
7. Wait for admin approval
8. Once approved, add products

### Admin Approving Businesses

1. Visit `admin-dashboard.html`
2. Go to "Business Requests" tab
3. Review pending requests
4. Add admin notes (for rejection)
5. Click "Approve" or "Reject"
6. Status updates in real-time

### Customer Browsing

1. Visit `index.html` home page
2. Click "Browse Businesses"
3. Browse marketplace on `marketplace.html`
4. Search or filter by category
5. Click "View Shop" on business
6. See all products in `business-details.html`
7. Add products to cart

## 🎨 CSS Classes Reference

### Button Classes

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-small">Small</button>
<button class="btn btn-large">Large</button>
<button class="btn btn-full">Full Width</button>
```

### Status Badges

```html
<span class="status-badge pending">Pending</span>
<span class="status-badge approved">Approved</span>
<span class="status-badge rejected">Rejected</span>
<span class="status-badge active">Active</span>
```

### Card Classes

```html
<div class="business-card">...</div>
<div class="product-card">...</div>
<div class="request-card pending">...</div>
<div class="stat-card">...</div>
```

## 📊 Data Structure (localStorage)

### User Object

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  role: "business_owner",
  registeredAt: "2025-11-14T..."
}
```

### Business Object

```javascript
{
  id: "business_1",
  name: "Tech Store",
  category: "Electronics",
  description: "...",
  address: "123 Tech Street",
  phone: "+1 (555) 123-4567",
  owner: "user_id",
  status: "approved",
  products: 45,
  rating: 4.8
}
```

### Product Object

```javascript
{
  id: "product_1",
  name: "Wireless Headphones",
  price: 89.99,
  business: "business_1",
  stock: 15,
  rating: 4.9,
  description: "..."
}
```

## 🚧 Future Enhancements

- Backend API integration
- Database implementation
- Payment gateway integration
- Email notifications
- Real-time notifications
- Advanced analytics
- Product reviews system
- Wishlist functionality
- Order management
- Shipping integration
- Multiple language support
- Dark mode
- Image upload for products

## 🐛 Known Limitations

- Data is stored in browser's localStorage (not persistent across browsers)
- No real backend API integration
- All data is demo/hardcoded
- No image upload functionality
- No email verification
- No payment processing
- No real notifications

## 🔧 Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Installation Notes

1. **No installation required** - Open files directly in browser
2. Files should be in same directory for proper linking
3. Use a local server for best experience
4. Check browser console for any errors

## 🤝 Contributing

To extend this marketplace:

1. Add more pages by creating new HTML files
2. Add styles to `styles.css`
3. Add functionality to `app.js`
4. Keep the same structure and naming conventions

## 📞 Support

For issues or questions:

1. Check the HTML file comments
2. Check browser console for errors
3. Review demo credentials in login page
4. Verify file paths are correct

## 📄 License

This project is open source and available for educational and commercial use.

---

**Happy coding! 🚀**

Last Updated: November 14, 2025

## 📝 Recent Changes

### November 22, 2025

- Updated `register.html` to restrict registration to business owners only by removing the role selector and adding a hidden input for the role.
- Modified `app.js` to default the role to `business_owner` when the role selector is not present and adjusted validation accordingly.
