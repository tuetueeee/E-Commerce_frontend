import { Header } from './Header';
import { Footer } from './Footer';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Search, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { ProductGrid } from './shared/ProductGrid';
import { Pagination } from './shared/Pagination';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';

export function BlanksListingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Read search query from URL
  useEffect(() => {
    const readSearchFromURL = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.split('?')[1] || '');
      const search = urlParams.get('search') || '';
      setSearchQuery(search);
      setCurrentPage(1); // Reset to first page when search changes
    };
    
    readSearchFromURL();
    // Listen for hash changes
    window.addEventListener('hashchange', readSearchFromURL);
    return () => window.removeEventListener('hashchange', readSearchFromURL);
  }, []);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await apiServices.categories.getAll();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Map sortBy to API format
        const sortMapping: Record<string, { sortBy: string; sortOrder: string }> = {
          'newest': { sortBy: 'createdAt', sortOrder: 'DESC' },
          'popular': { sortBy: 'rating', sortOrder: 'DESC' },
          'price-low': { sortBy: 'price', sortOrder: 'ASC' },
          'price-high': { sortBy: 'price', sortOrder: 'DESC' },
        };
        
        const sortConfig = sortMapping[sortBy] || sortMapping['newest'];
        
        // Use getBlanks endpoint with filters
        const params: any = {
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder,
        };
        
        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }
        
        if (priceRange[0] > 0) {
          params.minPrice = priceRange[0];
        }
        
        if (priceRange[1] < 1000000) {
          params.maxPrice = priceRange[1];
        }
        
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        
        const response = await apiServices.products.getBlanks(currentPage, 12, params);
        
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [currentPage, selectedCategory, sortBy, priceRange, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="#home" className="hover:text-black">
                Trang chủ
              </a>
              <span>/</span>
              <span className="text-black">
                {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Cửa hàng Áo Bền vững'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {searchQuery && (
            <div className="mb-6 p-4 bg-[#BCF181]/10 border border-[#BCF181] rounded-lg">
              <p className="text-sm text-gray-700">
                Đang hiển thị kết quả tìm kiếm cho: <span className="font-semibold">"{searchQuery}"</span>
              </p>
            </div>
          )}
          <div className="flex gap-8">
            {/* Sidebar - Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Lato'] uppercase">Bộ lọc</h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([0, 1000000]);
                      setCurrentPage(1);
                    }}
                    className="text-[#ca6946] hover:underline text-sm"
                  >
                    Xóa tất cả
                  </button>
                </div>

                {/* Category */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-['Lato'] mb-3">Danh mục</h4>
                  <div className="space-y-2">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 cursor-pointer hover:text-[#ca6946]"
                        >
                          <Checkbox
                            checked={selectedCategory === cat.id}
                            onCheckedChange={(checked) => {
                              setSelectedCategory(checked ? cat.id : null);
                              setCurrentPage(1); // Reset to first page when filter changes
                            }}
                          />
                          <span>{cat.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Đang tải danh mục...</p>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-['Lato'] mb-4">Giá</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value);
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    min={0}
                    max={1000000}
                    step={50000}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-4">
                    <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile Filters */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Bộ lọc
                  </button>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                </select>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={products}
                loading={loading}
                error={error}
                viewMode={viewMode}
                showEcoBadges={true}
                showCustomizeButton={true}
                onRetry={() => {
                  setCurrentPage(1);
                  // Reload will be triggered by useEffect
                }}
                emptyMessage="Không tìm thấy sản phẩm nào"
              />

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  maxVisiblePages={5}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
