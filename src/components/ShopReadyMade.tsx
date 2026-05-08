import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { ProductGrid } from './shared/ProductGrid';

export function ShopReadyMade() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadyMade = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiServices.products.getReadyMade(1, 6);
      setProducts(response.products || []);
      setTotal(Number(response.total ?? 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadyMade();
  }, []);

  return (
    <section id="shop-ready-made" className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FFE9A8]/40 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-amber-700">Thiết Kế Có Sẵn</span>
          </div>
          <h2 className="font-['Lato'] uppercase tracking-wider mb-3">
            Mua Áo Tự Thiết Kế
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bộ sưu tập áo đã được thiết kế sẵn bởi đội ngũ Sustainique.
            Chọn mẫu yêu thích, đặt size và màu là xong — không cần tự thiết kế.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            viewMode="grid"
            showEcoBadges={false}
            showCustomizeButton={false}
            onRetry={fetchReadyMade}
            emptyMessage="Chưa có áo thiết kế sẵn nào"
          />
        </div>

        {/* View All */}
        <div className="text-center">
          <a
            href="#ready-made"
            className="inline-block border-2 border-black hover:bg-black hover:text-white px-8 py-3 rounded-full transition-all font-medium cursor-pointer"
          >
            Xem tất cả áo ({total})
          </a>
        </div>
      </div>
    </section>
  );
}
