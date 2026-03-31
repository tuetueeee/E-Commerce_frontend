// Placeholder images - replace with actual images when available
const imgRectangle18 = "https://placehold.co/400x300/90EE90/FFFFFF?text=Design+1";
const imgRectangle17 = "https://placehold.co/400x300/87CEEB/FFFFFF?text=Design+2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Palette,
  Leaf,
  Gift,
  Users,
  Star,
  Download,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  DollarSign,
  LogOut,
  Search,
  AlertCircle,
  Warehouse,
  Box,
  Ruler,
  FileText,
  UserCog,
  FolderOpen,
  Save
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { apiServices } from '../../services/apiConfig';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../ui/loading';
import { ErrorDisplay } from '../ui/error';
import { toast } from "sonner";
import { Pagination } from '../shared/Pagination';

const mockOrders = [
  { id: "ORD-2024-156", customer: "Nguyễn Văn A", date: "2024-11-07", status: "Processing", total: 749000, items: 1 },
  { id: "ORD-2024-155", customer: "Trần Thị B", date: "2024-11-07", status: "Printing", total: 1498000, items: 2 },
  { id: "ORD-2024-154", customer: "Lê Văn C", date: "2024-11-06", status: "Shipped", total: 998000, items: 1 },
];

const mockProducts = [
  { id: 1, name: "Organic Cotton T-Shirt", category: "T-Shirts", price: 299000, stock: 0, status: "Active" },
  { id: 2, name: "Eco Fleece Hoodie", category: "Hoodies", price: 599000, stock: 0, status: "Active" },
];

const mockDesigns = [
  { id: 1, name: "Minimalist Nature", artist: "Green Artist", status: "Approved", sales: 89, image: imgRectangle18 },
  { id: 2, name: "Save The Planet", artist: "Eco Designer", status: "Pending", sales: 45, image: imgRectangle17 },
];

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Admin tabs data
  const [inventory, setInventory] = useState<any[]>([]);
  const [packaging, setPackaging] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [printMethods, setPrintMethods] = useState<any[]>([]);
  const [returnReasons, setReturnReasons] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rewardCatalog, setRewardCatalog] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  // Filter states for users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [designStatusFilter, setDesignStatusFilter] = useState<string>('all');
  
  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [designsPage, setDesignsPage] = useState(1);
  const [designsTotalPages, setDesignsTotalPages] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (token && user?.role === 'admin') {
      loadAdminData();
    } else {
      setError('Truy cập bị từ chối. Yêu cầu quyền quản trị.');
      setLoading(false);
    }
  }, [token, user]);

  // Load paginated data when page or filters change
  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'orders') {
      setOrdersPage(1); // Reset to page 1 when filter changes
      loadOrdersPage();
    }
  }, [orderStatusFilter, orderSearch, token, user, activeTab]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'orders' && ordersPage > 0) {
      loadOrdersPage();
    }
  }, [ordersPage]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'products') {
      setProductsPage(1);
      loadProductsPage();
    }
  }, [productCategoryFilter, productSearch, token, user, activeTab]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'products' && productsPage > 0) {
      loadProductsPage();
    }
  }, [productsPage]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'designs') {
      setDesignsPage(1);
      loadDesignsPage();
    }
  }, [designStatusFilter, token, user, activeTab]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'designs' && designsPage > 0) {
      loadDesignsPage();
    }
  }, [designsPage]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'users') {
      setUsersPage(1);
      loadUsersPage();
    }
  }, [userRoleFilter, userSearch, token, user, activeTab]);

  useEffect(() => {
    if (token && user?.role === 'admin' && activeTab === 'users' && usersPage > 0) {
      loadUsersPage();
    }
  }, [usersPage]);

  // Debug dialog state - REMOVED to prevent console spam

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!token) return;

      // Load all data in parallel
      const results = await Promise.all([
        apiServices.orders.getAll(token).catch(() => ({ orders: [] })),
        // Orders Stats
        apiServices.orders.getStats(token).catch(() => null),
        // Users Stats
        apiServices.users.getStats(token).catch(() => null),
        apiServices.products.getAll(1, 100).catch(() => ({ products: [] })),
        apiServices.designs.getAll(1, 100).catch(() => ({ designs: [] })),
        apiServices.inventory.getStock(token).catch(() => ({ stock: [] })),
        apiServices.packaging.getAll(token).catch(() => ({ packaging: [] })),
        apiServices.sizes.getAll(token).catch(() => ({ sizes: [] })),
        apiServices.materials.getAll(token).catch(() => ({ materials: [] })),
        apiServices.printMethods.getAll(token).catch(() => ({ printMethods: [] })),
        apiServices.returnReasons.getAll(token).catch(() => ({ returnReasons: [] })),
        apiServices.employees.getAll(token).catch(() => ({ employees: [] })),
        apiServices.assets.getAll(token).catch(() => ({ assets: [] })),
        apiServices.categories.getAll().catch(() => []),
        // Admin user list
        apiServices.users.getAll(token, { page: 1, limit: 100 }).catch(() => ({ users: [], total: 0 })),
        // Reward catalog admin (if available)
        apiServices.rewards.catalogGetAll(token).catch(() => []),
        // Payment methods
        apiServices.paymentMethods.getAll(token).catch(() => []),
      ]);

      const [
        ordersData,
        ordersStatsData,
        usersStatsData,
        productsData,
        designsData,
        inventoryData,
        packagingData,
        sizesData,
        materialsData,
        printMethodsData,
        returnReasonsData,
        employeesData,
        assetsData,
        categoriesData,
        usersData,
        rewardCatalogData,
        paymentMethodsData,
      ] = results as any[];

      const ordersList = ordersData.orders || ordersData || [];
      const productsList = productsData.products || [];
      const designsList = designsData.designs || [];
      
      setOrders(ordersList);
      setProducts(productsList);
      setDesigns(designsList);
      setInventory(inventoryData.stock || inventoryData || []);
      setPackaging(packagingData.packaging || packagingData || []);
      setSizes(sizesData.sizes || sizesData || []);
      setMaterials(materialsData.materials || materialsData || []);
      setPrintMethods(printMethodsData.printMethods || printMethodsData || []);
      setReturnReasons(returnReasonsData.returnReasons || returnReasonsData || []);
      setEmployees(employeesData.employees || employeesData || []);
      setAssets(assetsData.assets || assetsData || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setUsersList(usersData?.users || usersData || []);
      setRewardCatalog(Array.isArray(rewardCatalogData) ? rewardCatalogData : []);
      setPaymentMethods(Array.isArray(paymentMethodsData) ? paymentMethodsData : []);

      // Calculate stats from API data
      const revenue = ordersStatsData?.totalRevenue 
        ? (typeof ordersStatsData.totalRevenue === 'string' ? parseFloat(ordersStatsData.totalRevenue) : Number(ordersStatsData.totalRevenue) || 0)
        : ordersList.reduce((sum: number, o: any) => {
            const total = o.totalAmount || o.Total || o.total || 0;
            return sum + (typeof total === 'string' ? parseFloat(total) : Number(total) || 0);
          }, 0);
      
      const totalOrders = ordersStatsData?.totalOrders || ordersList.length;
      const activeUsers = usersStatsData?.activeUsers || usersList.filter((u: any) => u.isActive !== false).length || 0;
      
      // Calculate CO2 saved: approximate 2kg CO2 per order (or null if no orders)
      const co2Saved = ordersList.length > 0 ? ordersList.length * 2 : null;
      
      setStats({
        revenue,
        orders: totalOrders,
        users: activeUsers,
        co2Saved
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu quản trị';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Load paginated data functions
  const loadOrdersPage = async () => {
    try {
      if (!token) return;
      const params: any = { page: ordersPage, limit: ITEMS_PER_PAGE };
      if (orderStatusFilter !== 'all') {
        params.status = orderStatusFilter;
      }
      const response = await apiServices.orders.getAll(token, params) as any;
      const ordersList = response.orders || [];
      setOrders(ordersList);
      setOrdersTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const loadProductsPage = async () => {
    try {
      if (!token) return;
      const params: any = {};
      if (productCategoryFilter !== 'all') {
        params.categoryId = productCategoryFilter;
      }
      if (productSearch) {
        params.search = productSearch;
      }
      const response = await apiServices.products.getAll(productsPage, ITEMS_PER_PAGE, params) as any;
      const productsList = response.products || [];
      setProducts(productsList);
      setProductsTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const loadDesignsPage = async () => {
    try {
      if (!token) return;
      const offset = (designsPage - 1) * ITEMS_PER_PAGE;
      const params: any = { limit: ITEMS_PER_PAGE, offset };
      if (designStatusFilter !== 'all') {
        params.status = designStatusFilter;
      }
      const response = await apiServices.designs.getAll(designsPage, ITEMS_PER_PAGE, params) as any;
      const designsList = response.designs || response || [];
      setDesigns(designsList);
      const total = response.total || designsList.length;
      setDesignsTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Failed to load designs:', err);
    }
  };

  const loadUsersPage = async () => {
    try {
      if (!token) return;
      const params: any = { page: usersPage, limit: ITEMS_PER_PAGE };
      if (userRoleFilter !== 'all') {
        params.role = userRoleFilter;
      }
      if (userSearch) {
        params.search = userSearch;
      }
      const response = await apiServices.users.getAll(token, params) as any;
      const usersList = response.users || [];
      setUsersList(usersList);
      setUsersTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      if (!token) return;
      await apiServices.admin.updateOrderStatus(orderId, newStatus, token);
      toast.success('Đã cập nhật trạng thái đơn hàng');
      await loadOrdersPage(); // Reload current page
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật đơn hàng';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleApproveDesign = async (designId: string) => {
    try {
      if (!token) return;
      await apiServices.admin.updateDesignStatus(designId, 'approved', token);
      toast.success('Đã phê duyệt thiết kế');
      await loadAdminData(); // Reload data
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể phê duyệt thiết kế';
      setError(msg);
      toast.error(msg);
    }
  };

  // Product CRUD handlers
  const handleOpenProductDialog = (type: 'create' | 'edit', product?: any) => {
    console.log('handleOpenProductDialog called', { type, product });
    setDialogType(type);
    setEditingItem(product || null);
    setFormData(product ? {
      name: product.name || '',
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      oldPrice: product.oldPrice || 0,
      stock: product.stock || 0,
      quantity: product.quantity || 0,
      image: product.image || '',
      categoryId: typeof product.category === 'object' ? product.category.id : product.categoryId || '',
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== undefined ? product.isActive : true,
    } : {
      name: '',
      title: '',
      description: '',
      price: 0,
      oldPrice: 0,
      stock: 0,
      quantity: 0,
      image: '',
      categoryId: '',
      isNew: false,
      isFeatured: false,
      isActive: true,
    });
    console.log('Setting isDialogOpen to true');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDialogType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleSaveProduct = async () => {
    try {
      if (!token) return;
      setError(null);
      
      // Validation
      if (dialogType === 'create') {
        if (!formData.name || !formData.name.trim()) {
          const msg = 'Vui lòng nhập tên sản phẩm';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.title || !formData.title.trim()) {
          const msg = 'Vui lòng nhập tiêu đề sản phẩm';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.description || !formData.description.trim()) {
          const msg = 'Vui lòng nhập mô tả sản phẩm';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.price || formData.price < 0) {
          const msg = 'Vui lòng nhập giá sản phẩm hợp lệ (>= 0)';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.categoryId) {
          const msg = 'Vui lòng chọn danh mục';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.stock || formData.stock < 0) {
          const msg = 'Vui lòng nhập tồn kho hợp lệ (>= 0)';
          setError(msg);
          toast.error(msg);
          return;
        }
        if (!formData.quantity || formData.quantity < 0) {
          const msg = 'Vui lòng nhập số lượng hợp lệ (>= 0)';
          setError(msg);
          toast.error(msg);
          return;
        }
      }
      
      // Prepare data
      const dataToSend = {
        ...formData,
        price: Number(formData.price) || 0,
        oldPrice: Number(formData.oldPrice) || 0,
        stock: Number(formData.stock) || 0,
        quantity: Number(formData.quantity) || 0,
      };
      
      if (dialogType === 'create') {
        await apiServices.products.create(dataToSend, token);
        toast.success('Đã tạo sản phẩm mới');
      } else if (dialogType === 'edit' && editingItem) {
        await apiServices.products.update(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật sản phẩm');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu sản phẩm';
      setError(msg);
      toast.error(msg);
    }
  };

  // User CRUD handlers
  const handleSaveUser = async () => {
    try {
      if (!token) return;
      setError(null);
      
      if (!formData.email || !formData.email.trim()) {
        const msg = 'Vui lòng nhập email';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      const dataToSend: any = {
        email: formData.email.trim(),
        name: formData.name?.trim() || '',
        phone: formData.phone?.trim() || '',
        role: formData.role || 'user',
        isActive: formData.isActive !== false,
      };
      
      if (dialogType === 'create-user') {
        if (!formData.password || formData.password.length < 6) {
          const msg = 'Vui lòng nhập mật khẩu (tối thiểu 6 ký tự)';
          setError(msg);
          toast.error(msg);
          return;
        }
        dataToSend.password = formData.password;
        await apiServices.users.create(dataToSend, token);
        toast.success('Đã tạo người dùng mới');
      } else if (dialogType === 'edit-user' && editingItem) {
        await apiServices.users.update(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật người dùng');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu người dùng';
      setError(msg);
      toast.error(msg);
    }
  };

  // Material CRUD handlers
  const handleSaveMaterial = async () => {
    try {
      if (!token) return;
      setError(null);
      
      if (!formData.name || !formData.name.trim()) {
        const msg = 'Vui lòng nhập tên chất liệu';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        isActive: formData.isActive !== false,
      };
      
      if (dialogType === 'create-material') {
        await apiServices.materials.create(dataToSend, token);
        toast.success('Đã thêm chất liệu mới');
      } else if (dialogType === 'edit-material' && editingItem) {
        await apiServices.materials.update(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật chất liệu');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu chất liệu';
      setError(msg);
      toast.error(msg);
    }
  };

  // Print Method CRUD handlers
  const handleSavePrintMethod = async () => {
    try {
      if (!token) return;
      setError(null);
      
      if (!formData.name || !formData.name.trim()) {
        const msg = 'Vui lòng nhập tên phương thức in';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        isActive: formData.isActive !== false,
      };
      
      if (dialogType === 'create-print-method') {
        await apiServices.printMethods.create(dataToSend, token);
        toast.success('Đã thêm phương thức in mới');
      } else if (dialogType === 'edit-print-method' && editingItem) {
        await apiServices.printMethods.update(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật phương thức in');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu phương thức in';
      setError(msg);
      toast.error(msg);
    }
  };

  // Payment Method CRUD handlers
  const handleSavePaymentMethod = async () => {
    try {
      if (!token) return;
      setError(null);
      
      if (!formData.name || !formData.name.trim()) {
        const msg = 'Vui lòng nhập tên phương thức thanh toán';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!formData.type || !formData.type.trim()) {
        const msg = 'Vui lòng chọn loại phương thức thanh toán';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      const dataToSend = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        isActive: formData.isActive !== false,
        isDefault: formData.isDefault || false,
      };
      
      if (dialogType === 'create-payment-method') {
        await apiServices.paymentMethods.create(dataToSend, token);
        toast.success('Đã thêm phương thức thanh toán mới');
      } else if (dialogType === 'edit-payment-method' && editingItem) {
        await apiServices.paymentMethods.update(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật phương thức thanh toán');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu phương thức thanh toán';
      setError(msg);
      toast.error(msg);
    }
  };

  // Reward Catalog CRUD handlers
  const handleSaveReward = async () => {
    try {
      if (!token) return;
      setError(null);
      
      if (!formData.name || !formData.name.trim()) {
        const msg = 'Vui lòng nhập tên phần thưởng';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!formData.pointsRequired || formData.pointsRequired <= 0) {
        const msg = 'Vui lòng nhập số điểm yêu cầu hợp lệ';
        setError(msg);
        toast.error(msg);
        return;
      }
      
      const dataToSend = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        pointsRequired: Number(formData.pointsRequired),
        type: formData.type || 'voucher',
        discountValue: Number(formData.discountValue) || 0,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        isActive: formData.isActive !== false,
      };
      
      if (dialogType === 'create-reward') {
        await apiServices.rewards.catalogCreate(dataToSend, token);
        toast.success('Đã thêm phần thưởng mới');
      } else if (dialogType === 'edit-reward' && editingItem) {
        await apiServices.rewards.catalogUpdate(editingItem.id, dataToSend, token);
        toast.success('Đã cập nhật phần thưởng');
      }
      
      await loadAdminData();
      handleCloseDialog();
    } catch (err: any) {
      const msg = err?.message || 'Không thể lưu phần thưởng. Backend có thể chưa hỗ trợ admin CRUD reward catalog.';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      if (!token) return;
      await apiServices.products.delete(productId, token);
      toast.success('Đã xóa sản phẩm');
      await loadAdminData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa sản phẩm';
      setError(msg);
      toast.error(msg);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = !productSearch || 
      product.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.title?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || 
      (typeof product.category === 'object' ? product.category.id === productCategoryFilter : product.categoryId === productCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Filter orders (client-side search only, status filter is server-side)
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = !orderSearch || 
      order.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (typeof order.customer === 'object' ? order.customer.email : order.customer)?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesSearch;
  });

  // Designs are already filtered server-side
  const filteredDesigns = designs;

  if (error && !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-gray-600 mb-4">Admin privileges required</p>
          <a href="#login" className="text-[#ca6946] hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading text="Đang tải bảng điều khiển quản trị..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#BCF181] rounded-lg p-2">
              <Leaf className="w-6 h-6 text-green-800" />
            </div>
            <div>
              <h1 className="font-bold">Quản trị Sustainique</h1>
              <p className="text-xs text-gray-600">Quản lý In theo yêu cầu</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-black">
              Xem cửa hàng →
            </button>
            <a href="#home" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "dashboard" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Bảng điều khiển</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "orders" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Đơn hàng</span>
              {(() => {
                const pendingOrders = orders.filter((order: any) => {
                  const status = (order.Status || order.status || '').toLowerCase();
                  return status === 'pending' || status === 'processing' || status === 'printing';
                }).length;
                return pendingOrders > 0 ? (
                  <Badge className="ml-auto" variant="destructive">{pendingOrders}</Badge>
                ) : null;
              })()}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "products" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <Package className="w-5 h-5" />
              <span>Sản phẩm</span>
            </button>

            <button
              onClick={() => setActiveTab("designs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "designs" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <Palette className="w-5 h-5" />
              <span>Thiết kế</span>
            </button>

            <button
              onClick={() => setActiveTab("green")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "green" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <Leaf className="w-5 h-5" />
              <span>Quản lý Xanh</span>
            </button>

            <button
              onClick={() => setActiveTab("rewards")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "rewards" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <Gift className="w-5 h-5" />
              <span>Phần thưởng</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "users" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                }`}
            >
              <Users className="w-5 h-5" />
              <span>Người dùng</span>
            </button>

            <div className="pt-4 mt-4 border-t">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Vận hành</p>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "inventory" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <Warehouse className="w-5 h-5" />
                <span>Kho hàng</span>
              </button>

              <button
                onClick={() => setActiveTab("packaging")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "packaging" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <Box className="w-5 h-5" />
                <span>Đóng gói</span>
              </button>

              <button
                onClick={() => setActiveTab("catalogs")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "catalogs" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <Ruler className="w-5 h-5" />
                <span>Danh mục</span>
              </button>

              <button
                onClick={() => setActiveTab("return-reasons")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "return-reasons" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <FileText className="w-5 h-5" />
                <span>Lý do đổi trả</span>
              </button>

              <button
                onClick={() => setActiveTab("employees")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "employees" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <UserCog className="w-5 h-5" />
                <span>Nhân viên</span>
              </button>

              <button
                onClick={() => setActiveTab("assets")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "assets" ? "bg-[#BCF181] text-black" : "hover:bg-gray-100"
                  }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Tài sản</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="font-['Lora'] mb-8">Tổng quan bảng điều khiển</h2>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                    <DollarSign className="w-4 h-4 text-gray-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">{(stats?.revenue || 0).toLocaleString('vi-VN')}₫</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                    <ShoppingBag className="w-4 h-4 text-gray-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">{stats?.orders || orders.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
                    <Users className="w-4 h-4 text-gray-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold text-2xl">{stats?.users || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Tác động Xanh</CardTitle>
                    <Leaf className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    {stats?.co2Saved !== null && stats?.co2Saved !== undefined ? (
                      <>
                        <div className="font-bold text-2xl">{stats.co2Saved}kg</div>
                        <p className="text-xs text-gray-600 mt-1">CO₂ Tiết kiệm (ước tính)</p>
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">Chưa có dữ liệu</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng gần đây</CardTitle>
                  <CardDescription>Đơn hàng khách hàng mới nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {typeof order.customer === 'object' && order.customer !== null
                              ? order.customer.name || order.customer.email || order.user?.email || 'N/A'
                              : order.customer || order.user?.email || 'N/A'}
                          </p>
                        </div>
                        <Badge variant={order.status === "Processing" ? "default" : order.status === "Shipped" ? "outline" : "secondary"}>
                          {order.status}
                        </Badge>
                        <p className="font-bold">
                          {(() => {
                            const total = order.totalAmount || order.Total || order.total || 0;
                            const totalNum = typeof total === 'string' ? parseFloat(total) : Number(total) || 0;
                            return totalNum.toLocaleString('vi-VN') + '₫';
                          })()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Management */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Lora']">Quản lý đơn hàng</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Tìm kiếm đơn hàng..." 
                      className="pl-10"
                      value={orderSearch}
                      onChange={(e) => {
                        setOrderSearch(e.target.value);
                        setOrdersPage(1);
                      }}
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={(value) => {
                    setOrderStatusFilter(value);
                    setOrdersPage(1); // Reset to page 1 when filter changes
                  }}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="printing">Đang in</SelectItem>
                      <SelectItem value="shipped">Đã gửi</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium">Mã đơn hàng</th>
                          <th className="text-left p-4 font-medium">Khách hàng</th>
                          <th className="text-left p-4 font-medium">Ngày</th>
                          <th className="text-left p-4 font-medium">Trạng thái</th>
                          <th className="text-left p-4 font-medium">Tổng tiền</th>
                          <th className="text-left p-4 font-medium">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              Không tìm thấy đơn hàng
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order: any) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{order.id}</td>
                              <td className="p-4">{order.user?.email || order.customer || 'N/A'}</td>
                              <td className="p-4 text-sm text-gray-600">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : order.date}
                              </td>
                              <td className="p-4">
                                <Badge>{order.Status || order.status || 'Pending'}</Badge>
                              </td>
                              <td className="p-4 font-bold">
                                {(() => {
                                  const total = order.totalAmount || order.Total || order.total || 0;
                                  const totalNum = typeof total === 'string' ? parseFloat(total) : Number(total) || 0;
                                  return totalNum.toLocaleString('vi-VN') + '₫';
                                })()}
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => window.location.hash = `#order-success?id=${order.id}`}
                                    className="p-2 hover:bg-gray-100 rounded"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                    className="p-2 hover:bg-gray-100 rounded"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Management */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Lora']">Quản lý sản phẩm</h2>
                <button 
                  onClick={() => handleOpenProductDialog('create')}
                  className="flex items-center gap-2 bg-[#ca6946] text-white px-4 py-2 rounded-lg hover:bg-[#b55835]"
                >
                  <Plus className="w-4 h-4" />
                  Thêm sản phẩm
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="pl-10"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductsPage(1);
                    }}
                  />
                </div>
                <Select value={productCategoryFilter} onValueChange={(value) => {
                  setProductCategoryFilter(value);
                  setProductsPage(1);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories && categories.length > 0 ? categories.map((cat: any) => (
                      <SelectItem key={cat.id || cat.name} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="" disabled>Không có danh mục</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium">Tên sản phẩm</th>
                          <th className="text-left p-4 font-medium">Danh mục</th>
                          <th className="text-left p-4 font-medium">Giá</th>
                          <th className="text-left p-4 font-medium">Tồn kho POD</th>
                          <th className="text-left p-4 font-medium">Trạng thái</th>
                          <th className="text-left p-4 font-medium">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">
                              Không tìm thấy sản phẩm
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product: any) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{product.name}</td>
                              <td className="p-4">
                                {typeof product.category === 'object' && product.category !== null
                                  ? product.category.name || product.category.title || 'N/A'
                                  : product.category || 'N/A'}
                              </td>
                              <td className="p-4">{(product.price || 0).toLocaleString('vi-VN')}₫</td>
                              <td className="p-4">
                                <Badge variant="outline">On-Demand</Badge>
                              </td>
                              <td className="p-4">
                                <Badge variant={product.isActive ? "default" : "secondary"}>
                                  {product.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOpenProductDialog('edit', product)}
                                    className="p-2 hover:bg-gray-100 rounded"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {productsTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={productsPage}
                    totalPages={productsTotalPages}
                    onPageChange={setProductsPage}
                    maxVisiblePages={5}
                  />
                </div>
              )}
            </div>
          )}

          {/* Designs Management */}
          {activeTab === "designs" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Lora']">Quản lý thiết kế</h2>
                <div className="flex gap-3">
                  <Select value={designStatusFilter} onValueChange={(value) => {
                    setDesignStatusFilter(value);
                    setDesignsPage(1);
                  }}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="approved">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredDesigns.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    Không tìm thấy thiết kế
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigns.map((design: any) => (
                    <Card key={design.id}>
                      <div className="aspect-square bg-gray-100">
                        <img src={design.image || "https://images.unsplash.com/photo-1655141559787-25ac8cfca72f?w=400"} alt={design.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium mb-1">{design.name}</h3>
                            <p className="text-sm text-gray-600">by {design.creator || 'Unknown'}</p>
                          </div>
                          <Badge variant={design.status === "approved" ? "default" : "secondary"}>
                            {design.status || 'pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{design.downloads || 0} lượt tải</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.location.hash = `#design-detail?id=${design.id}`}
                            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                          >
                            Xem
                          </button>
                          {design.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveDesign(design.id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                              Duyệt
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {designsTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={designsPage}
                    totalPages={designsTotalPages}
                    onPageChange={setDesignsPage}
                    maxVisiblePages={5}
                  />
                </div>
              )}
            </div>
          )}

          {/* Green Management */}
          {activeTab === "green" && (
            <div>
              <h2 className="font-['Lora'] mb-8">Quản lý Xanh</h2>

              <Tabs defaultValue="materials">
                <TabsList>
                  <TabsTrigger value="materials">Chất liệu</TabsTrigger>
                  <TabsTrigger value="inks">Loại mực</TabsTrigger>
                  <TabsTrigger value="certifications">Chứng nhận</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                      <CardTitle>Chất liệu bền vững</CardTitle>
                      <CardDescription>Quản lý chất liệu thân thiện môi trường</CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            setDialogType('create-material');
                            setEditingItem(null);
                            setFormData({ name: '', description: '', isActive: true });
                            setIsDialogOpen(true);
                          }}
                          className="bg-[#BCF181] hover:bg-[#a8d76d] text-black"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Thêm chất liệu
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {materials.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          Chưa có chất liệu nào. Hãy thêm chất liệu mới để bắt đầu.
                        </div>
                      ) : (
                      <div className="space-y-4">
                          {materials.map((material: any) => (
                            <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Leaf className="w-5 h-5 text-green-700" />
                              <div>
                                  <p className="font-medium">{material.name || material.materialName}</p>
                                  <p className="text-sm text-gray-600">{material.description || 'Chất liệu thân thiện môi trường'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDialogType('edit-material');
                                    setEditingItem(material);
                                    setFormData({
                                      name: material.name || material.materialName || '',
                                      description: material.description || '',
                                      isActive: material.isActive !== false,
                                    });
                                    setIsDialogOpen(true);
                                  }}
                                >
                                <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    if (!confirm(`Bạn có chắc muốn xóa chất liệu ${material.name || material.materialName}?`)) return;
                                    if (!token) return;
                                    try {
                                      await apiServices.materials.delete(material.id, token);
                                      toast.success('Đã xóa chất liệu');
                                      loadAdminData();
                                    } catch (err: any) {
                                      toast.error('Không thể xóa chất liệu: ' + (err?.message || 'Lỗi không xác định'));
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inks" className="mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Phương thức in</CardTitle>
                          <CardDescription>Quản lý phương thức in thân thiện môi trường</CardDescription>
                        </div>
                        <Button
                          onClick={() => {
                            setDialogType('create-print-method');
                            setEditingItem(null);
                            setFormData({ name: '', description: '', isActive: true });
                            setIsDialogOpen(true);
                          }}
                          className="bg-[#BCF181] hover:bg-[#a8d76d] text-black"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Thêm phương thức in
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {printMethods.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          Chưa có phương thức in nào. Hãy thêm phương thức in mới để bắt đầu.
                        </div>
                      ) : (
                      <div className="space-y-4">
                          {printMethods.map((method: any) => (
                            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">{method.name || method.methodName}</p>
                                <p className="text-sm text-gray-600">{method.description || 'Phương thức in thân thiện môi trường'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDialogType('edit-print-method');
                                    setEditingItem(method);
                                    setFormData({
                                      name: method.name || method.methodName || '',
                                      description: method.description || '',
                                      isActive: method.isActive !== false,
                                    });
                                    setIsDialogOpen(true);
                                  }}
                                >
                                <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    if (!confirm(`Bạn có chắc muốn xóa phương thức in ${method.name || method.methodName}?`)) return;
                                    if (!token) return;
                                    try {
                                      await apiServices.printMethods.delete(method.id, token);
                                      toast.success('Đã xóa phương thức in');
                                      loadAdminData();
                                    } catch (err: any) {
                                      toast.error('Không thể xóa phương thức in: ' + (err?.message || 'Lỗi không xác định'));
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Rewards Management */}
          {activeTab === "rewards" && (
            <div>
              <h2 className="font-['Lora'] mb-8">Quản lý phần thưởng</h2>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Danh mục Phần thưởng</CardTitle>
                      <CardDescription>Quản lý phần thưởng có thể đổi bằng điểm (bao gồm voucher, giảm giá, sản phẩm miễn phí)</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setDialogType('create-reward');
                        setEditingItem(null);
                        setFormData({
                          name: '',
                          description: '',
                          pointsRequired: 0,
                          type: 'voucher',
                          discountValue: 0,
                          minOrderAmount: 0,
                          isActive: true,
                        });
                        setIsDialogOpen(true);
                      }}
                      className="bg-[#ca6946] hover:bg-[#b55835] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm phần thưởng
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {rewardCatalog.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p>Chưa có phần thưởng nào. Hãy thêm phần thưởng mới để bắt đầu.</p>
                      <p className="text-sm mt-2">Lưu ý: Backend có thể chưa hỗ trợ admin CRUD reward catalog.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rewardCatalog.map((reward: any) => (
                        <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-bold text-lg">{reward.name}</p>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {reward.pointsRequired} điểm • {reward.type === 'voucher' ? 'Voucher' : reward.type}
                              {reward.discountValue > 0 && ` • Giảm ${reward.discountValue}${reward.type === 'PERCENTAGE' ? '%' : '₫'}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={reward.isActive ? 'default' : 'secondary'}>
                              {reward.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDialogType('edit-reward');
                                setEditingItem(reward);
                                setFormData({
                                  name: reward.name,
                                  description: reward.description,
                                  pointsRequired: reward.pointsRequired,
                                  type: reward.type,
                                  discountValue: reward.discountValue || 0,
                                  minOrderAmount: reward.minOrderAmount || 0,
                                  isActive: reward.isActive !== false,
                                });
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                if (!confirm(`Bạn có chắc muốn xóa phần thưởng ${reward.name}?`)) return;
                                if (!token) return;
                                try {
                                  await apiServices.rewards.catalogDelete(reward.id, token);
                                  toast.success('Đã xóa phần thưởng');
                                  loadAdminData();
                                } catch (err: any) {
                                  toast.error('Không thể xóa phần thưởng: ' + (err?.message || 'Backend có thể chưa hỗ trợ admin CRUD reward catalog'));
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Management */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Lora']">Quản lý người dùng</h2>
                <Button
                  onClick={() => {
                    setDialogType('create-user');
                    setEditingItem(null);
                    setFormData({ role: 'user', isActive: true });
                    setIsDialogOpen(true);
                  }}
                  className="bg-[#ca6946] hover:bg-[#b55835] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm người dùng
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm theo email, tên..."
                    className="pl-10"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUsersPage(1);
                    }}
                  />
                </div>
                <Select value={userRoleFilter} onValueChange={(value) => {
                  setUserRoleFilter(value);
                  setUsersPage(1);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usersList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              Không có người dùng nào
                            </td>
                          </tr>
                        ) : (
                          usersList.map((user: any) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role === 'admin' ? 'Quản trị' : 'Người dùng'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={user.isActive !== false ? 'default' : 'destructive'}>
                                  {user.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setDialogType('edit-user');
                                      setEditingItem(user);
                                      setFormData({
                                        email: user.email,
                                        name: user.name,
                                        phone: user.phone,
                                        role: user.role,
                                        isActive: user.isActive !== false,
                                      });
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  {user.isActive !== false ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        if (!token) return;
                                        try {
                                          await apiServices.users.deactivate(user.id, token);
                                          toast.success('Đã khóa tài khoản người dùng');
                                          loadAdminData();
                                        } catch (err: any) {
                                          toast.error('Không thể khóa tài khoản: ' + (err?.message || 'Lỗi không xác định'));
                                        }
                                      }}
                                    >
                                      <AlertCircle className="w-4 h-4 text-orange-600" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={async () => {
                                        if (!token) return;
                                        try {
                                          await apiServices.users.activate(user.id, token);
                                          toast.success('Đã kích hoạt tài khoản người dùng');
                                          loadAdminData();
                                        } catch (err: any) {
                                          toast.error('Không thể kích hoạt tài khoản: ' + (err?.message || 'Lỗi không xác định'));
                                        }
                                      }}
                                    >
                                      <UserCog className="w-4 h-4 text-green-600" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                      if (!confirm(`Bạn có chắc muốn xóa người dùng ${user.email}?`)) return;
                                      if (!token) return;
                                      try {
                                        await apiServices.users.delete(user.id, token);
                                        toast.success('Đã xóa người dùng');
                                        loadAdminData();
                                      } catch (err: any) {
                                        toast.error('Không thể xóa người dùng: ' + (err?.message || 'Lỗi không xác định'));
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {usersTotalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={usersPage}
                    totalPages={usersTotalPages}
                    onPageChange={setUsersPage}
                    maxVisiblePages={5}
                  />
                </div>
              )}
            </div>
          )}

        </main>

        {/* Product Dialog - Rendered outside main to avoid container constraints */}
        {isDialogOpen && dialogType !== '' && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={handleCloseDialog}
            style={{ position: 'fixed', zIndex: 9999 }}
          >
            <div 
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 relative"
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', zIndex: 10000 }}
            >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {dialogType === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                  </h2>
                  <button 
                    onClick={handleCloseDialog}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center"
                    type="button"
                    aria-label="Đóng"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {(dialogType === 'create' || dialogType === 'edit') ? (dialogType === 'create' ? 'Điền thông tin để tạo sản phẩm mới' : 'Cập nhật thông tin sản phẩm') :
                   (dialogType === 'create-user' || dialogType === 'edit-user') ? (dialogType === 'create-user' ? 'Điền thông tin để tạo người dùng mới' : 'Cập nhật thông tin người dùng') :
                   (dialogType === 'create-reward' || dialogType === 'edit-reward') ? (dialogType === 'create-reward' ? 'Điền thông tin để thêm phần thưởng mới' : 'Cập nhật thông tin phần thưởng') :
                   ''}
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Product Form */}
                {(dialogType === 'create' || dialogType === 'edit') && (
                <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tên sản phẩm *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: Áo thun Organic Cotton"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ví dụ: Áo thun thân thiện môi trường"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả *</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Giá (₫) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price || 0}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="oldPrice">Giá cũ (₫)</Label>
                    <Input
                      id="oldPrice"
                      type="number"
                      min="0"
                      value={formData.oldPrice || 0}
                      onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Danh mục *</Label>
                    <Select 
                      value={formData.categoryId || ''} 
                      onValueChange={(value) => setFormData({...formData, categoryId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent 
                        className="max-h-[200px] overflow-y-auto z-[10001]" 
                        style={{ zIndex: 10001 }} 
                        position="popper"
                      >
                        {categories && categories.length > 0 ? categories.map((cat: any) => (
                          <SelectItem key={cat.id || cat.name} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        )) : (
                          <SelectItem value="" disabled>Không có danh mục</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock">Tồn kho</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Số lượng</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity || 0}
                      onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">URL Hình ảnh</Label>
                    <Input
                      id="image"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isNew">Sản phẩm mới</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isFeatured">Nổi bật</Label>
                  </div>
                  {dialogType === 'edit' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive !== undefined ? formData.isActive : true}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="isActive">Kích hoạt</Label>
                    </div>
                  )}
                </div>
                </div>
                )}

                {/* User Form */}
                {(dialogType === 'create-user' || dialogType === 'edit-user') && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="user-email">Email *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="user@example.com"
                      disabled={dialogType === 'edit-user'}
                    />
                  </div>
                  {dialogType === 'create-user' && (
                    <div>
                      <Label htmlFor="user-password">Mật khẩu *</Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Tối thiểu 6 ký tự"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-name">Tên</Label>
                      <Input
                        id="user-name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Tên người dùng"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-phone">Số điện thoại</Label>
                      <Input
                        id="user-phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="user-role">Vai trò *</Label>
                    <Select value={formData.role || 'user'} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent 
                        position="popper"
                        style={{ zIndex: 10001 }}
                        className="z-[10001]"
                      >
                        <SelectItem value="user">Người dùng</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="user-active"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="user-active">Tài khoản hoạt động</Label>
                  </div>
                </div>
                )}

                {/* Reward Catalog Form */}
                {(dialogType === 'create-reward' || dialogType === 'edit-reward') && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="reward-name">Tên phần thưởng *</Label>
                    <Input
                      id="reward-name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Voucher giảm giá 20%"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward-description">Mô tả</Label>
                    <textarea
                      id="reward-description"
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Mô tả về phần thưởng..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reward-points">Điểm yêu cầu *</Label>
                      <Input
                        id="reward-points"
                        type="number"
                        min="1"
                        value={formData.pointsRequired || 0}
                        onChange={(e) => setFormData({...formData, pointsRequired: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-type">Loại</Label>
                      <Select value={formData.type || 'voucher'} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent 
                          position="popper"
                          style={{ zIndex: 10001 }}
                          className="z-[10001]"
                        >
                          <SelectItem value="voucher">Voucher</SelectItem>
                          <SelectItem value="discount">Giảm giá</SelectItem>
                          <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reward-discount">Giá trị giảm giá</Label>
                      <Input
                        id="reward-discount"
                        type="number"
                        min="0"
                        value={formData.discountValue || 0}
                        onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-min-order">Đơn hàng tối thiểu (₫)</Label>
                      <Input
                        id="reward-min-order"
                        type="number"
                        min="0"
                        value={formData.minOrderAmount || 0}
                        onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="reward-active"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="reward-active">Hoạt động</Label>
                  </div>
                </div>
                )}

                {/* Material Form */}
                {(dialogType === 'create-material' || dialogType === 'edit-material') && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="material-name">Tên chất liệu *</Label>
                    <Input
                      id="material-name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: Organic Cotton"
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-description">Mô tả</Label>
                    <textarea
                      id="material-description"
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Mô tả về chất liệu..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="material-active"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="material-active">Hoạt động</Label>
                  </div>
                </div>
                )}

                {/* Print Method Form */}
                {(dialogType === 'create-print-method' || dialogType === 'edit-print-method') && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="print-method-name">Tên phương thức in *</Label>
                    <Input
                      id="print-method-name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: Water-Based Ink"
                    />
                  </div>
                  <div>
                    <Label htmlFor="print-method-description">Mô tả</Label>
                    <textarea
                      id="print-method-description"
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Mô tả về phương thức in..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="print-method-active"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="print-method-active">Hoạt động</Label>
                  </div>
                </div>
                )}

                {/* Payment Method Form */}
                {(dialogType === 'create-payment-method' || dialogType === 'edit-payment-method') && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="payment-method-name">Tên phương thức thanh toán *</Label>
                    <Input
                      id="payment-method-name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ví dụ: VNPay"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-method-type">Loại *</Label>
                    <Select value={formData.type || 'vnpay'} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vnpay">VNPay</SelectItem>
                        <SelectItem value="momo">MoMo</SelectItem>
                        <SelectItem value="cod">Thanh toán khi nhận hàng (COD)</SelectItem>
                        <SelectItem value="bank_transfer">Chuyển khoản ngân hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="payment-method-active"
                      checked={formData.isActive !== false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="payment-method-active">Hoạt động</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="payment-method-default"
                      checked={formData.isDefault || false}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="payment-method-default">Đặt làm mặc định</Label>
                  </div>
                </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Hủy
                  </Button>
                  <Button onClick={
                    (dialogType === 'create' || dialogType === 'edit') ? handleSaveProduct :
                    (dialogType === 'create-user' || dialogType === 'edit-user') ? handleSaveUser :
                    (dialogType === 'create-reward' || dialogType === 'edit-reward') ? handleSaveReward :
                    (dialogType === 'create-material' || dialogType === 'edit-material') ? handleSaveMaterial :
                    (dialogType === 'create-print-method' || dialogType === 'edit-print-method') ? handleSavePrintMethod :
                    (dialogType === 'create-payment-method' || dialogType === 'edit-payment-method') ? handleSavePaymentMethod :
                    handleCloseDialog
                  }>
                    <Save className="w-4 h-4 mr-2" />
                    {(dialogType === 'create' || dialogType === 'create-user' || dialogType === 'create-reward' || dialogType === 'create-material' || dialogType === 'create-print-method' || dialogType === 'create-payment-method') ? 'Tạo' : 'Lưu'}
                  </Button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
