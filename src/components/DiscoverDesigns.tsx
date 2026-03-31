import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { DesignGrid } from './shared/DesignGrid';

type FilterType = 'all' | 'trending' | 'newest' | 'popular';

export function DiscoverDesigns() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const loadDesigns = async (filter: FilterType) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = { limit: 6 };
      
      // Set sortBy based on filter
      switch (filter) {
        case 'trending':
          params.sortBy = 'likes';
          params.sortOrder = 'DESC';
          break;
        case 'newest':
          params.sortBy = 'createdAt';
          params.sortOrder = 'DESC';
          break;
        case 'popular':
          params.sortBy = 'downloads';
          params.sortOrder = 'DESC';
          break;
        case 'all':
        default:
          // No specific sort, use default
          break;
      }
      
      const response = await apiServices.designs.getAll(1, 6, params);
      setDesigns(response.designs || response || []);
    } catch (err) {
      console.error('Failed to load designs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load designs');
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns(activeFilter);
  }, [activeFilter]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  if (loading && designs.length === 0) {
    return null; // Show nothing while loading initial data
  }

  if (error) {
    console.error('Failed to load designs:', error);
    return null; // Silently fail for featured section
  }

  if (designs.length === 0) {
    return null;
  }

  return (
    <section id="designs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-['Lato'] uppercase tracking-wider mb-3">
            Discover Unique Designs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá hàng trăm thiết kế độc đáo từ cộng đồng nghệ sĩ tài năng. 
            Chọn thiết kế yêu thích và tùy chỉnh trên áo bền vững của bạn.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => handleFilterClick('all')}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer font-medium ${
              activeFilter === 'all'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => handleFilterClick('trending')}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer font-medium ${
              activeFilter === 'trending'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            Trending
          </button>
          <button 
            onClick={() => handleFilterClick('newest')}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer font-medium ${
              activeFilter === 'newest'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            Mới nhất
          </button>
          <button 
            onClick={() => handleFilterClick('popular')}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer font-medium ${
              activeFilter === 'popular'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            Phổ biến
          </button>
        </div>

        {/* Designs Grid */}
        <div className="mb-8">
          <DesignGrid 
            designs={designs}
            loading={loading}
            error={error}
            columns={3}
            showStats={true}
            onRetry={() => loadDesigns(activeFilter)}
            emptyMessage="No designs available"
          />
        </div>

        {/* Load More */}
        <div className="text-center">
          <a
            href="#designs"
            className="inline-block border-2 border-black hover:bg-black hover:text-white px-8 py-3 rounded-full transition-all font-medium cursor-pointer"
          >
            Khám phá tất cả thiết kế ({designs.length + 120})
          </a>
        </div>
      </div>
    </section>
  );
}
