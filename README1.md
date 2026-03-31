# 🎨 Frontend - React Application

Hướng dẫn hoàn chỉnh setup, chạy, và sử dụng ứng dụng React frontend.

---

## 📋 Mục Lục

1. [Quick Start](#-quick-start)
2. [Setup Toàn Bộ](#-setup-toàn-bộ)
3. [Environment Variables](#-environment-variables)
4. [File Structure](#-file-structure)
5. [Pages & Components](#-pages--components)
6. [Services & API Integration](#-services--api-integration)
7. [Styling & UI](#-styling--ui)
8. [Documentation](#-documentation)
9. [Troubleshooting](#-troubleshooting)

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit with backend URL

# 3. Make sure backend is running
# http://localhost:5000

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 🔧 Setup Toàn Bộ

### 1. Install Node.js & npm

**Required:**
- Node.js 18+ (https://nodejs.org/)
- npm 9+

**Verify:**
```bash
node --version   # v18.x or higher
npm --version    # 9.x or higher
```

### 2. Install Dependencies

```bash
cd front-end
npm install
```

**What gets installed:**
- React 18
- TypeScript
- Vite (build tool)
- React Router
- Axios (HTTP client)
- React Hook Form
- ShadcnUI components
- TailwindCSS
- Zustand (state management)
- Plus 30+ other libraries

### 3. Setup Environment Variables

Create `.env.local`:
```bash
cp .env.example .env.local
```

**Edit `.env.local`:**

```env
# ================== API ==================
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# ================== FRONTEND ==================
VITE_APP_NAME=TMĐT
VITE_APP_VERSION=1.0.0

# ================== FEATURES ==================
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false

# ================== PAYMENT ==================
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# ================== DEBUG ==================
VITE_DEBUG_MODE=false
```

**Important Variables:**
- `VITE_API_BASE_URL`: Must match your backend URL
- `VITE_STRIPE_PUBLIC_KEY`: For payments (optional)

### 4. Ensure Backend is Running

```bash
# Terminal 1: Start Backend
cd ../retail-store-nestjs
npm run start:dev
# Should show: "Nest application successfully started"
```

### 5. Run Development Server

```bash
# Terminal 2: Start Frontend
npm run dev
```

**You should see:**
```
VITE v4.x.x  build for production: npm run build

➜  Local:   http://localhost:3000/
➜  press h to show help
```

**Open in browser:** http://localhost:3000/

---

## 🌍 Environment Variables

### Development (.env.local)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEBUG_MODE=true
```

### Production (.env.production)

```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_DEBUG_MODE=false
```

### Available Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:5000/api` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `VITE_APP_NAME` | App name | `TMĐT` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_...` |
| `VITE_DEBUG_MODE` | Enable debug logs | `true` / `false` |

---

## 📁 File Structure

```
src/
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
│
├── pages/                       # Page components (routes)
│   ├── HomePage.tsx
│   ├── ProductListingPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CustomizerPage.tsx
│   ├── DesignGalleryPage.tsx
│   ├── ShoppingCartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderSuccessPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── UserDashboardPage.tsx
│   ├── OrdersListPage.tsx
│   ├── OrderDetailPage.tsx
│   ├── AddressesPage.tsx
│   ├── VouchersPage.tsx
│   ├── FavoritesPage.tsx
│   └── ... (20+ more pages)
│
├── components/                  # Reusable components
│   ├── Header.tsx              # Navigation bar
│   ├── Footer.tsx              # Footer
│   ├── ProductCard.tsx         # Product card component
│   ├── CustomizerPage.tsx      # Design customizer
│   ├── ui/                     # ShadcnUI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── dialog.tsx
│   │   └── ... (40+ UI components)
│   └── shared/                 # Shared components
│       ├── ProtectedRoute.tsx  # Route protection
│       └── LoadingSpinner.tsx
│
├── services/                    # API calls
│   ├── apiServices.ts          # API client setup
│   └── axiosInstance.ts        # Axios configuration
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useCart.ts              # Shopping cart hook
│   └── useFetch.ts             # Data fetching hook
│
├── types/                       # TypeScript types
│   └── index.ts                # Shared types
│
├── styles/                      # Global styles
│   └── index.css               # TailwindCSS
│
├── guidelines/                  # Design guidelines
│   └── Colors.tsx              # Color palette
│
└── index.css                    # Entry styles
```

---

## 📄 Pages & Components

### Main Pages

#### 🏠 Home Page
**Route:** `/`
- Hero section
- Featured products
- Category showcase
- Newsletter signup

#### 🛍️ Shop / Product Listing
**Route:** `/shop`
- Product grid
- Filter & search
- Category sidebar
- Sorting options

**Features:**
```typescript
// Filter by category
/shop?category=fashion

// Search products
/shop?search=shirt

// Sort by price
/shop?sort=price&order=asc
```

#### 📦 Product Detail
**Route:** `/products/:id`
- Product images
- Description
- Price & availability
- Customer reviews
- Related products
- Add to cart button

#### 🎨 Design Customizer
**Route:** `/customize/:productId`
- Live preview
- Color selection
- Size selection
- Custom design upload
- Price calculator
- Save design button

**Features:**
- Real-time price updates
- Design templates
- Color swatches
- Size guide
- Design history

#### 🎭 Design Gallery
**Route:** `/designs`
- Browse saved designs
- Community designs
- Filter & search
- Apply design to new product

#### 🛒 Shopping Cart
**Route:** `/cart`
- Cart items list
- Quantity adjustment
- Remove items
- Apply vouchers
- Subtotal & shipping
- Checkout button

#### 💳 Checkout
**Route:** `/checkout`
- Shipping address selection
- Shipping method
- Payment method selection
- Order review
- Place order button

#### ✅ Order Success
**Route:** `/order-success/:orderId`
- Order confirmation
- Order details
- Download invoice
- Track shipment button

#### 👤 User Login
**Route:** `/login`
- Email input
- Password input
- Remember me
- Forgot password link
- Social login (if enabled)

#### 📝 User Register
**Route:** `/register`
- Email input
- Password input
- Confirm password
- Terms & conditions
- Register button

#### 📊 User Dashboard
**Route:** `/dashboard`
- Profile summary
- Order history
- Saved addresses
- Saved designs
- Wishlist
- Settings

#### 📋 Orders List
**Route:** `/orders`
- All user orders
- Order status
- Order date
- Total amount
- View details link

#### 🔍 Order Detail
**Route:** `/orders/:id`
- Order items
- Shipping address
- Delivery tracking
- Order status timeline
- Return request button

#### 📍 Addresses
**Route:** `/addresses`
- List all addresses
- Add new address
- Edit address
- Delete address
- Set default address

#### 🎟️ Vouchers
**Route:** `/vouchers`
- Available vouchers
- Apply voucher
- Voucher history
- Voucher details

#### ❤️ Favorites / Wishlist
**Route:** `/favorites`
- Saved products
- Remove from favorites
- Move to cart

---

### Key Components

#### ProductCard Component
```typescript
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onFavorite={handleFavorite}
/>
```

#### Header Component
- Navigation menu
- Search bar
- User menu
- Cart icon with count
- Mobile hamburger menu

#### Footer Component
- About section
- Links
- Newsletter signup
- Social media
- Copyright

#### ProtectedRoute Component
- Checks authentication
- Redirects if not logged in
- Role-based access

#### Loading Spinner
- Shows while loading
- Customizable size
- Customizable text

---

## 🔌 Services & API Integration

### API Services Setup

**File:** `src/services/apiServices.ts`

```typescript
// Base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Auth endpoints
api.post('/auth/login', { email, password })
api.post('/auth/register', { email, password, firstName, lastName })
api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })

// Product endpoints
api.get('/products')
api.get('/products/:id')
api.get('/products?search=shirt&page=1&limit=10')

// Cart endpoints
api.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
api.post('/cart/items', itemData, { headers: { Authorization: `Bearer ${token}` } })
api.patch('/cart/items/:id', { quantity: 5 }, { headers: { Authorization: `Bearer ${token}` } })
api.delete('/cart/items/:id', { headers: { Authorization: `Bearer ${token}` } })

// Order endpoints
api.post('/orders', orderData, { headers: { Authorization: `Bearer ${token}` } })
api.get('/orders', { headers: { Authorization: `Bearer ${token}` } })
api.get('/orders/:id', { headers: { Authorization: `Bearer ${token}` } })

// Customizer endpoints
api.post('/customizer/calculate-price', { productId, colorCode, sizeCode })
api.post('/customizer/add-to-cart', customizationData, { headers: { Authorization: `Bearer ${token}` } })
api.post('/customizer/save-design', designData, { headers: { Authorization: `Bearer ${token}` } })
```

### Authentication Flow

```typescript
// 1. Register
const response = await api.post('/auth/register', {
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});
const token = response.data.access_token;

// 2. Store token
localStorage.setItem('token', token);

// 3. Use in requests
const headers = { Authorization: `Bearer ${token}` };
api.get('/auth/me', { headers });

// 4. Logout
localStorage.removeItem('token');
```

### Making API Calls

**GET Request:**
```typescript
try {
  const response = await api.get('/products');
  console.log(response.data);
} catch (error) {
  console.error('Error:', error);
}
```

**POST Request:**
```typescript
try {
  const response = await api.post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
  });
  localStorage.setItem('token', response.data.access_token);
} catch (error) {
  console.error('Login failed:', error);
}
```

**With Authentication:**
```typescript
const token = localStorage.getItem('token');
const response = await api.get('/cart', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🎨 Styling & UI

### TailwindCSS

All components use TailwindCSS for styling.

**Common utility classes:**
```typescript
// Flexbox
className="flex flex-col gap-4"

// Grid
className="grid grid-cols-3 gap-4"

// Spacing
className="p-4 m-2"

// Colors
className="bg-blue-500 text-white"

// Responsive
className="w-full md:w-1/2 lg:w-1/3"

// Hover states
className="hover:bg-gray-100 transition-colors"
```

### ShadcnUI Components

Pre-built UI components available:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Tabs } from '@/components/ui/tabs';

// Usage
<Button onClick={handleClick}>Click me</Button>
<Input type="email" placeholder="Email" />
<Card className="p-4">Content</Card>
<Dialog>
  <DialogContent>Dialog content</DialogContent>
</Dialog>
```

### Color Palette

**Primary Colors:**
- Blue: `#3B82F6`
- Green: `#10B981`
- Red: `#EF4444`

**Neutral Colors:**
- White: `#FFFFFF`
- Gray-100: `#F3F4F6`
- Gray-500: `#6B7280`
- Black: `#000000`

---

## 🔄 State Management

### Zustand Store

State management with Zustand:

```typescript
// auth.store.ts
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  }
}));

// Usage in component
const { token, user, login, logout } = useAuthStore();
```

### Custom Hooks

**useAuth Hook:**
```typescript
const { isAuthenticated, user, login, logout } = useAuth();
```

**useCart Hook:**
```typescript
const { items, total, addItem, removeItem } = useCart();
```

---

## 🚀 Build & Deploy

### Development Build

```bash
npm run dev
```

Starts dev server with hot reload at http://localhost:3000

### Production Build

```bash
npm run build
```

**Creates:**
- `dist/` folder with optimized files
- Minified JavaScript & CSS
- Asset optimization
- Ready for deployment

**Check build:**
```bash
npm run build -- --analyze
```

### Preview Production Build

```bash
npm run preview
```

Test production build locally before deploying.

### Deploy to S3 + CloudFront

```bash
# Build first
npm run build

# Upload to S3
aws s3 sync dist/ s3://tmdt-retail-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id XXXX --paths "/*"
```

---

## 📦 Available Scripts

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Check code quality
npm run format        # Format code
npm run type-check    # Check TypeScript types
npm run test          # Run unit tests
```

---

## 🆘 Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3001
```

### Backend Not Responding

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not:
# Terminal: cd ../retail-store-nestjs && npm run start:dev
```

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Make sure backend is running
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Check backend CORS configuration
4. Ensure backend allows frontend origin

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Blank Page on Load

```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Clear localStorage: F12 -> Application -> Local Storage -> Clear
# Hard refresh: Ctrl+Shift+R
```

### Slow Performance

```bash
# Analyze bundle size
npm run build -- --analyze

# Check Chrome DevTools Performance tab
# Look for large components or images
```

---

## 🔍 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests (if configured)

```bash
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse products
- [ ] Add product to cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Customize product
- [ ] Apply voucher
- [ ] Proceed to checkout
- [ ] Complete payment
- [ ] View order confirmation
- [ ] Track shipment
- [ ] Submit review

---

## 🎓 Common Patterns

### Loading Data

```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/products');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
return <div>{/* render data */}</div>;
```

### Form Handling

```typescript
const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = async (data) => {
  try {
    await api.post('/auth/login', data);
  } catch (error) {
    console.error(error);
  }
};

<form onSubmit={handleSubmit(onSubmit)}>
  <Input {...register('email', { required: true })} />
  {errors.email && <span>Email required</span>}
  <Button type="submit">Submit</Button>
</form>
```

### Protected Routes

```typescript
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>
```

---

## 📚 Documentation

### **🚀 [START HERE - DOCUMENTATION INDEX](./DOCUMENTATION_INDEX.md)**
Quick navigation guide to all documentation files & how to find information.

---

### **📚 Complete Documentation Suite**

#### **1. Quick Reference** 🚀
- **[PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md)** - Danh sách nhanh tất cả 27 pages
  - Quick page overview table (27 pages)
  - Route path cho mỗi page
  - API endpoints sử dụng cho mỗi page
  - Features và actions
  - 🔥 **START HERE** để bắt đầu

#### **2. Detailed Documentation** 📖
- **[FRONTEND_FLOW.md](./FRONTEND_FLOW.md)** - Tổng hợp chi tiết tất cả pages & APIs
  - Chi tiết 27 pages (request/response examples)
  - API mapping bảng (50+ endpoints)
  - User flows & sequences
  - Authentication & authorization
  - Development setup guide

#### **3. Visual Flows** 🎨
- **[FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md)** - Mermaid sequence diagrams
  - 8 sequence diagrams cho user journeys
  - Auth flows (Registration, Login)
  - Shopping & Cart flows
  - Customizer flows
  - Checkout & Payment flows
  - Order & Tracking flows
  - Profile & Settings flows
  - Reviews flows

#### **4. Summary & Overview** 📊
- **[SUMMARY.md](./SUMMARY.md)** - Project overview & statistics
  - 27 pages & 50+ API endpoints
  - Technology stack
  - Complete pages list
  - Development setup
  - Deployment guide

#### **5. Code References**
- **[API Config](./src/services/apiConfig.ts)** - API endpoints & services (1,400+ lines)
  - 50+ API endpoints mapping
  - Service methods (apiServices)
  - Error handling
  - HTTP headers configuration

#### **6. Backend Documentation** (in @backend folder):
- `API_FLOW.md` - Backend API documentation (106+ endpoints)
- `SEQUENCE_DIAGRAM.md` - API interaction diagrams
- `PROJECT_SUMMARY.md` - Project overview

---

### **📖 How to Use Documentation**

1. **First time?** 
   - Start with **PAGES_QUICK_REFERENCE.md** for quick overview

2. **Want details on specific page?**
   - Check **FRONTEND_FLOW.md** - chi tiết từng page, request/response

3. **Need to understand user flows?**
   - Check **FLOWS_DIAGRAMS.md** - see sequence diagrams

4. **Want project stats & overview?**
   - Check **SUMMARY.md** - statistics, features, deployment

5. **Need API endpoint information?**
   - Check **API Config** (apiConfig.ts) - 50+ endpoints + service methods

6. **Need to understand backend?**
   - Check **backend/API_FLOW.md** - 106+ endpoints documented

---

## 📝 Notes

- Responsive design (mobile, tablet, desktop)
- Dark mode ready (optional feature)
- Accessibility (WCAG 2.1 AA)
- Performance optimized (Lighthouse score 90+)
- SEO friendly
- PWA ready (with service worker)

---

## ✨ Features Implemented

✅ Product browsing & filtering  
✅ User authentication  
✅ Shopping cart  
✅ Order checkout  
✅ Design customization  
✅ Order tracking  
✅ User profile  
✅ Address management  
✅ Wishlist/Favorites  
✅ Product reviews  
✅ Responsive design  
✅ Mobile optimized  
✅ Payment integration  
✅ Voucher system  

---

**Last Updated:** December 22, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready

