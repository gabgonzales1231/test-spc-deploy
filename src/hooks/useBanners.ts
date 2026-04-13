import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

export function useGetBanners() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    return apiRequest(`/banners?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetBannersManage() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    active?: boolean;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.active !== undefined) q.append('active', params.active.toString());
    return apiRequest(`/banners/manage?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetBanner() {
  const apiFunction = useCallback(async (bannerId: number) => {
    return apiRequest(`/banners/${bannerId}`);
  }, []);
  return useApi(apiFunction);
}
