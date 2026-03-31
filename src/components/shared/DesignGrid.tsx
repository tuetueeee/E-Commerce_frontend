import { DesignCard } from './DesignCard';
import { Design } from '../../types';
import { Loading } from '../ui/loading';
import { ErrorDisplay } from '../ui/error';

interface DesignGridProps {
  designs: Design[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 3 | 4;
  showStats?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
}

export function DesignGrid({
  designs,
  loading = false,
  error = null,
  columns = 3,
  showStats = true,
  onRetry,
  emptyMessage = 'No designs found',
}: DesignGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading text="Loading designs..." />
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

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridClasses = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6',
  };

  return (
    <div className={gridClasses[columns]}>
      {designs.map((design) => (
        <DesignCard
          key={design.id || design.DESIGN_ID}
          design={design}
          showStats={showStats}
        />
      ))}
    </div>
  );
}

