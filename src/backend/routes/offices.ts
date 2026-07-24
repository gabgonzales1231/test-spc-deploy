//src/backend/routes/offices.ts

import { Elysia } from "elysia";
import { supabase } from "@/backend/config/database";
import { successResponse, errorResponse } from "@/backend/utils/response";

export const officesRoutes = new Elysia({ prefix: "/offices" }).get(
  "/",
  async ({ set }) => {
    const { data, error } = await supabase
      .from("offices")
      .select("id, sector, name, head, email, address, sort_order")
      .order("sector", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      set.status = 500;
      return errorResponse("OFFICES_FETCH_FAILED", error.message);
    }

    return successResponse(data);
  }
);