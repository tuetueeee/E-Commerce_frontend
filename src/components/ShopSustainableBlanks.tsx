import { Leaf } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { ProductGrid } from './shared/ProductGrid';

export function ShopSustainableBlanks() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlanks = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use getBlanks instead of getAll to get only blank products
        const response = await apiServices.products.getBlanks(1, 4);
        setProducts(response.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    loadBlanks();
  }, []);

  return (
    <section id="shop-blanks" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#BCF181]/20 px-4 py-2 rounded-full mb-4">
            <Leaf className="w-4 h-4 text-green-700" />
            <span className="text-green-700">Vật Liệu Bền Vững</span>
          </div>
          <h2 className="font-['Lato'] uppercase tracking-wider mb-3">
            Mua Phôi Áo Bền Vững
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chọn từ bộ sưu tập áo cao cấp làm từ vật liệu bền vững. 
            Mỗi sản phẩm đều được chứng nhận organic và thân thiện với môi trường.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <ProductGrid 
            products={products} 
            loading={loading}
            error={error}
            viewMode="grid"
            showEcoBadges={true}
            showCustomizeButton={true}
            onRetry={async () => {
              try {
                setLoading(true);
                const response = await apiServices.products.getBlanks(1, 4);
                setProducts(response.products || []);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
              } finally {
                setLoading(false);
              }
            }}
            emptyMessage="Không có áo bền vững nào"
          />
        </div>

        {/* View All */}
        <div className="text-center">
          <a
            href="#blanks"
            className="inline-block border-2 border-black hover:bg-black hover:text-white px-8 py-3 rounded-full transition-all font-medium cursor-pointer"
          >
            Xem tất cả áo ({products.length + 13})
          </a>
        </div>
      </div>
    </section>
  );
}
