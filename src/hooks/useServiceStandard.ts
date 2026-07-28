// src/hooks/useServiceStandard.ts

import { useEffect } from "react";
import { useApi, apiRequest, type ApiResponse } from "./useCore";

export interface ServiceStandard {
  id: string;
  description: string;
  order_index: number;
  file_path: string | null;   // storage-relative path in 'media' bucket
  image_url: string | null;   // resolved public URL, use this for rendering
  timestamp: string;
}

async function getServiceStandards(): Promise<ApiResponse<ServiceStandard[]>> {
  return apiRequest<ServiceStandard[]>("/service-standard");
}

export function useGetServiceStandards() {
  const { data, loading, error, execute } = useApi(getServiceStandards);

  useEffect(() => {
    execute();
  }, [execute]);

  return { standards: data ?? [], loading, error };
}