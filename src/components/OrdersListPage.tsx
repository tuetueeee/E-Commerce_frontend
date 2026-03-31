import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    ChevronRight,
    Filter,
    Search
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { Input } from './ui/input';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    pending: { label: 'Chờ xử lý', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Đang xử lý', icon: Package, color: 'bg-blue-100 text-blue-800' },
    shipped: { label: 'Đã gửi', icon: Truck, color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Đã giao', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Đã hủy', icon: XCircle, color: 'bg-red-100 text-red-800' },
};

export function OrdersListPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (token) {
            loadOrders();
        } else {
            window.location.hash = '#login';
        }
    }, [token, page, statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!token) return;

            const params: any = { page, limit };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const response = await apiServices.orders.getMyOrders(token, params) as any;
            setOrders(response.orders || []);
            setTotalPages(response.totalPages || 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusBadge = (status: string) => {
        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const filteredOrders = orders.filter(order => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                order.id?.toLowerCase().includes(query) ||
                order.trackingNumber?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadOrders} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải đơn hàng..." />
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
                        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
                        <p className="text-gray-600">Xem và quản lý đơn hàng của bạn</p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Bộ lọc
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Tìm kiếm theo mã đơn hàng hoặc mã vận đơn..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                                        <SelectItem value="processing">Đang xử lý</SelectItem>
                                        <SelectItem value="shipped">Đã gửi</SelectItem>
                                        <SelectItem value="delivered">Đã giao</SelectItem>
                                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'Thử điều chỉnh bộ lọc của bạn'
                                        : "Bạn chưa đặt đơn hàng nào"}
                                </p>
                                {!searchQuery && statusFilter === 'all' && (
                                    <Button onClick={() => (window.location.hash = '#blanks')}>
                                        Bắt đầu mua sắm
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <Card key={order.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-1">
                                                            Đơn hàng #{order.id || order.orderNumber}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Đặt vào {formatDate(order.createdAt || order.orderDate)}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(order.status || order.Status)}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                                        <p className="font-semibold">
                                                            {formatPrice(order.total || order.Total || 0)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Sản phẩm</p>
                                                        <p className="font-semibold">
                                                            {order.itemsCount || order.items?.length || 0} sản phẩm
                                                        </p>
                                                    </div>
                                                    {order.trackingNumber && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Mã vận đơn</p>
                                                            <p className="font-semibold text-sm">
                                                                {order.trackingNumber}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.estimatedDelivery && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Giao hàng dự kiến</p>
                                                            <p className="font-semibold text-sm">
                                                                {formatDate(order.estimatedDelivery)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 md:min-w-[150px]">
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => {
                                                        window.location.hash = `#order-detail?id=${order.id}`;
                                                    }}
                                                >
                                                    Xem chi tiết
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </Button>
                                                {order.status === 'shipped' && order.trackingNumber && (
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => {
                                                            window.location.hash = `#order-tracking?id=${order.id}`;
                                                        }}
                                                    >
                                                        Track Order
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

