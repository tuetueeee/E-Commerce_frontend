import { Header } from './Header';
import { Footer } from './Footer';
import { XCircle, ShoppingBag, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PaymentCancelPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy orderId từ URL nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    // Có thể lấy orderId từ paymentId nếu cần
    setOrderId(paymentId);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán đã bị hủy</h2>
          <p className="text-gray-600 mb-6">
            Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn vẫn được lưu và bạn có thể thanh toán sau.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Mã đơn hàng: <span className="font-semibold">{orderId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href="#orders"
              className="block w-full bg-[#ca6946] hover:bg-[#b55835] text-white py-3 rounded-full transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Xem đơn hàng của tôi
            </a>
            <a
              href="#cart"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-full transition-all flex items-center justify-center gap-2"
            >
              Quay lại giỏ hàng
            </a>
            <a
              href="#home"
              className="block w-full text-gray-600 hover:text-gray-800 py-2 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

