import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { Loading } from '../ui/loading';
import { ErrorDisplay } from '../ui/error';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  viewMode?: 'grid' | 'list';
  showEcoBadges?: boolean;
  showCustomizeButton?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  loading = false,
  error = null,
  viewMode = 'grid',
  showEcoBadges = true,
  showCustomizeButton = true,
  onRetry,
  emptyMessage = 'No products found',
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <ErrorDisplay message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridClasses =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      : 'space-y-4';

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          showEcoBadges={showEcoBadges}
          showCustomizeButton={showCustomizeButton}
        />
      ))}
    </div>
  );
}

