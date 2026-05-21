//src/hooks/useCore.ts

import { useState, useCallback } from 'react';

// ============= TYPES =============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  pagination: ApiResponse<unknown>['pagination'] | null;
}

export interface UseApiReturn<T, A extends unknown[]> extends UseApiState<T> {
  execute: (...args: A) => Promise<ApiResponse<T> | null>;
  reset: () => void;
}

// ============= CORE HOOK =============

export function useApi<T, A extends unknown[]>(
  apiFunction: (...args: A) => Promise<ApiResponse<T>>
): UseApiReturn<T, A> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    pagination: null,
  });

  const execute = useCallback(
    async (...args: A): Promise<ApiResponse<T> | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null, pagination: null }));
      try {
        const response = await apiFunction(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
          pagination: response.pagination || null,
        });
        return response;
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.error?.message ||
          (error as Error)?.message ||
          'An unknown error occurred';
        setState({ data: null, loading: false, error: errorMessage, pagination: null });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, pagination: null });
  }, []);

  return { ...state, execute, reset };
}

// ============= API CLIENT HELPER =============

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
