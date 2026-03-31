import { Header } from './Header';
import { Footer } from './Footer';
import { Search, Package, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiServices } from '../services/apiConfig';
import { ProductGrid } from './shared/ProductGrid';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Eye } from 'lucide-react';

export function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'blanks' | 'designs'>('all');
  
  // Blanks state
  const [blanks, setBlanks] = useState<any[]>([]);
  const [blanksLoading, setBlanksLoading] = useState(false);
  const [blanksError, setBlanksError] = useState<string | null>(null);
  const [blanksTotal, setBlanksTotal] = useState(0);
  
  // Designs state
  const [designs, setDesigns] = useState<any[]>([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [designsError, setDesignsError] = useState<string | null>(null);
  const [designsTotal, setDesignsTotal] = useState(0);

  // Read search query from URL
  useEffect(() => {
    const readSearchFromURL = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.split('?')[1] || '');
      const search = urlParams.get('search') || '';
      setSearchQuery(search);
    };
    
    readSearchFromURL();
    window.addEventListener('hashchange', readSearchFromURL);
    return () => window.removeEventListener('hashchange', readSearchFromURL);
  }, []);

  // Load search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setBlanks([]);
      setDesigns([]);
      return;
    }

    const loadSearchResults = async () => {
      // Load blanks
      if (activeTab === 'all' || activeTab === 'blanks') {
        setBlanksLoading(true);
        setBlanksError(null);
        try {
          const response = await apiServices.products.getBlanks(1, 20, { search: searchQuery.trim() });
          setBlanks(response.products || []);
          setBlanksTotal(response.total || 0);
        } catch (err) {
          setBlanksError(err instanceof Error ? err.message : 'Không thể tải áo');
        } finally {
          setBlanksLoading(false);
        }
      }

      // Load designs
      if (activeTab === 'all' || activeTab === 'designs') {
        setDesignsLoading(true);
        setDesignsError(null);
        try {
          const response = await apiServices.designs.getAll(1, 20, { search: searchQuery.trim() });
          const designsList = Array.isArray(response.designs) ? response.designs : (Array.isArray(response) ? response : []);
          setDesigns(designsList);
          setDesignsTotal(response.total || designsList.length);
        } catch (err) {
          setDesignsError(err instanceof Error ? err.message : 'Không thể tải thiết kế');
        } finally {
          setDesignsLoading(false);
        }
      }
    };

    loadSearchResults();
  }, [searchQuery, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      window.location.hash = `#search?search=${encodeURIComponent(input.value.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="#home" className="hover:text-black">Trang chủ</a>
              <span>/</span>
              <span className="text-black">
                {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tìm kiếm'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm áo, thiết kế độc đáo..."
                defaultValue={searchQuery}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-[#BCF181] transition-colors"
              />
            </form>
          </div>

          {!searchQuery ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nhập từ khóa để tìm kiếm</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'blanks' | 'designs')} className="mb-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                  <TabsTrigger value="all">
                    Tất cả ({blanksTotal + designsTotal})
                  </TabsTrigger>
                  <TabsTrigger value="blanks">
                    <Package className="w-4 h-4 mr-2" />
                    Áo ({blanksTotal})
                  </TabsTrigger>
                  <TabsTrigger value="designs">
                    <Palette className="w-4 h-4 mr-2" />
                    Thiết kế ({designsTotal})
                  </TabsTrigger>
                </TabsList>

                {/* All Results */}
                <TabsContent value="all" className="mt-8">
                  {/* Blanks Section */}
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                      <Package className="w-5 h-5 text-[#ca6946]" />
                      <h2 className="text-2xl font-['Lato']">Phôi Áo ({blanksTotal})</h2>
                    </div>
                    {blanksLoading ? (
                      <Loading text="Đang tải áo..." />
                    ) : blanksError ? (
                      <ErrorDisplay message={blanksError} />
                    ) : blanks.length > 0 ? (
                      <ProductGrid
                        products={blanks}
                        loading={false}
                        viewMode="grid"
                        showEcoBadges={true}
                        showCustomizeButton={true}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Không tìm thấy áo nào</p>
                      </div>
                    )}
                  </div>

                  {/* Designs Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Palette className="w-5 h-5 text-[#ca6946]" />
                      <h2 className="text-2xl font-['Lato']">Thiết Kế ({designsTotal})</h2>
                    </div>
                    {designsLoading ? (
                      <Loading text="Đang tải thiết kế..." />
                    ) : designsError ? (
                      <ErrorDisplay message={designsError} />
                    ) : designs.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {designs.map((design) => (
                          <a
                            key={design.DESIGN_ID || design.id}
                            href={`#design-detail?id=${design.DESIGN_ID || design.id}`}
                            className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                          >
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                              <ImageWithFallback
                                src={design.preview_url || design.image || design.assets?.[0]?.file_url}
                                alt={design.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white text-sm font-medium px-4 py-2 bg-[#ca6946] rounded-full shadow-lg">
                                  Xem chi tiết
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-sm mb-2 truncate">{design.title}</h3>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
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
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Palette className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Không tìm thấy thiết kế nào</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Blanks Only */}
                <TabsContent value="blanks" className="mt-8">
                  {blanksLoading ? (
                    <Loading text="Đang tải phôi áo..." />
                  ) : blanksError ? (
                    <ErrorDisplay message={blanksError} />
                  ) : blanks.length > 0 ? (
                    <ProductGrid
                      products={blanks}
                      loading={false}
                      viewMode="grid"
                      showEcoBadges={true}
                      showCustomizeButton={true}
                    />
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Không tìm thấy phôi áo nào</p>
                      <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  )}
                </TabsContent>

                {/* Designs Only */}
                <TabsContent value="designs" className="mt-8">
                  {designsLoading ? (
                    <Loading text="Đang tải thiết kế..." />
                  ) : designsError ? (
                    <ErrorDisplay message={designsError} />
                  ) : designs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {designs.map((design) => (
                        <a
                          key={design.DESIGN_ID || design.id}
                          href={`#design-detail?id=${design.DESIGN_ID || design.id}`}
                          className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                        >
                          <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={design.preview_url || design.image || design.assets?.[0]?.file_url}
                              alt={design.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="text-white text-sm font-medium px-4 py-2 bg-[#ca6946] rounded-full shadow-lg">
                                Xem chi tiết
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-sm mb-2 truncate">{design.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
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
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <Palette className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">Không tìm thấy thiết kế nào</p>
                      <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

