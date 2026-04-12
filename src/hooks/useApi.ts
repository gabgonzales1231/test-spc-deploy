import { useState, useCallback } from 'react';

// ============= TYPES =============

/**
 * Represents a successful API response structure.
 * @template T The type of the data payload.
 */
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

/**
 * Represents a failed API response structure.
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown; // Use 'unknown' for safer type handling
  };
}

/**
 * Represents the state of an API call within the hook.
 * @template T The type of the expected data.
 */
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  pagination: ApiResponse<unknown>['pagination'] | null;
}

/**
 * The return type of the useApi hook, including state and actions.
 * @template T The type of the expected data.
 * @template A A tuple representing the types of the arguments for the execute function.
 */
export interface UseApiReturn<T, A extends unknown[]> extends UseApiState<T> {
  execute: (...args: A) => Promise<ApiResponse<T> | null>; // Changed from Promise<T | null>
  reset: () => void;
}

// ...

function useApi<T, A extends unknown[]>(
  apiFunction: (...args: A) => Promise<ApiResponse<T>>
): UseApiReturn<T, A> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    pagination: null,
  });

  const execute = useCallback(
    // 2. UPDATE THE FUNCTION'S RETURN TYPE AND VALUE
    async (...args: A): Promise<ApiResponse<T> | null> => { // Changed return type here
      setState((prevState) => ({ ...prevState, loading: true, error: null, pagination: null }));
      try {
        const response = await apiFunction(...args);
        setState({ data: response.data, loading: false, error: null, pagination: response.pagination || null });
        return response; // <-- FIX: Return the entire response object
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.error?.message ||
          (error as Error)?.message ||
          'An unknown error occurred';
        setState({ data: null, loading: false, error: errorMessage, pagination: null });
        return null; // Return null on failure
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

/**
 * A helper function to make fetch requests to the API.
 * @template T The expected data type from the response.
 * @param endpoint The API endpoint to request (e.g., '/users').
 * @param options The standard fetch RequestInit options.
 * @returns A promise that resolves to the API response.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(options.headers); // Safely create Headers object
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
    // Throw the JSON error payload from the API on failure
    throw data;
  }

  return data;
}

// ============= ARTICLES API HOOKS =============

export function useGetArticles() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    author_id?: number;
    from_date?: string;
    to_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.author_id) queryParams.append('author_id', params.author_id.toString());
    if (params?.from_date) queryParams.append('from_date', params.from_date);
    if (params?.to_date) queryParams.append('to_date', params.to_date);

    return apiRequest(`/articles?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetArticlesManage() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category_id?: number;
    author_id?: number;
    from_date?: string;
    to_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params?.author_id) queryParams.append('author_id', params.author_id.toString());
    if (params?.from_date) queryParams.append('from_date', params.from_date);
    if (params?.to_date) queryParams.append('to_date', params.to_date);

    return apiRequest(`/articles/manage?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetArticle() {
  const apiFunction = useCallback(async (articleId: number) => {
    return apiRequest(`/articles/${articleId}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetArticleBySlug() {
  const apiFunction = useCallback(async (slug: string) => {
    return apiRequest(`/articles/slug/${slug}`);
  }, []);
  return useApi(apiFunction);
}

// ============= CATEGORIES API HOOKS =============

export function useGetCategories() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    parent_category_id?: number | 'null';
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.parent_category_id !== undefined) {
      queryParams.append('parent_category_id', params.parent_category_id.toString());
    }

    return apiRequest(`/categories?${queryParams.toString()}`);
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
  const apiFunction = useCallback(async (categoryId: number, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/categories/${categoryId}/subcategories?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

// ============= MEDIA API HOOKS =============

export function useGetMedia() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    media_type?: string;
    related_article_id?: number;
    related_event_id?: number;
    related_banner_id?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.media_type) queryParams.append('media_type', params.media_type);
    if (params?.related_article_id) queryParams.append('related_article_id', params.related_article_id.toString());
    if (params?.related_event_id) queryParams.append('related_event_id', params.related_event_id.toString());
    if (params?.related_banner_id) queryParams.append('related_banner_id', params.related_banner_id.toString());

    return apiRequest(`/media?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetMediaItem() {
  const apiFunction = useCallback(async (mediaId: number) => {
    return apiRequest(`/media/${mediaId}`);
  }, []);
  return useApi(apiFunction);
}

// ============= BANNERS API HOOKS =============

export function useGetBanners() {
  const apiFunction = useCallback(async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/banners?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetBannersManage() {
  const apiFunction = useCallback(async (params?: { page?: number; limit?: number; active?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());

    return apiRequest(`/banners/manage?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetBanner() {
  const apiFunction = useCallback(async (bannerId: number) => {
    return apiRequest(`/banners/${bannerId}`);
  }, []);
  return useApi(apiFunction);
}

// ============= ORDINANCES API HOOKS =============

export function useGetOrdinances() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'repealed';
    from_date?: string;
    to_date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.from_date) queryParams.append('from_date', params.from_date);
    if (params?.to_date) queryParams.append('to_date', params.to_date);

    return apiRequest(`/ordinances?${queryParams.toString()}`);
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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.from_date) queryParams.append('from_date', params.from_date);
    if (params?.to_date) queryParams.append('to_date', params.to_date);

    return apiRequest(`/ordinances/public?${queryParams.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetOrdinance() {
  const apiFunction = useCallback(async (ordinanceId: number) => {
    return apiRequest(`/ordinances/${ordinanceId}`);
  }, []);
  return useApi(apiFunction);
}

// Export the default useApi for generic usage if needed
export default useApi;