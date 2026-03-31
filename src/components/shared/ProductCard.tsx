import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Star, Leaf, Recycle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onClickDetail?: (productId: string) => void;
  showEcoBadges?: boolean;
  showCustomizeButton?: boolean;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  onClickDetail,
  showEcoBadges = true,
  showCustomizeButton = true,
}: ProductCardProps) {
  const handleClick = () => {
    if (onClickDetail) {
      onClickDetail(product.id);
    }
  };

  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'Product';

  const isGridView = viewMode === 'grid';

  return (
    <a
      href={`#blank-detail?id=${product.id}`}
      onClick={handleClick}
      className={`group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all ${
        !isGridView ? 'flex gap-4' : ''
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden ${
          isGridView ? 'aspect-[3/4]' : 'w-48 h-48 flex-shrink-0'
        }`}
      >
        <ImageWithFallback
          src={product.image || (Array.isArray(product.images) && product.images[0]?.url) || (typeof product.images === 'object' && product.images && 'url' in product.images ? product.images.url : undefined) || undefined}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Eco Badges */}
        {showEcoBadges && (product.isEco || product.isRecycled) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isEco && (
              <div className="bg-[#BCF181] px-2 py-1 rounded-full flex items-center gap-1">
                <Leaf className="w-3 h-3 text-green-800" />
                <span className="text-green-800 text-xs">Eco</span>
              </div>
            )}
            {product.isRecycled && (
              <div className="bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <Recycle className="w-3 h-3 text-blue-800" />
                <span className="text-blue-800 text-xs">Recycled</span>
              </div>
            )}
          </div>
        )}

        {/* Rating Badge - Only show if rating > 0 */}
        {product.rating && product.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Customize Button */}
        {showCustomizeButton && (
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#ca6946] text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm hover:bg-[#b55835]">
            Tùy chỉnh
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className={`p-4 ${!isGridView ? 'flex-1' : ''}`}>
        <p className="text-gray-500 text-sm mb-1">{categoryName}</p>
        <h3 className="font-['Lato'] mb-2 line-clamp-2">{product.name}</h3>

        {/* Materials */}
        {product.materials && product.materials.length > 0 ? (
          <div className="text-xs text-gray-600 mb-2">
            <p className="line-clamp-1">{product.materials.join(' • ')}</p>
          </div>
        ) : null}

        {/* Rating & Reviews - Only show if rating > 0 */}
        {product.rating && product.rating > 0 ? (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({(product.reviews || product.numReviews || 0) > 0 ? (product.reviews || product.numReviews || 0) : ''})
            </span>
          </div>
        ) : null}

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            {/* Old Price - Only show if exists and > 0 */}
            {product.oldPrice && Number(product.oldPrice) > 0 && Number(product.oldPrice) > Number(product.price || 0) && (
              <p className="text-sm text-gray-400 line-through mb-1">
                {Number(product.oldPrice).toLocaleString('vi-VN')}₫
              </p>
            )}
            {/* Current Price */}
            <p className="font-['Lato'] font-semibold">
              {product.price !== null && product.price !== undefined && Number(product.price) > 0 
                ? `${Number(product.price).toLocaleString('vi-VN')}₫`
                : product.price === null || product.price === undefined
                  ? 'Liên hệ'
                  : 'Miễn phí'}
            </p>
            {/* Stock - Only show if > 0 */}
            {product.stock !== undefined && product.stock !== null && Number(product.stock) > 0 && (
              <p className="text-xs text-gray-500 mt-1">Còn {Number(product.stock)} sản phẩm</p>
            )}
          </div>
          {!isGridView && (
            <button className="bg-[#ca6946] hover:bg-[#b55835] text-white px-4 py-2 rounded-full transition-colors text-sm">
              Tùy chỉnh
            </button>
          )}
        </div>
      </div>
    </a>
  );
}

