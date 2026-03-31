# 📚 Frontend Documentation Index

Danh sách toàn bộ tài liệu & hướng dẫn cho Frontend project.

---

## 🎯 Quick Navigation

### **New to the project?**
1. Start with [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md) - Xem tổng quan 27 pages
2. Then read [SUMMARY.md](./SUMMARY.md) - Hiểu project statistics & features

### **Want to understand specific page?**
1. Open [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md) - Find the page in table
2. Open [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) - Jump to section for detailed info
3. Check [apiConfig.ts](./src/services/apiConfig.ts) - See API endpoints used

### **Want visual understanding of flows?**
1. Open [FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md) - See Mermaid sequence diagrams
2. Follow the user journey step by step

### **Need setup instructions?**
1. Read [README1.md](./README1.md) - Installation & setup guide
2. Check environment variables section

### **Need API documentation?**
1. Check [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) - API Mapping section
2. Check [apiConfig.ts](./src/services/apiConfig.ts) - API services implementation
3. Check [backend/API_FLOW.md](../backend/API_FLOW.md) - Backend API documentation

---

## 📑 All Documentation Files

### **Frontend Documentation**

| File | Purpose | Content | Size |
|------|---------|---------|------|
| [README1.md](./README1.md) | Setup & General Guide | Installation, environment variables, troubleshooting | 873 lines |
| [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md) | Pages Overview | Table of all 27 pages with routes & APIs | 500+ lines |
| [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) | Detailed Documentation | Chi tiết 27 pages, request/response, API mapping | 1,500+ lines |
| [FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md) | Visual Flows | 8 sequence diagrams for user journeys | 800+ lines |
| [SUMMARY.md](./SUMMARY.md) | Project Summary | Statistics, features, tech stack, deployment | 600+ lines |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | This File | Navigation guide & index | 300+ lines |

### **Code Files with Documentation**

| File | Purpose | Lines |
|------|---------|-------|
| [src/services/apiConfig.ts](./src/services/apiConfig.ts) | API endpoints & services | 1,400+ |
| [src/hooks/useAuth.ts](./src/hooks/useAuth.ts) | Authentication hook | 100+ |
| [App.tsx](./src/App.tsx) | Router & page routing | 177 |

### **Backend Documentation** (Reference)

Located in `@backend/` folder:
- [API_FLOW.md](../backend/API_FLOW.md) - 106+ backend endpoints (1,500+ lines)
- [SEQUENCE_DIAGRAM.md](../backend/SEQUENCE_DIAGRAM.md) - Backend interaction diagrams
- [PROJECT_SUMMARY.md](../backend/PROJECT_SUMMARY.md) - Backend overview

---

## 📖 Documentation by Topic

### **🔓 Authentication**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Auth Pages](./PAGES_QUICK_REFERENCE.md#-auth-pages-3)
- **Detailed Flow:** [FRONTEND_FLOW.md - Auth Flow](./FRONTEND_FLOW.md#-1-auth-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Auth](./FLOWS_DIAGRAMS.md#1-user-authentication-flow)
- **Code:** [LoginPage.tsx](./src/components/LoginPage.tsx), [RegisterPage.tsx](./src/components/RegisterPage.tsx)

### **🛍️ Shopping**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Shopping Pages](./PAGES_QUICK_REFERENCE.md#-shopping-pages-4)
- **Detailed Flow:** [FRONTEND_FLOW.md - Shopping Flow](./FRONTEND_FLOW.md#️-2-shopping-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Shopping](./FLOWS_DIAGRAMS.md#2-shopping--cart-flow)
- **Code:** [BlanksListingPage.tsx](./src/components/BlanksListingPage.tsx), [BlankDetailPage.tsx](./src/components/BlankDetailPage.tsx)

### **🛒 Cart & Checkout**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Cart Pages](./PAGES_QUICK_REFERENCE.md#-cart--checkout-pages-6)
- **Detailed Flow:** [FRONTEND_FLOW.md - Cart & Checkout](./FRONTEND_FLOW.md#-4-cart--checkout-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Checkout](./FLOWS_DIAGRAMS.md#4-checkout--payment-flow)
- **Code:** [ShoppingCartPage.tsx](./src/components/ShoppingCartPage.tsx), [CheckoutPage.tsx](./src/components/CheckoutPage.tsx)

### **🎨 Design Customization**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Customizer](./PAGES_QUICK_REFERENCE.md#-customizer-page-1)
- **Detailed Flow:** [FRONTEND_FLOW.md - Customizer](./FRONTEND_FLOW.md#-3-customizer-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Customizer](./FLOWS_DIAGRAMS.md#3-design-customization-flow)
- **Code:** [CustomizerPage.tsx](./src/components/CustomizerPage.tsx)

### **💳 Payment**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Checkout Pages](./PAGES_QUICK_REFERENCE.md#-cart--checkout-pages-6)
- **Detailed Flow:** [FRONTEND_FLOW.md - Checkout & Payment](./FRONTEND_FLOW.md#-4-cart--checkout-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Payment](./FLOWS_DIAGRAMS.md#4-checkout--payment-flow)
- **Code:** [CheckoutPage.tsx](./src/components/CheckoutPage.tsx), [PaymentCallbackPage.tsx](./src/components/PaymentCallbackPage.tsx)

### **📦 Orders & Tracking**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Order Pages](./PAGES_QUICK_REFERENCE.md#-user-dashboard-pages-8)
- **Detailed Flow:** [FRONTEND_FLOW.md - Order Management](./FRONTEND_FLOW.md#-5-user-dashboard-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Tracking](./FLOWS_DIAGRAMS.md#5-order-tracking-flow)
- **Code:** [OrdersListPage.tsx](./src/components/OrdersListPage.tsx), [OrderTrackingPage.tsx](./src/components/OrderTrackingPage.tsx)

### **👤 User Dashboard**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Dashboard Pages](./PAGES_QUICK_REFERENCE.md#-user-dashboard-pages-8)
- **Detailed Flow:** [FRONTEND_FLOW.md - Dashboard](./FRONTEND_FLOW.md#-5-user-dashboard-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Profile Management](./FLOWS_DIAGRAMS.md#6-user-profile-management-flow)
- **Code:** [UserDashboardPage.tsx](./src/components/UserDashboardPage.tsx)

### **🎁 Rewards & Vouchers**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Rewards & Vouchers](./PAGES_QUICK_REFERENCE.md#-user-dashboard-pages-8)
- **Detailed Flow:** [FRONTEND_FLOW.md - Rewards & Vouchers](./FRONTEND_FLOW.md#-5-user-dashboard-flow)
- **Code:** [RewardsPage.tsx](./src/components/RewardsPage.tsx), [VouchersPage.tsx](./src/components/VouchersPage.tsx)

### **⭐ Reviews & Favorites**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Reviews & Favorites](./PAGES_QUICK_REFERENCE.md#-user-dashboard-pages-8)
- **Detailed Flow:** [FRONTEND_FLOW.md - Reviews](./FRONTEND_FLOW.md#-5-user-dashboard-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Reviews](./FLOWS_DIAGRAMS.md#8-reviews-flow)
- **Code:** [ReviewsPage.tsx](./src/components/ReviewsPage.tsx), [FavoritesPage.tsx](./src/components/FavoritesPage.tsx)

### **🎨 Design Gallery**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Design Pages](./PAGES_QUICK_REFERENCE.md#-design-pages-1)
- **Detailed Flow:** [FRONTEND_FLOW.md - Design Gallery](./FRONTEND_FLOW.md#-2-shopping-flow)
- **Sequence Diagram:** [FLOWS_DIAGRAMS.md - Design Discovery](./FLOWS_DIAGRAMS.md#7-design-gallery--favorites-flow)
- **Code:** [DesignGalleryPage.tsx](./src/components/DesignGalleryPage.tsx)

### **📍 Addresses**
- **Quick Info:** [PAGES_QUICK_REFERENCE.md - Addresses](./PAGES_QUICK_REFERENCE.md#-user-dashboard-pages-8)
- **Detailed Flow:** [FRONTEND_FLOW.md - Addresses](./FRONTEND_FLOW.md#-5-user-dashboard-flow)
- **Code:** [AddressesPage.tsx](./src/components/AddressesPage.tsx)

### **API Integration**
- **API Configuration:** [apiConfig.ts](./src/services/apiConfig.ts) - 50+ endpoints
- **API Mapping:** [FRONTEND_FLOW.md - API Mapping](./FRONTEND_FLOW.md#-api-mapping-chi-tiết)
- **Backend APIs:** [../backend/API_FLOW.md](../backend/API_FLOW.md) - 106+ endpoints

---

## 🔍 Finding Information

### **By Page Name**
1. Use Ctrl+F to search page name in [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md)
2. Get route, APIs, and quick info
3. Jump to detailed section in [FRONTEND_FLOW.md](./FRONTEND_FLOW.md)

### **By API Endpoint**
1. Search endpoint in [apiConfig.ts](./src/services/apiConfig.ts)
2. Check which pages use this endpoint
3. Get request/response examples in [FRONTEND_FLOW.md](./FRONTEND_FLOW.md)

### **By User Flow**
1. Start with [FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md)
2. Find sequence diagram for your flow
3. Get detailed explanation in [FRONTEND_FLOW.md](./FRONTEND_FLOW.md)

### **By Feature**
1. Search feature name across all docs
2. Check [SUMMARY.md](./SUMMARY.md) - Features Implemented section
3. Get code reference in relevant component

---

## 📊 Documentation Statistics

- **Total Documentation Pages:** 5 main docs
- **Total Lines of Documentation:** 5,500+ lines
- **Code Pages Documented:** 27 pages
- **API Endpoints Documented:** 50+ endpoints
- **Sequence Diagrams:** 8 diagrams
- **Code Files Referenced:** 30+ files

---

## 🎓 Learning Path

### **Level 1: Beginner**
1. Read [README1.md](./README1.md) - Setup & basics
2. Scan [SUMMARY.md](./SUMMARY.md) - Project overview
3. Browse [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md) - See all pages

### **Level 2: Intermediate**
1. Read [FRONTEND_FLOW.md](./FRONTEND_FLOW.md) - Detailed pages
2. Study [FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md) - Understand flows
3. Review [apiConfig.ts](./src/services/apiConfig.ts) - API services

### **Level 3: Advanced**
1. Deep dive into specific component code
2. Study [../backend/API_FLOW.md](../backend/API_FLOW.md) - Backend integration
3. Implement new features

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# View production build
npm run preview
```

---

## 💡 Pro Tips

- **Bookmark [PAGES_QUICK_REFERENCE.md](./PAGES_QUICK_REFERENCE.md)** - Most frequently used
- **Use Ctrl+F heavily** - Documentation is searchable
- **Check [FLOWS_DIAGRAMS.md](./FLOWS_DIAGRAMS.md)** - Visual learner friendly
- **Reference [apiConfig.ts](./src/services/apiConfig.ts)** - Actual implementation
- **Cross-reference** - Backend & Frontend docs complement each other

---

## 📞 Documentation Maintenance

Last Updated: December 24, 2024
- ✅ All 27 pages documented
- ✅ All 50+ API endpoints documented
- ✅ All 8 major flows documented with diagrams
- ✅ Setup & deployment guides included
- ✅ Code examples for every major feature

---

**Happy Coding! 🚀**





