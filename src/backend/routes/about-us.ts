import Elysia from "elysia";
import { supabase } from "../config/database";
import { successResponse } from "../utils/response";
import { AppError } from "../utils/error";

const MEDIA_BUCKET = "media";

function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

export const aboutUsRoutes = new Elysia({ prefix: "/about-us" }).get(
  "/photos",
  async () => {
    const { data, error } = await supabase
      .from("about_us")
      .select("photo_id, file_path, caption, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) throw new AppError("Failed to fetch about us photos", "INTERNAL_ERROR", 500);

    const photos = (data ?? []).map((row) => ({
      ...row,
      url: getPublicUrl(row.file_path),
    }));

    return successResponse(photos);
  }
);