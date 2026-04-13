import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

export function useGetMedia() {
  const apiFunction = useCallback(async (params?: {
    page?: number;
    limit?: number;
    media_type?: string;
    related_article_id?: number;
    related_event_id?: number;
    related_banner_id?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.media_type) q.append('media_type', params.media_type);
    if (params?.related_article_id) q.append('related_article_id', params.related_article_id.toString());
    if (params?.related_event_id) q.append('related_event_id', params.related_event_id.toString());
    if (params?.related_banner_id) q.append('related_banner_id', params.related_banner_id.toString());
    return apiRequest(`/media?${q.toString()}`);
  }, []);
  return useApi(apiFunction);
}

export function useGetMediaItem() {
  const apiFunction = useCallback(async (mediaId: number) => {
    return apiRequest(`/media/${mediaId}`);
  }, []);
  return useApi(apiFunction);
}
