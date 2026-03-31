import { Gift, Coins, Zap, Star, ArrowRight } from 'lucide-react';

export function VoucherCoins() {
  return (
    <section id="vouchers" className="py-16 bg-gradient-to-br from-[#ca6946] to-[#b55835] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span>Chương Trình Thưởng</span>
            </div>

            <h2 className="font-['Lato'] uppercase tracking-wider mb-4">
              Voucher & Coins
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Kiếm coins mỗi khi mua sắm và sử dụng để đổi vouchers giảm giá. 
              Càng mua nhiều, càng tiết kiệm nhiều!
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Lato'] mb-1">Nhận Vouchers độc quyền</h3>
                  <p className="text-white/80">Giảm giá lên đến 50% cho các thiết kế và áo cao cấp</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Lato'] mb-1">Kiếm Coins dễ dàng</h3>
                  <p className="text-white/80">Mỗi 100.000₫ = 10 coins. Coins không giới hạn thời gian</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Lato'] mb-1">Ưu đãi đặc biệt</h3>
                  <p className="text-white/80">Miễn phí vận chuyển và truy cập sớm đến thiết kế mới</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-[#ca6946] px-8 py-3 rounded-full hover:bg-gray-100 transition-all inline-flex items-center gap-2">
                Tham Gia Ngay
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white px-8 py-3 rounded-full hover:bg-white/10 transition-all">
                Cách Hoạt Động
              </button>
            </div>
          </div>

          {/* Right: Visual Cards */}
          <div className="relative">
            {/* Coin Card */}
            <div className="bg-white text-black rounded-2xl p-8 mb-6 shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 mb-1">Coins Của Bạn</p>
                  <p className="font-bold">1,250 Coins</p>
                </div>
                <div className="bg-[#BCF181] p-3 rounded-full">
                  <Coins className="w-8 h-8 text-green-800" />
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Phần thưởng tiếp theo tại</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-300 rounded-full h-2">
                    <div className="bg-[#ca6946] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm">1,500</span>
                </div>
              </div>
            </div>

            {/* Voucher Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#BCF181] text-black rounded-xl p-6 shadow-lg">
                <Gift className="w-8 h-8 mb-2" />
                <p className="font-bold mb-1">20% OFF</p>
                <p className="text-sm">500 Coins</p>
              </div>
              <div className="bg-yellow-300 text-black rounded-xl p-6 shadow-lg">
                <Zap className="w-8 h-8 mb-2" />
                <p className="font-bold mb-1">Miễn Phí Vận Chuyển</p>
                <p className="text-sm">300 Coins</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center animate-pulse">
              <Star className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
