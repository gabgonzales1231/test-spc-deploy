import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

export function useGetCategories() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    parent_category_id?: number | 'null';
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);
    if (params?.parent_category_id !== undefined) {
      q.append('parent_category_id', params.parent_category_id.toString());
    }
    return apiRequest(`/categories?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetRootCategories() {
  const apiFunction = useCallback(async () => apiRequest('/categories/root'), []);
  return useApi(apiFunction);
}

export function useGetCategoryTree() {
  const apiFunction = useCallback(async () => apiRequest('/categories/tree'), []);
  return useApi(apiFunction);
}

export function useGetCategory() {
  const apiFunction = useCallback(async (categoryId: number) => {
    return apiRequest(`/categories/${categoryId}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetCategoryBySlug() {
  const apiFunction = useCallback(async (slug: string) => {
    return apiRequest(`/categories/slug/${slug}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetSubcategories() {
  const apiFunction = useCallback(async (
    categoryId: number,
    params?: { page?: number; limit?: number }
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    return apiRequest(`/categories/${categoryId}/subcategories?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}
