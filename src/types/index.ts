/**
 * Shared Types for the Application
 */

// Product Types
export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images?: any[] | Record<string, any>;
  category?: string | { id: string; name: string };
  categoryId?: string;
  stock?: number;
  quantity?: number;
  rating?: number;
  averageRating?: string | number;
  numReviews?: number;
  reviews?: number;
  materials?: string[];
  care_instructions?: string;
  certifications?: any[];
  design_areas?: any[];
  skuVariants?: any[];
  isActive?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isEco?: boolean;
  isRecycled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Design Types
export interface Design {
  id: string;
  DESIGN_ID?: string;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  preview_url?: string;
  creator?: string;
  downloads?: number;
  likes?: number;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  license_type?: 'standard' | 'premium' | 'exclusive';
  createdAt?: string;
  updatedAt?: string;
  assets?: any[];
  placements?: any[];
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items?: any[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  Total?: number;
  totalAmount?: number;
  subtotal?: number;
  discount?: number;
  shippingAddress?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Cart Types
export interface CartItem {
  id?: string;
  productId: string;
  designId?: string;
  quantity: number;
  price: number;
  colorCode?: string;
}

// Review Types
export interface Review {
  id: string;
  productId?: string;
  author?: string;
  rating: number;
  comment?: string;
  date?: string;
  verified?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface FilterOptions {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'newest' | 'popular' | 'price-low' | 'price-high';
  search?: string;
  page?: number;
  limit?: number;
}

