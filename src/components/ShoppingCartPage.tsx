// Placeholder images - replace with actual images when available
const imgRectangle18 = "https://placehold.co/400x300/90EE90/FFFFFF?text=Design+1";
const imgRectangle17 = "https://placehold.co/400x300/87CEEB/FFFFFF?text=Design+2";
const imgRectangle19 = "https://placehold.co/400x300/FFB6C1/FFFFFF?text=Design+3";
import { Header } from './Header';
import { Footer } from './Footer';
import { Input } from './ui/input';
import { Leaf, X, ChevronRight, Tag, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiServices } from '../services/apiConfig';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { ProductCard } from './shared/ProductCard';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  colorCode?: string;
  designId?: string;
}

export function ShoppingCartPage() {
  const { token: authToken, isLoading: authLoading, getToken } = useAuth();
  const token = getToken(); // Get fresh token from localStorage if needed
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [userVouchers, setUserVouchers] = useState<any[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<any[]>([]);
  const [loadingFrequentlyBought, setLoadingFrequentlyBought] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const currentToken = getToken();
      if (currentToken) {
        loadCart();
        loadUserVouchers();
        // Load applied voucher từ localStorage
        const savedVoucher = localStorage.getItem('appliedVoucher');
        if (savedVoucher) {
          try {
            setAppliedVoucher(JSON.parse(savedVoucher));
          } catch (e) {
            localStorage.removeItem('appliedVoucher');
          }
        }
      } else {
        setError('Vui lòng đăng nhập để xem giỏ hàng');
        setLoading(false);
      }
    }
  }, [authLoading]);

  const loadUserVouchers = async () => {
    try {
      const currentToken = getToken();
      if (!currentToken) return;

      const vouchersData = await apiServices.vouchers.getMyVouchers(currentToken).catch(() => []);
      const vouchersList = Array.isArray(vouchersData) ? vouchersData : [];
      const formattedVouchers = vouchersList
        .filter((uv: any) => {
          // Chỉ lấy vouchers chưa sử dụng và chưa hết hạn
          const isUsed = uv.status === 'used' || uv.isUsed || false;
          const expiresAt = uv.voucher?.validUntil || uv.voucher?.expiresAt;
          const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;
          return !isUsed && !isExpired;
        })
        .map((uv: any) => ({
          id: uv.id || uv.VOUCHER_ID,
          code: uv.voucher?.code || uv.code,
          name: uv.voucher?.name || uv.voucher?.title || 'Voucher',
          discount: uv.voucher?.discountValue || uv.voucher?.value || 0,
          discountType: uv.voucher?.type || 'fixed',
          minOrderAmount: uv.voucher?.minOrderAmount || 0,
          expiresAt: uv.voucher?.validUntil || uv.voucher?.expiresAt,
          voucher: uv.voucher,
        }));
      setUserVouchers(formattedVouchers);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
    }
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentToken = getToken();
      if (!currentToken) {
        setError('Not authenticated');
        return;
      }
      const response = await apiServices.cart.get(currentToken);
      // Format cart items để hiển thị
      const formattedItems = (response.items || []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity || item.qty || 1,
        price: item.price || item.unit_price_snapshot || 0,
        subtotal: item.subtotal || (item.quantity || item.qty || 1) * (item.price || item.unit_price_snapshot || 0),
        name: item.product?.name || item.product?.title || 'Sản phẩm',
        image: item.product?.image || 'https://placehold.co/96x96',
        product: item.product,
        designId: item.designId,
        colorCode: item.colorCode,
        sizeCode: item.sizeCode,
        customDesignData: item.customDesignData, // Include custom design data
      }));
      setCartItems(formattedItems);
      
      // Load frequently bought together for first item in cart
      if (formattedItems.length > 0 && formattedItems[0].productId) {
        loadFrequentlyBought(formattedItems[0].productId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const loadFrequentlyBought = async (productId: string) => {
    try {
      setLoadingFrequentlyBought(true);
      const response = await apiServices.products.getFrequentlyBought(productId, 4);
      setFrequentlyBought(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to load frequently bought products:', err);
      setFrequentlyBought([]);
    } finally {
      setLoadingFrequentlyBought(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const currentToken = getToken();
      if (!currentToken) {
        setError('Not authenticated');
        return;
      }
      await apiServices.cart.updateItem(itemId, currentToken, { quantity: newQuantity });
      // Reload cart to get updated data
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật số lượng');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const currentToken = getToken();
      if (!currentToken) {
        setError('Not authenticated');
        return;
      }
      await apiServices.cart.removeItem(itemId, currentToken);
      // Reload cart to get updated data
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa sản phẩm');
    }
  };

  const applyVoucher = async (voucherCodeParam?: string) => {
    const code = voucherCodeParam || voucherCode.trim();
    if (!code) {
      setError('Vui lòng chọn voucher');
      return;
    }
    try {
      setApplyingVoucher(true);
      setError(null);
      const currentToken = getToken();
      if (!currentToken) {
        setError('Not authenticated');
        return;
      }

      // Get cart total first
      const cart = await apiServices.cart.get(currentToken);
      const cartTotal = cart.totalAmount || 0;

      // Validate voucher using correct endpoint
      const validation = await apiServices.vouchers.validate(
        code.toUpperCase(),
        cartTotal,
        currentToken
      );

      if (!validation.valid) {
        setError(validation.message || 'Mã voucher không hợp lệ');
        return;
      }

      const voucherData = { 
        code: code.toUpperCase(), 
        discount: validation.discount / cartTotal, // Convert to percentage
        discountAmount: validation.discount,
        voucher: validation.voucher,
      };
      setAppliedVoucher(voucherData);
      // Lưu vào localStorage để truyền đến checkout
      localStorage.setItem('appliedVoucher', JSON.stringify(voucherData));
      setVoucherCode("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mã voucher không hợp lệ';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setApplyingVoucher(false);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    localStorage.removeItem('appliedVoucher');
    loadCart(); // Reload để cập nhật total
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedVoucher 
    ? (appliedVoucher.discountAmount || (subtotal * appliedVoucher.discount))
    : 0;
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = Math.max(0, subtotal - discount + shipping);

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ca6946] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-4">Vui lòng đăng nhập</p>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem giỏ hàng</p>
            <a href="#login" className="inline-block bg-[#ca6946] hover:bg-[#b55835] text-white px-8 py-3 rounded-full transition-all">
              Đi đến đăng nhập
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="#home" className="hover:text-black">Trang chủ</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">Giỏ hàng</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading && <Loading text="Đang tải giỏ hàng..." />}
          {error && error !== 'Vui lòng đăng nhập để xem giỏ hàng' && <ErrorDisplay message={error} onRetry={loadCart} />}

          {!loading && !error && (
            <>
              <h1 className="font-['Lora'] mb-8">Giỏ hàng ({cartItems.length} sản phẩm)</h1>

              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-6">Giỏ hàng của bạn trống</p>
                  <a
                    href="#home"
                    className="inline-block bg-[#ca6946] hover:bg-[#b55835] text-white px-8 py-3 rounded-full transition-all"
                  >
                    Tiếp tục mua sắm
                  </a>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
                          {/* Image */}
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={item.product?.image || item.image || 'https://placehold.co/96x96'} 
                              alt={item.product?.name || item.name || 'Product'} 
                              className="w-full h-full object-cover" 
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <div>
                                <h3 className="font-['Lato'] mb-1">{item.product?.name || item.name || 'Sản phẩm'}</h3>
                                {item.designId && (
                                  <p className="text-sm text-gray-600 mb-1">Thiết kế ID: {item.designId}</p>
                                )}
                                {(item.sizeCode || item.colorCode) && (
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    {item.sizeCode && <span>Size: {item.sizeCode}</span>}
                                    {item.sizeCode && item.colorCode && <span>•</span>}
                                    {item.colorCode && <span>Màu: {item.colorCode}</span>}
                                  </div>
                                )}
                                {item.isEco && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Leaf className="w-3 h-3 text-green-700" />
                                    <span className="text-xs text-green-700">Sản phẩm thân thiện môi trường</span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                  +
                                </button>
                              </div>

                              {/* Price */}
                              <p className="font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Continue Shopping */}
                    <a
                      href="#blanks"
                      className="inline-block mt-6 text-[#ca6946] hover:underline"
                    >
                      ← Tiếp tục mua sắm
                    </a>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                      <h2 className="font-['Lato'] mb-6">Tóm tắt đơn hàng</h2>

                      {/* Voucher */}
                      <div className="mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                        <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#ca6946]" />
                          Mã Voucher / Mã giảm giá
                        </label>
                        {!appliedVoucher ? (
                          <div className="space-y-2">
                            {userVouchers.length > 0 ? (
                              <>
                                <p className="text-xs text-gray-600 mb-2">Chọn voucher của bạn:</p>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                  {userVouchers.map((voucher: any) => {
                                    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                    const canUse = !voucher.minOrderAmount || subtotal >= voucher.minOrderAmount;
                                    return (
                                      <button
                                        key={voucher.id}
                                        type="button"
                                        onClick={() => applyVoucher(voucher.code)}
                                        disabled={!canUse || applyingVoucher}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                          canUse && !applyingVoucher
                                            ? 'border-gray-200 hover:border-[#ca6946] hover:bg-[#ca6946]/5 cursor-pointer'
                                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-semibold text-sm">{voucher.name}</span>
                                              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
                                                {voucher.code}
                                              </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                              {voucher.discountType === 'percentage'
                                                ? `Giảm ${voucher.discount}%`
                                                : `Giảm ${voucher.discount.toLocaleString('vi-VN')}₫`}
                                              {voucher.minOrderAmount > 0 && (
                                                <span className="text-gray-500">
                                                  {' '}• Đơn tối thiểu {voucher.minOrderAmount.toLocaleString('vi-VN')}₫
                                                </span>
                                              )}
                                            </p>
                                            {!canUse && (
                                              <p className="text-xs text-red-600 mt-1">
                                                Chưa đủ điều kiện sử dụng
                                              </p>
                                            )}
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-sm text-gray-500 mb-2">Bạn chưa có voucher nào</p>
                                <a
                                  href="#dashboard?tab=rewards"
                                  className="text-sm text-[#ca6946] hover:underline"
                                >
                                  Xem phần thưởng →
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-green-700">
                                <Tag className="w-4 h-4" />
                                <span className="font-medium">Voucher "{appliedVoucher.code}" đã áp dụng</span>
                              </div>
                              <button
                                onClick={removeVoucher}
                                className="text-red-500 hover:text-red-700"
                                title="Xóa voucher"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              Giảm {appliedVoucher.discountAmount?.toLocaleString('vi-VN') || (appliedVoucher.discount * 100)}₫
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 mb-6 pb-6 border-b">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tạm tính</span>
                          <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                        </div>
                        {appliedVoucher && (
                          <div className="flex justify-between text-green-700">
                            <span>Giảm giá</span>
                            <span>-{discount.toLocaleString('vi-VN')}₫</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vận chuyển</span>
                          <span className={shipping === 0 ? "text-green-700" : ""}>
                            {shipping === 0 ? "MIỄN PHÍ" : `${shipping.toLocaleString('vi-VN')}₫`}
                          </span>
                        </div>
                        {shipping > 0 && (
                          <p className="text-xs text-gray-500">
                            Thêm {(500000 - subtotal).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển
                          </p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between mb-6">
                        <span className="font-bold">Tổng cộng</span>
                        <span className="font-bold text-xl">{total.toLocaleString('vi-VN')}₫</span>
                      </div>

                      {/* Checkout Button */}
                      <a
                        href="#checkout"
                        className="block w-full bg-[#ca6946] hover:bg-[#b55835] text-white py-4 rounded-full transition-all mb-4 text-center"
                      >
                        Tiến hành thanh toán
                      </a>

                      {/* Trust Badges */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Truck className="w-5 h-5" />
                          <span>Free shipping on orders over 500k</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShieldCheck className="w-5 h-5" />
                          <span>Secure checkout guaranteed</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Leaf className="w-5 h-5 text-green-700" />
                          <span className="text-green-700">Carbon-neutral shipping</span>
                        </div>
                      </div>

                      {/* Green Commitment */}
                      <div className="mt-6 p-4 bg-[#BCF181]/20 rounded-lg">
                        <p className="text-sm text-green-900">
                          🌱 Your order supports sustainable practices and helps plant trees!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
