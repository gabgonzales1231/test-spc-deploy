//src/hooks/useOffices.ts

import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';
import { SectorId } from '@/components/city-government/types';

export interface OfficeContactInfo {
  email?: string | null;
  contact_no?: string | null;
  social_url?: string | null;
}

export interface RawOffice {
  id: string;
  sector: SectorId;
  name: string;
  head: string;
  contact_info: OfficeContactInfo | null;
  address: string;
  sort_order: number;
  office_no: number | null;
}

export function useGetOffices() {
  const fetchOffices = useCallback(() => apiRequest<RawOffice[]>('/offices'), []);
  return useApi<RawOffice[], []>(fetchOffices);
}