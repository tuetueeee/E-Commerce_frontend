import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { Footer } from './Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Leaf, Recycle, Shield, Award, Star, Truck, RotateCcw, Info, Palette, ChevronRight, Heart, AlertCircle, ShoppingCart, Share2 } from 'lucide-react';
import { apiServices, apiFetch, API_ENDPOINTS } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { StarRatingInput } from './ui/star-rating';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  image?: string;
  images?: any[] | Record<string, any>;
  materials?: string[];
  category?: string | { id: string; name: string };
  care_instructions?: string;
  certifications?: any[];
  design_areas?: any[];
  skuVariants?: any[];
  reviews?: any[];
}

const mockProduct = {
  id: 1,
  name: "Áo Phông Organic Cotton Unisex",
  category: "Áo Phông",
  price: 299000,
  rating: 4.8,
  reviews: 124,
  description: "Áo phông cổ tròn basic từ cotton hữu cơ 100%, được chứng nhận GOTS. Thiết kế tối giản, phù hợp cho mọi phong cách. Vải mềm mại, thoáng khí và thân thiện với làn da.",
  images: [
    { url: "https://images.unsplash.com/photo-1596723524688-176682618fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFuayUyMHdoaXRlJTIwdHNoaXJ0fGVufDF8fHx8MTc2Mzg1NTM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", color: "white" },
    { url: "https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwdHNoaXJ0fGVufDF8fHx8MTc2Mzg1NTM4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", color: "black" },
    { url: "https://images.unsplash.com/photo-1586940069830-04cdba740ba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwaGFuZ2VyfGVufDF8fHx8MTc2Mzg1NTY3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", color: "gray" },
    { url: "https://images.unsplash.com/photo-1750343293522-2f08b60a317a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGNsb3RoaW5nJTIwc2hvcHxlbnwxfHx8fDE3NjM4NTU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", color: "blue" },
  ],
  certifications: [
    { icon: "https://images.unsplash.com/photo-1603873945428-67b1c22e6450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY290dG9uJTIwZmFicmljfGVufDF8fHx8MTc2Mzc5NjMzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", name: "GOTS Certified" },
    { icon: "https://images.unsplash.com/photo-1668506904013-810e73073cfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGRyb3BsZXQlMjBuYXR1cmV8ZW58MXx8fHwxNzYzNzc2NzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", name: "OEKO-TEX" },
    { icon: "https://images.unsplash.com/photo-1642402806417-e451280d845b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBzdXN0YWluYWJpbGl0eXxlbnwxfHx8fDE3NjM4MDMwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", name: "Fair Trade" },
  ],
  greenBadges: [
    { icon: Leaf, label: "100% Organic Cotton", tooltip: "Cotton hữu cơ được trồng không sử dụng thuốc trừ sâu hóa học" },
    { icon: Recycle, label: "Eco-Friendly Inks", tooltip: "Mực in water-based không độc hại, phân hủy sinh học" },
    { icon: Shield, label: "GOTS Certified", tooltip: "Chứng nhận tiêu chuẩn dệt may hữu cơ toàn cầu" },
    { icon: Award, label: "Fair Trade", tooltip: "Sản xuất công bằng, đảm bảo quyền lợi người lao động" },
  ],
  colors: [
    { name: "White", hex: "#FFFFFF", available: true },
    { name: "Black", hex: "#000000", available: true },
    { name: "Gray", hex: "#6B7280", available: true },
    { name: "Blue", hex: "#3B82F6", available: true },
    { name: "Green", hex: "#10B981", available: false },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  material: "100% Organic Cotton",
  weight: "180 GSM",
  fit: "Regular Fit",
  inkType: "Water-based Eco Inks",
};


export function BlankDetailPage() {
  const { getToken } = useAuth();
  const token = getToken();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null as any);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarBlanks, setSimilarBlanks] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingReviewStats, setLoadingReviewStats] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get product ID from URL hash
      const urlParams = new URLSearchParams(window.location.hash.replace('#blank-detail?', ''));
      const productId = urlParams.get('id');
      
      if (!productId) {
        setError('Product ID not found. Please select a product from the list.');
        setLoading(false);
        return;
      }

      const response = await apiServices.products.getById(productId) as any;
      setProduct(response);
      if (response.skuVariants && response.skuVariants.length > 0) {
        setSelectedSize(response.skuVariants[0]?.size || 'M');
      }

      // Load similar products using AI, reviews, review stats, and favorite status
      loadSimilarProducts(productId);
      loadReviews(productId);
      loadReviewStats(productId);
      if (token) {
        checkFavoriteStatus(productId, token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (productId: string, userToken: string) => {
    try {
      const response = await apiServices.favorites.check(productId, undefined, userToken) as any;
      setIsLiked(response.isFavorited);
      // If favorited, we need to get the favoriteId from getAll if needed
      if (response.isFavorited) {
        const allFavorites = await apiServices.favorites.getAll(userToken) as any;
        const favoritesList = Array.isArray(allFavorites) ? allFavorites : [];
        const favorite = favoritesList.find((f: any) => {
        const fProductId = f.productId || f.PRODUCT_ID || f.product?.id || f.product?.PRODUCT_ID;
        return fProductId === productId;
      });
      if (favorite) {
        setFavoriteId(favorite.id || favorite.FAVORITE_ID);
        }
      }
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  };

  const loadSimilarProducts = async (categoryId?: string) => {
    try {
      setLoadingSimilar(true);
      const params: Record<string, any> = { limit: 4 };
      if (categoryId) {
        params.category = categoryId;
      }
      const response = await apiServices.products.getAll(1, 4, params) as any;
      setSimilarBlanks(response.products || []);
    } catch (err) {
      console.error('Failed to load similar products:', err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const loadReviews = async (productId: string) => {
    try {
      setLoadingReviews(true);
      const response = await apiFetch(
        `${API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(productId)}`,
        undefined,
        undefined
      ) as any;
      setReviews(response.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadReviewStats = async (productId: string) => {
    try {
      setLoadingReviewStats(true);
      const stats = await apiServices.reviews.getProductStats(productId) as any;
      setReviewStats(stats);
    } catch (err) {
      console.error('Failed to load review stats:', err);
      setReviewStats(null);
    } finally {
      setLoadingReviewStats(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      if (!token) {
        window.location.hash = '#login';
        return;
      }
      if (!product || !product.id) {
        alert('Sản phẩm không tồn tại');
        return;
      }

      const cartItem = {
        productId: product.id,
        quantity: quantity,
      };
      console.log('Adding to cart:', cartItem);
      await apiServices.cart.addItem(cartItem, token);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng thành công!`);
    } catch (err: any) {
      console.error('Add to cart error:', err);
      const errorMessage = err?.message || err?.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      window.location.hash = '#login';
      return;
    }
    if (!product || !product.id) {
      alert('Sản phẩm không tồn tại');
      return;
    }
    try {
      if (isLiked && favoriteId) {
        console.log('Removing favorite:', favoriteId);
        await apiServices.favorites.remove(favoriteId, token);
        setIsLiked(false);
        setFavoriteId(null);
      } else if (!isLiked) {
        console.log('Adding favorite for product:', product.id);
        try {
          const response = await apiServices.favorites.add({ productId: product.id }, token) as any;
          console.log('Favorite response:', response);
          setIsLiked(true);
          if (response) {
            setFavoriteId(response.id || response.FAVORITE_ID || response[0]?.id || response[0]?.FAVORITE_ID);
          }
        } catch (addErr: any) {
          // Nếu lỗi 409 (Already in favorites), reload favorites để lấy favoriteId
          if (addErr?.response?.status === 409 || addErr?.message?.includes('Already in favorites')) {
            console.log('Already in favorites, reloading...');
            await checkFavoriteStatus(product.id, token);
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
    const urlParams = new URLSearchParams(window.location.hash.replace('#blank-detail?', ''));
    const productId = urlParams.get('id');
    const url = `${window.location.origin}${window.location.pathname}#blank-detail?id=${productId}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || 'Sản phẩm',
          text: product?.description || '',
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <ErrorDisplay message={error} onRetry={loadProduct} />
        </div>
        <Footer />
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading text="Đang tải chi tiết sản phẩm..." />
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
              <a href="#blanks" className="hover:text-black">Cửa hàng</a>
              <ChevronRight className="w-4 h-4" />
              <a href="#blanks" className="hover:text-black">
                {typeof product.category === 'string' 
                  ? product.category 
                  : product.category?.name || 'Category'}
              </a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-black">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Media Gallery */}
            <div>
              {/* Main Image */}
              <div className="mb-4 aspect-square rounded-xl overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image || (Array.isArray(product.images) && product.images[selectedImage]?.url) || "https://images.unsplash.com/photo-1596723524688-176682618fd2?w=400"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails - Only show if product has images array */}
              {Array.isArray(product.images) && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {product.images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-[#ca6946]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <ImageWithFallback src={img.url || img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) || null}

              {/* Green Certifications - Only show if product has certifications */}
              {product.certifications && Array.isArray(product.certifications) && product.certifications.length > 0 && (
                <div className="bg-[#BCF181]/10 rounded-xl p-6">
                  <h3 className="font-['Lato'] mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-700" />
                    Chứng nhận Xanh
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {product.certifications.map((cert: any, idx: number) => (
                      <div key={idx} className="text-center">
                        <ImageWithFallback src={cert.icon || cert.image} alt={cert.name || 'Certification'} className="w-16 h-16 mx-auto mb-2 rounded-full object-cover" />
                        <p className="text-sm text-gray-700">{cert.name || 'Certified'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Product Name */}
              <h1 className="font-['Lato'] mb-2">{product.name}</h1>

              {/* Price */}
              <p className="mb-4">
                {(() => {
                  const priceValue = product.price !== null && product.price !== undefined 
                    ? Number(product.price) 
                    : null;
                  
                  if (priceValue !== null && priceValue > 0) {
                    return (
                      <>
                        <span className="text-gray-500">Từ</span>{' '}
                        <span className="font-bold">{priceValue.toLocaleString('vi-VN')}₫</span>
                      </>
                    );
                  } else if (product.price === null || product.price === undefined) {
                    return <span className="font-bold text-gray-600">Liên hệ</span>;
                  } else {
                    return <span className="font-bold text-green-600">Miễn phí</span>;
                  }
                })()}
              </p>

              {/* Rating - Only show if product has rating */}
              {product.rating && product.rating > 0 ? (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">
                    ({(product.reviews || product.numReviews || 0) > 0 ? (product.reviews || product.numReviews || 0) : ''} reviews)
                  </span>
                </div>
              ) : null}

              {/* Green Badges - Only show if product has greenBadges */}
              {product.greenBadges && Array.isArray(product.greenBadges) && product.greenBadges.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-['Lato'] mb-3">Đặc điểm xanh nổi bật</h3>
                  <TooltipProvider>
                    <div className="grid grid-cols-2 gap-3">
                      {product.greenBadges.map((badge: any, idx: number) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 bg-[#BCF181]/20 px-3 py-2 rounded-lg cursor-help hover:bg-[#BCF181]/30 transition-colors">
                              {badge.icon && <badge.icon className="w-4 h-4 text-green-700 flex-shrink-0" />}
                              <span className="text-sm text-green-900">{badge.label || 'Eco Friendly'}</span>
                              <Info className="w-3 h-3 text-green-700 ml-auto" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{badge.tooltip || badge.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              )}

              {/* Materials - Show if available */}
              {product.materials && Array.isArray(product.materials) && product.materials.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-['Lato'] mb-3">Vật liệu</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material: string, idx: number) => (
                      <span key={idx} className="bg-[#BCF181]/20 px-3 py-1 rounded-full text-sm text-green-900">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection - Only show if product has colors or skuVariants */}
              {(product.colors || (product.skuVariants && product.skuVariants.length > 0)) && (
                <div className="mb-6">
                  <h3 className="font-['Lato'] mb-3">
                    Màu sắc: <span className="font-normal text-gray-600">{selectedColor?.name || 'Chọn màu'}</span>
                  </h3>
                  <div className="flex gap-3">
                    {product.colors ? product.colors.map((color: any) => (
                      <button
                        key={color.name || color}
                        onClick={() => color.available !== false && setSelectedColor(color)}
                        disabled={color.available === false}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.name === color.name
                          ? 'border-[#ca6946] scale-110'
                          : 'border-gray-300'
                          } ${color.available === false ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color.hex || color }}
                        title={color.name || color}
                      />
                    )) : (
                      <p className="text-gray-500">Màu sắc có sẵn trong SKU variants</p>
                    )}
                  </div>
                </div>
              )}

              {/* Size Selection - Use skuVariants if available, otherwise use sizes */}
              {(product.sizes || (product.skuVariants && product.skuVariants.length > 0)) && (
                <div className="mb-6">
                  <h3 className="font-['Lato'] mb-3">Kích thước</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.skuVariants && product.skuVariants.length > 0 ? (
                      product.skuVariants.map((variant: any) => (
                        <button
                          key={variant.size || variant.id}
                          onClick={() => setSelectedSize(variant.size)}
                          className={`px-6 py-2 border-2 rounded-lg transition-all ${selectedSize === variant.size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                            }`}
                        >
                          {variant.size}
                        </button>
                      ))
                    ) : product.sizes ? (
                      product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-2 border-2 rounded-lg transition-all ${selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-black'
                            }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : null}
                  </div>
                </div>
              )}

              {/* Stock Info - Only show if stock > 0 */}
              {product.stock !== undefined && product.stock !== null && Number(product.stock) > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Còn <span className="font-semibold text-[#ca6946]">{Number(product.stock)}</span> sản phẩm
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-['Lato'] mb-3">Số lượng</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      const maxQuantity = product.stock && Number(product.stock) > 0 
                        ? Number(product.stock) 
                        : 999;
                      setQuantity(Math.min(maxQuantity, quantity + 1));
                    }}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#ca6946] hover:bg-[#b55835] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                <a
                  href={`#customizer?id=${product.id}`}
                  className="flex-1 bg-white border-2 border-[#ca6946] text-[#ca6946] hover:bg-[#ca6946] hover:text-white py-4 rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <Palette className="w-5 h-5" />
                  BẮT ĐẦU THIẾT KẾ
                </a>
                <button
                  onClick={handleToggleFavorite}
                  className={`w-14 h-14 border-2 rounded-full flex items-center justify-center transition-all ${isLiked
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  title="Yêu thích"
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

              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Shipping & Returns */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Miễn phí vận chuyển</h4>
                    <p className="text-sm text-gray-600">Cho đơn hàng từ 500.000₫ trở lên</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Đổi trả dễ dàng</h4>
                    <p className="text-sm text-gray-600">Trong vòng 30 ngày nếu không hài lòng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ca6946] px-6 py-3">
                Mô tả
              </TabsTrigger>
              <TabsTrigger value="green" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ca6946] px-6 py-3">
                Cam kết Xanh
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#ca6946] px-6 py-3">
                Đánh giá ({(product.reviews || product.numReviews || 0) > 0 ? (product.reviews || product.numReviews || 0) : 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="max-w-4xl">
                <h3 className="font-['Lato'] mb-4">Chi tiết sản phẩm</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Thông số kỹ thuật</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex justify-between">
                        <span>Chất liệu:</span>
                        <span className="font-medium text-black">{product.material}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Trọng lượng vải:</span>
                        <span className="font-medium text-black">{product.weight}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Form dáng:</span>
                        <span className="font-medium text-black">{product.fit}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Loại mực in:</span>
                        <span className="font-medium text-black">{product.inkType}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Hướng dẫn bảo quản</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Giặt máy ở nhiệt độ thấp (30°C)</li>
                      <li>• Không sử dụng chất tẩy</li>
                      <li>• Phơi khô tự nhiên</li>
                      <li>• Ủi ở nhiệt độ thấp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="green" className="mt-6">
              <div className="max-w-4xl">
                <h3 className="font-['Lato'] mb-4">Cam kết xanh của chúng tôi</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#BCF181] rounded-full flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-6 h-6 text-green-800" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Vật liệu hữu cơ 100%</h4>
                      <p className="text-gray-600">
                        Cotton hữu cơ được trồng không sử dụng thuốc trừ sâu hoặc phân bón hóa học.
                        Được chứng nhận GOTS (Global Organic Textile Standard), đảm bảo quy trình sản xuất
                        bền vững từ trang trại đến sản phẩm hoàn thiện.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#BCF181] rounded-full flex items-center justify-center flex-shrink-0">
                      <Recycle className="w-6 h-6 text-green-800" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mực in thân thiện môi trường</h4>
                      <p className="text-gray-600">
                        Sử dụng mực in water-based không chứa PVC và phthalates độc hại. Mực in có thể
                        phân hủy sinh học, giảm thiểu tác động đến môi trường và an toàn cho người sử dụng.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#BCF181] rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-green-800" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Sản xuất có trách nhiệm</h4>
                      <p className="text-gray-600">
                        Đối tác sản xuất của chúng tôi được chứng nhận Fair Trade, đảm bảo điều kiện làm việc
                        công bằng và an toàn cho người lao động. Chúng tôi cam kết carbon-neutral shipping
                        và sử dụng bao bì có thể tái chế 100%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-4xl">
                {/* Write Review Form */}
                {token && (
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
                        const productId = new URLSearchParams(window.location.hash.replace('#blank-detail?', '')).get('id');
                        await apiServices.reviews.create({
                          productId,
                          rating: parseInt(rating),
                          comment
                        }, token);
                        alert('Cảm ơn bạn! Đánh giá của bạn đã được gửi.');
                        (e.target as any).reset();
                        if (productId) {
                          loadReviews(productId);
                          loadReviewStats(productId);
                        }
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
                )}

                {/* Review Summary */}
                {loadingReviewStats ? (
                  <div className="text-center py-8 mb-8 pb-8 border-b">
                    <Loading text="Đang tải thống kê đánh giá..." />
                  </div>
                ) : reviewStats ? (
                <div className="flex items-start gap-8 mb-8 pb-8 border-b">
                  <div className="text-center">
                      <p className="text-4xl font-bold mb-2">
                        {reviewStats.averageRating?.toFixed(1) || product.rating || '0.0'}
                      </p>
                      <div className="flex items-center gap-1 mb-2 justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                            className={`w-5 h-5 ${i < Math.floor(reviewStats.averageRating || product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                      <p className="text-gray-600">
                        {(reviewStats.totalReviews || product.reviews || product.numReviews || 0) > 0 
                          ? (reviewStats.totalReviews || product.reviews || product.numReviews || 0) 
                          : 0} đánh giá
                      </p>
                  </div>

                  <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviewStats.ratingDistribution?.[stars] || 0;
                        const total = reviewStats.totalReviews || 1;
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        return (
                      <div key={stars} className="flex items-center gap-3 mb-2">
                        <span className="w-3">{stars}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                          />
                        </div>
                            <span className="text-sm text-gray-600 w-16 text-right">
                              {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-8 mb-8 pb-8 border-b">
                    <div className="text-center">
                      <p className="text-4xl font-bold mb-2">
                        {product.rating || '0.0'}
                      </p>
                      <div className="flex items-center gap-1 mb-2 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                    ))}
                  </div>
                      <p className="text-gray-600">
                        {(product.reviews || product.numReviews || 0) > 0 
                          ? (product.reviews || product.numReviews || 0) 
                          : 0} đánh giá
                      </p>
                </div>
                    <div className="flex-1 text-gray-500 text-sm">
                      Chưa có thống kê đánh giá
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <Loading text="Loading reviews..." />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{review.author}</h4>
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
                                    className={`w-4 h-4 ${i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
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

          {/* Similar Blanks */}
          <div className="mb-12">
            <h2 className="font-['Lato'] uppercase tracking-wider mb-6">Similar Blanks</h2>
            {loadingSimilar ? (
              <div className="text-center py-8">
                <Loading text="Loading similar products..." />
              </div>
            ) : similarBlanks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No similar products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {similarBlanks.map((blank) => (
                  <div key={blank.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={blank.image}
                        alt={blank.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-['Lato'] mb-1 line-clamp-2">{blank.name}</h3>
                    {typeof blank.category === 'string' ? (
                      <p className="text-gray-500 text-sm mb-2">{blank.category}</p>
                    ) : blank.category?.name ? (
                      <p className="text-gray-500 text-sm mb-2">{blank.category.name}</p>
                    ) : null}
                    <div className="flex items-center justify-between">
                      <p>{blank.price.toLocaleString('vi-VN')}₫</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{blank.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Designs on This Blank */}
          <div>
            <h2 className="font-['Lato'] uppercase tracking-wider mb-6">Popular Designs on This Blank</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "https://images.unsplash.com/photo-1655141559787-25ac8cfca72f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludGVkJTIwdHNoaXJ0JTIwZGVzaWdufGVufDF8fHx8MTc2Mzg1NTM4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1610518066693-8c9f6d3d6455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwdHlwb2dyYXBoeSUyMGRlc2lnbnxlbnwxfHx8fDE3NjM4NTUzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1748712073377-5c200bf4cbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBpbGx1c3RyYXRpb24lMjBwbGFudHxlbnwxfHx8fDE3NjM4NTUzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                "https://images.unsplash.com/photo-1676134893614-fc13ef156284?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMHBhdHRlcm58ZW58MXx8fHwxNjM4NTUzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              ].map((img, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <ImageWithFallback
                      src={img}
                      alt={`Design ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Design by Artist {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}