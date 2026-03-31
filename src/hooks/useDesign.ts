import { useState, useCallback } from 'react';
import { apiServices } from '../services/apiConfig';
import { Design } from '../types';

interface UseDesignReturn {
  designs: Design[];
  loading: boolean;
  error: string | null;
  loadTrending: (limit?: number) => Promise<void>;
  loadAll: (page?: number, limit?: number) => Promise<void>;
  getDesignById: (id: string) => Promise<Design | null>;
}

export function useDesign(): UseDesignReturn {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrending = useCallback(async (limit = 6) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiServices.designs.getTrending(limit);
      setDesigns(response.designs || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load designs';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAll = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiServices.designs.getAll(page, limit);
      setDesigns(response.designs || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load designs';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDesignById = useCallback(async (id: string) => {
    try {
      const response = await apiServices.designs.getById(id);
      return response as Design;
    } catch (err) {
      console.error('Failed to load design:', err);
      return null;
    }
  }, []);

  return {
    designs,
    loading,
    error,
    loadTrending,
    loadAll,
    getDesignById,
  };
}

