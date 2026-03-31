import { Header } from './Header';
// Bỏ import ImageWithFallback để tránh lỗi
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import {
  Upload, Type, Image as ImageIcon, RotateCw, Trash2,
  ShoppingCart, ChevronRight, Leaf, ZoomIn, ZoomOut, Save, X,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas';
import { apiServices } from '../services/apiConfig';
import { useAuth } from '../hooks/useAuth';
import { Loading } from './ui/loading';
import { ErrorDisplay } from './ui/error';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'design';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  designId?: string; // Store design ID if from gallery
}

export function CustomizerPage() {
  const { getToken } = useAuth();
  const token = getToken();
  const [product, setProduct] = useState<any>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [designCategories, setDesignCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [zoomLevel, setZoomLevel] = useState(0.8); // Mặc định zoom nhỏ hơn chút để nhìn bao quát
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [showPrintArea, setShowPrintArea] = useState(false); // Ẩn Print Area mặc định
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const [loadingSavedDesigns, setLoadingSavedDesigns] = useState(false);
  const [selectedDesignPreview, setSelectedDesignPreview] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Debug: Log when selectedDesignPreview changes (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('selectedDesignPreview changed:', selectedDesignPreview);
    }
  }, [selectedDesignPreview]);

  // Text settings
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data khi component mount
  useEffect(() => {
    loadData();
  }, []);

  // Tính giá tiền
  useEffect(() => {
    if (!product || !selectedColor || !selectedSize) return;
    const fetchPrice = async () => {
      try {
        setIsCalculatingPrice(true);
        
        // Validate và filter các element hợp lệ
        const validElements = canvasElements.filter((el) => {
          if (el.type === 'text') {
            return el.content && el.content.trim().length > 0;
          } else if (el.type === 'design' || el.type === 'image') {
            return el.content && el.content.length > 0;
          }
          return false;
        });
        
        // Use ColorCode for SKU variant lookup
        const colorCode = selectedColor.ColorCode || selectedColor.name || 'BLACK';
        
        console.log('🎨 Calculating price:', {
          productId: product.id,
          selectedColor,
          colorCode,
          sizeCode: selectedSize,
        });
        
        const res = await apiServices.customizer.calculatePrice({
          productId: product.id,
          colorCode: colorCode,
          sizeCode: selectedSize,
          quantity: 1,
          canvasData: {
            elements: validElements.length > 0 ? validElements : [],
            selectedColor: selectedColor.hex || '#000000',
            selectedSize: selectedSize,
            quantity: 1,
          },
        }) as any;
        // Handle different response formats from backend
        const price = res.totalPrice || res.price || res.basePrice || 0;
        setCalculatedPrice(price);
      } catch (e: any) {
        console.error('Error calculating price:', e);
        // Fallback tính giá thủ công nếu API lỗi (404 hoặc lỗi khác)
        // Don't show alert - silently fallback to manual calculation
        const basePrice = product?.price || 0;
        const designPrice = 45000;
        setCalculatedPrice(
          basePrice +
            canvasElements.filter((el) => el.type === 'design').length *
              designPrice,
        );
      } finally {
        setIsCalculatingPrice(false);
      }
    };
    const timeoutId = setTimeout(() => fetchPrice(), 500);
    return () => clearTimeout(timeoutId);
  }, [canvasElements, selectedSize, selectedColor, product]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Lấy ID từ URL hash
      const hashString = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
      const urlParams = new URLSearchParams(hashString);
      const productId = urlParams.get('id') || urlParams.get('productId');
      const designId = urlParams.get('designId');

      if (!productId) {
        setError('Không tìm thấy ID sản phẩm. Vui lòng quay lại trang chủ chọn sản phẩm.');
        setLoading(false);
        return;
      }

      const [productData, designsData] = await Promise.all([
        apiServices.products.getById(productId) as Promise<any>,
        apiServices.designs.getAll(1, 100) as Promise<any>
      ]);

      setProduct(productData);
      const designsList = designsData.designs || [];
      setDesigns(designsList);
      setDesignCategories(groupDesignsByCategory(designsList));

      // Nếu có designId trong URL, tự động load design vào canvas
      if (designId) {
        try {
          const designData = await apiServices.designs.getById(designId) as any;
          if (designData) {
            // Transform design data to match addDesign format
            const designToAdd = {
              image: designData.preview_url || designData.image,
              preview_url: designData.preview_url,
              imageUrl: designData.assets?.[0]?.file_url,
              url: designData.preview_url,
              id: designData.DESIGN_ID || designData.id,
              assets: designData.assets || [],
            };
            // Add design to canvas after a short delay to ensure product is loaded
            setTimeout(() => {
              addDesign(designToAdd, designId);
              // Switch to designs tab to show the added design
              setActiveTab('designs');
            }, 500);
          }
        } catch (err) {
          console.warn('Failed to load design from URL:', err);
          // Don't show error - just continue without pre-loading design
        }
      }

      // Set default variants
      console.log('📦 Product data:', {
        colors: productData.colors,
        skuVariants: productData.skuVariants,
        productId: productData.id,
      });
      
      // Set color - with fallback to default
      if (productData.colors?.length > 0) {
        // Use first color from colors array
        console.log('✅ Setting first color from API:', productData.colors[0]);
        setSelectedColor(productData.colors[0]);
      } else {
        // Fallback - create a default color object
        console.warn('⚠️ No colors from API, using fallback');
        setSelectedColor({ 
          ColorCode: 'BLACK', 
          ColorName: 'Black', 
          hex: '#000000' 
        } as any);
      }
      
      // Set size
      if (productData.skuVariants?.length > 0) {
        // Extract first size from SKU variants
        const firstVariant = productData.skuVariants[0];
        console.log('✅ Setting first size:', firstVariant.SizeCode);
        setSelectedSize(firstVariant.SizeCode || 'M');
      } else {
        // Fallback to default size
        console.warn('⚠️ No SKU variants from API, using default size M');
        setSelectedSize('M');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const groupDesignsByCategory = (designsList: any[]): any[] => {
    const categoryMap = new Map<string, any[]>();
    designsList.forEach(design => {
      // Ensure category is always a string
      const category = String(design.category || 'other');
      if (!categoryMap.has(category)) categoryMap.set(category, []);
      categoryMap.get(category)!.push(design);
    });
    const categories: any[] = [];
    categoryMap.forEach((designs, categoryId) => {
      // categoryId should always be string now, but add safety check
      const categoryName = typeof categoryId === 'string' 
        ? categoryId.toUpperCase() 
        : String(categoryId || 'UNCATEGORIZED').toUpperCase();
      categories.push({ id: categoryId, name: categoryName, designs: designs });
    });
    return categories;
  };

  // --- ACTIONS: ADD TEXT/DESIGN ---
  const addText = () => {
    if (!textInput.trim()) return;
    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: textInput,
      x: 50, y: 50, width: 200, height: 50, rotation: 0,
      fontSize, fontFamily, color: textColor, textAlign,
    };
    setCanvasElements([...canvasElements, newElement]);
    setTextInput("");
  };

  const addDesign = (design: any, designId?: string) => {
    // Validate design has an image - check multiple possible fields
    const imageUrl = design.image || design.preview_url || design.imageUrl || design.url || design.assets?.[0]?.file_url || '';
    if (!imageUrl || imageUrl.trim() === '') {
      alert('Hình ảnh thiết kế không hợp lệ. Vui lòng chọn thiết kế khác.');
      return;
    }
    const newElement: CanvasElement = {
      id: `design-${Date.now()}`,
      type: 'design',
      content: imageUrl,
      x: 20, y: 20, width: 100, height: 100, rotation: 0,
      designId: designId || design.id || design.DESIGN_ID, // Store designId for reference
    };
    setCanvasElements([...canvasElements, newElement]);
    setSelectedElement(newElement.id);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl) {
        const newElement: CanvasElement = {
          id: `image-${Date.now()}`,
          type: 'image',
          content: imageUrl,
          x: 20, y: 20, width: 150, height: 150, rotation: 0,
        };
        setCanvasElements([...canvasElements, newElement]);
        setSelectedElement(newElement.id);
        // Switch to designs tab to see the uploaded image
        setActiveTab('designs');
      }
    };
    reader.onerror = () => {
      alert('Lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setCanvasElements(canvasElements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(canvasElements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newElements = [...canvasElements];
    const targetIndex = canvasElements.length - 1 - index;
    if (direction === 'up' && targetIndex < newElements.length - 1) {
      [newElements[targetIndex], newElements[targetIndex + 1]] = [newElements[targetIndex + 1], newElements[targetIndex]];
    } else if (direction === 'down' && targetIndex > 0) {
      [newElements[targetIndex], newElements[targetIndex - 1]] = [newElements[targetIndex - 1], newElements[targetIndex]];
    }
    setCanvasElements(newElements);
  };

  const capturePreview = async (): Promise<string> => {
    if (!canvasRef.current) return '';
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null, scale: 0.5, useCORS: true, logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (err) {
      return '';
    }
  };

  const handleAddToCart = async () => {
    if (!product || !token) {
      alert('Vui lòng đăng nhập trước');
      window.location.hash = '#login';
      return;
    }

    // Validate required fields
    if (!selectedColor?.hex) {
      alert('Vui lòng chọn màu sắc');
      return;
    }

    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }

    try {
      const previewImage = await capturePreview();
      
      // Validate và filter các element hợp lệ
      const validElements = canvasElements.filter((el) => {
        if (el.type === 'text') {
          return el.content && el.content.trim().length > 0;
        } else if (el.type === 'design' || el.type === 'image') {
          return el.content && el.content.length > 0;
        }
        return false;
      });
      
      const customDesignData =
        validElements.length > 0
          ? {
              elements: validElements.map((el) => ({
                id: el.id,
                type: el.type,
                content: el.content || '',
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                rotation: el.rotation || 0,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                color: el.color || textColor,
                textAlign: el.textAlign || textAlign,
                designId: el.designId, // Include designId if from gallery
              })),
              previewImage: previewImage,
              canvasWidth: 500,
              canvasHeight: 650,
              color: selectedColor.hex,
              size: selectedSize,
            }
          : undefined;

      // Use ColorCode for SKU variant lookup
      const colorCode = selectedColor.ColorCode || selectedColor.name || 'BLACK';
      
      // Extract designId from elements if any design from gallery is used
      const designIdFromElements = validElements.find((el) => el.designId)?.designId;
      
      await apiServices.cart.addItem(
        {
          productId: product.id,
          quantity: 1,
          colorCode: colorCode,
          sizeCode: selectedSize,
          customDesignData: customDesignData,
          designId: designIdFromElements || undefined, // Include designId if from gallery
        },
        token,
      );
      alert('✅ Thêm vào giỏ hàng thành công!');
      window.location.hash = '#cart';
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể thêm vào giỏ hàng. Vui lòng thử lại.';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleSaveDesign = async () => {
    if (!product || !token) {
      alert('Vui lòng đăng nhập');
      window.location.hash = '#login';
      return;
    }

    // Validate required fields
    if (!selectedColor?.hex) {
      alert('Vui lòng chọn màu sắc');
      return;
    }

    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }

    // Validate canvasData structure
    if (!canvasElements || !Array.isArray(canvasElements)) {
      alert('Dữ liệu thiết kế không hợp lệ');
      return;
    }

    try {
      const designName = prompt(
        'Nhập tên cho thiết kế này:',
        `Design ${new Date().toLocaleDateString('vi-VN')}`,
      );

      if (!designName) {
        return; // User cancelled
      }

      // Validate và filter các element hợp lệ
      const validElements = canvasElements.filter((el) => {
        if (el.type === 'text') {
          return el.content && el.content.trim().length > 0;
        } else if (el.type === 'design' || el.type === 'image') {
          return el.content && el.content.length > 0;
        }
        return false;
      });
      
      // Use ColorCode for SKU variant lookup
      const colorCode = selectedColor.ColorCode || selectedColor.name || 'BLACK';
      
      const saveData = {
        productId: product.id,
        name: designName.trim() || `Design ${new Date().toLocaleDateString('vi-VN')}`,
        canvasData: {
          elements: validElements.map((el) => ({
            id: el.id,
            type: el.type,
            content: el.content || '',
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            rotation: el.rotation || 0,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            color: el.color || textColor,
            textAlign: el.textAlign || textAlign,
            designId: el.type === 'design' ? el.content : undefined,
          })),
          selectedColor: selectedColor.hex || '#000000',
          selectedSize: selectedSize,
          quantity: 1,
        },
        colorCode: colorCode,
        sizeCode: selectedSize,
        quantity: 1,
      };

      const savedDesign = await apiServices.customizer.saveDesign(
        saveData,
        token,
      ) as any;

      alert('✅ Đã lưu thiết kế thành công!');
      console.log('Saved design:', savedDesign);
      
      // Reload saved designs list
      await loadSavedDesigns();
      
      // Auto-switch to saved tab to show the newly saved design
      setActiveTab('saved');
    } catch (err: any) {
      console.error('Error saving design:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể lưu thiết kế. Vui lòng thử lại.';
      alert(`❌ ${errorMessage}`);
    }
  };

  // Load saved designs
  const loadSavedDesigns = async () => {
    if (!token) return;
    try {
      setLoadingSavedDesigns(true);
      const response = await apiServices.customizer.getSavedDesigns(token) as any;
      setSavedDesigns(response.savedDesigns || response || []);
    } catch (err) {
      console.error('Error loading saved designs:', err);
    } finally {
      setLoadingSavedDesigns(false);
    }
  };

  // Load saved design into editor
  const loadSavedDesign = async (designId: string) => {
    try {
      const response = await apiServices.customizer.getSavedDesignById(designId, token!) as any;
      const design = response.savedDesign || response;
      
      if (design.canvasData?.elements) {
        setCanvasElements(design.canvasData.elements);
        if (design.canvasData.selectedColor) {
          // Find and set the color
          const color = product?.colors?.find((c: any) => c.hex === design.canvasData.selectedColor);
          if (color) setSelectedColor(color);
        }
        if (design.canvasData.selectedSize) {
          setSelectedSize(design.canvasData.selectedSize);
        }
        alert('✅ Đã tải thiết kế thành công!');
      }
    } catch (err) {
      alert('❌ Không thể tải thiết kế');
      console.error('Error loading saved design:', err);
    }
  };

  // Delete saved design
  const deleteSavedDesign = async (designId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa thiết kế này?')) return;
    
    try {
      await apiServices.customizer.deleteSavedDesign(designId, token!);
      setSavedDesigns(savedDesigns.filter(d => (d.id || d.DESIGN_ID) !== designId));
      alert('✅ Đã xóa thiết kế thành công!');
    } catch (err) {
      alert('❌ Không thể xóa thiết kế');
      console.error('Error deleting saved design:', err);
    }
  };

  // --- RENDER ---
  if (loading) return <div className="h-screen flex items-center justify-center"><Loading text="Đang tải thiết kế..." /></div>;
  if (error || !product) return <div className="h-screen flex items-center justify-center"><ErrorDisplay message={error || "Lỗi sản phẩm"} onRetry={loadData} /></div>;

  // Xử lý ảnh sản phẩm (Ưu tiên ảnh màu -> ảnh gốc -> placeholder)
  const productImage = selectedColor?.image || product.image || 'https://placehold.co/500x650/png?text=No+Image';
  const totalPrice = calculatedPrice > 0 ? calculatedPrice : (product?.price || 0);

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b px-4 py-2 text-xs flex gap-2 items-center">
        <span className="text-gray-500">Store</span> <ChevronRight className="w-3 h-3"/>
        <span className="font-bold">{product.name}</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* === SIDEBAR TRÁI: CÔNG CỤ === */}
        <aside className="w-[320px] flex flex-col border-r bg-white z-20 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(val) => {
            setActiveTab(val);
            if (val === 'saved') {
              loadSavedDesigns();
            }
          }} className="w-full flex-1 flex flex-col overflow-hidden">
            <div className="px-2 pt-2 border-b flex-shrink-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload"><Upload className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="text"><Type className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="designs"><ImageIcon className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="saved"><Save className="w-4 h-4" /></TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto overflow-x-hidden">
              <TabsContent value="upload" className="mt-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div 
                  onClick={triggerFileUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Tải ảnh lên</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (tối đa 5MB)</p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-0 space-y-4">
                <textarea 
                  value={textInput} 
                  onChange={e => setTextInput(e.target.value)} 
                  className="w-full border p-2 rounded" 
                  placeholder="Nhập chữ ở đây..." 
                />
                <div className="flex gap-2">
                   <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-10 w-10 p-0 border-0 rounded cursor-pointer"/>
                   <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="flex-1"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <Slider value={[fontSize]} onValueChange={v => setFontSize(v[0])} min={10} max={100} step={1} />
                <button onClick={addText} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-medium">Thêm Chữ</button>
              </TabsContent>

              <TabsContent value="designs" className="mt-0 space-y-2 overflow-y-auto overflow-x-hidden">
                {designCategories.map((cat, idx) => (
                  <div key={idx} className="mb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-1 px-1">{String(cat.name || 'UNCATEGORIZED')}</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {cat.designs.map((d: any, i: number) => (
                        <div
                          key={i}
                          className="relative group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Design clicked:', d);
                            setSelectedDesignPreview(d);
                          }}
                        >
                          <img 
                            src={d.image || d.preview_url || d.assets?.[0]?.file_url} 
                            className="w-full h-16 object-cover rounded border border-gray-200 hover:border-[#ca6946] cursor-pointer bg-gray-50 transition-all"
                            alt={d.title || d.name || 'Design'}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image';
                            }}
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white text-xs font-medium px-1.5 py-0.5 bg-[#ca6946] rounded shadow-md">Xem</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="mt-0 space-y-4">
                {loadingSavedDesigns ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Đang tải...</p>
                  </div>
                ) : savedDesigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Save className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Chưa có thiết kế đã lưu</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedDesigns.map((design: any) => (
                      <div key={design.id || design.DESIGN_ID} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold truncate">{design.name}</h4>
                            <p className="text-xs text-gray-500">{new Date(design.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <button
                            onClick={() => deleteSavedDesign(design.id || design.DESIGN_ID)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => loadSavedDesign(design.id || design.DESIGN_ID)}
                          className="w-full mt-2 bg-black text-white text-xs py-2 rounded hover:bg-gray-800 transition"
                        >
                          Tải thiết kế này
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* === KHU VỰC CHÍNH: CANVAS (NƠI SỬA LỖI) === */}
        {/* Đổi màu nền sang slate-200 để Canvas trắng nổi bật lên */}
        <section className="flex-1 bg-slate-200 relative flex items-center justify-center overflow-hidden p-8">
          
          {/* Controls Zoom */}
          <div className="absolute top-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-4 z-50">
             <button onClick={()=>setZoomLevel(z => Math.max(0.5, z - 0.1))}><ZoomOut className="w-5 h-5"/></button>
             <span className="font-mono text-sm w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
             <button onClick={()=>setZoomLevel(z => Math.min(2, z + 0.1))}><ZoomIn className="w-5 h-5"/></button>
          </div>

          {/* === CANVAS WRAPPER === */}
          <div 
             className="relative transition-transform duration-200 ease-out shadow-2xl bg-white"
             style={{ 
               transform: `scale(${zoomLevel})`,
               width: '500px', 
               height: '650px' // Kích thước cố định
             }}
          >
             {/* CANVAS NỘI DUNG */}
             <div ref={canvasRef} className="w-full h-full relative bg-white select-none overflow-hidden">
                
                {/* 1. HÌNH NỀN SẢN PHẨM (NẰM DƯỚI CÙNG) */}
                <img 
                   src={productImage} 
                   className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                   alt="Product"
                   onError={(e) => {
                     // Tự động thay thế nếu ảnh lỗi
                     (e.target as HTMLImageElement).src = 'https://placehold.co/500x650/png?text=Product+Image+Error';
                   }}
                />

                {/* 2. KHUNG VÙNG IN (PRINT AREA) - Chỉ hiện khi hover hoặc có elements */}
                <div 
                   className={`absolute border border-dashed z-10 transition-all duration-200 ${
                      showPrintArea || canvasElements.length > 0
                        ? 'border-gray-400 opacity-100' 
                        : 'border-transparent opacity-0'
                   } hover:border-gray-500 hover:opacity-100 group`}
                   style={{
                      top: `${product?.printArea?.top || 22}%`, 
                      left: `${product?.printArea?.left || 28}%`, 
                      width: `${product?.printArea?.width || 44}%`, 
                      height: `${product?.printArea?.height || 55}%`
                   }}
                   onMouseEnter={() => setShowPrintArea(true)}
                   onMouseLeave={() => {
                      if (canvasElements.length === 0) setShowPrintArea(false);
                   }}
                >
                   {/* Label - Chỉ hiện khi hover */}
                   <span className="absolute -top-6 left-0 text-[9px] bg-gray-800 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium uppercase tracking-wider whitespace-nowrap">
                     Vùng in
                   </span>

                   {/* 3. CÁC LAYER KÉO THẢ (NẰM TRONG VÙNG IN) */}
                   {canvasElements.map((el) => (
                      <Rnd
                        key={el.id}
                        default={{ x: 0, y: 0, width: 100, height: 100 }}
                        size={{ width: el.width, height: el.type==='text'?'auto':el.height }}
                        position={{ x: el.x, y: el.y }}
                        onDragStop={(e, d) => { updateElement(el.id, {x:d.x, y:d.y}); setSelectedElement(el.id); }}
                        onResizeStop={(e, dir, ref, delta, pos) => {
                           updateElement(el.id, {
                             width: parseInt(ref.style.width),
                             height: el.type==='text' ? el.height : parseInt(ref.style.height),
                             x: pos.x, y: pos.y
                           });
                        }}
                        bounds="parent"
                        lockAspectRatio={el.type === 'design' || el.type === 'image'}
                        className={`cursor-move ${selectedElement === el.id ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-blue-300'}`}
                        onClick={(e) => { e.stopPropagation(); setSelectedElement(el.id); }}
                        style={{ zIndex: selectedElement === el.id ? 50 : 10 }}
                      >
                         <div className="w-full h-full relative group">
                            {el.type === 'text' ? (
                               <div style={{
                                  fontSize: el.fontSize, fontFamily: el.fontFamily, color: el.color, 
                                  textAlign: el.textAlign, width: '100%', height: '100%', lineHeight: 1
                               }}>
                                  {el.content}
                               </div>
                            ) : (
                               <img src={el.content} className="w-full h-full object-contain pointer-events-none"/>
                            )}
                            
                            {/* Nút Xóa Nhanh */}
                            {selectedElement === el.id && (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); deleteSelectedElement(); }}
                                 className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 z-50"
                               >
                                  <Trash2 className="w-3 h-3"/>
                               </button>
                            )}
                         </div>
                      </Rnd>
                   ))}
                </div>

                {/* 4. LỚP PHỦ TẠO HIỆU ỨNG CHÌM VÀO VẢI (TRÊN CÙNG) */}
                <div 
                   className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply opacity-20"
                   style={{
                      background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.2) 100%)'
                   }}
                />
             </div>
          </div>
          
          <div className="absolute bottom-4 bg-white/90 px-4 py-2 rounded-full text-xs text-green-700 flex items-center gap-2 shadow-sm">
             <Leaf className="w-3 h-3"/> Eco-friendly Printing
          </div>
        </section>

        {/* === SIDEBAR PHẢI: THÔNG TIN === */}
        <aside className="w-[280px] md:w-[300px] flex flex-col border-l bg-white z-20 shadow-sm overflow-hidden">
           <div className="p-4 md:p-5 space-y-4 md:space-y-5 flex-1 overflow-y-auto">
              {/* Product Info */}
              <div className="border-b pb-3 md:pb-4">
                 <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1">{product.name}</h2>
                 <p className="text-xs md:text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
              </div>

              {/* Chọn Màu */}
              <div>
                 <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-3">Màu sắc</label>
                 <div className="flex gap-2 flex-wrap">
                    {(product.colors || [{hex:'#000', name:'Default'}]).map((c: any, i: number) => (
                       <button 
                         key={i} 
                         onClick={() => setSelectedColor(c)}
                         className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 transition-all ${selectedColor?.name === c.name ? 'ring-2 ring-offset-2 ring-gray-900 scale-110 border-gray-900' : 'border-gray-300 hover:border-gray-400'}`}
                         style={{ backgroundColor: c.hex }}
                         title={c.name}
                       />
                    ))}
                 </div>
              </div>

              {/* Chọn Size */}
              <div>
                 <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide block mb-3">Kích thước</label>
                 <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                    {['S','M','L','XL'].map(s => (
                       <button 
                         key={s} 
                         onClick={() => setSelectedSize(s)}
                         className={`h-9 md:h-10 rounded-md border-2 font-semibold text-xs md:text-sm transition-all ${selectedSize === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                       >
                         {s}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Danh sách lớp */}
              <div className="border-t pt-4">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Lớp ({canvasElements.length})</span>
                    {canvasElements.length > 0 && (
                       <button 
                          onClick={() => {
                            if (confirm('Bạn có chắc muốn xóa tất cả?')) {
                              setCanvasElements([]);
                              setSelectedElement(null);
                            }
                          }} 
                          className="text-xs text-red-600 hover:text-red-700 hover:underline font-medium"
                       >
                          Xóa hết
                       </button>
                    )}
                 </div>
                 <div className="bg-gray-50 rounded-lg p-3 min-h-[120px] max-h-[220px] overflow-y-auto border border-gray-200">
                    {canvasElements.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-full py-8">
                          <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                          <p className="text-xs text-gray-400 text-center">Chưa có thiết kế nào</p>
                          <p className="text-xs text-gray-400 text-center mt-1">Thêm chữ hoặc hình ảnh để bắt đầu</p>
                       </div>
                    ) : (
                       <div className="space-y-1.5">
                          {[...canvasElements].reverse().map((el, i) => {
                             const actualIndex = canvasElements.length - 1 - i;
                             const isTop = actualIndex === canvasElements.length - 1;
                             const isBottom = actualIndex === 0;
                             return (
                                <div 
                                   key={el.id} 
                                   onClick={() => setSelectedElement(el.id)}
                                   className={`flex items-center gap-2 p-2.5 rounded-md text-sm cursor-pointer transition-colors ${
                                      selectedElement === el.id 
                                         ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                                         : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                   }`}
                                >
                                   <div className="flex items-center gap-1">
                                      {el.type === 'text' ? (
                                         <Type className="w-4 h-4 text-gray-500" />
                                      ) : (
                                         <ImageIcon className="w-4 h-4 text-gray-500" />
                                      )}
                                   </div>
                                   <span className="flex-1 truncate text-xs font-medium">
                                      {el.type === 'text' ? el.content : `Hình ảnh ${i + 1}`}
                                   </span>
                                   <div className="flex items-center gap-0.5">
                                      <button 
                                         onClick={(e) => {
                                            e.stopPropagation();
                                            moveLayer(i, 'up');
                                         }}
                                         disabled={isTop}
                                         className={`p-1 rounded ${isTop ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                                         title="Lên trên"
                                      >
                                         <ChevronRight className="w-3 h-3 -rotate-90 text-gray-500" />
                                      </button>
                                      <button 
                                         onClick={(e) => {
                                            e.stopPropagation();
                                            moveLayer(i, 'down');
                                         }}
                                         disabled={isBottom}
                                         className={`p-1 rounded ${isBottom ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                                         title="Xuống dưới"
                                      >
                                         <ChevronRight className="w-3 h-3 rotate-90 text-gray-500" />
                                      </button>
                                      {selectedElement === el.id && (
                                         <button
                                            onClick={(e) => {
                                               e.stopPropagation();
                                               deleteSelectedElement();
                                            }}
                                            className="p-1 rounded hover:bg-red-100 ml-1"
                                            title="Xóa"
                                         >
                                            <Trash2 className="w-3 h-3 text-red-600" />
                                         </button>
                                      )}
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Footer Action */}
           <div className="p-3 md:p-5 border-t bg-gray-50 space-y-2 md:space-y-3 sticky bottom-0">
              <div className="flex justify-between items-end pb-1 md:pb-2">
                 <span className="text-xs md:text-sm font-medium text-gray-700">Tổng tiền:</span>
                 {isCalculatingPrice ? (
                    <span className="text-xs md:text-sm text-gray-500 animate-pulse">Đang tính...</span>
                 ) : (
                    <span className="text-lg md:text-xl font-bold text-gray-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
                 )}
              </div>
              <button 
                 onClick={handleAddToCart}
                 className="w-full bg-[#ca6946] hover:bg-[#b05a3b] text-white py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-md transition-all"
              >
                 <ShoppingCart className="w-4 h-4"/> Thêm vào giỏ hàng
              </button>
              <button 
                 onClick={handleSaveDesign} 
                 className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all"
              >
                 Lưu thiết kế
              </button>
           </div>
        </aside>

      </div>

      {/* Design Preview Modal - Custom implementation to avoid Dialog issues */}
      {selectedDesignPreview && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedDesignPreview(null)}
          style={{ position: 'fixed', zIndex: 99999 }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4 relative"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 100000 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold">
                  {selectedDesignPreview?.title || selectedDesignPreview?.name || 'Xem trước thiết kế'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDesignPreview?.description || 'Xem trước thiết kế trước khi thêm vào canvas'}
                </p>
              </div>
              <button
                onClick={() => setSelectedDesignPreview(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[300px]">
                <img 
                  src={selectedDesignPreview?.image || selectedDesignPreview?.preview_url || selectedDesignPreview?.assets?.[0]?.file_url} 
                  alt={selectedDesignPreview?.title || 'Design preview'}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (import.meta.env.DEV) {
                      console.log('Adding design to canvas:', selectedDesignPreview);
                    }
                    if (selectedDesignPreview) {
                      addDesign(selectedDesignPreview, selectedDesignPreview.DESIGN_ID || selectedDesignPreview.id);
                      setSelectedDesignPreview(null);
                    }
                  }}
                  className="flex-1 bg-[#ca6946] hover:bg-[#b55835] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Thêm vào canvas
                </button>
                <button
                  onClick={() => {
                    console.log('Closing modal');
                    setSelectedDesignPreview(null);
                  }}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}