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
    XCircle,
    Truck,
    MapPin,
    CreditCard,
    ArrowLeft,
    Download,
    Printer,
    X
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { ImageWithFallback } from './figma/ImageWithFallback';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
};

export function OrderDetailPage() {
    const { token, getToken } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            const currentToken = token || getToken();
            if (!currentToken) {
                setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
                setLoading(false);
                return;
            }

            const urlParams = new URLSearchParams(window.location.hash.replace('#order-detail?', ''));
            const orderId = urlParams.get('id');

            if (!orderId) {
                setError('Yêu cầu mã đơn hàng');
                return;
            }

            const orderData = await apiServices.orders.getById(orderId, currentToken);
            setOrder(orderData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        
        try {
            if (!token || !order) return;
            
            await apiServices.orders.cancel(order.id, token);
            await loadOrder(); // Reload để cập nhật status
            alert('Đơn hàng đã được hủy');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể hủy đơn hàng');
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadOrder} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading || !order) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải chi tiết đơn hàng..." />
                </div>
                <Footer />
            </div>
        );
    }

    const orderStatus = order.status || order.Status || 'pending';
    const orderItems = order.items || [];
    const shippingAddress = order.shippingAddress || order.address;
    const paymentMethod = order.paymentMethod || order.payment;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <Button
                                variant="ghost"
                                onClick={() => (window.location.hash = '#orders')}
                                className="mb-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại đơn hàng
                            </Button>
                            <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
                            <p className="text-gray-600 mt-1">Đơn hàng #{order.id || order.orderNumber}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => window.print()}>
                                <Printer className="w-4 h-4 mr-2" />
                                In
                            </Button>
                            {orderStatus === 'shipped' && order.trackingNumber && (
                                <Button
                                    onClick={() => {
                                        window.location.hash = `#order-tracking?id=${order.id}`;
                                    }}
                                >
                                    Theo dõi đơn hàng
                                </Button>
                            )}
                            {orderStatus === 'pending' && (
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelOrder}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Hủy đơn hàng
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trạng thái đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Trạng thái hiện tại</p>
                                            {getStatusBadge(orderStatus)}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Ngày đặt hàng</p>
                                            <p className="font-semibold">
                                                {formatDate(order.createdAt || order.orderDate)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sản phẩm đơn hàng</CardTitle>
                                    <CardDescription>{orderItems.length} sản phẩm</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {orderItems.map((item: any, index: number) => (
                                            <div
                                                key={item.id || index}
                                                className="flex gap-4 pb-4 border-b last:border-0"
                                            >
                                                <ImageWithFallback
                                                    src={item.product?.image || item.image || 'https://placehold.co/100x100'}
                                                    alt={item.product?.name || item.name || 'Product'}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold mb-1">
                                                        {item.product?.name || item.name || 'Product'}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Số lượng: {item.quantity || item.qty || 1}
                                                    </p>
                                                    {item.size && (
                                                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                    )}
                                                    {item.color && (
                                                        <p className="text-sm text-gray-600">Màu: {item.color}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        {formatPrice(item.price || item.unit_price || 0)}
                                                    </p>
                                                    {item.quantity && item.price && (
                                                        <p className="text-sm text-gray-600">
                                                            Tổng: {formatPrice(item.quantity * item.price)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Shipping Address */}
                            {shippingAddress && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Địa chỉ giao hàng
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-semibold">{shippingAddress.fullName || shippingAddress.name}</p>
                                            <p>{shippingAddress.street || shippingAddress.address}</p>
                                            <p>
                                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                            </p>
                                            <p>{shippingAddress.country}</p>
                                            {shippingAddress.phone && (
                                                <p className="mt-2">Điện thoại: {shippingAddress.phone}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment Method */}
                            {paymentMethod && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Phương thức thanh toán
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-semibold">
                                                {paymentMethod.type || paymentMethod.name || 'Credit Card'}
                                            </p>
                                            {paymentMethod.last4 && (
                                                <p className="text-gray-600">**** {paymentMethod.last4}</p>
                                            )}
                                            {paymentMethod.status && (
                                                <Badge className="mt-2">
                                                    {paymentMethod.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tạm tính</span>
                                            <span>{formatPrice(order.subtotal || order.total || 0)}</span>
                                        </div>
                                        {order.shippingCost && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Vận chuyển</span>
                                                <span>{formatPrice(order.shippingCost)}</span>
                                            </div>
                                        )}
                                        {order.discount && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Giảm giá</span>
                                                <span>-{formatPrice(order.discount)}</span>
                                            </div>
                                        )}
                                        {order.tax && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Thuế</span>
                                                <span>{formatPrice(order.tax)}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3 flex justify-between font-bold">
                                            <span>Tổng cộng</span>
                                            <span>{formatPrice(order.total || order.Total || 0)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

