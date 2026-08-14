// src/backend/routes/tourism.ts
import { Elysia } from "elysia";
import { supabase } from "../config/database";
import { successResponse } from "../utils/response";
import { AppError } from "../utils/error";
import { tourismListResponse } from "../schemas/tourism";

export const tourismRoutes = new Elysia({ prefix: "/tourism" }).get(
  "/",
  async () => {
    const { data, error } = await supabase
      .from("tourism")
      .select("id, name, tagline, date, href, image, category, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      throw new AppError(
        "Failed to fetch tourism highlights",
        "INTERNAL_ERROR",
        502,
        error.message
      );
    }

    // `image` is stored as just a filename (e.g. "coco-festival.png").
    // The actual file lives in the "media" storage bucket under
    // "tourism/", so resolve it to a public URL here — same pattern as
    // the map route — the frontend just gets a ready-to-use image URL.
    const highlights = (data ?? []).map((item) => {
      if (!item.image) return item;

      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(`tourism/${item.image}`);

      return { ...item, image: publicUrlData.publicUrl };
    });

    return successResponse(highlights);
  },
  {
    response: tourismListResponse,
    detail: {
      summary: "Get all tourism highlight cards",
      tags: ["Tourism"],
    },
  }
);