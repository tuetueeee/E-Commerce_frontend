import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { Footer } from './Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, Share2, ChevronRight, Leaf, ShoppingCart, Star, TrendingUp, Info, Palette } from 'lucide-react';
import { apiServices, apiFetch, API_ENDPOINTS } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { StarRatingInput } from './ui/star-rating';

interface Design {
  id: string;
  name: string;
  description?: string;
  image?: string;
  creator?: string;
  downloads?: number;
  likes?: number;
  status?: string;
}

const mockDesign = {
  id: 1,
  title: "Minimalist Nature",
  artist: "Green Artist",
  artistAvatar: "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0JTIwcHJpbnR8ZW58MXx8fHwxNzYzODU1Mzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  description: "A beautiful minimalist design celebrating nature and sustainability. Perfect for eco-conscious individuals who appreciate clean, modern aesthetics.",
  category: "Nature",
  tags: ["eco", "minimal", "leaf", "nature", "green", "sustainable"],
  price: 450000,
  likes: 234,
  views: 1520,
  sales: 89,
  rating: 4.8,
  reviews: 45,
  isEco: true,
  isTrending: true,
  images: [
    "https://images.unsplash.com/photo-1655141559787-25ac8cfca72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwZGVzaWdufGVufDF8fHx8MTc2Mzg1NTM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1553474432-4202a2d5f6b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c2hpcnQlMjBtb2NrdXAlMjBkaXNwbGF5fGVufDF8fHx8MTc2Mzg1NTY3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1748712073377-5c200bf4cbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBpbGx1c3RyYXRpb24lMjBwbGFudHxlbnwxfHx8fDE3NjM4NTUzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1758708536099-9f46dc81fffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjB0b3RlJTIwYmFnfGVufDF8fHx8MTc2Mzg1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  ],
  mockups: [
    { product: "T-Shirt", image: "https://images.unsplash.com/photo-1655141559787-25ac8cfca72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwZGVzaWdufGVufDF8fHx8MTc2Mzg1NTM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { product: "Hoodie", image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHdoaXRlJTIwaG9vZGllfGVufDF8fHx8MTc2Mzg1NTM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { product: "Tote Bag", image: "https://images.unsplash.com/photo-1758708536099-9f46dc81fffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjB0b3RlJTIwYmFnfGVufDF8fHx8MTc2Mzg1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  ],
  availableProducts: [
    { id: 1, name: "Organic Cotton T-Shirt", price: 299000, image: "https://images.unsplash.com/photo-1596723524688-176682618fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFuayUyMHdoaXRlJTIwdHNoaXJ0fGVufDF8fHx8MTc2Mzg1NTM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { id: 2, name: "Eco Fleece Hoodie", price: 599000, image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFpbiUyMHdoaXRlJTIwaG9vZGllfGVufDF8fHx8MTc2Mzg1NTM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
    { id: 3, name: "Recycled Tote Bag", price: 199000, image: "https://images.unsplash.com/photo-1758708536099-9f46dc81fffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjB0b3RlJTIwYmFnfGVufDF8fHx8MTc2Mzg1NTY3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  ],
};


export function DesignDetailPage() {
  const { token } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null as any);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedDesigns, setRelatedDesigns] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadDesign();
  }, []);

  const loadDesign = async () => {
    try {
      setLoading(true);
      setError(null);
      const urlParams = new URLSearchParams(window.location.hash.replace('#design-detail?', ''));
      const designId = urlParams.get('id');
      
      if (!designId) {
        setError('Không tìm thấy ID thiết kế');
        setLoading(false);
        return;
      }

      const response = await apiServices.designs.getById(designId) as any;
      
      // Transform API response to match component expectations
      const transformedDesign = {
        id: response.DESIGN_ID || response.id,
        name: response.title,
        title: response.title,
        description: response.description || '',
        image: response.preview_url,
        // Create images array from assets or use preview_url
        images: response.assets && response.assets.length > 0
          ? response.assets.map((asset: any) => asset.file_url)
          : response.preview_url
            ? [response.preview_url]
            : [],
        category: response.design_tag || 'Uncategorized',
        tags: response.design_tag ? response.design_tag.split(',').map((t: string) => t.trim()) : [],
        price: response.price !== null && response.price !== undefined 
          ? (typeof response.price === 'number' ? response.price : parseFloat(String(response.price)))
          : null,
        likes: response.likes || 0,
        views: response.downloads || 0,
        sales: 0, // Not available in API
        rating: 4.5, // Default rating
        reviews: 0, // Not available in API
        isEco: false, // Default
        isTrending: false, // Default
        artist: 'Designer', // Default
        artistAvatar: response.preview_url || 'https://placehold.co/100x100',
        mockups: response.assets && response.assets.length > 0
          ? response.assets.slice(0, 3).map((asset: any, idx: number) => ({
              product: `Product ${idx + 1}`,
              image: asset.file_url,
            }))
          : [],
        availableProducts: [], // Should be loaded separately
      };
      
      setDesign(transformedDesign);
      
      // Load a default product from the same category as the design for reviews
      if (response.categoryId || response.category?.id) {
        try {
          const categoryId = response.categoryId || response.category?.id;
          const productsResponse = await apiServices.products.getAll(1, 1, { categoryId }) as any;
          if (productsResponse.products && productsResponse.products.length > 0) {
            const firstProduct = productsResponse.products[0];
            setSelectedProduct(firstProduct);
            // Load reviews for the selected product
            if (firstProduct && firstProduct.id) {
              loadReviews(firstProduct.id);
            }
          } else {
            // If no product in category, try to load any product as fallback
            try {
              const fallbackResponse = await apiServices.products.getAll(1, 1) as any;
              if (fallbackResponse.products && fallbackResponse.products.length > 0) {
                const fallbackProduct = fallbackResponse.products[0];
                setSelectedProduct(fallbackProduct);
                if (fallbackProduct && fallbackProduct.id) {
                  loadReviews(fallbackProduct.id);
                }
              }
            } catch (fallbackErr) {
              console.error('Failed to load fallback product for reviews:', fallbackErr);
            }
          }
        } catch (err) {
          console.error('Failed to load default product for reviews:', err);
          // Try to load any product as fallback
          try {
            const fallbackResponse = await apiServices.products.getAll(1, 1) as any;
            if (fallbackResponse.products && fallbackResponse.products.length > 0) {
              const fallbackProduct = fallbackResponse.products[0];
              setSelectedProduct(fallbackProduct);
              if (fallbackProduct && fallbackProduct.id) {
                loadReviews(fallbackProduct.id);
              }
            }
          } catch (fallbackErr) {
            console.error('Failed to load fallback product for reviews:', fallbackErr);
          }
        }
      } else {
        // If design has no category, try to load any product as fallback
        try {
          const fallbackResponse = await apiServices.products.getAll(1, 1) as any;
          if (fallbackResponse.products && fallbackResponse.products.length > 0) {
            const fallbackProduct = fallbackResponse.products[0];
            setSelectedProduct(fallbackProduct);
            if (fallbackProduct && fallbackProduct.id) {
              loadReviews(fallbackProduct.id);
            }
          }
        } catch (fallbackErr) {
          console.error('Failed to load fallback product for reviews:', fallbackErr);
        }
      }

      // Load related designs and favorite status
      loadRelatedDesigns(designId);
      if (token) {
        checkFavoriteStatus(transformedDesign.id, token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thiết kế');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (designId: string, userToken: string) => {
    try {
      const response = await apiServices.favorites.getAll(userToken) as any;
      console.log('Favorites response:', response);
      // Response có thể là array hoặc object với property favorites
      const favorites = Array.isArray(response) ? response : (response.favorites || []);
      console.log('All favorites:', favorites);
      console.log('Looking for designId:', designId);
      const favorite = favorites.find((f: any) => {
        const fDesignId = f.designId || f.DESIGN_ID || f.design?.DESIGN_ID || f.design?.id;
        console.log('Comparing:', fDesignId, 'with', designId);
        return fDesignId === designId;
      });
      console.log('Found favorite:', favorite);
      if (favorite) {
        setIsLiked(true);
        setFavoriteId(favorite.id || favorite.FAVORITE_ID);
        console.log('Set isLiked to true, favoriteId:', favorite.id || favorite.FAVORITE_ID);
      } else {
        console.log('No favorite found for designId:', designId);
      }
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  };

  const loadReviews = async (productId: string) => {
    try {
      setLoadingReviews(true);
      const response = await apiServices.reviews.getByProduct(productId) as any;
      setReviews(response.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadRelatedDesigns = async (currentDesignId: string) => {
    try {
      setLoadingRelated(true);
      const response = await apiServices.designs.getAll(1, 4) as any;
      // Filter out current design and transform data
      const filtered = (response.designs || [])
        .filter((d: any) => d.DESIGN_ID !== currentDesignId)
        .map((d: any) => ({
          id: d.DESIGN_ID,
          title: d.title,
          name: d.title,
          image: d.preview_url,
          thumbnail: d.preview_url,
          artist: 'Designer',
          creator: 'Designer',
          price: 0,
        }))
        .slice(0, 3);
      setRelatedDesigns(filtered);
    } catch (err) {
      console.error('Failed to load related designs:', err);
      setRelatedDesigns([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      window.location.hash = '#login';
      return;
    }
    if (!design || !design.id) {
      alert('Thiết kế không tồn tại');
      return;
    }
    try {
      if (isLiked && favoriteId) {
        console.log('Removing favorite:', favoriteId);
        await apiServices.favorites.remove(favoriteId, token);
        setIsLiked(false);
        setFavoriteId(null);
      } else if (!isLiked) {
        console.log('Adding favorite for design:', design.id);
        try {
          const response = await apiServices.favorites.add({ designId: design.id }, token) as any;
          console.log('Favorite response:', response);
          setIsLiked(true);
          if (response) {
            setFavoriteId(response.id || response.FAVORITE_ID || response[0]?.id || response[0]?.FAVORITE_ID);
          }
        } catch (addErr: any) {
          // Nếu lỗi 409 (Already in favorites), reload favorites để lấy favoriteId
          if (addErr?.response?.status === 409 || addErr?.message?.includes('Already in favorites')) {
            console.log('Already in favorites, reloading...');
            await checkFavoriteStatus(design.id, token);
            // Không hiển thị lỗi vì đây là trạng thái hợp lệ
          } else {
            throw addErr; // Re-throw nếu không phải lỗi 409
          }
        }
      }
    } catch (err: any) {
      console.error('Favorite error:', err);
      const errorMessage = err?.message || err?.response?.data?.message || 'Không thể cập nhật yêu thích';
      // Chỉ hiển thị lỗi nếu không phải lỗi "Already in favorites"
      if (!errorMessage.includes('Already in favorites')) {
        alert(errorMessage);
        setError(errorMessage);
      }
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#design-detail?id=${design?.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: design?.title || 'Thiết kế',
          text: design?.description || '',
          url: url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        alert('Đã sao chép link vào clipboard!');
      }
    } catch (err) {
      // User cancelled or error
      if (err instanceof Error && err.name !== 'AbortError') {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          alert('Đã sao chép link vào clipboard!');
        }).catch(() => {
          alert('Không thể chia sẻ. Link: ' + url);
        });
      }
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      window.location.hash = '#login';
      return;
    }
    if (!design) {
      alert('Thiết kế không tồn tại');
      return;
    }
    // Yêu cầu user chọn sản phẩm trước
    if (!selectedProduct || !selectedProduct.id) {
      alert('Vui lòng chọn sản phẩm trước khi thêm vào giỏ hàng. Hiện tại chưa có sản phẩm nào được chọn.');
      return;
    }
    try {
      setAddingToCart(true);
      // API chỉ cần productId và quantity
      const cartItem = {
        productId: selectedProduct.id,
        quantity: quantity,
      };
      console.log('Adding to cart:', cartItem);
      await apiServices.cart.addItem(cartItem, token);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công!`);
    } catch (err: any) {
      console.error('Add to cart error:', err);
      let errorMessage = 'Không thể thêm vào giỏ hàng';
      
      // Xử lý các loại lỗi khác nhau
      if (err?.response?.status === 404) {
        errorMessage = 'Sản phẩm không tồn tại hoặc đã bị xóa';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Dữ liệu không hợp lệ';
      } else if (err?.response?.status === 500) {
        errorMessage = err?.response?.data?.message || 'Lỗi server. Vui lòng thử lại sau.';
        console.error('Server error details:', err?.response?.data);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <ErrorDisplay message={error} onRetry={loadDesign} />
        </div>
        <Footer />
      </div>
    );
  }

  if (loading || !design) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Đang tải chi tiết thiết kế..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <a href="#home" className="hover:text-black">Trang chủ</a>
              <ChevronRight className="w-4 h-4" />
              <a href="#designs" className="hover:text-black">Thiết kế</a>
              {design.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <a href="#designs" className="hover:text-black">{design.category}</a>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">{design.title}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              {design.images && design.images.length > 0 && (
                <>
                  <div className="mb-4 aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={design.images[selectedImage] || design.images[0]}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnails */}
                  {design.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {design.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-[#ca6946]' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                          <ImageWithFallback src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Column - Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {design.isEco && (
                  <div className="bg-[#BCF181] px-3 py-1 rounded-full flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-green-800" />
                    <span className="text-green-800">Chủ đề Xanh</span>
                  </div>
                )}
                {design.isTrending && (
                  <div className="bg-[#ca6946] px-3 py-1 rounded-full flex items-center gap-1 text-white">
                    <TrendingUp className="w-4 h-4" />
                    <span>Đang thịnh hành</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="font-['Lora'] mb-2">{design.title}</h1>

              {/* Artist */}
              <div className="flex items-center gap-3 mb-4">
                <ImageWithFallback src={design.artistAvatar} alt={design.artist} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium">bởi {design.artist}</p>
                  <button className="text-sm text-[#ca6946] hover:underline">Xem hồ sơ</button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(design.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{design.rating} ({design.reviews})</span>
                </div>
                <span className="text-sm text-gray-600">{design.sales} đã bán</span>
                <span className="text-sm text-gray-600">{design.likes} lượt thích</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{design.description}</p>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-['Lato'] mb-2">Thẻ</h3>
                  <div className="flex flex-wrap gap-2">
                    {design.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info */}
              {selectedProduct && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-['Lato'] mb-3">Sản phẩm này bao gồm:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">{selectedProduct.name}</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✓ Cotton hữu cơ cao cấp</li>
                      <li>✓ In thân thiện môi trường chuyên nghiệp</li>
                      <li>✓ Bao gồm tác phẩm thiết kế sẵn</li>
                      <li>✓ Sẵn sàng để mặc</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Size & Color */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-['Lato'] mb-2">Kích thước</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block font-['Lato'] mb-2">Màu</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">Trắng</SelectItem>
                        <SelectItem value="black">Đen</SelectItem>
                        <SelectItem value="gray">Xám</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !selectedProduct}
                  className="flex-1 bg-[#ca6946] hover:bg-[#b55835] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                {selectedProduct && (
                  <a
                    href={`#customizer?id=${selectedProduct.id}${design?.id ? `&designId=${design.id}` : ''}`}
                    className="flex-1 bg-white border-2 border-[#ca6946] text-[#ca6946] hover:bg-[#ca6946] hover:text-white py-4 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <Palette className="w-5 h-5" />
                    BẮT ĐẦU THIẾT KẾ
                  </a>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-['Lato'] mb-2">Số lượng</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-20 text-center border-2 border-gray-300 rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-500 mb-1">Tổng giá (Sản phẩm + Thiết kế)</p>
                <p className="text-3xl font-bold">
                  {(() => {
                    const designPrice = design.price !== null && design.price !== undefined && Number(design.price) > 0 
                      ? Number(design.price) 
                      : 0;
                    const productPrice = selectedProduct?.price ? Number(selectedProduct.price) : 0;
                    const totalPrice = (designPrice + productPrice) * quantity;
                    return totalPrice > 0 
                      ? `${totalPrice.toLocaleString('vi-VN')}₫`
                      : 'Liên hệ';
                  })()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Bao gồm tác phẩm thiết kế & in cao cấp
                </p>
              </div>

              {/* Favorite & Share Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-14 h-14 border-2 rounded-full flex items-center justify-center transition-all ${isLiked
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Chia sẻ"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Info Message */}
              <div className="bg-[#BCF181]/20 border border-[#BCF181] rounded-lg p-4 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">Sản phẩm Xanh sẵn có</p>
                  <p className="text-green-800">Đây là sản phẩm hoàn chỉnh với tác phẩm thiết kế sẵn. Muốn tạo của riêng bạn? Ghé thăm <a href="#blanks" className="underline font-medium">phần Áo</a> của chúng tôi để tùy chỉnh từ đầu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Product Views */}
          {design.mockups && design.mockups.length > 0 && (
            <div className="mb-16">
              <h2 className="font-['Lato'] uppercase tracking-wider mb-6">Thêm góc nhìn sản phẩm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {design.mockups.map((mockup, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden group cursor-pointer">
                    <ImageWithFallback
                      src={mockup.image}
                      alt={`${design.title} - View ${idx + 1}`}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <p className="font-medium">{design.title}</p>
                      <p className="text-sm text-gray-600">{mockup.product} - {selectedColor} color</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 mt-6 text-sm">
                * Tất cả hình ảnh hiển thị cùng một thiết kế sẵn có ở các góc và ánh sáng khác nhau
              </p>
            </div>
          )}

          {/* Tabs Section - Reviews */}
          <Tabs defaultValue="reviews" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ca6946] px-6 py-3">
                Đánh giá ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-4xl">
                {/* Write Review Form */}
                {token && selectedProduct && selectedProduct.id ? (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const rating = (e.target as any).rating?.value;
                      const comment = (e.target as any).comment?.value;
                      
                      if (!rating || !comment) {
                        alert('Vui lòng điền đầy đủ thông tin');
                        return;
                      }

                      try {
                        await apiServices.reviews.create({
                          productId: selectedProduct.id,
                          rating: parseInt(rating),
                          comment
                        }, token);
                        alert('Cảm ơn bạn! Đánh giá của bạn đã được gửi.');
                        (e.target as any).reset();
                        if (selectedProduct.id) loadReviews(selectedProduct.id);
                      } catch (err) {
                        alert('Không thể gửi đánh giá');
                      }
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-3">Đánh giá</label>
                          <StarRatingInput 
                            name="rating" 
                            required 
                            defaultValue={0}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Bình luận</label>
                          <textarea
                            name="comment"
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#ca6946]"
                            required
                          />
                        </div>
                        <button type="submit" className="bg-[#ca6946] text-white px-6 py-2 rounded-lg hover:bg-[#b55835] transition-colors">
                          Gửi đánh giá
                        </button>
                      </div>
                    </form>
                  </div>
                ) : !token ? (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 text-center">
                    <p className="text-gray-600 mb-4">Vui lòng đăng nhập để viết đánh giá</p>
                    <a href="#login" className="text-[#ca6946] hover:underline font-medium">Đăng nhập</a>
                  </div>
                ) : !selectedProduct ? (
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 text-center">
                    <p className="text-gray-600">Vui lòng chọn sản phẩm để viết đánh giá</p>
                  </div>
                ) : null}

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <Loading text="Đang tải đánh giá..." />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{review.author || review.user?.name || 'Người dùng'}</h4>
                              {review.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < (review.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Designs */}
          <div>
            <h2 className="font-['Lato'] uppercase tracking-wider mb-6">Bạn cũng có thể thích</h2>
            {loadingRelated ? (
              <div className="text-center py-8">
                <Loading text="Đang tải thiết kế liên quan..." />
              </div>
            ) : relatedDesigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Không tìm thấy thiết kế liên quan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDesigns.map((relatedDesign) => (
                  <a
                    key={relatedDesign.id}
                    href={`#design-detail?id=${relatedDesign.id}`}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={relatedDesign.image || relatedDesign.thumbnail || 'https://placehold.co/400x400'}
                        alt={relatedDesign.name || relatedDesign.title || 'Design'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-['Lato'] mb-1">{relatedDesign.name || relatedDesign.title || 'Design'}</h3>
                    <p className="text-sm text-gray-600 mb-1">by {relatedDesign.creator || relatedDesign.artist || 'Artist'}</p>
                    <p className="font-medium">{(relatedDesign.price || 0).toLocaleString('vi-VN')}₫</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}