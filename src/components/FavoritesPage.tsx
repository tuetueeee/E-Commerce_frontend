import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
    Heart,
    ShoppingCart,
    Trash2,
    Image as ImageIcon
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FavoritesPage() {
    const { getToken, isLoading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            const token = getToken();
            if (token) {
                loadFavorites();
            } else {
                window.location.hash = '#login';
            }
        }
    }, [authLoading]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) return;

            const response = await apiServices.favorites.getAll(token);
            setFavorites(response.favorites || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải yêu thích');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favoriteId: string) => {
        try {
            const token = getToken();
            if (!token) return;
            await apiServices.favorites.remove(favoriteId, token);
            await loadFavorites();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể xóa yêu thích');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (error && favorites.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadFavorites} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && favorites.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải yêu thích..." />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                            Yêu thích của tôi
                        </h1>
                        <p className="text-gray-600">
                            Đã lưu {favorites.length} {favorites.length === 1 ? 'thiết kế' : 'thiết kế'}
                        </p>
                    </div>

                    {/* Favorites Grid */}
                    {favorites.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có yêu thích</h3>
                                <p className="text-gray-600 mb-4">
                                    Bắt đầu khám phá thiết kế và thêm chúng vào yêu thích
                                </p>
                                <Button onClick={() => (window.location.hash = '#designs')}>
                                    Duyệt thiết kế
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites.map((favorite) => {
                                const design = favorite.design || favorite;
                                return (
                                    <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            <ImageWithFallback
                                                src={design.image || design.thumbnail || 'https://placehold.co/400x400'}
                                                alt={design.name || 'Design'}
                                                className="w-full aspect-square object-cover rounded-t-lg"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveFavorite(favorite.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-2 line-clamp-2">
                                                {design.name || 'Design'}
                                            </h3>
                                            {design.creator && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    by {design.creator}
                                                </p>
                                            )}
                                            {design.price && (
                                                <p className="font-bold text-lg mb-3">
                                                    {formatPrice(design.price)}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        window.location.hash = `#design-detail?id=${design.id}`;
                                                    }}
                                                >
                                                    Xem
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => {
                                                        // Add to cart logic here
                                                        window.location.hash = `#design-detail?id=${design.id}`;
                                                    }}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Thêm vào giỏ hàng
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

