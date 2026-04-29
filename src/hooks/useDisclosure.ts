import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';

export type DisclosureCategory =
  | 'city-ordinance'
  | 'city-resolution'
  | 'executive-order'
  | 'bids-awards'
  | 'financial-aid'

export interface DisclosureDocument {
  document_id:   number
  category:      DisclosureCategory
  title:         string
  date_passed:   string | null
  year:          number | null
  document_path: string | null
  pdf_url:       string | null
  status:        'active' | 'repealed'
  created_at:    string
}

export function useGetPublicDisclosure() {
  const apiFunction = useCallback(async (params?: {
    page?:     number
    limit?:    number
    category?: DisclosureCategory
    year?:     string
    search?:   string
  }) => {
    const q = new URLSearchParams()
    if (params?.page)     q.append('page',     String(params.page))
    if (params?.limit)    q.append('limit',    String(params.limit))
    if (params?.category) q.append('category', params.category)
    if (params?.year)     q.append('year',     params.year)
    if (params?.search)   q.append('search',   params.search)
    return apiRequest(`/disclosure/public?${q.toString()}`)
  }, [])
  return useApi(apiFunction)
}