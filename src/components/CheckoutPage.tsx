import imgRectangle18 from "../imports/figma:asset/ec5dee110611d8fa4386b7342909242db3aabd49.png";
import imgRectangle17 from "../imports/figma:asset/5de3554431d6c0f521e30ae15d7346a37c0da80e.png";
import { Header } from './Header';
import { Footer } from './Footer';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  ChevronRight,
  Leaf,
  Truck,
  CreditCard,
  MapPin,
  Check,
  ShieldCheck,
  AlertCircle,
  Plus,
  Tag,
  X
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { toast } from "sonner";

interface CheckoutStep {
  number: number;
  title: string;
  completed: boolean;
}

export function CheckoutPage() {
  const { token, isLoading: authLoading, getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [useGreenPoints, setUseGreenPoints] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
      const [showAddressForm, setShowAddressForm] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number; discountAmount?: number } | null>(null);
  const [userVouchers, setUserVouchers] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const hasLoadedRef = useRef(false); // Để tránh gọi API nhiều lần

  const steps: CheckoutStep[] = [
    { number: 1, title: "Địa chỉ giao hàng", completed: currentStep > 1 },
    { number: 2, title: "Phương thức giao hàng", completed: currentStep > 2 },
    { number: 3, title: "Thanh toán", completed: false },
  ];

  useEffect(() => {
    // Đợi auth loading xong trước khi check token
    // Chỉ load data một lần khi auth loading xong
    if (!authLoading && !hasLoadedRef.current) {
      const currentToken = getToken(); // Lấy token từ localStorage nếu token state chưa có
      if (currentToken) {
        hasLoadedRef.current = true; // Đánh dấu đã load
        loadData();
      } else {
        window.location.hash = '#login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]); // Chỉ phụ thuộc vào authLoading để tránh spam API calls

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentToken = getToken(); // Lấy token từ localStorage
      if (!currentToken) {
        window.location.hash = '#login';
        return;
      }

      const [cartData, addressesData, vouchersData] = await Promise.all([
        apiServices.cart.get(currentToken),
        apiServices.addresses.getAll(currentToken),
        apiServices.vouchers.getMyVouchers(currentToken).catch(() => [])
      ]);

      setCart(cartData);
      // Response là Address[] trực tiếp
      const addressesList = Array.isArray(addressesData) ? addressesData : [];
      setAddresses(addressesList);
      if (addressesList.length > 0) {
        const defaultAddr = addressesList.find((a: any) => a.is_default) || addressesList[0];
        setSelectedAddress(defaultAddr);
      } else {
        setShowAddressForm(true);
      }
      
      // Format vouchers từ API
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
      
      // Load applied voucher từ localStorage
      const savedVoucher = localStorage.getItem('appliedVoucher');
      if (savedVoucher) {
        try {
          setAppliedVoucher(JSON.parse(savedVoucher));
        } catch (e) {
          localStorage.removeItem('appliedVoucher');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu thanh toán';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setCreatingOrder(true);
      setError(null);
      const currentToken = getToken();
      if (!currentToken || !cart || !selectedAddress) {
        const msg = 'Vui lòng điền đầy đủ các trường bắt buộc';
        setError(msg);
        toast.error(msg);
        if (!currentToken) {
          window.location.hash = '#login';
        }
        return;
      }

      if (!cart.items || cart.items.length === 0) {
        const msg = 'Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.';
        setError(msg);
        toast.error(msg);
        return;
      }

      // Tính toán tổng tiền
      const subtotal = cart?.totalAmount || cart?.total || 0;
      const shippingCost = shippingMethod === "express" ? 50000 : (subtotal >= 500000 ? 0 : 30000);
      const voucherDiscount = appliedVoucher 
        ? (appliedVoucher.discountAmount || (subtotal * appliedVoucher.discount))
        : 0;
      const greenPointsDiscount = useGreenPoints ? 50000 : 0;
      const total = Math.max(0, subtotal - voucherDiscount + shippingCost - greenPointsDiscount);

      // Format order data theo API requirements
      const orderData = {
        items: cart.items.map((item: any) => {
          // Ensure price is a valid number > 0
          const price = parseFloat(item.price || item.unit_price_snapshot || item.product?.price || 0);
          if (price <= 0) {
            throw new Error(`Invalid price for product ${item.productId}. Price must be greater than 0.`);
          }
          return {
            productId: item.productId,
            quantity: item.quantity || item.qty || 1,
            price: price,
            colorCode: item.colorCode,
            sizeCode: item.sizeCode,
            designId: item.designId,
            customDesignData: item.customDesignData, // Include custom design data from cart
          };
        }),
        shippingAddress: selectedAddress.line1 
          ? `${selectedAddress.line1}${selectedAddress.line2 ? ', ' + selectedAddress.line2 : ''}, ${selectedAddress.state || ''}, ${selectedAddress.country || 'Vietnam'} ${selectedAddress.zip || ''}`
          : 'Address not specified',
        paymentMethod: paymentMethod,
        notes: `Shipping: ${shippingMethod === 'express' ? 'Express' : 'Standard'}`,
        voucherCode: appliedVoucher?.code,
      };

      console.log('Creating order with data:', orderData);
      const order = await apiServices.orders.create(orderData, currentToken) as any;
      console.log('Order created:', order);
      toast.success('Tạo đơn hàng thành công');
      
      // Clear cart và voucher sau khi đặt hàng thành công
      try {
        await apiServices.cart.clear(currentToken);
      } catch (clearErr) {
        console.warn('Failed to clear cart:', clearErr);
      }
      localStorage.removeItem('appliedVoucher');

      // Nếu là COD (Cash on Delivery), chuyển thẳng đến order success
      if (paymentMethod === 'cod') {
        window.location.hash = `#order-success?id=${order.id}`;
        return;
      }

      // Nếu là online payment (VNPay, MoMo), initiate payment
      try {
        // Lấy payment method ID (tạm thời dùng paymentMethod string, backend sẽ map)
        // TODO: Load payment methods từ API và lấy đúng ID
        const paymentResponse = await apiServices.payments.initiate({
          orderId: order.id,
          amount: total,
          paymentMethodId: paymentMethod, // Tạm thời dùng string, backend sẽ xử lý
          description: `Thanh toán đơn hàng #${order.id}`,
        }, currentToken) as any;

        console.log('Payment initiated:', paymentResponse);

        // Nếu có paymentUrl, redirect đến payment gateway
        if (paymentResponse?.paymentUrl) {
          // Thanh toán online: chuyển tới VNPay / Momo
          toast.info('Đang chuyển đến cổng thanh toán an toàn...');
          window.location.href = paymentResponse.paymentUrl;
        } else {
          // Không có paymentUrl (mock / lỗi cấu hình)
          toast.warning('Không nhận được đường dẫn thanh toán. Đơn hàng đã được tạo, vui lòng thanh toán sau.');
          window.location.hash = `#order-success?id=${order.id}`;
        }
      } catch (paymentErr: any) {
        console.error('Payment initiation error:', paymentErr);
        // Payment endpoint not available - order still created successfully
        // User can proceed to order success page
        const msg =
          paymentErr?.response?.data?.message ||
          paymentErr?.message ||
          'Thanh toán sẽ được xử lý sau. Đơn hàng đã được tạo thành công.';
        toast.warning(msg);
        // Order was created successfully, show order success page
        window.location.hash = `#order-success?id=${order.id}`;
      }
    } catch (err: any) {
      console.error('Create order error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Không thể tạo đơn hàng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCreatingOrder(false);
    }
  };

  // Apply voucher function
  const applyVoucher = async (voucherCode?: string) => {
    const code = voucherCode || '';
    if (!code.trim()) {
      toast.error('Vui lòng chọn voucher');
      return;
    }

    try {
      const currentToken = getToken();
      if (!currentToken) return;

      const subtotal = cart?.totalAmount || cart?.total || 0;
      const voucher = userVouchers.find(v => v.code === code);
      
      if (!voucher) {
        toast.error('Voucher không hợp lệ');
        return;
      }

      // Check minimum order amount
      if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
        toast.error(`Đơn hàng tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}₫ để sử dụng voucher này`);
        return;
      }

      // Calculate discount
      let discount = 0;
      let discountAmount = 0;
      
      if (voucher.discountType === 'percentage') {
        discount = voucher.discount / 100; // Convert percentage to decimal
        discountAmount = subtotal * discount;
      } else {
        discountAmount = voucher.discount;
      }

      const voucherData = {
        code: voucher.code,
        discount: discount,
        discountAmount: discountAmount,
      };

      setAppliedVoucher(voucherData);
      localStorage.setItem('appliedVoucher', JSON.stringify(voucherData));
      toast.success(`Đã áp dụng voucher ${voucher.code}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể áp dụng voucher';
      toast.error(msg);
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    localStorage.removeItem('appliedVoucher');
    toast.success('Đã xóa voucher');
  };

  const subtotal = cart?.totalAmount || cart?.total || 0;
  const shippingCost = shippingMethod === "express" ? 50000 : (subtotal >= 500000 ? 0 : 30000);
  const voucherDiscount = appliedVoucher 
    ? (appliedVoucher.discountAmount || (subtotal * appliedVoucher.discount))
    : 0;
  const greenPointsDiscount = useGreenPoints ? 50000 : 0;
  const total = Math.max(0, subtotal - voucherDiscount + shippingCost - greenPointsDiscount);
  const availableGreenPoints = 500;

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ca6946] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user is authenticated
  const currentToken = getToken();
  if (!currentToken) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-4">Vui lòng đăng nhập</p>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để thanh toán</p>
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
              <a href="#cart" className="hover:text-black">Giỏ hàng</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${step.completed
                        ? 'bg-green-600 border-green-600 text-white'
                        : currentStep === step.number
                          ? 'border-[#ca6946] text-[#ca6946] bg-white'
                          : 'border-gray-300 text-gray-400 bg-white'
                        }`}
                    >
                      {step.completed ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <span className="font-bold">{step.number}</span>
                      )}
                    </div>
                    <p className={`mt-2 text-sm ${currentStep >= step.number ? 'font-medium' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 transition-colors ${step.completed ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Address */}
              <div className={`bg-white border-2 rounded-xl p-6 transition-all ${currentStep === 1 ? 'border-[#ca6946]' : currentStep > 1 ? 'border-green-600' : 'border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-[#ca6946]" />
                    <h2 className="font-['Lato'] uppercase tracking-wider">Địa chỉ giao hàng</h2>
                  </div>
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-[#ca6946] hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {currentStep === 1 ? (
                  <div className="space-y-4">
                    {addresses.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          <Label>Chọn địa chỉ đã lưu</Label>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {addresses.map((addr) => {
                              const isSelected = (selectedAddress?.addr_id || selectedAddress?.id) === (addr.addr_id || addr.id);
                              return (
                                <button
                                  key={addr.addr_id || addr.id}
                                  type="button"
                                  onClick={() => setSelectedAddress(addr)}
                                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'border-[#ca6946] bg-[#ca6946]/5'
                                      : 'border-gray-200 hover:border-[#ca6946]/50 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-gray-900">{addr.label || 'Địa chỉ'}</h4>
                                        {addr.is_default && (
                                          <span className="px-2 py-0.5 bg-[#BCF181] text-xs rounded text-gray-700">Mặc định</span>
                                        )}
                                        {isSelected && (
                                          <Check className="w-5 h-5 text-[#ca6946]" />
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mb-1">
                                        {addr.line1}
                                        {addr.line2 && `, ${addr.line2}`}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {addr.state && `${addr.state}, `}
                                        {addr.country || 'Vietnam'}
                                        {addr.zip && ` ${addr.zip}`}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => window.location.hash = '#dashboard?tab=addresses'}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ca6946] hover:bg-[#ca6946]/5 transition-colors text-sm text-gray-600 hover:text-[#ca6946]"
                          >
                            <Plus className="w-4 h-4" />
                            Thêm địa chỉ mới
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
                        <button
                          type="button"
                          onClick={() => window.location.hash = '#dashboard?tab=addresses'}
                          className="px-4 py-2 bg-[#ca6946] hover:bg-[#b55835] text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm địa chỉ mới
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (selectedAddress) {
                          setCurrentStep(2);
                        } else {
                          alert('Vui lòng chọn địa chỉ giao hàng');
                        }
                      }}
                      disabled={!selectedAddress}
                      className="w-full bg-[#ca6946] hover:bg-[#b55835] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-full transition-all"
                    >
                      Tiếp tục đến giao hàng
                    </button>
                  </div>
                ) : (
                  selectedAddress && (
                  <div className="text-sm text-gray-600">
                      <p className="font-semibold">{selectedAddress.label}</p>
                      <p>{selectedAddress.line1}</p>
                      {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
                      <p>{selectedAddress.state} {selectedAddress.zip}</p>
                      <p>{selectedAddress.country}</p>
                  </div>
                  )
                )}
              </div>

              {/* Step 2: Delivery Method */}
              <div className={`bg-white border-2 rounded-xl p-6 transition-all ${currentStep === 2 ? 'border-[#ca6946]' : currentStep > 2 ? 'border-green-600' : 'border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-[#ca6946]" />
                    <h2 className="font-['Lato'] uppercase tracking-wider">Phương thức giao hàng</h2>
                  </div>
                  {currentStep > 2 && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm text-[#ca6946] hover:underline"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {currentStep === 2 ? (
                  <div className="space-y-4">
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${shippingMethod === "standard" ? 'border-[#ca6946] bg-[#BCF181]/10' : 'border-gray-200 hover:border-gray-400'
                        }`}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">Giao hàng tiêu chuẩn</p>
                              <p className="font-bold text-green-700">MIỄN PHÍ</p>
                            </div>
                            <p className="text-sm text-gray-600">Thời gian giao hàng ước tính: 5-7 ngày làm việc</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Leaf className="w-4 h-4 text-green-700" />
                              <span className="text-xs text-green-700">Vận chuyển carbon-neutral</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${shippingMethod === "express" ? 'border-[#ca6946] bg-[#BCF181]/10' : 'border-gray-200 hover:border-gray-400'
                        }`}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">Giao hàng nhanh</p>
                              <p className="font-bold">50.000₫</p>
                            </div>
                            <p className="text-sm text-gray-600">Thời gian giao hàng ước tính: 2-3 ngày làm việc</p>
                          </label>
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 bg-[#ca6946] hover:bg-[#b55835] text-white py-3 rounded-full transition-all"
                      >
                        Tiếp Tục Thanh Toán
                      </button>
                    </div>
                  </div>
                ) : currentStep > 2 ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{shippingMethod === "standard" ? "Giao Hàng Tiêu Chuẩn" : "Giao Hàng Nhanh"}</p>
                    <p>Dự kiến: {shippingMethod === "standard" ? "5-7 ngày làm việc" : "2-3 ngày làm việc"}</p>
                  </div>
                ) : null}
              </div>

              {/* Step 3: Payment */}
              <div className={`bg-white border-2 rounded-xl p-6 transition-all ${currentStep === 3 ? 'border-[#ca6946]' : 'border-gray-200'
                }`}>
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-[#ca6946]" />
                  <h2 className="font-['Lato'] uppercase tracking-wider">Phương Thức Thanh Toán</h2>
                </div>

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "vnpay" ? 'border-[#ca6946] bg-[#BCF181]/10' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="vnpay" id="vnpay" />
                          <label htmlFor="vnpay" className="flex-1 cursor-pointer">
                            <p className="font-medium">VNPAY</p>
                            <p className="text-sm text-gray-600">Thanh toán qua cổng VNPAY</p>
                          </label>
                        </div>
                      </div>

                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "momo" ? 'border-[#ca6946] bg-[#BCF181]/10' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="momo" id="momo" />
                          <label htmlFor="momo" className="flex-1 cursor-pointer">
                            <p className="font-medium">Momo</p>
                            <p className="text-sm text-gray-600">Thanh toán qua ví Momo</p>
                          </label>
                        </div>
                      </div>

                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "cod" ? 'border-[#ca6946] bg-[#BCF181]/10' : 'border-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <label htmlFor="cod" className="flex-1 cursor-pointer">
                            <p className="font-medium">Thanh Toán Khi Nhận Hàng</p>
                            <p className="text-sm text-gray-600">Thanh toán khi nhận hàng</p>
                          </label>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Green Points */}
                    <div className="border-2 border-[#BCF181] rounded-lg p-4 bg-[#BCF181]/10">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={useGreenPoints}
                          onCheckedChange={(checked) => setUseGreenPoints(checked as boolean)}
                          id="greenpoints"
                        />
                        <label htmlFor="greenpoints" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Leaf className="w-4 h-4 text-green-700" />
                            <p className="font-medium">Sử Dụng Điểm Xanh</p>
                          </div>
                          <p className="text-sm text-gray-600">Bạn có {availableGreenPoints} điểm (-50,000₫)</p>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={handleCreateOrder}
                        disabled={creatingOrder || !selectedAddress}
                        className="flex-1 bg-[#ca6946] hover:bg-[#b55835] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-full transition-all"
                      >
                        {creatingOrder ? 'Đang tạo đơn hàng...' : 'Đặt hàng'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-['Lato'] uppercase tracking-wider mb-6">Tóm Tắt Đơn Hàng</h3>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                  {cart?.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                        <img src={item.product?.image || item.image || 'https://placehold.co/80x80'} alt={item.product?.name || item.name || 'Sản phẩm'} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1 truncate">{item.product?.name || item.name || 'Sản phẩm'}</p>
                        {item.design && <p className="text-xs text-gray-600 mb-1">Thiết kế: {item.design}</p>}
                        <p className="text-xs text-gray-600">{item.sizeCode || 'N/A'} • {item.colorCode || 'N/A'} • SL: {item.quantity || item.qty}</p>
                        <p className="text-sm font-medium mt-1">{(item.price || item.unit_price_snapshot || 0).toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher Section */}
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
                              const canUse = !voucher.minOrderAmount || subtotal >= voucher.minOrderAmount;
                              return (
                                <button
                                  key={voucher.id}
                                  type="button"
                                  onClick={() => applyVoucher(voucher.code)}
                                  disabled={!canUse}
                                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    canUse
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
                          type="button"
                          onClick={removeVoucher}
                          className="text-red-500 hover:text-red-700"
                          title="Xóa voucher"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Giảm {voucherDiscount.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {appliedVoucher && voucherDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Giảm giá (Voucher {appliedVoucher.code})</span>
                      <span>-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vận chuyển</span>
                    <span className={shippingCost === 0 ? "text-green-700" : ""}>
                      {shippingCost === 0 ? "MIỄN PHÍ" : `${shippingCost.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                  {useGreenPoints && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="flex items-center gap-1">
                        <Leaf className="w-4 h-4" />
                        Điểm Xanh
                      </span>
                      <span>-{greenPointsDiscount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="font-bold">Tổng cộng</span>
                  <span className="font-bold text-xl">{total.toLocaleString('vi-VN')}₫</span>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span>Đóng gói thân thiện môi trường</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
