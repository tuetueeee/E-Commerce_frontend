import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShopSustainableBlanks } from './components/ShopSustainableBlanks';
import { DiscoverDesigns } from './components/DiscoverDesigns';
import { GreenCommitment } from './components/GreenCommitment';
import { VoucherCoins } from './components/VoucherCoins';
import { ProductRecommendations } from './components/ProductRecommendations';
import { DesignRecommendations } from './components/DesignRecommendations';
import { Footer } from './components/Footer';
import { BlanksListingPage } from './components/BlanksListingPage';
import { BlankDetailPage } from './components/BlankDetailPage';
import { DesignGalleryPage } from './components/DesignGalleryPage';
import { DesignDetailPage } from './components/DesignDetailPage';
import { ShoppingCartPage } from './components/ShoppingCartPage';
import { UserDashboardPage } from './components/UserDashboardPage';
import { CustomizerPage } from './components/CustomizerPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { PaymentCallbackPage } from './components/PaymentCallbackPage';
import { PaymentCancelPage } from './components/PaymentCancelPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { AboutGreenPage } from './components/AboutGreenPage';
import { HelpPage } from './components/HelpPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrdersListPage } from './components/OrdersListPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { AddressesPage } from './components/AddressesPage';
import { FavoritesPage } from './components/FavoritesPage';
import { RewardsPage } from './components/RewardsPage';
import { VouchersPage } from './components/VouchersPage';
import { ReviewsPage } from './components/ReviewsPage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useState, useEffect } from 'react';

type PageType = 
  | 'home' 
  | 'blanks' 
  | 'blank-detail' 
  | 'designs' 
  | 'design-detail' 
  | 'my-designs'
  | 'cart' 
  | 'dashboard'
  | 'customizer'
  | 'checkout'
  | 'order-success'
  | 'payment-callback'
  | 'payment-cancel'
  | 'orders'
  | 'order-detail'
  | 'order-tracking'
  | 'addresses'
  | 'favorites'
  | 'rewards'
  | 'vouchers'
  | 'reviews'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'about-green'
  | 'help'
  | 'contact'
  | 'admin'
  | 'search';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [error, setError] = useState<Error | null>(null);

  // Listen to hash changes for simple routing
  useEffect(() => {
    try {
      const handleHashChange = () => {
        const hash = window.location.hash.slice(1);
        // Extract only the route part, ignore query parameters
        const route = hash.split('?')[0] || 'home';
        setCurrentPage((route as PageType) || 'home');
      };

      // If no hash, redirect to #home
      if (!window.location.hash) {
        window.location.hash = '#home';
      }

      handleHashChange(); // Initial check
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    } catch (err) {
      console.error('Error in App useEffect:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  // Show error if any
  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "red" }}>Application Error</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  // Simple router - you can switch pages using hash
  switch (currentPage) {
    case 'blanks':
      return <BlanksListingPage />;
    case 'blank-detail':
      return <BlankDetailPage />;
    case 'designs':
      return <DesignGalleryPage />;
    case 'design-detail':
      return <DesignDetailPage />;
    case 'cart':
      return <ProtectedRoute pageName="giỏ hàng"><ShoppingCartPage /></ProtectedRoute>;
    case 'dashboard':
      return <ProtectedRoute pageName="bảng điều khiển người dùng"><UserDashboardPage /></ProtectedRoute>;
    case 'customizer':
      return <ProtectedRoute pageName="công cụ tùy chỉnh"><CustomizerPage /></ProtectedRoute>;
    case 'checkout':
      return <ProtectedRoute pageName="thanh toán"><CheckoutPage /></ProtectedRoute>;
    case 'order-success':
      return <ProtectedRoute pageName="xác nhận đơn hàng"><OrderSuccessPage /></ProtectedRoute>;
    case 'payment-callback':
      return <PaymentCallbackPage />;
    case 'payment-cancel':
      return <PaymentCancelPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'forgot-password':
      return <ForgotPasswordPage />;
    case 'about-green':
      return <AboutGreenPage />;
    case 'help':
      return <HelpPage />;
    case 'contact':
      return <ContactPage />;
    case 'orders':
      return <ProtectedRoute pageName="lịch sử đơn hàng"><OrdersListPage /></ProtectedRoute>;
    case 'order-detail':
      return <ProtectedRoute pageName="chi tiết đơn hàng"><OrderDetailPage /></ProtectedRoute>;
    case 'order-tracking':
      return <ProtectedRoute pageName="theo dõi đơn hàng"><OrderTrackingPage /></ProtectedRoute>;
    case 'addresses':
      return <ProtectedRoute pageName="quản lý địa chỉ"><AddressesPage /></ProtectedRoute>;
    case 'favorites':
      return <ProtectedRoute pageName="danh sách yêu thích"><FavoritesPage /></ProtectedRoute>;
    case 'rewards':
      return <ProtectedRoute pageName="điểm thưởng"><RewardsPage /></ProtectedRoute>;
    case 'vouchers':
      return <ProtectedRoute pageName="phiếu giảm giá"><VouchersPage /></ProtectedRoute>;
    case 'reviews':
      return <ProtectedRoute pageName="quản lý đánh giá"><ReviewsPage /></ProtectedRoute>;
    case 'admin':
      return <ProtectedRoute requiredRole="admin" pageName="bảng điều khiển quản trị"><AdminDashboard /></ProtectedRoute>;
    case 'search':
      return <SearchResultsPage />;
    default:
      return (
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <HeroSection />
            <ShopSustainableBlanks />
            <DiscoverDesigns />
            <GreenCommitment />
            <VoucherCoins />
            <ProductRecommendations />
            <DesignRecommendations />
          </main>
          <Footer />
        </div>
      );
  }
}
