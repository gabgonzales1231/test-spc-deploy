// src/hooks/useArticles.ts

import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

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
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);
    if (params?.category_id) q.append('category_id', params.category_id.toString());
    if (params?.author_id) q.append('author_id', params.author_id.toString());
    if (params?.from_date) q.append('from_date', params.from_date);
    if (params?.to_date) q.append('to_date', params.to_date);
    return apiRequest(`/articles?${q.toString()}`);
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
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.search) q.append('search', params.search);
    if (params?.status) q.append('status', params.status);
    if (params?.category_id) q.append('category_id', params.category_id.toString());
    if (params?.author_id) q.append('author_id', params.author_id.toString());
    if (params?.from_date) q.append('from_date', params.from_date);
    if (params?.to_date) q.append('to_date', params.to_date);
    return apiRequest(`/articles/manage?${q.toString()}`);
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
    // FIX: Trim hidden whitespace and safely encode the slug for the URL
    const safeSlug = encodeURIComponent(slug.trim());
    return apiRequest(`/articles/slug/${safeSlug}`);
  }, []);
  return useApi(apiFunction);
}