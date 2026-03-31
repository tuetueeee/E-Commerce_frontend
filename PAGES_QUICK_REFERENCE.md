# 🎯 Pages Quick Reference

Tài liệu nhanh cho tất cả pages & routes trong frontend.

---

## 📑 Pages Overview

| # | Page | Route | Auth | APIs Used | Status |
|---|------|-------|------|-----------|--------|
| 1 | Home | `#home` | ❌ | GET /products, GET /designs/trending | ✅ |
| 2 | Shop Blanks | `#blanks` | ❌ | GET /products/blanks | ✅ |
| 3 | Blank Detail | `#blank-detail` | ❌ | GET /products/{id}, POST /cart/add | ✅ |
| 4 | Design Gallery | `#designs` | ❌ | GET /designs, GET /designs/trending, POST /favorites | ✅ |
| 5 | Design Detail | `#design-detail` | ❌ | GET /designs/{id}, POST /cart/add | ✅ |
| 6 | Customizer | `#customizer` | ✅ | GET /products/{id}, POST /customizer/*, GET /customizer/saved | ✅ |
| 7 | Shopping Cart | `#cart` | ✅ | GET /cart, PATCH /cart/items, DELETE /cart/items, POST /cart/apply-voucher | ✅ |
| 8 | Checkout | `#checkout` | ✅ | GET /cart, GET /addresses, POST /orders, POST /addresses | ✅ |
| 9 | Order Success | `#order-success` | ✅ | GET /orders/{id} | ✅ |
| 10 | Payment Callback | `#payment-callback` | ✅ | Payment gateway callback | ✅ |
| 11 | Payment Cancel | `#payment-cancel` | ✅ | Manual cancel | ✅ |
| 12 | Login | `#login` | ❌ | POST /auth/login | ✅ |
| 13 | Register | `#register` | ❌ | POST /auth/register, POST /auth/login | ✅ |
| 14 | Forgot Password | `#forgot-password` | ❌ | POST /auth/forgot-password | ✅ |
| 15 | Dashboard | `#dashboard` | ✅ | GET /users/dashboard/*, GET /orders/my-orders | ✅ |
| 16 | Orders List | `#orders` | ✅ | GET /orders/my-orders | ✅ |
| 17 | Order Detail | `#order-detail` | ✅ | GET /orders/{id} | ✅ |
| 18 | Order Tracking | `#order-tracking` | ✅ | GET /shipments/order/{id}, GET /orders/{id}/tracking | ✅ |
| 19 | Reviews | `#reviews` | ✅ | GET /reviews/my-reviews, PATCH /reviews/{id}, DELETE /reviews/{id} | ✅ |
| 20 | Favorites | `#favorites` | ✅ | GET /favorites, DELETE /favorites/{id}, POST /cart/add | ✅ |
| 21 | Rewards | `#rewards` | ✅ | GET /rewards/points, GET /rewards/history, GET /rewards/catalog, POST /rewards/redeem | ✅ |
| 22 | Vouchers | `#vouchers` | ✅ | GET /vouchers/my-vouchers, GET /vouchers/validate | ✅ |
| 23 | Addresses | `#addresses` | ✅ | GET /addresses, POST /addresses, PATCH /addresses/{id}, DELETE /addresses/{id} | ✅ |
| 24 | About Green | `#about-green` | ❌ | Static content | ✅ |
| 25 | Help | `#help` | ❌ | Static content | ✅ |
| 26 | Contact | `#contact` | ❌/✅ | POST /contact, GET /contact/my-messages | ✅ |
| 27 | Admin Dashboard | `#admin` | ✅ (admin) | Multiple admin endpoints | ✅ |

---

## 🔓 Auth Pages (3 pages)

### 1️⃣ **LoginPage** (`#login`)
- **Purpose:** User login
- **Form:** Email, Password
- **API:** `POST /auth/login`
- **Next:** Redirect to `#home` or `#admin`
- **File:** `LoginPage.tsx`

```
Flow: Email + Password → POST /auth/login → Save token → Redirect
```

---

### 2️⃣ **RegisterPage** (`#register`)
- **Purpose:** Create new account
- **Form:** Full Name, Email, Password, Confirm Password
- **API:** `POST /auth/register` → `POST /auth/login` (auto)
- **Next:** Redirect to `#dashboard`
- **File:** `RegisterPage.tsx`

```
Flow: Validate → POST /auth/register → Auto-login → Redirect
```

---

### 3️⃣ **ForgotPasswordPage** (`#forgot-password`)
- **Purpose:** Password recovery
- **Form:** Email
- **API:** `POST /auth/forgot-password`
- **Next:** Show confirmation message
- **File:** `ForgotPasswordPage.tsx`

```
Flow: Email → POST /auth/forgot-password → Show message
```

---

## 🛍️ Shopping Pages (4 pages)

### 4️⃣ **Home** (`#home`)
- **Purpose:** Landing page with featured products & trending designs
- **APIs:**
  - `GET /api/products` (featured)
  - `GET /api/designs/trending`
- **Components:** HeroSection, ShopSustainableBlanks, DiscoverDesigns, Recommendations
- **File:** `App.tsx` (default route)

---

### 5️⃣ **BlanksListingPage** (`#blanks`)
- **Purpose:** Browse & filter products
- **API:** `GET /api/products/blanks?page=1&limit=20`
- **Features:** Pagination, Sorting, Filtering (color, size, price)
- **Actions:** View detail, Add to cart
- **File:** `BlanksListingPage.tsx`

```
Params: page, limit, category, color, size, price range
```

---

### 6️⃣ **BlankDetailPage** (`#blank-detail?id=productId`)
- **Purpose:** View single product details
- **API:** `GET /api/products/{id}`
- **Features:** Select color/size, quantity selector, related products
- **Actions:** Add to cart, Add to favorites
- **File:** `BlankDetailPage.tsx`

```
Params: id (productId from URL)
Action: POST /api/cart/add
```

---

### 7️⃣ **DesignGalleryPage** (`#designs`)
- **Purpose:** Browse & filter community designs
- **APIs:**
  - `GET /api/designs?page=1&limit=12`
  - `GET /api/designs/trending`
- **Features:** Pagination, Search, Filter (category, tags, style), Sort (trending, newest, likes)
- **Actions:** Like design, View detail, Add to cart
- **File:** `DesignGalleryPage.tsx`

```
Filters: category, tags, eco-friendly, search query
Sort: trending, newest, most-liked
```

---

### 8️⃣ **DesignDetailPage** (`#design-detail?id=designId`)
- **Purpose:** View single design & artist info
- **API:** `GET /api/designs/{id}`
- **Features:** Preview, Artist info, Price, Like/Unlike
- **Actions:** Use design (apply to product), Add to cart
- **File:** `DesignDetailPage.tsx`

```
Params: id (designId from URL)
```

---

## 🎨 Customizer Page (1 page)

### 9️⃣ **CustomizerPage** (`#customizer`)
- **Purpose:** Customize products with text, images, designs
- **APIs:**
  - `GET /api/products/{id}` (product info)
  - `POST /api/customizer/calculate-price` (real-time)
  - `POST /api/customizer/save` (save design)
  - `GET /api/customizer/saved` (load saved)
  - `POST /api/cart/add` (add to cart)
- **Features:**
  - Canvas editor (drag & drop)
  - Add text (font, size, color)
  - Add images (upload, design library)
  - Real-time price calculation
  - Save/load designs
- **File:** `CustomizerPage.tsx`

```
Canvas Elements:
  - Text: content, fontSize, color, fontFamily, position, rotation
  - Image: base64, position, width, height, rotation
  - Design: pre-made design, position, scale
```

---

## 🛒 Cart & Checkout Pages (6 pages)

### 🔟 **ShoppingCartPage** (`#cart`)
- **Purpose:** Manage shopping cart
- **APIs:**
  - `GET /api/cart`
  - `PATCH /api/cart/items/{id}` (update qty)
  - `DELETE /api/cart/items/{id}` (remove)
  - `POST /api/cart/apply-voucher` (apply code)
  - `DELETE /api/cart/clear`
- **Features:** View items, Update qty, Remove item, Apply voucher, Show totals
- **File:** `ShoppingCartPage.tsx`

```
Display: Items with product image, quantity, price, subtotal
Actions: Update qty, Remove, Clear all, Apply voucher
```

---

### 1️⃣1️⃣ **CheckoutPage** (`#checkout`)
- **Purpose:** Multi-step checkout (address → shipping → payment)
- **APIs:**
  - `GET /api/cart`
  - `GET /api/addresses`
  - `POST /api/addresses` (add new)
  - `POST /api/orders` (create order)
- **Steps:**
  1. Select shipping address
  2. Select shipping method (Standard/Express)
  3. Select payment method & confirm
- **File:** `CheckoutPage.tsx`

```
Step 1: Address selection + add new option
Step 2: Shipping method selection
Step 3: Payment method + order review + submit
```

---

### 1️⃣2️⃣ **OrderSuccessPage** (`#order-success?orderId=xxx`)
- **Purpose:** Confirm order & show details
- **API:** `GET /api/orders/{orderId}`
- **Display:** Order number, items, total, estimated delivery, next steps
- **File:** `OrderSuccessPage.tsx`

```
Params: orderId from URL
Display: Order confirmation with details
```

---

### 1️⃣3️⃣ **PaymentCallbackPage** (`#payment-callback`)
- **Purpose:** Handle VNPay payment callback
- **Flow:** Process callback → Verify → Update status → Redirect
- **File:** `PaymentCallbackPage.tsx`

```
URL Params: vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo
Status: 00 = success, others = failure
```

---

### 1️⃣4️⃣ **PaymentCancelPage** (`#payment-cancel`)
- **Purpose:** Show payment cancellation message
- **File:** `PaymentCancelPage.tsx`

```
Manual cancel or timeout from payment gateway
```

---

## 👤 User Dashboard Pages (8 pages)

### 1️⃣5️⃣ **UserDashboardPage** (`#dashboard`)
- **Purpose:** User dashboard with stats & quick access
- **APIs:**
  - `GET /api/users/dashboard/stats`
  - `GET /api/users/dashboard/recent-orders`
  - `GET /api/users/dashboard/trees-planted`
- **Sections:** Quick stats, Recent orders, Change password, Quick actions
- **File:** `UserDashboardPage.tsx`

```
Display:
  - Total orders, Total spent, Loyalty points, Trees planted
  - Recent 5 orders
  - Change password form
  - Action buttons to other pages
```

---

### 1️⃣6️⃣ **OrdersListPage** (`#orders`)
- **Purpose:** View user's order history
- **API:** `GET /api/orders/my-orders?page=1&limit=10&status=all`
- **Features:** Pagination, Status filter, Search by order number
- **Actions:** View detail, Track shipment
- **File:** `OrdersListPage.tsx`

```
Filters: Status (all, pending, processing, shipped, delivered, cancelled)
Display: Order number, date, total, status, items preview
```

---

### 1️⃣7️⃣ **OrderDetailPage** (`#order-detail?id=orderId`)
- **Purpose:** View single order details
- **API:** `GET /api/orders/{orderId}`
- **Display:** Full order info, items, shipping address, payment method
- **Actions:** Track shipment, Leave review
- **File:** `OrderDetailPage.tsx`

```
Params: id (orderId from URL)
Display: Order summary, items list, address, payment, timeline
```

---

### 1️⃣8️⃣ **OrderTrackingPage** (`#order-tracking?id=orderId`)
- **Purpose:** Real-time shipment tracking
- **APIs:**
  - `GET /api/shipments/order/{orderId}`
  - Fallback: `GET /api/orders/{orderId}/tracking`
- **Display:** Tracking number, status timeline, estimated delivery
- **File:** `OrderTrackingPage.tsx`

```
Params: id (orderId from URL)
Display: Timeline of events with timestamps and locations
```

---

### 1️⃣9️⃣ **ReviewsPage** (`#reviews`)
- **Purpose:** Manage user's product reviews
- **APIs:**
  - `GET /api/reviews/my-reviews?page=1&limit=20`
  - `PATCH /api/reviews/{id}` (edit)
  - `DELETE /api/reviews/{id}` (delete)
- **Features:** Pagination, Display reviews with ratings
- **Actions:** Edit review, Delete review
- **File:** `ReviewsPage.tsx`

```
Display: Product image, rating (stars), title, comment, date
Actions: Edit, Delete
```

---

### 2️⃣0️⃣ **FavoritesPage** (`#favorites`)
- **Purpose:** View favorited products & designs
- **API:** `GET /api/favorites`
- **Features:** Display favorites, Quick view, Add to cart
- **Actions:** Remove from favorites
- **File:** `FavoritesPage.tsx`

```
Display: Favorited products and designs in grid
Actions: View, Add to cart, Remove from favorites
```

---

### 2️⃣1️⃣ **RewardsPage** (`#rewards`)
- **Purpose:** Manage loyalty points & rewards
- **APIs:**
  - `GET /api/rewards/points`
  - `GET /api/rewards/history?page=1&limit=10`
  - `GET /api/rewards/catalog`
  - `POST /api/rewards/redeem/{rewardId}`
- **Features:** Points balance, History, Rewards catalog, Redeem
- **Tabs:**
  1. **Balance** - Show points, tier, progress to next tier
  2. **History** - Point transactions (earn/redeem)
  3. **Catalog** - Available rewards to redeem
- **File:** `RewardsPage.tsx`

```
Tabs:
  1. Points balance with tier info
  2. Earn/redeem history with pagination
  3. Rewards catalog - can redeem if enough points
```

---

### 2️⃣2️⃣ **VouchersPage** (`#vouchers`)
- **Purpose:** Manage voucher codes
- **APIs:**
  - `GET /api/vouchers/my-vouchers`
  - `GET /api/vouchers/validate?code=xxx&orderAmount=xxx`
- **Features:** List vouchers, Copy code, Show discount, Show status (used/unused)
- **Tabs:**
  1. **My Vouchers** - List with copy button
  2. **Validate** - Test voucher code
- **File:** `VouchersPage.tsx`

```
Display: Code, discount, expiry date, used/unused status
Actions: Copy code to clipboard, Validate code
```

---

### 2️⃣3️⃣ **AddressesPage** (`#addresses`)
- **Purpose:** Manage shipping addresses
- **APIs:**
  - `GET /api/addresses`
  - `POST /api/addresses`
  - `PATCH /api/addresses/{id}` (edit)
  - `DELETE /api/addresses/{id}`
  - `PATCH /api/addresses/{id}/set-default`
- **Features:** List addresses, Add new, Edit, Delete, Set default
- **Form Fields:** Label, Line1, Line2, State, Country, Zip
- **File:** `AddressesPage.tsx`

```
Display: Addresses in cards with default badge
Actions: Edit, Delete, Set default
Form: Dialog for add/edit
```

---

## ℹ️ Info Pages (3 pages)

### 2️⃣4️⃣ **AboutGreenPage** (`#about-green`)
- **Purpose:** About sustainability & green initiatives
- **APIs:** None (static content)
- **File:** `AboutGreenPage.tsx`

---

### 2️⃣5️⃣ **HelpPage** (`#help`)
- **Purpose:** FAQ & help information
- **APIs:** None (static content)
- **File:** `HelpPage.tsx`

---

### 2️⃣6️⃣ **ContactPage** (`#contact`)
- **Purpose:** Contact form & support
- **APIs:**
  - `POST /api/contact` (submit form)
  - `GET /api/contact/my-messages` (if authenticated)
- **Form:** Name, Email, Subject, Message
- **Features:** Send message, View my messages (if logged in)
- **File:** `ContactPage.tsx`

```
Public: Submit form (no auth required)
Private: View my messages (requires auth)
```

---

## 👨‍💼 Admin Page (1 page)

### 2️⃣7️⃣ **AdminDashboard** (`#admin`)
- **Purpose:** System administration
- **APIs:** Multiple admin endpoints for:
  - Order management (view, update status)
  - Product management (create, edit, delete)
  - User management (view, activate/deactivate)
  - Design management (approve, reject)
- **File:** `admin/AdminDashboard.tsx`

```
Admin-only page (requires role: 'admin')
Features: Orders, Products, Users, Designs, Analytics, Inventory
```

---

## 📱 Responsive & Navigation

### **Header Component** (`Header.tsx`)
- Navigation menu
- Logo
- Auth buttons (Login/Register or user menu)
- Cart icon with badge
- Mobile menu

### **Footer Component** (`Footer.tsx`)
- Company info
- Links
- Social media

### **ProtectedRoute Component** (`ProtectedRoute.tsx`)
- Checks authentication token
- Checks user role (for admin pages)
- Redirects to login if not authenticated
- Shows error message if insufficient permissions

---

## 🔄 Main Flows Summary

```
┌─────────────────────────────────────────────────────┐
│ USER REGISTRATION & LOGIN                           │
├─────────────────────────────────────────────────────┤
│ RegisterPage → LoginPage → Dashboard                │
│ (or) LoginPage → Dashboard/Admin                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SHOPPING JOURNEY                                     │
├─────────────────────────────────────────────────────┤
│ Home → BlanksListing → BlankDetail → Cart           │
│ → Checkout → Payment → OrderSuccess                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ DESIGN CUSTOMIZATION                                │
├─────────────────────────────────────────────────────┤
│ DesignGallery → CustomizerPage → Cart → Checkout   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ORDER MANAGEMENT                                     │
├─────────────────────────────────────────────────────┤
│ Dashboard → OrdersList → OrderDetail → OrderTracking│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ USER SETTINGS                                        │
├─────────────────────────────────────────────────────┤
│ Dashboard → Addresses/Rewards/Vouchers/Reviews      │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Statistics

- **Total Pages:** 27
- **Public Pages (no auth):** 11
  - Home, Shop Blanks, Blank Detail
  - Design Gallery, Design Detail
  - Login, Register, Forgot Password
  - About Green, Help, Contact
- **Private Pages (require auth):** 14
  - Customizer, Cart, Checkout
  - Dashboard, Orders List, Order Detail, Order Tracking
  - Reviews, Favorites, Rewards, Vouchers, Addresses
- **Admin Pages (require admin role):** 1
  - Admin Dashboard
- **Payment Pages:** 2
  - Payment Callback, Payment Cancel

- **Total API Endpoints Used:** 50+
- **Total API Calls per User Session:** 100+

---

**Last Updated:** December 24, 2024





