import { useCallback, useEffect } from "react";
import { useApi, apiRequest } from "./useCore";

export interface AboutUsPhoto {
  photo_id: string;
  file_path: string;
  caption: string | null;
  url: string;
  created_at: string;
  updated_at: string;
}

export function useAboutUs() {
  const fetchPhotos = useCallback(
    () => apiRequest<AboutUsPhoto[]>("/about-us/photos"),
    []
  );

  const { data, loading, error, execute } = useApi<AboutUsPhoto[], []>(fetchPhotos);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    photos: data ?? [],
    loading,
    error,
  };
}