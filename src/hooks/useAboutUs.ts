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
  const fetchPhotos = useCallback(async () => {
    const response = await apiRequest<AboutUsPhoto[]>("/about-us/photos");
    // Cache-bust the storage URL using updated_at so replacing an image
    // under the same file_path/filename shows up immediately instead of
    // being served from browser/CDN cache.
    return {
      ...response,
      data: response.data.map((photo: AboutUsPhoto) => ({
        ...photo,
        url: `${photo.url}${photo.url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
          photo.updated_at
        )}`,
      })),
    };
  }, []);

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