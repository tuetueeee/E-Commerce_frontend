import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Eye } from 'lucide-react';

const ITEMS_PER_VIEW = 4;

export function DesignRecommendations() {
  const { getToken } = useAuth();
  const [designs, setDesigns] = useState<any[]>([]);
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
        const response = await apiServices.designs.getRecommended(token, 8);
        setDesigns(Array.isArray(response) ? response : []);
      } else {
        const response = await apiServices.designs.getTrending(8);
        setDesigns(Array.isArray(response.designs) ? response.designs : []);
      }
    } catch (err) {
      console.error('Failed to load design recommendations:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải thiết kế');
      // Fallback to trending if recommended fails
      try {
        const response = await apiServices.designs.getTrending(8);
        setDesigns(Array.isArray(response.designs) ? response.designs : []);
      } catch (fallbackErr) {
        setDesigns([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const maxIndex = Math.max(0, designs.length - ITEMS_PER_VIEW);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Show loading state but don't hide the section
  if (loading && designs.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-['Lato'] uppercase tracking-wider mb-2">
                Thiết Kế Dành Cho Bạn
              </h2>
              <p className="text-gray-600">
                {getToken() 
                  ? 'Các thiết kế được gợi ý dựa trên sở thích của bạn'
                  : 'Các thiết kế đang được yêu thích'}
              </p>
            </div>
          </div>
          <div className="text-center py-12 text-gray-500">Đang tải thiết kế...</div>
        </div>
      </section>
    );
  }

  // If error or no designs, try to show trending as fallback
  if (error || designs.length === 0) {
    // Already tried fallback in loadRecommendations, so just show empty state
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-['Lato'] uppercase tracking-wider mb-2">
              Thiết Kế Dành Cho Bạn
            </h2>
            <p className="text-gray-600">
              {getToken() 
                ? 'Các thiết kế được gợi ý dựa trên sở thích của bạn'
                : 'Các thiết kế đang được yêu thích'}
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
              href="#design-gallery"
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
            {designs.map((design) => (
              <div
                key={design.DESIGN_ID || design.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / ITEMS_PER_VIEW}% - 12px)` }}
              >
                <a
                  href={`#design-detail?id=${design.DESIGN_ID || design.id}`}
                  className="block group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <ImageWithFallback
                      src={design.preview_url || design.assets?.[0]?.file_url || design.image}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-sm font-medium px-4 py-2 bg-[#ca6946] rounded-full shadow-lg">
                        Xem chi tiết
                      </span>
                    </div>
                    {/* Stats */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                      <h3 className="font-semibold text-sm mb-1 truncate">{design.title}</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {design.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {design.downloads || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
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

