import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductCard } from './shared/ProductCard';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';

const ITEMS_PER_VIEW = 4;

export function ProductRecommendations() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      // Use AI recommended if logged in, otherwise use trending
      if (token) {
        const response = await apiServices.products.getRecommended(token, 8);
        setProducts(Array.isArray(response) ? response : []);
      } else {
        const response = await apiServices.products.getAITrending(8);
        setProducts(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
      // Fallback to trending if recommended fails
      try {
        const response = await apiServices.products.getAITrending(8);
        setProducts(Array.isArray(response) ? response : []);
      } catch (fallbackErr) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const maxIndex = Math.max(0, products.length - ITEMS_PER_VIEW);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Show loading state but don't hide the section
  if (loading && products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-['Lato'] uppercase tracking-wider mb-2">
                Sản Phẩm Phôi Dành Cho Bạn
              </h2>
              <p className="text-gray-600">
                {getToken() 
                  ? 'Các sản phẩm phôi được gợi ý dựa trên sở thích của bạn'
                  : 'Các sản phẩm phôi đang được yêu thích'}
              </p>
            </div>
          </div>
          <div className="text-center py-12 text-gray-500">Đang tải sản phẩm...</div>
        </div>
      </section>
    );
  }

  // If error or no products, try to show trending as fallback
  if (error || products.length === 0) {
    // Already tried fallback in loadRecommendations, so just show empty state
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-['Lato'] uppercase tracking-wider mb-2">
              Sản Phẩm Phôi Dành Cho Bạn
            </h2>
            <p className="text-gray-600">
              {getToken() 
                ? 'Các sản phẩm phôi được gợi ý dựa trên sở thích của bạn'
                : 'Các sản phẩm phôi đang được yêu thích'}
            </p>
          </div>

          {/* Navigation Arrows & View All */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="border-2 border-gray-300 p-2 rounded-full hover:bg-[#ca6946] hover:border-[#ca6946] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-current"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                className="border-2 border-gray-300 p-2 rounded-full hover:bg-[#ca6946] hover:border-[#ca6946] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-current"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <a
              href="#blanks"
              className="inline-block border-2 border-black hover:bg-black hover:text-white px-6 py-2 rounded-full transition-all font-medium text-sm"
            >
              Xem tất cả
            </a>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / ITEMS_PER_VIEW)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / ITEMS_PER_VIEW}% - 12px)` }}
              >
                <ProductCard
                  product={product}
                  viewMode="grid"
                  showEcoBadges={true}
                  showCustomizeButton={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all cursor-pointer hover:bg-[#ca6946] ${
                currentIndex === index
                  ? 'bg-[#ca6946] w-8'
                  : 'bg-gray-300 w-1.5 hover:w-4'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
