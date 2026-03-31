import { Header } from './Header';
import { Footer } from './Footer';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';

export function PaymentCallbackPage() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState<string>('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Lấy params từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const paymentIdParam = urlParams.get('paymentId');
      
      // VNPay sẽ gửi các params về đây
      const vnpParams: any = {};
      urlParams.forEach((value, key) => {
        vnpParams[key] = value;
      });

      if (!paymentIdParam) {
        setStatus('failed');
        setMessage('Không tìm thấy thông tin thanh toán');
        return;
      }

      setPaymentId(paymentIdParam);

      // Gọi backend để verify payment
      // Backend sẽ gọi GET /api/payments/callback/vnpay?paymentId=xxx&vnp_...
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/payments/callback/vnpay?paymentId=${paymentIdParam}&${new URLSearchParams(vnpParams).toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.status === 'completed') {
        setStatus('success');
        setMessage('Thanh toán thành công!');
        setOrderId(data.orderId);
        
        // Redirect đến order success sau 2 giây
        setTimeout(() => {
          window.location.hash = `#order-success?id=${data.orderId}`;
        }, 2000);
      } else {
        setStatus('failed');
        setMessage(data.message || 'Thanh toán thất bại');
        setOrderId(data.orderId);
      }
    } catch (err: any) {
      console.error('Payment callback error:', err);
      setStatus('failed');
      setMessage(err?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-[#ca6946] animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              {orderId && (
                <p className="text-sm text-gray-500 mb-6">
                  Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                </p>
              )}
              <p className="text-sm text-gray-500">Đang chuyển đến trang xác nhận đơn hàng...</p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Đơn hàng của bạn đã được tạo với mã: <span className="font-semibold">{orderId}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Bạn có thể thanh toán sau từ trang quản lý đơn hàng
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <a
                  href="#orders"
                  className="flex-1 bg-[#ca6946] hover:bg-[#b55835] text-white py-3 rounded-full transition-all text-center"
                >
                  Xem đơn hàng
                </a>
                <a
                  href="#home"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-full transition-all text-center"
                >
                  Về trang chủ
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

