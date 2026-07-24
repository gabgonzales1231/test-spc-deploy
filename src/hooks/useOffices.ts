//src/hooks/useOffices.ts

import { useCallback } from 'react';
import { useApi, apiRequest } from './useCore';
import { SectorId } from '@/components/city-government/types';

export interface RawOffice {
  id: string;
  sector: SectorId;
  name: string;
  head: string;
  email: string;
  address: string;
  sort_order: number;
}

export function useGetOffices() {
  const fetchOffices = useCallback(() => apiRequest<RawOffice[]>('/offices'), []);
  return useApi<RawOffice[], []>(fetchOffices);
}