// src/backend/routes/service-standard.ts

import { Elysia } from "elysia";
import { supabase } from "../config/database";
import { successResponse, errorResponse } from "../utils/response";
import { AppError } from "../utils/error";

const MEDIA_BUCKET = "media";

export const serviceStandardRoutes = new Elysia({ prefix: "/service-standard" })
  // GET /service-standard - public, read-only, ordered list
  .get("/", async () => {
    try {
      const { data, error } = await supabase
        .from("service_standard")
        .select("id, description, order_index, file_path, timestamp")
        .order("order_index", { ascending: true });

      if (error) {
        throw new AppError(error.message, "INTERNAL_ERROR", 500);
      }

      // Resolve each file_path (storage-relative, e.g. 'service-standard/001.png')
      // into a full public URL from the 'media' bucket. NULL file_path stays NULL.
      const withUrls = (data ?? []).map((row) => ({
        ...row,
        image_url: row.file_path
          ? supabase.storage.from(MEDIA_BUCKET).getPublicUrl(row.file_path).data.publicUrl
          : null,
      }));

      return successResponse(withUrls);
    } catch (err) {
      if (err instanceof AppError) {
        return errorResponse(err.code, err.message, err.details);
      }
      const message = err instanceof Error ? err.message : "Internal server error";
      return errorResponse("INTERNAL_ERROR", message);
    }
  });