import { Search, ShoppingCart, User, Menu, Leaf, Gift, LogOut, Settings, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiServices } from '../services/apiConfig';
import logoImage from '../assets/logo.png';

export function Header() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { user, logout, getToken } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = Array.isArray(cart) ? cart.length : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    // Listen for cart changes
    window.addEventListener('storage', updateCartCount);
    // Custom event for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);


  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 gap-6">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={logoImage} 
              alt="Sustainique Logo" 
              className="h-20 md:h-24 w-auto object-contain"
            />
          </a>

          {/* Search Bar - Large like Etsy */}
          <div className="flex-1 max-w-3xl">
            <form 
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  // Navigate to search results page
                  window.location.hash = `#search?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm áo, thiết kế độc đáo, vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#BCF181] transition-colors"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Tài khoản</span>
              </button>

              {/* Account Dropdown */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {user ? (
                    <>
                      {/* Logged In Menu */}
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold text-gray-900">{user.full_name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                      </div>
                      <a
                        href="#dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Bảng điều khiển</span>
                      </a>
                      <a
                        href="#dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Bảng điều khiển</span>
                      </a>
                      {user.role === 'admin' && (
                        <>
                          <div className="border-t my-2"></div>
                          <a
                            href="#admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-[#ca6946]"
                            onClick={() => setShowAccountMenu(false)}
                          >
                            <Leaf className="w-5 h-5" />
                            <span>Quản trị hệ thống</span>
                          </a>
                        </>
                      )}
                      <div className="border-t my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowAccountMenu(false);
                          window.location.hash = '#home';
                          alert('✅ Đã đăng xuất thành công!');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Not Logged In Menu */}
                      <a
                        href="#login"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-[#ca6946] font-semibold"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Đăng nhập</span>
                      </a>
                      <a
                        href="#register"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <Leaf className="w-5 h-5" />
                        <span>Tạo tài khoản</span>
                      </a>
                      <div className="border-t my-2"></div>
                      <a
                        href="#help"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <Gift className="w-5 h-5" />
                        <span>Trợ giúp</span>
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart - Only show when logged in */}
            {user && (
              <a href="#cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ca6946] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </a>
            )}

            <button className="lg:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t">
          <a
            href="#blanks"
            className="flex items-center gap-2 hover:text-[#ca6946] transition-colors"
          >
            <span>Cửa hàng Áo</span>
          </a>
          <a href="#designs" className="hover:text-[#ca6946] transition-colors">
            Thư viện thiết kế
          </a>
          <a href="#about-green" className="flex items-center gap-1 hover:text-[#ca6946] transition-colors">
            <Leaf className="w-4 h-4" />
            <span>Về Xanh</span>
          </a>
          <a href="#help" className="hover:text-[#ca6946] transition-colors">
            Trợ giúp
          </a>
        </nav>
      </div>
    </header>
  );
}
