import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Star
} from 'lucide-react';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';

export function AddressesPage() {
    const { getToken, isLoading: authLoading } = useAuth();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [formData, setFormData] = useState({
        label: 'Home',
        line1: '',
        line2: '',
        state: '',
        country: 'Vietnam',
        zip: '',
        is_default: false,
    });

    useEffect(() => {
        if (!authLoading) {
            const token = getToken();
            if (token) {
                loadAddresses();
            } else {
                window.location.hash = '#login';
            }
        }
    }, [authLoading]);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) return;

            const response = await apiServices.addresses.getAll(token);
            // Response là Address[] trực tiếp, không có wrapper
            const addressesList = Array.isArray(response) ? response : [];
            setAddresses(addressesList);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể tải địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (address?: any) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                label: address.label || 'Home',
                line1: address.line1 || '',
                line2: address.line2 || '',
                state: address.state || '',
                country: address.country || 'Vietnam',
                zip: address.zip || '',
                is_default: address.is_default || false,
            });
        } else {
            setEditingAddress(null);
            setFormData({
                label: 'Home',
                line1: '',
                line2: '',
                state: '',
                country: 'Vietnam',
                zip: '',
                is_default: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAddress(null);
        setFormData({
            label: 'Home',
            line1: '',
            line2: '',
            state: '',
            country: 'Vietnam',
            zip: '',
            is_default: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getToken();
            if (!token) return;

            if (editingAddress) {
                await apiServices.addresses.update(editingAddress.addr_id || editingAddress.id, formData, token);
            } else {
                await apiServices.addresses.create(formData, token);
            }

            await loadAddresses();
            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể lưu địa chỉ');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

        try {
            const token = getToken();
            if (!token) return;
            await apiServices.addresses.delete(id, token);
            await loadAddresses();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể xóa địa chỉ');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const token = getToken();
            if (!token) return;
            
            await apiServices.addresses.setDefault(id, token);
            await loadAddresses();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Không thể đặt địa chỉ mặc định');
        }
    };

    if (error && addresses.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <ErrorDisplay message={error} onRetry={loadAddresses} />
                </div>
                <Footer />
            </div>
        );
    }

    if (loading && addresses.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Đang tải địa chỉ..." />
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
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Địa chỉ của tôi</h1>
                            <p className="text-gray-600">Quản lý địa chỉ giao hàng của bạn</p>
                        </div>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm địa chỉ mới
                        </Button>
                    </div>

                    {/* Addresses List */}
                    {addresses.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Chưa có địa chỉ nào</h3>
                                <p className="text-gray-600 mb-4">
                                    Thêm địa chỉ đầu tiên để thanh toán nhanh hơn
                                </p>
                                <Button onClick={() => handleOpenDialog()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm địa chỉ
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                                <Card key={address.id} className="relative">
                                    <CardContent className="p-6">
                                        {address.is_default && (
                                            <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800">
                                                <Star className="w-3 h-3 mr-1" />
                                                Mặc định
                                            </Badge>
                                        )}
                                        <div className="mb-4">
                                            <div className="flex items-start gap-2 mb-2">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1">
                                                        {address.label || 'Address'}
                                                    </h3>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>{address.line1}</p>
                                                        {address.line2 && <p>{address.line2}</p>}
                                                        <p>
                                                            {address.state} {address.zip}
                                                        </p>
                                                        <p>{address.country}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleOpenDialog(address)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Chỉnh sửa
                                            </Button>
                                            {!address.is_default && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleSetDefault(address.addr_id || address.id)}
                                                >
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Đặt mặc định
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(address.addr_id || address.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? 'Cập nhật thông tin địa chỉ của bạn'
                                : 'Thêm địa chỉ giao hàng mới vào tài khoản của bạn'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Nhãn địa chỉ *</Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData({ ...formData, label: e.target.value })
                                    }
                                    placeholder="Home, Work, etc."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="line1">Địa chỉ đường *</Label>
                                <Input
                                    id="line1"
                                    value={formData.line1}
                                    onChange={(e) =>
                                        setFormData({ ...formData, line1: e.target.value })
                                    }
                                    placeholder="123 Đường ABC"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="line2">Địa chỉ bổ sung (Tùy chọn)</Label>
                                <Input
                                    id="line2"
                                    value={formData.line2}
                                    onChange={(e) =>
                                        setFormData({ ...formData, line2: e.target.value })
                                    }
                                    placeholder="Apt 4B, Building..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state">Tỉnh/Thành phố *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) =>
                                            setFormData({ ...formData, state: e.target.value })
                                        }
                                        placeholder="Ho Chi Minh City"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Mã bưu điện *</Label>
                                    <Input
                                        id="zip"
                                        value={formData.zip}
                                        onChange={(e) =>
                                            setFormData({ ...formData, zip: e.target.value })
                                        }
                                        placeholder="70000"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Quốc gia *</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={formData.is_default}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_default: checked === true })
                                    }
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    Đặt làm địa chỉ mặc định
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Hủy
                            </Button>
                            <Button type="submit">
                                {editingAddress ? 'Cập nhật' : 'Thêm'} địa chỉ
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}

