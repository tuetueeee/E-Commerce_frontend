import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    MapPin,
    ArrowLeft,
    Copy,
    ExternalLink
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';

export function OrderTrackingPage() {
    const { token } = useAuth();
    const [tracking, setTracking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (token) {
            loadTracking();
        } else {
            window.location.hash = '#login';
        }
    }, [token]);

    const loadTracking = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!token) return;

            const urlParams = new URLSearchParams(window.location.hash.replace('#order-tracking?', ''));
            const orderId = urlParams.get('id');

            if (!orderId) {
                setError('Yêu cầu mã đơn hàng');
                return;
            }

            // Try shipments API first, fallback to orders tracking
            try {
                const shipmentData = await apiServices.shipments.getByOrder(orderId, token);
                setTracking(shipmentData);
            } catch (err) {
                // Fallback to orders tracking endpoint
                const trackingData = await apiServices.orders.getTracking(orderId, token);
                setTracking(trackingData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải thông tin theo dõi');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyTrackingNumber = () => {
        if (tracking?.trackingNumber) {
            navigator.clipboard.writeText(tracking.trackingNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStatusIcon = (status: string, index: number, currentIndex: number) => {
        if (index < currentIndex) {
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        } else if (index === currentIndex) {
            return <Clock className="w-5 h-5 text-blue-600" />;
        } else {
            return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadTracking} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading || !tracking) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải thông tin theo dõi..." />
                </div>
                <Footer />
            </div>
        );
    }

    const events = tracking.events || [];
    const currentStatus = tracking.status || 'pending';
    const statusOrder = ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="flex-1 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => (window.location.hash = '#orders')}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại đơn hàng
                        </Button>
                        <h1 className="text-3xl font-bold mb-2">Theo dõi đơn hàng của bạn</h1>
                        <p className="text-gray-600">Đơn hàng #{tracking.orderId || tracking.id}</p>
                    </div>

                    {/* Tracking Number */}
                    {tracking.trackingNumber && (
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Mã vận đơn</p>
                                        <p className="text-2xl font-bold font-mono">
                                            {tracking.trackingNumber}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={copyTrackingNumber}
                                            className="flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copied ? 'Đã sao chép!' : 'Sao chép'}
                                        </Button>
                                        {tracking.carrier && tracking.trackingUrl && (
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(tracking.trackingUrl, '_blank')}
                                                className="flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Theo dõi trên {tracking.carrier}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Status Overview */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Trạng thái hiện tại</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                                        {currentStatus.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </div>
                                {tracking.estimatedDelivery && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Giao hàng dự kiến</p>
                                        <p className="font-semibold">
                                            {formatDate(tracking.estimatedDelivery)}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {tracking.carrier && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        Đơn vị vận chuyển: <span className="font-semibold">{tracking.carrier}</span>
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tracking Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử theo dõi</CardTitle>
                            <CardDescription>
                                {events.length} sự kiện đã ghi nhận
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {events.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>Chưa có sự kiện theo dõi</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                                    <div className="space-y-6">
                                        {events.map((event: any, index: number) => {
                                            const isLatest = index === 0;
                                            return (
                                                <div key={index} className="relative flex gap-4">
                                                    {/* Icon */}
                                                    <div className={`relative z-10 ${isLatest ? 'text-blue-600' : 'text-gray-400'}`}>
                                                        {isLatest ? (
                                                            <Clock className="w-6 h-6" />
                                                        ) : (
                                                            <CheckCircle className="w-6 h-6" />
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 pb-6">
                                                        <div className={`${isLatest ? 'font-semibold' : ''} mb-1`}>
                                                            {event.status || event.description || 'Status Update'}
                                                        </div>
                                                        {event.location && (
                                                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {event.location}
                                                            </div>
                                                        )}
                                                        {event.date && (
                                                            <div className="text-sm text-gray-500">
                                                                {formatDate(event.date)}
                                                            </div>
                                                        )}
                                                        {event.note && (
                                                            <div className="text-sm text-gray-600 mt-2">
                                                                {event.note}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="mt-6 flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                window.location.hash = `#order-detail?id=${tracking.orderId || tracking.id}`;
                            }}
                        >
                            Xem chi tiết đơn hàng
                        </Button>
                        <Button
                            onClick={() => (window.location.hash = '#orders')}
                        >
                            Quay lại đơn hàng
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

