import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Star,
    MessageSquare,
    Edit,
    Trash2,
    Image as ImageIcon
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ReviewsPage() {
    const { getToken, isLoading: authLoading } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            const token = getToken();
            if (token) {
                // Note: API might not have endpoint to get user's reviews
                // This is a placeholder - you may need to fetch from orders/products
                loadReviews();
            } else {
                window.location.hash = '#login';
            }
        }
    }, [authLoading]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) return;

            const response = await apiServices.reviews.getMyReviews(token, 1, 20) as any;
            setReviews(response.reviews || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
        
        try {
            const token = getToken();
            if (!token) return;
            
            await apiServices.reviews.delete(reviewId, token);
            await loadReviews();
            alert('Đã xóa đánh giá thành công');
        } catch (err) {
            alert('Không thể xóa đánh giá: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (error && reviews.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadReviews} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && reviews.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Loading reviews..." />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="flex-1 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                            Đánh giá của tôi
                        </h1>
                        <p className="text-gray-600">Xem và quản lý các đánh giá sản phẩm của bạn</p>
                    </div>

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có đánh giá nào</h3>
                                <p className="text-gray-600 mb-4">
                                    Bạn chưa viết đánh giá nào. Đánh giá có thể được thêm từ lịch sử đơn hàng của bạn.
                                </p>
                                <Button onClick={() => (window.location.hash = '#orders')}>
                                    Xem đơn hàng
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <ImageWithFallback
                                                src={review.product?.image || 'https://placehold.co/100x100'}
                                                alt={review.product?.name || 'Product'}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold mb-1">
                                                            {review.product?.name || 'Product'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {renderStars(review.rating)}
                                                            <span className="text-sm text-gray-600">
                                                                {formatDate(review.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => {
                                                                window.location.hash = `#blank-detail?id=${review.productId || review.product?.id}`;
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteReview(review.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-gray-700 mb-2">{review.comment}</p>
                                                )}
                                                {review.media_url && (
                                                    <div className="mt-2">
                                                        <ImageWithFallback
                                                            src={review.media_url}
                                                            alt="Review media"
                                                            className="w-32 h-32 object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

