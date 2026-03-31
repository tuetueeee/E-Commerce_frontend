import { useState, useCallback } from 'react';
import { apiServices } from '../services/apiConfig';
import { Product, FilterOptions } from '../types';

interface UseProductReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  loadProducts: (filters?: FilterOptions) => Promise<void>;
  setCurrentPage: (page: number) => void;
  getProductById: (id: string) => Promise<Product | null>;
}

export function useProduct(): UseProductReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = useCallback(
    async (filters?: FilterOptions) => {
      try {
        setLoading(true);
        setError(null);

        const page = filters?.page || currentPage;
        const limit = filters?.limit || 12;

        const response = await apiServices.products.getAll(page, limit, {
          ...filters,
        });

        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  const getProductById = useCallback(async (id: string) => {
    try {
      const response = await apiServices.products.getById(id);
      return response as Product;
    } catch (err) {
      console.error('Failed to load product:', err);
      return null;
    }
  }, []);

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    loadProducts,
    setCurrentPage,
    getProductById,
  };
}

