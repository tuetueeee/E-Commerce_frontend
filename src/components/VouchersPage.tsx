import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import {
    Ticket,
    Copy,
    CheckCircle,
    XCircle,
    Clock,
    Check
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';

export function VouchersPage() {
    const { getToken, isLoading: authLoading } = useAuth();
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validateCode, setValidateCode] = useState('');
    const [validateResult, setValidateResult] = useState<any>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading) {
            const token = getToken();
            if (token) {
                loadVouchers();
            } else {
                window.location.hash = '#login';
            }
        }
    }, [authLoading]);

    const loadVouchers = async () => {
        try {
            const token = getToken();
            setLoading(true);
            setError(null);
            if (!token) return;

            const response = await apiServices.vouchers.getMyVouchers(token) as any;
            // Response format: UserVoucher[] với relation voucher
            const vouchersList = Array.isArray(response) ? response : [];
            setVouchers(vouchersList.map((uv: any) => ({
              id: uv.id,
              code: uv.voucher?.code,
              discount: uv.voucher?.value || uv.voucher?.discount,
              discountPercent: uv.voucher?.type === 'percentage' ? uv.voucher?.value : 0,
              expiresAt: uv.voucher?.validUntil,
              isUsed: uv.status === 'used' || uv.isUsed,
              usedAt: uv.usedAt,
              voucher: uv.voucher,
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async () => {
        try {
            const token = getToken();
            if (!token || !validateCode) return;

            // Need order amount for validation - use 0 as default or get from cart
            const orderAmount = 0; // TODO: Get from cart if available
            const result = await apiServices.vouchers.validate(validateCode, orderAmount, token) as any;
            setValidateResult({
                valid: result.valid,
                discount: result.discount,
                message: result.message,
            });
        } catch (err) {
            setValidateResult({
                valid: false,
                discount: 0,
                message: err instanceof Error ? err.message : 'Validation failed'
            });
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDiscount = (discount: number) => {
        if (discount < 1) {
            return `${(discount * 100).toFixed(0)}%`;
        }
        return `${discount}%`;
    };

    const availableVouchers = vouchers.filter(v => !v.isUsed && (!v.expiresAt || new Date(v.expiresAt) > new Date()));
    const usedVouchers = vouchers.filter(v => v.isUsed);
    const expiredVouchers = vouchers.filter(v => !v.isUsed && v.expiresAt && new Date(v.expiresAt) <= new Date());

    if (error && vouchers.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadVouchers} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && vouchers.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải voucher..." />
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
                            <Ticket className="w-8 h-8 text-purple-500" />
                            Voucher của tôi
                        </h1>
                        <p className="text-gray-600">Quản lý voucher giảm giá của bạn</p>
                    </div>

                    {/* Validate Voucher */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Kiểm tra Voucher</CardTitle>
                            <CardDescription>Kiểm tra mã voucher có hợp lệ không</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nhập mã voucher"
                                    value={validateCode}
                                    onChange={(e) => setValidateCode(e.target.value.toUpperCase())}
                                    onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                                />
                                <Button onClick={handleValidate}>Kiểm tra</Button>
                            </div>
                            {validateResult && (
                                <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${validateResult.valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}>
                                    {validateResult.valid ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <XCircle className="w-5 h-5" />
                                    )}
                                    <div>
                                        <p className="font-semibold">{validateResult.message}</p>
                                        {validateResult.valid && validateResult.discount && (
                                            <p className="text-sm mt-1">
                                                Giảm giá: {formatDiscount(validateResult.discount)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vouchers Tabs */}
                    <Tabs defaultValue="available" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="available">
                                Có sẵn ({availableVouchers.length})
                            </TabsTrigger>
                            <TabsTrigger value="used">
                                Đã dùng ({usedVouchers.length})
                            </TabsTrigger>
                            <TabsTrigger value="expired">
                                Hết hạn ({expiredVouchers.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="available">
                            {availableVouchers.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Không có voucher nào</h3>
                                        <p className="text-gray-600">Bạn chưa có voucher nào đang hoạt động</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableVouchers.map((voucher) => (
                                        <Card key={voucher.id} className="border-2 border-purple-200">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-2xl mb-1">
                                                            {formatDiscount(voucher.discount || voucher.discountPercent || 0)}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">OFF</p>
                                                    </div>
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Hoạt động
                                                    </Badge>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="font-mono text-lg font-semibold mb-2">
                                                        {voucher.code}
                                                    </p>
                                                    {voucher.expiresAt && (
                                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            Hết hạn: {formatDate(voucher.expiresAt)}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => copyToClipboard(voucher.code)}
                                                >
                                                    {copiedCode === voucher.code ? (
                                                        <>
                                                            <Check className="w-4 h-4 mr-2" />
                                                            Đã sao chép!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Sao chép mã
                                                        </>
                                                    )}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="used">
                            {usedVouchers.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Chưa có voucher đã dùng</h3>
                                        <p className="text-gray-600">Bạn chưa sử dụng voucher nào</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {usedVouchers.map((voucher) => (
                                        <Card key={voucher.id} className="opacity-60">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-2xl mb-1">
                                                            {formatDiscount(voucher.discount || voucher.discountPercent || 0)}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">OFF</p>
                                                    </div>
                                                    <Badge variant="outline">Đã dùng</Badge>
                                                </div>
                                                <p className="font-mono text-lg font-semibold mb-2">
                                                    {voucher.code}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="expired">
                            {expiredVouchers.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <XCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Không có voucher hết hạn</h3>
                                        <p className="text-gray-600">Tất cả voucher của bạn vẫn còn hiệu lực</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {expiredVouchers.map((voucher) => (
                                        <Card key={voucher.id} className="opacity-60">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-2xl mb-1">
                                                            {formatDiscount(voucher.discount || voucher.discountPercent || 0)}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">OFF</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-red-600">
                                                        Hết hạn
                                                    </Badge>
                                                </div>
                                                <p className="font-mono text-lg font-semibold mb-2">
                                                    {voucher.code}
                                                </p>
                                                {voucher.expiresAt && (
                                                    <p className="text-sm text-gray-600">
                                                        Hết hạn: {formatDate(voucher.expiresAt)}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Footer />
        </div>
    );
}

