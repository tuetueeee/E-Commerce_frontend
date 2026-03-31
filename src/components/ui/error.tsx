import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorDisplay({ 
  message = 'Đã xảy ra lỗi. Vui lòng thử lại.', 
  onRetry,
  fullScreen = false 
}: ErrorDisplayProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-red-100 p-3">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">Lỗi</h3>
        <p className="text-sm text-gray-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

