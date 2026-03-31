import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Gift,
    Coins,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';

export function RewardsPage() {
    const { getToken, isLoading: authLoading } = useAuth();
    const [balance, setBalance] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [catalog, setCatalog] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCatalog, setLoadingCatalog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
    const [selectedReward, setSelectedReward] = useState<any>(null);

    useEffect(() => {
        if (!authLoading) {
            const token = getToken();
            if (token) {
                loadRewardsData();
            } else {
                window.location.hash = '#login';
            }
        }
    }, [authLoading, page]);

    const loadRewardsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) return;

            const [balanceData, historyData] = await Promise.all([
                apiServices.rewards.getBalance(token),
                apiServices.rewards.getHistory(token, { page, limit: 10 })
            ]);

            setBalance(balanceData);
            const historyResponse = historyData as any;
            setHistory(historyResponse.history || []);
            
            // Load catalog
            loadCatalog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu phần thưởng');
        } finally {
            setLoading(false);
        }
    };

    const loadCatalog = async () => {
        try {
            setLoadingCatalog(true);
            const token = getToken();
            if (!token) return;
            
            const catalogData = await apiServices.rewards.getCatalog(token) as any;
            setCatalog(Array.isArray(catalogData) ? catalogData : []);
        } catch (err) {
            console.error('Failed to load catalog:', err);
            setCatalog([]);
        } finally {
            setLoadingCatalog(false);
        }
    };

    const handleRedeem = async () => {
        try {
            const token = getToken();
            if (!token) return;
            if (!selectedReward) {
                setError('Vui lòng chọn phần thưởng');
                return;
            }

            const result = await apiServices.rewards.redeem(
                selectedReward.id || selectedReward.reward_id,
                token
            ) as any;
            // Response: { voucher: Voucher, pointsUsed: number }

            setIsRedeemDialogOpen(false);
            setSelectedReward(null);
            await loadRewardsData();
            alert(`Đổi điểm thành công! Đã sử dụng ${result.pointsUsed} điểm.`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể đổi điểm');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'purchase':
                return <Coins className="w-4 h-4" />;
            case 'redeem':
                return <Gift className="w-4 h-4" />;
            default:
                return <Coins className="w-4 h-4" />;
        }
    };

    if (error && !balance) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadRewardsData} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && !balance) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải phần thưởng..." />
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
                            <Gift className="w-8 h-8 text-yellow-500" />
                            Phần thưởng & Điểm
                        </h1>
                        <p className="text-gray-600">Kiếm và đổi điểm thưởng</p>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Điểm khả dụng
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-6 h-6 text-yellow-500" />
                                    <span className="text-3xl font-bold">
                                        {balance?.available || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Điểm chờ xử lý
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-blue-500" />
                                    <span className="text-3xl font-bold">
                                        {balance?.pending || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Tổng điểm
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-500" />
                                    <span className="text-3xl font-bold">
                                        {balance?.total || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="history" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="history">Lịch sử</TabsTrigger>
                            <TabsTrigger value="redeem">Đổi điểm</TabsTrigger>
                        </TabsList>

                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lịch sử điểm</CardTitle>
                                    <CardDescription>
                                        Xem lịch sử kiếm và đổi điểm của bạn
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {history.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Coins className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p>Chưa có lịch sử</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {history.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-full ${item.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                            }`}>
                                                            {getTypeIcon(item.type)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{item.description || item.type}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {formatDate(item.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${item.points > 0 ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {item.points > 0 ? '+' : ''}{item.points} điểm
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="redeem">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Đổi điểm</CardTitle>
                                    <CardDescription>
                                        Sử dụng điểm của bạn để đổi phần thưởng
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingCatalog ? (
                                        <div className="text-center py-8">
                                            <Loading text="Đang tải danh sách phần thưởng..." />
                                        </div>
                                    ) : catalog.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p>Chưa có phần thưởng nào</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {catalog.map((reward: any) => {
                                                    const canRedeem = (balance?.available || 0) >= (reward.pointsRequired || reward.points_required || 0);
                                                    return (
                                                        <Card
                                                            key={reward.id || reward.reward_id}
                                                            className={`cursor-pointer transition-all ${
                                                                selectedReward?.id === reward.id || selectedReward?.reward_id === reward.reward_id
                                                                    ? 'border-2 border-yellow-500 bg-yellow-50'
                                                                    : canRedeem
                                                                    ? 'hover:border-yellow-300 hover:shadow-md'
                                                                    : 'opacity-60'
                                                            }`}
                                                            onClick={() => canRedeem && setSelectedReward(reward)}
                                                        >
                                                            <CardContent className="p-6">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div className="flex-1">
                                                                        <h3 className="font-semibold text-lg mb-2">
                                                                            {reward.name || reward.title || 'Phần thưởng'}
                                                                        </h3>
                                                                        {reward.description && (
                                                                            <p className="text-sm text-gray-600 mb-3">
                                                                                {reward.description}
                                                                            </p>
                                                                        )}
                                                                        <div className="flex items-center gap-2">
                                                                            <Coins className="w-5 h-5 text-yellow-500" />
                                                                            <span className="text-xl font-bold text-yellow-600">
                                                                                {reward.pointsRequired || reward.points_required || 0} điểm
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {!canRedeem && (
                                                                        <Badge variant="outline" className="text-red-600">
                                                                            Không đủ điểm
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                {reward.voucherValue && (
                                                                    <div className="mt-4 pt-4 border-t">
                                                                        <p className="text-sm text-gray-600">
                                                                            Giá trị: {reward.voucherValue}% giảm giá
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                            {selectedReward && (
                                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <p className="font-semibold mb-2">Phần thưởng đã chọn:</p>
                                                    <p className="text-sm text-gray-700 mb-1">
                                                        {selectedReward.name || selectedReward.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Cần: {selectedReward.pointsRequired || selectedReward.points_required || 0} điểm
                                                    </p>
                                                    <Button
                                                        onClick={() => setIsRedeemDialogOpen(true)}
                                                        className="w-full"
                                                    >
                                                        Xác nhận đổi điểm
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Redeem Confirmation Dialog */}
            <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận đổi điểm</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn đổi {selectedReward?.pointsRequired || selectedReward?.points_required || 0} điểm để nhận phần thưởng "{selectedReward?.name || selectedReward?.title}"?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleRedeem}>Xác nhận</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

