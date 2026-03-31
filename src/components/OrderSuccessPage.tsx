import imgRectangle18 from "../imports/figma:asset/ec5dee110611d8fa4386b7342909242db3aabd49.png";
import imgRectangle17 from "../imports/figma:asset/5de3554431d6c0f521e30ae15d7346a37c0da80e.png";
import { Header } from './Header';
import { Footer } from './Footer';
import { CheckCircle, Package, Truck, Mail, Leaf, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';

export function OrderSuccessPage() {
  const { token } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!token) {
        window.location.hash = '#login';
        return;
      }

      const urlParams = new URLSearchParams(window.location.hash.replace('#order-success?', ''));
      const orderId = urlParams.get('id');

      if (!orderId) {
        setError('Order ID not found');
        return;
      }

      const response = await apiServices.orders.getById(orderId, token);
      setOrder(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <ErrorDisplay message={error} onRetry={loadOrder} />
        </div>
        <Footer />
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Loading order details..." />
        </div>
        <Footer />
      </div>
    );
  }

  const orderId = order.id || "ORD-2024-000";
  const estimatedDelivery = order.shipment?.estimatedDelivery
    ? new Date(order.shipment.estimatedDelivery).toLocaleDateString('vi-VN')
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');
  const orderItems = order.items || [];
  const total = order.Total || order.total || 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-['Lora'] mb-4">Đặt hàng thành công!</h1>
            <p className="text-xl text-gray-600 mb-2">
              Cảm ơn bạn đã chọn thời trang bền vững
            </p>
            <p className="text-gray-600">
              Xác nhận đơn hàng đã được gửi đến <span className="font-medium">customer@sustainique.com</span>
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
              {/* Order Number */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                <p className="font-bold text-xl">{orderId}</p>
              </div>

              {/* Estimated Delivery */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Dự kiến giao hàng</p>
                <p className="font-bold text-xl">{estimatedDelivery}</p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-['Lato'] uppercase tracking-wider mb-6">Trạng thái đơn hàng</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium mb-1">Đã đặt hàng</p>
                    <p className="text-sm text-gray-600">Đơn hàng của bạn đã được nhận</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-gray-600 mb-1">Đang xử lý</p>
                    <p className="text-sm text-gray-500">Chúng tôi đang chuẩn bị sản phẩm của bạn</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-600 mb-1">Đã gửi</p>
                    <p className="text-sm text-gray-500">Đơn hàng của bạn đang trên đường</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-['Lato'] uppercase tracking-wider mb-4">Sản phẩm trong đơn hàng</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{item.name}</p>
                      <p className="text-sm text-gray-600 mb-1">Thiết kế: {item.design}</p>
                      <p className="text-sm text-gray-600">
                        Kích thước: {item.size} • Màu: {item.color} • Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center">
              <span className="font-bold text-xl">Tổng đã thanh toán</span>
              <span className="font-bold text-2xl text-[#ca6946]">{total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          {/* Green Impact */}
          <div className="bg-gradient-to-r from-[#BCF181] to-[#ca6946] rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-green-700" />
              </div>
              <div className="text-white">
                <h3 className="font-['Lato'] uppercase tracking-wider mb-2">Tác động Xanh của bạn</h3>
                <p className="text-white/90 mb-4">
                  Bằng cách chọn sản phẩm thân thiện môi trường, bạn đã góp phần vào tương lai bền vững!
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-2xl font-bold">2.5kg</p>
                    <p className="text-sm text-white/80">CO₂ đã tiết kiệm</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-2xl font-bold">+120</p>
                    <p className="text-sm text-white/80">Điểm Xanh</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-white/80">Cây đã trồng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <a
              href="#dashboard"
              className="border-2 border-black hover:bg-black hover:text-white py-4 rounded-full transition-all text-center flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Theo dõi đơn hàng
            </a>
            <button className="border-2 border-gray-300 hover:bg-gray-50 py-4 rounded-full transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Tải hóa đơn
            </button>
            <a
              href="#home"
              className="bg-[#ca6946] hover:bg-[#b55835] text-white py-4 rounded-full transition-all text-center"
            >
              Tiếp tục mua sắm
            </a>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <h4 className="font-medium mb-2">Cần trợ giúp?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi
            </p>
            <a
              href="#contact"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
