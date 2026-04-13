import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

export function useGetOrdinances() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'repealed';
    from_date?: string;
    to_date?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);
    if (params?.status) q.append('status', params.status);
    if (params?.from_date) q.append('from_date', params.from_date);
    if (params?.to_date) q.append('to_date', params.to_date);
    return apiRequest(`/ordinances?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetPublicOrdinances() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    from_date?: string;
    to_date?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);
    if (params?.from_date) q.append('from_date', params.from_date);
    if (params?.to_date) q.append('to_date', params.to_date);
    return apiRequest(`/ordinances/public?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetOrdinance() {
  const apiFunction = useCallback(async (ordinanceId: number) => {
    return apiRequest(`/ordinances/${ordinanceId}`);
  }, []);
  return useApi(apiFunction);
}
