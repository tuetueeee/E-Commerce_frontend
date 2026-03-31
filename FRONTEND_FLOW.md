# 🎨 Frontend - Tổng Hợp Tất Cả Pages & API Flows

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Kiến Trúc Ứng Dụng](#kiến-trúc-ứng-dụng)
3. [Chi Tiết Từng Page](#chi-tiết-từng-page)
4. [API Mapping Chi Tiết](#api-mapping-chi-tiết)
5. [Flows & Sequences](#flows--sequences)

---

## 📱 Tổng Quan

Frontend là React + TypeScript application sử dụng **Vite** làm build tool.

**Stack:**
- **Framework:** React 18 + TypeScript
- **Routing:** Hash-based routing (window.location.hash)
- **HTTP Client:** Fetch API + apiServices wrapper
- **UI Components:** Radix UI + ShadcnUI + TailwindCSS
- **State Management:** Local Storage + useAuth hook
- **Forms:** React Hook Form

**Base URL:** `http://localhost:5000/api`

---

## 🏗️ Kiến Trúc Ứng Dụng

### File Structure
```
src/
├── components/              # Tất cả pages & components
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   ├── App.tsx             # Router logic
│   │
│   ├── [AUTH PAGES]
│   ├── LoginPage.tsx       # Đăng nhập
│   ├── RegisterPage.tsx    # Đăng ký
│   ├── ForgotPasswordPage.tsx # Quên mật khẩu
│   │
│   ├── [SHOPPING PAGES]
│   ├── BlanksListingPage.tsx # Danh sách sản phẩm trống
│   ├── BlankDetailPage.tsx    # Chi tiết sản phẩm trống
│   ├── DesignGalleryPage.tsx  # Thư viện thiết kế
│   ├── DesignDetailPage.tsx   # Chi tiết thiết kế
│   ├── ShoppingCartPage.tsx  # Giỏ hàng
│   │
│   ├── [CUSTOMIZER]
│   ├── CustomizerPage.tsx    # Công cụ tùy chỉnh
│   │
│   ├── [CHECKOUT & PAYMENT]
│   ├── CheckoutPage.tsx      # Thanh toán
│   ├── OrderSuccessPage.tsx  # Xác nhận đơn hàng
│   ├── PaymentCallbackPage.tsx # VNPay callback
│   ├── PaymentCancelPage.tsx # Hủy thanh toán
│   │
│   ├── [USER PAGES]
│   ├── UserDashboardPage.tsx # Bảng điều khiển người dùng
│   ├── OrdersListPage.tsx    # Danh sách đơn hàng
│   ├── OrderDetailPage.tsx   # Chi tiết đơn hàng
│   ├── OrderTrackingPage.tsx # Theo dõi đơn hàng
│   ├── ReviewsPage.tsx       # Quản lý đánh giá
│   ├── FavoritesPage.tsx     # Danh sách yêu thích
│   ├── RewardsPage.tsx       # Điểm thưởng
│   ├── VouchersPage.tsx      # Phiếu giảm giá
│   ├── AddressesPage.tsx     # Quản lý địa chỉ
│   │
│   ├── [INFO PAGES]
│   ├── AboutGreenPage.tsx    # Về tính bền vững
│   ├── HelpPage.tsx          # Trợ giúp
│   ├── ContactPage.tsx       # Liên hệ
│   │
│   ├── [ADMIN]
│   ├── admin/AdminDashboard.tsx # Dashboard quản trị
│   │
│   ├── [SHARED]
│   ├── shared/ProductGrid.tsx
│   ├── shared/DesignGrid.tsx
│   ├── ProtectedRoute.tsx
│   │
│   └── ui/                   # Radix UI components
│
├── services/
│   └── apiConfig.ts          # API endpoints & services
│
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   ├── useProduct.ts        # Product hook
│   ├── useDesign.ts         # Design hook
│
└── types/
    └── index.ts             # TypeScript types
```

### Authentication Hook (useAuth)
```typescript
// Stored in localStorage
{
  token: string;           // JWT token
  user: {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
    // ...
  }
}
```

---

## 📄 Chi Tiết Từng Page

### 🔓 **1. AUTH FLOW**

#### **LoginPage** (`#login`)
**Mục đích:** Đăng nhập tài khoản

**Request:**
```json
POST /api/auth/login
{
  "email": "customer@sustainique.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "customer@sustainique.com",
    "name": "Customer Name",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGc..."
}
```

**State Management:**
- Lưu `token` + `user` vào localStorage
- Redirect: `#home` (customer) hoặc `#admin` (admin)

**API Service:**
```typescript
apiServices.auth.login(email, password)
```

---

#### **RegisterPage** (`#register`)
**Mục đích:** Tạo tài khoản mới

**Request:**
```json
POST /api/auth/register
{
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "name": "New User",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Flow:**
1. Validate form (email, password ≥8 ký tự, password match)
2. POST to register endpoint
3. Tự động login sau khi register thành công
4. Redirect to `#dashboard`

**API Service:**
```typescript
apiServices.auth.register(email, password, confirmPassword)
```

---

#### **ForgotPasswordPage** (`#forgot-password`)
**Mục đích:** Khôi phục mật khẩu

**Request:**
```json
POST /api/auth/forgot-password
{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "message": "Email reset password telah dikirim"
}
```

---

### 🛍️ **2. SHOPPING FLOW**

#### **Home Page** (`#home`)
**Mục đích:** Trang chủ - hiển thị featured products & trending designs

**API Calls:**
```typescript
// Get featured products
GET /api/products?page=1&limit=10

// Get trending designs
GET /api/designs/trending?limit=10
```

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Premium T-Shirt",
      "price": 29.99,
      "image": "https://...",
      "category": "Blanks"
    }
  ]
}
```

**Components:**
- Header
- HeroSection
- ShopSustainableBlanks (featured products)
- DiscoverDesigns (trending designs)
- GreenCommitment
- VoucherCoins (rewards)
- ProductRecommendations (Neo4j AI)
- Footer

---

#### **BlanksListingPage** (`#blanks`)
**Mục đích:** Xem danh sách sản phẩm trống

**API Calls:**
```typescript
// Get products (blanks type)
GET /api/products/blanks?page=1&limit=20

// Response
{
  "products": [{
    "id": "uuid",
    "name": "Product Name",
    "description": "...",
    "price": 29.99,
    "image": "https://...",
    "variants": [{
      "id": "uuid",
      "colorCode": "BLACK",
      "sizeCode": "M",
      "stock": 50
    }],
    "category": "Blanks"
  }],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

**Features:**
- Pagination (10-20 items per page)
- Sorting (popularity, price, newest)
- Filters (color, size, price range)
- Add to cart / View details

**State:**
- Current page
- Total pages
- Filters

---

#### **BlankDetailPage** (`#blank-detail?id=productId`)
**Mục đích:** Xem chi tiết sản phẩm trống

**API Calls:**
```typescript
// Get product by ID
GET /api/products/{id}

// Response
{
  "id": "uuid",
  "name": "Premium T-Shirt",
  "description": "...",
  "price": 29.99,
  "image": "https://...",
  "variants": [
    {
      "id": "variant-uuid",
      "colorCode": "BLACK",
      "colorName": "Black",
      "sizeCode": "S",
      "stock": 30
    },
    {
      "id": "variant-uuid",
      "colorCode": "WHITE",
      "colorName": "White",
      "sizeCode": "M",
      "stock": 50
    }
  ],
  "category": "Blanks",
  "ecoFriendly": true
}
```

**Features:**
- Display product info
- Select color & size
- Quantity selector
- Add to cart button
- Related products

**Add to Cart Request:**
```json
POST /api/cart/add
{
  "productId": "uuid",
  "quantity": 2,
  "colorCode": "BLACK",
  "sizeCode": "M"
}
```

**Add to Cart Response:**
```json
{
  "id": "cart-item-uuid",
  "productId": "uuid",
  "quantity": 2,
  "price": 29.99
}
```

---

#### **DesignGalleryPage** (`#designs`)
**Mục đích:** Xem & lọc các thiết kế

**API Calls:**
```typescript
// Get all designs with pagination
GET /api/designs?page=1&limit=12&offset=0

// Get trending designs
GET /api/designs/trending?limit=10

// Response
{
  "designs": [
    {
      "id": "uuid",
      "title": "Modern Abstract",
      "artist": "Artist Name",
      "preview_url": "https://...",
      "price": 5.99,
      "likes": 234,
      "views": 1000,
      "design_tag": "abstract,modern",
      "category": "Modern"
    }
  ],
  "total": 500
}
```

**Features:**
- Pagination
- Search
- Filter by category, tags, style
- Sort (trending, newest, likes)
- Eco-friendly filter
- Like/Heart design (favorite)

**Like Design Request:**
```json
POST /api/favorites
{
  "designId": "uuid"
}
```

**Filters:**
- Trending
- Newest
- By category
- By tags
- Eco-friendly only

---

#### **DesignDetailPage** (`#design-detail?id=designId`)
**Mục đích:** Xem chi tiết thiết kế và preview

**API Calls:**
```typescript
// Get design by ID
GET /api/designs/{id}

// Response
{
  "id": "uuid",
  "title": "Modern Abstract",
  "artist": "Artist Name",
  "preview_url": "https://...",
  "description": "...",
  "price": 5.99,
  "likes": 234,
  "downloads": 45,
  "category": "Modern",
  "design_tag": "abstract,modern,colorful"
}
```

**Features:**
- Display design preview
- Artist info
- Description
- Price
- Like/Unlike
- Add to cart (apply to product)

---

### 🎨 **3. CUSTOMIZER FLOW**

#### **CustomizerPage** (`#customizer`)
**Mục đích:** Tùy chỉnh sản phẩm (text, images, designs)

**API Calls:**

1. **Get Product:**
```typescript
GET /api/products/{id}
```

2. **Save Design:**
```json
POST /api/customizer/save
{
  "productId": "uuid",
  "name": "My Custom Design",
  "canvasData": {
    "elements": [
      {
        "type": "text",
        "content": "Hello World",
        "x": 100,
        "y": 100,
        "fontSize": 32,
        "color": "#000000"
      },
      {
        "type": "image",
        "content": "data:image/png;base64,...",
        "x": 200,
        "y": 200,
        "width": 200,
        "height": 200
      }
    ]
  }
}
```

3. **Calculate Price:**
```json
POST /api/customizer/calculate-price
{
  "productId": "uuid",
  "colorCode": "BLACK",
  "sizeCode": "M",
  "quantity": 1,
  "canvasData": {
    "elements": [...]
  }
}
```

**Price Response:**
```json
{
  "basePrice": 29.99,
  "customizationFee": 5.00,
  "totalPrice": 34.99,
  "breakdown": {
    "product": 29.99,
    "customization": 5.00
  }
}
```

4. **Get Saved Designs:**
```typescript
GET /api/customizer/saved

// Response
{
  "designs": [
    {
      "id": "uuid",
      "name": "My Design 1",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Features:**
- Canvas editor (drag & drop)
- Add text
- Add images
- Apply pre-made designs
- Color picker
- Font selection
- Size & position control
- Real-time price calculation
- Save design
- Load saved design

**Canvas Elements:**
- **Text:** content, position, fontSize, color, fontFamily, textAlign
- **Image:** content (base64), position, width, height, rotation
- **Design:** pre-made design, position, scale

---

### 🛒 **4. CART & CHECKOUT FLOW**

#### **ShoppingCartPage** (`#cart`)
**Mục đích:** Xem & quản lý giỏ hàng

**API Calls:**

1. **Get Cart:**
```typescript
GET /api/cart

// Response
{
  "items": [
    {
      "id": "cart-item-uuid",
      "productId": "uuid",
      "product": {
        "id": "uuid",
        "name": "Premium T-Shirt",
        "image": "https://..."
      },
      "quantity": 2,
      "price": 29.99,
      "subtotal": 59.98,
      "colorCode": "BLACK",
      "sizeCode": "M"
    }
  ],
  "total": 199.99,
  "itemCount": 5
}
```

2. **Update Item Quantity:**
```json
PATCH /api/cart/items/{itemId}
{
  "quantity": 3
}
```

3. **Remove Item:**
```typescript
DELETE /api/cart/items/{itemId}
```

4. **Apply Voucher:**
```json
POST /api/cart/apply-voucher
{
  "voucherCode": "SAVE10"
}

// Response
{
  "code": "SAVE10",
  "discount": 10,
  "discountAmount": 20.00,
  "totalAfterDiscount": 179.99
}
```

5. **Clear Cart:**
```typescript
DELETE /api/cart/clear
```

**State:**
- cartItems[]
- appliedVoucher
- totals (subtotal, discount, tax, total)
- loading, error

**Features:**
- Display cart items
- Update quantity
- Remove item
- Apply voucher code
- Show discount breakdown
- Proceed to checkout

---

#### **CheckoutPage** (`#checkout`)
**Mục đích:** Hoàn tất mua hàng (địa chỉ, vận chuyển, thanh toán)

**API Calls:**

1. **Get Addresses:**
```typescript
GET /api/addresses

// Response
[
  {
    "id": "uuid",
    "label": "Home",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "state": "Ho Chi Minh",
    "country": "Vietnam",
    "zip": "700000",
    "is_default": true
  }
]
```

2. **Create Order:**
```json
POST /api/orders
{
  "items": [
    {
      "cartItemId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddressId": "uuid",
  "shippingMethod": "standard",
  "paymentMethodId": "uuid",
  "useGreenPoints": false,
  "appliedVoucherCode": "SAVE10"
}

// Response
{
  "id": "order-uuid",
  "orderNumber": "ORD-2024-001234",
  "total": 179.99,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

3. **Get Cart (load during checkout):**
```typescript
GET /api/cart
```

**Steps:**
1. **Step 1:** Select shipping address
   - Load addresses
   - Option to add new address
   - Set default address

2. **Step 2:** Select shipping method
   - Standard (3-5 days)
   - Express (1-2 days)
   - Calculate shipping fee

3. **Step 3:** Select payment method & pay
   - Choose payment gateway (VNPay, etc.)
   - Show order summary
   - Apply voucher (if not already applied)
   - Option to use green points
   - Submit payment

**State:**
- currentStep
- cart
- selectedAddress
- shippingMethod
- paymentMethod
- useGreenPoints
- appliedVoucher
- loading, creatingOrder

---

#### **OrderSuccessPage** (`#order-success?orderId=xxx`)
**Mục đích:** Xác nhận đơn hàng thành công

**API Calls:**
```typescript
GET /api/orders/{orderId}

// Response
{
  "id": "uuid",
  "orderNumber": "ORD-2024-001234",
  "total": 179.99,
  "status": "pending",
  "items": [...],
  "shippingAddress": {...},
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Display:**
- Order number
- Order total
- Order date
- Estimated delivery
- Items list
- Shipping address
- Next steps

---

#### **PaymentCallbackPage** (`#payment-callback`)
**Mục đích:** Xử lý callback từ VNPay

**Flow:**
1. VNPay redirects user sau khi thanh toán
2. Extract transaction params từ URL
3. Verify transaction
4. Update order status
5. Redirect to success/error page

**Parameters:**
- `vnp_TxnRef` - Transaction reference
- `vnp_ResponseCode` - Response code (00 = success)
- `vnp_TransactionNo` - VNPay transaction number
- `vnp_OrderInfo` - Order info

---

### 📦 **5. USER DASHBOARD FLOW**

#### **UserDashboardPage** (`#dashboard`)
**Mục đích:** Trang chủ người dùng - xem thống kê & tính năng

**API Calls:**

1. **Get Dashboard Stats:**
```typescript
GET /api/users/dashboard/stats

// Response
{
  "totalOrders": 15,
  "totalSpent": 4500.00,
  "loyaltyPoints": 4500,
  "treesPlanted": 15
}
```

2. **Get Recent Orders:**
```typescript
GET /api/users/dashboard/recent-orders?limit=5

// Response
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2024-001234",
      "total": 179.99,
      "status": "delivered",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

3. **Get Trees Planted:**
```typescript
GET /api/users/dashboard/trees-planted

// Response
{
  "count": 15,
  "goal": 100
}
```

**Tabs/Sections:**
- Quick Stats (orders, spent, points, trees)
- Recent Orders
- Quick Actions (Orders, Addresses, Rewards, etc.)
- Change Password Form

---

#### **OrdersListPage** (`#orders`)
**Mục đích:** Xem tất cả đơn hàng của người dùng

**API Calls:**

1. **Get My Orders:**
```typescript
GET /api/orders/my-orders?page=1&limit=10&status=all

// Response
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2024-001234",
      "total": 179.99,
      "status": "delivered",
      "createdAt": "2024-01-01T00:00:00Z",
      "items": [...]
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

**Features:**
- Pagination
- Filter by status (all, pending, processing, shipped, delivered, cancelled)
- Search by order number
- Sort by date
- Click to view detail

---

#### **OrderDetailPage** (`#order-detail?id=orderId`)
**Mục đích:** Xem chi tiết 1 đơn hàng

**API Calls:**
```typescript
GET /api/orders/{orderId}

// Response
{
  "id": "uuid",
  "orderNumber": "ORD-2024-001234",
  "total": 179.99,
  "subtotal": 169.99,
  "tax": 10.00,
  "discount": 0,
  "status": "shipped",
  "createdAt": "2024-01-01T00:00:00Z",
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Premium T-Shirt",
        "image": "https://..."
      },
      "quantity": 1,
      "price": 29.99,
      "colorCode": "BLACK",
      "sizeCode": "M"
    }
  ],
  "shippingAddress": {
    "line1": "123 Main St",
    "state": "Ho Chi Minh",
    "country": "Vietnam"
  },
  "paymentMethod": "vnpay"
}
```

**Features:**
- Order summary
- Items list
- Shipping address
- Payment method
- Order timeline
- Track shipment button

---

#### **OrderTrackingPage** (`#order-tracking?id=orderId`)
**Mục đích:** Theo dõi vị trí đơn hàng

**API Calls:**

1. **Get Shipment by Order:**
```typescript
GET /api/shipments/order/{orderId}

// Response
{
  "id": "uuid",
  "orderId": "uuid",
  "trackingNumber": "VN1234567890",
  "status": "in_transit",
  "estimatedDelivery": "2024-01-10T00:00:00Z",
  "events": [
    {
      "timestamp": "2024-01-08T14:30:00Z",
      "status": "picked_up",
      "location": "Ho Chi Minh",
      "description": "Đơn hàng đã được lấy"
    },
    {
      "timestamp": "2024-01-09T08:00:00Z",
      "status": "in_transit",
      "location": "Da Nang",
      "description": "Đơn hàng đang được vận chuyển"
    }
  ]
}
```

2. **Fallback - Get Order Tracking:**
```typescript
GET /api/orders/{orderId}/tracking
```

**Display:**
- Tracking number
- Current status
- Timeline of events
- Estimated delivery
- Carrier info

---

#### **ReviewsPage** (`#reviews`)
**Mục đích:** Quản lý đánh giá của người dùng

**API Calls:**

1. **Get My Reviews:**
```typescript
GET /api/reviews/my-reviews?page=1&limit=20

// Response
{
  "reviews": [
    {
      "id": "uuid",
      "productId": "uuid",
      "product": {
        "name": "Premium T-Shirt",
        "image": "https://..."
      },
      "rating": 5,
      "title": "Great quality!",
      "comment": "Very happy with this product",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

2. **Delete Review:**
```typescript
DELETE /api/reviews/{reviewId}
```

2. **Update Review:**
```json
PATCH /api/reviews/{reviewId}
{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

**Features:**
- List user's reviews
- Display rating (stars)
- Product info
- Review text
- Edit review
- Delete review
- Pagination

---

#### **FavoritesPage** (`#favorites`)
**Mục đích:** Xem danh sách sản phẩm & thiết kế yêu thích

**API Calls:**

1. **Get Favorites:**
```typescript
GET /api/favorites

// Response
{
  "favorites": [
    {
      "id": "fav-uuid",
      "productId": "uuid",
      "product": {
        "id": "uuid",
        "name": "Premium T-Shirt",
        "price": 29.99,
        "image": "https://..."
      }
    },
    {
      "id": "fav-uuid",
      "designId": "uuid",
      "design": {
        "id": "uuid",
        "title": "Modern Abstract",
        "price": 5.99,
        "preview_url": "https://..."
      }
    }
  ]
}
```

2. **Remove Favorite:**
```typescript
DELETE /api/favorites/{favoriteId}
```

**Features:**
- Display favorited products & designs
- Quick view
- Remove from favorites
- Add to cart

---

#### **RewardsPage** (`#rewards`)
**Mục đích:** Xem & quản lý điểm thưởng (Green Points)

**API Calls:**

1. **Get Balance:**
```typescript
GET /api/rewards/points

// Response
{
  "userId": "uuid",
  "balance": 4500,
  "tier": "gold",
  "nextTierPoints": 5000,
  "pointsUntilNextTier": 500
}
```

2. **Get History:**
```typescript
GET /api/rewards/history?page=1&limit=20

// Response
{
  "history": [
    {
      "id": "uuid",
      "type": "purchase",
      "amount": 500,
      "description": "Order ORD-2024-001234",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "type": "redeem",
      "amount": -200,
      "description": "Redeemed: Free Shipping",
      "createdAt": "2024-01-02T00:00:00Z"
    }
  ],
  "total": 25
}
```

3. **Get Catalog:**
```typescript
GET /api/rewards/catalog

// Response
{
  "catalog": [
    {
      "id": "uuid",
      "name": "Free Shipping",
      "description": "Free shipping on next order",
      "requiredPoints": 200,
      "quantity": 50,
      "expiresAt": "2024-12-31T00:00:00Z"
    }
  ]
}
```

4. **Redeem Reward:**
```json
POST /api/rewards/redeem/{rewardId}

// Response
{
  "id": "uuid",
  "rewardId": "uuid",
  "status": "redeemed",
  "redeemedAt": "2024-01-03T00:00:00Z"
}
```

**Features:**
- Show points balance
- Points tier/level
- Points history (earn/redeem)
- Rewards catalog
- Redeem reward
- Pagination

---

#### **VouchersPage** (`#vouchers`)
**Mục đích:** Xem & quản lý vouchers

**API Calls:**

1. **Get My Vouchers:**
```typescript
GET /api/vouchers/my-vouchers

// Response
[
  {
    "id": "user-voucher-uuid",
    "code": "SAVE10",
    "discount": 10,
    "type": "percentage",
    "expiresAt": "2024-12-31T00:00:00Z",
    "status": "unused",
    "isUsed": false
  },
  {
    "id": "user-voucher-uuid",
    "code": "FREESHIP",
    "discount": 50000,
    "type": "fixed",
    "expiresAt": "2024-06-30T00:00:00Z",
    "status": "used",
    "isUsed": true,
    "usedAt": "2024-01-01T00:00:00Z"
  }
]
```

2. **Validate Voucher:**
```typescript
GET /api/vouchers/validate?code=SAVE10&orderAmount=500000

// Response
{
  "valid": true,
  "code": "SAVE10",
  "discount": 10,
  "discountAmount": 50000,
  "message": "Voucher is valid"
}
```

**Features:**
- Show all vouchers
- Show voucher code (with copy)
- Show discount value
- Show expiry date
- Show used/unused status
- Validate voucher code
- Pagination

---

#### **AddressesPage** (`#addresses`)
**Mục đích:** Quản lý địa chỉ giao hàng

**API Calls:**

1. **Get All Addresses:**
```typescript
GET /api/addresses

// Response
[
  {
    "id": "uuid",
    "label": "Home",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "state": "Ho Chi Minh",
    "country": "Vietnam",
    "zip": "700000",
    "is_default": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

2. **Create Address:**
```json
POST /api/addresses
{
  "label": "Office",
  "line1": "456 Business Ave",
  "line2": "Floor 10",
  "state": "Ha Noi",
  "country": "Vietnam",
  "zip": "100000",
  "is_default": false
}

// Response
{
  "id": "uuid",
  "label": "Office",
  ...
}
```

3. **Update Address:**
```json
PATCH /api/addresses/{addressId}
{
  "label": "New Home",
  "line1": "789 New St",
  ...
}
```

4. **Delete Address:**
```typescript
DELETE /api/addresses/{addressId}
```

5. **Set Default Address:**
```json
PATCH /api/addresses/{addressId}/set-default

// Response
{
  "id": "uuid",
  "is_default": true
}
```

**Features:**
- List addresses
- Add new address
- Edit address
- Delete address
- Set default address
- Show default badge

---

### ℹ️ **6. INFO PAGES**

#### **AboutGreenPage** (`#about-green`)
**Mục đích:** Thông tin về tính bền vững của dự án

**Static Content** - không cần API call

---

#### **HelpPage** (`#help`)
**Mục đích:** Trợ giúp & FAQ

**Static Content** - không cần API call

---

#### **ContactPage** (`#contact`)
**Mục đích:** Liên hệ với công ty

**API Calls:**

1. **Submit Contact Form:**
```json
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I have a question about..."
}

// Response
{
  "id": "uuid",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

2. **Get My Messages (if authenticated):**
```typescript
GET /api/contact/my-messages

// Response
[
  {
    "id": "uuid",
    "status": "replied",
    "subject": "Product Inquiry",
    "message": "I have a question about...",
    "reply": "Thank you for contacting us...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### 👨‍💼 **7. ADMIN DASHBOARD** (`#admin`)

**Mục đích:** Quản lý hệ thống (orders, products, users, designs)

**Features:**
- Order management (view, update status, cancel)
- Product management (create, edit, delete)
- User management (view, activate/deactivate)
- Design management (approve, reject)
- Stats & analytics
- Inventory management

*Tích hợp với tất cả admin endpoints từ backend*

---

## 🔗 API Mapping Chi Tiết

### **Auth Endpoints**
| Page | Method | Endpoint | Request | Response |
|------|--------|----------|---------|----------|
| Login | POST | `/api/auth/login` | email, password | user, token |
| Register | POST | `/api/auth/register` | email, password, confirmPassword | user |
| Forgot Password | POST | `/api/auth/forgot-password` | email | message |
| Change Password | POST | `/api/auth/change-password` | currentPassword, newPassword, confirmPassword | message |

### **Products Endpoints**
| Page | Method | Endpoint | Params | Response |
|------|--------|----------|--------|----------|
| Home | GET | `/api/products` | page, limit | products[] |
| Shop Blanks | GET | `/api/products/blanks` | page, limit | products[] |
| Blank Detail | GET | `/api/products/{id}` | - | product |
| Customizer | GET | `/api/products/{id}` | - | product |

### **Designs Endpoints**
| Page | Method | Endpoint | Params | Response |
|------|--------|----------|--------|----------|
| Home | GET | `/api/designs/trending` | limit | designs[] |
| Design Gallery | GET | `/api/designs` | page, limit, offset, search, tags | designs[] |
| Design Detail | GET | `/api/designs/{id}` | - | design |

### **Cart Endpoints**
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Get Cart | GET | `/api/cart` | - | cart |
| Add Item | POST | `/api/cart/add` | productId, quantity, colorCode, sizeCode | cartItem |
| Update Item | PATCH | `/api/cart/items/{id}` | quantity | cartItem |
| Remove Item | DELETE | `/api/cart/items/{id}` | - | success |
| Clear Cart | DELETE | `/api/cart/clear` | - | success |
| Apply Voucher | POST | `/api/cart/apply-voucher` | voucherCode | { code, discount, discountAmount } |

### **Orders Endpoints**
| Page | Method | Endpoint | Request | Response |
|------|--------|----------|---------|----------|
| Checkout | POST | `/api/orders` | items, addressId, shippingMethod, paymentMethodId, voucherCode | order |
| Checkout | GET | `/api/cart` | - | cart |
| Orders List | GET | `/api/orders/my-orders` | page, limit, status | orders[] |
| Order Detail | GET | `/api/orders/{id}` | - | order |
| Order Tracking | GET | `/api/orders/{id}/tracking` | - | tracking |
| Order Tracking | GET | `/api/shipments/order/{orderId}` | - | shipment |

### **Users Endpoints**
| Page | Method | Endpoint | Response |
|------|--------|----------|----------|
| Dashboard | GET | `/api/users/dashboard/stats` | stats |
| Dashboard | GET | `/api/users/dashboard/recent-orders` | orders[] |
| Dashboard | GET | `/api/users/dashboard/trees-planted` | count |
| Profile | GET | `/api/users/profile` | user |
| Profile | PATCH | `/api/users/profile` | user |

### **Addresses Endpoints**
| Page | Method | Endpoint | Request | Response |
|------|--------|----------|---------|----------|
| Checkout | GET | `/api/addresses` | - | addresses[] |
| Addresses | GET | `/api/addresses` | - | addresses[] |
| Addresses | POST | `/api/addresses` | label, line1, line2, state, country, zip | address |
| Addresses | PATCH | `/api/addresses/{id}` | (same as POST) | address |
| Addresses | DELETE | `/api/addresses/{id}` | - | success |
| Addresses | PATCH | `/api/addresses/{id}/set-default` | - | address |

### **Customizer Endpoints**
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Get Saved Designs | GET | `/api/customizer/saved` | - | designs[] |
| Get Saved Design | GET | `/api/customizer/saved/{id}` | - | design |
| Save Design | POST | `/api/customizer/save` | productId, name, canvasData | design |
| Delete Saved Design | DELETE | `/api/customizer/saved/{id}` | - | success |
| Calculate Price | POST | `/api/customizer/calculate-price` | productId, colorCode, sizeCode, quantity, canvasData | { basePrice, customizationFee, totalPrice } |

### **Favorites Endpoints**
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Get Favorites | GET | `/api/favorites` | - | favorites[] |
| Add Favorite | POST | `/api/favorites` | productId hoặc designId | favorite |
| Check Favorite | GET | `/api/favorites/check` | productId, designId | { isFavorite } |
| Remove Favorite | DELETE | `/api/favorites/{id}` | - | success |

### **Reviews Endpoints**
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Get My Reviews | GET | `/api/reviews/my-reviews` | page, limit | reviews[] |
| Get Product Reviews | GET | `/api/reviews/product/{id}` | page, limit | reviews[] |
| Get Product Stats | GET | `/api/reviews/product/{id}/stats` | - | { avgRating, totalReviews } |
| Create Review | POST | `/api/reviews` | productId, rating, title, comment | review |
| Update Review | PATCH | `/api/reviews/{id}` | rating, title, comment | review |
| Delete Review | DELETE | `/api/reviews/{id}` | - | success |

### **Rewards Endpoints**
| Action | Method | Endpoint | Response |
|--------|--------|----------|----------|
| Get Balance | GET | `/api/rewards/points` | { balance, tier, nextTierPoints } |
| Get History | GET | `/api/rewards/history` | history[] |
| Get Catalog | GET | `/api/rewards/catalog` | catalog[] |
| Redeem Reward | POST | `/api/rewards/redeem/{id}` | redeem_record |

### **Vouchers Endpoints**
| Action | Method | Endpoint | Response |
|--------|--------|----------|----------|
| Get My Vouchers | GET | `/api/vouchers/my-vouchers` | vouchers[] |
| Validate Voucher | GET | `/api/vouchers/validate` | { valid, code, discount, discountAmount } |

### **Contact Endpoints**
| Action | Method | Endpoint | Request | Response |
|--------|--------|----------|---------|----------|
| Submit Form | POST | `/api/contact` | name, email, subject, message | message |
| Get My Messages | GET | `/api/contact/my-messages` | - | messages[] |

---

## 📊 Flows & Sequences

### **Flow 1: User Registration & Login**

```
User
  ↓
[RegisterPage]
  ├→ Validate form inputs
  ├→ POST /api/auth/register
  ├→ Auto-login POST /api/auth/login
  ├→ Save token + user to localStorage
  └→ Redirect to #dashboard

---

User
  ↓
[LoginPage]
  ├→ Enter credentials
  ├→ POST /api/auth/login
  ├→ Save token + user to localStorage
  ├→ Check user.role
  └→ Redirect to #home (customer) or #admin (admin)
```

---

### **Flow 2: Shopping Journey**

```
User
  ↓
[Home] GET /api/products (featured) + GET /api/designs/trending
  ↓
Browse → Click product
  ↓
[BlanksListingPage] GET /api/products/blanks (filtered)
  ↓
Select product
  ↓
[BlankDetailPage] GET /api/products/{id}
  ├→ Select color, size, quantity
  └→ Click "Add to Cart"
  ↓
POST /api/cart/add
  ↓
View cart [ShoppingCartPage]
  ├→ GET /api/cart
  ├→ Can update quantity
  ├→ Can remove items
  ├→ Can apply voucher POST /api/cart/apply-voucher
  └→ Proceed to checkout
  ↓
[CheckoutPage]
  ├→ Step 1: Select shipping address GET /api/addresses
  ├→ Step 2: Select shipping method
  ├→ Step 3: Select payment method
  └→ POST /api/orders
  ↓
Payment gateway (VNPay)
  ↓
[PaymentCallbackPage]
  ├→ Process callback
  ├→ Verify payment
  └→ Redirect to [OrderSuccessPage]
  ↓
[OrderSuccessPage] GET /api/orders/{orderId}
  └→ Show order confirmation
```

---

### **Flow 3: Design Customization**

```
User
  ↓
Browse designs [DesignGalleryPage] GET /api/designs
  ↓
Click "Customize" or go to [CustomizerPage]
  ├→ GET /api/products/{productId}
  └→ GET /api/customizer/saved (if has saved designs)
  ↓
[CustomizerPage] Canvas Editor
  ├→ Add text/images to canvas
  ├→ Real-time POST /api/customizer/calculate-price
  ├→ Can POST /api/customizer/save (save design)
  └→ Can POST /api/cart/add (add customized product to cart)
  ↓
Continue shopping or checkout
```

---

### **Flow 4: Order Management**

```
User
  ↓
View orders [OrdersListPage] GET /api/orders/my-orders
  ├→ Filter by status
  ├→ Search by order number
  └→ Click order
  ↓
[OrderDetailPage] GET /api/orders/{orderId}
  ├→ Show order summary
  ├→ Show items
  └→ Click "Track"
  ↓
[OrderTrackingPage]
  ├→ GET /api/shipments/order/{orderId}
  ├→ Fallback: GET /api/orders/{orderId}/tracking
  └→ Show timeline of events
```

---

### **Flow 5: User Profile & Settings**

```
User
  ↓
[UserDashboardPage]
  ├→ GET /api/users/dashboard/stats
  ├→ GET /api/users/dashboard/recent-orders
  ├→ GET /api/users/dashboard/trees-planted
  └→ Tabs: Orders, Addresses, Favorites, Rewards, Vouchers, Reviews, Settings
  ↓
[AddressesPage] GET /api/addresses
  ├→ POST /api/addresses (add)
  ├→ PATCH /api/addresses/{id} (edit)
  ├→ DELETE /api/addresses/{id}
  └→ PATCH /api/addresses/{id}/set-default
  ↓
[FavoritesPage] GET /api/favorites
  ├→ POST /api/favorites (add)
  ├→ DELETE /api/favorites/{id}
  └→ Can add to cart
  ↓
[RewardsPage]
  ├→ GET /api/rewards/points
  ├→ GET /api/rewards/history
  ├→ GET /api/rewards/catalog
  └→ POST /api/rewards/redeem/{id}
  ↓
[VouchersPage]
  ├→ GET /api/vouchers/my-vouchers
  └→ GET /api/vouchers/validate (test voucher)
  ↓
[ReviewsPage]
  ├→ GET /api/reviews/my-reviews
  ├→ PATCH /api/reviews/{id} (edit)
  └→ DELETE /api/reviews/{id}
```

---

## 🔐 Authentication & Authorization

### **Auth Storage:**
```javascript
localStorage = {
  "auth": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "customer" | "admin"
    }
  }
}
```

### **Protected Routes:**
- Logout users automatically redirect to `#login`
- ProtectedRoute component checks token & role
- Admin routes require `role === 'admin'`

### **Token Usage:**
- All authenticated requests include: `Authorization: Bearer {token}`
- Used in header via `getHeaders(token)` function

---

## 🛠️ Development Setup

### **Environment Variables (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_INIT_DEMO=true
```

### **Running Frontend:**
```bash
cd front-end
npm install
npm run dev
# Runs on http://localhost:5173 (Vite default) or custom port
```

### **API Service Usage:**
```typescript
import { apiServices } from '../services/apiConfig';

// Example: Get products
const products = await apiServices.products.getAll(page, limit);

// Example: Add to cart
const cartItem = await apiServices.cart.addItem(
  { productId, quantity, colorCode, sizeCode },
  token
);

// Example: Create order
const order = await apiServices.orders.create(orderData, token);
```

---

## 📝 Summary

**Total Pages:** 24+ pages
- 3 Auth pages (Login, Register, Forgot Password)
- 4 Shopping pages (Blanks Listing, Blank Detail, Design Gallery, Design Detail)
- 1 Customizer page
- 6 Cart & Checkout pages
- 8 User dashboard pages (Dashboard, Orders, Tracking, Reviews, Favorites, Rewards, Vouchers, Addresses)
- 3 Info pages (About, Help, Contact)
- 1 Admin dashboard

**Total API Endpoints Used:** 50+ endpoints across all pages

**Key Features:**
- ✅ Authentication (Login, Register, Change Password)
- ✅ Product browsing & filtering
- ✅ Design customization with real-time pricing
- ✅ Shopping cart management
- ✅ Multi-step checkout
- ✅ Payment integration (VNPay)
- ✅ Order tracking
- ✅ User dashboard with stats
- ✅ Address management
- ✅ Favorites/wishlist
- ✅ Rewards & loyalty points
- ✅ Vouchers & discounts
- ✅ Product reviews
- ✅ Admin dashboard

---

**Last Updated:** December 24, 2024





