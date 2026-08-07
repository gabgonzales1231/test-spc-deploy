//src/backend/routes/offices.ts

import { Elysia, t } from "elysia";
import { supabase } from "@/backend/config/database";
import { successResponse, errorResponse } from "@/backend/utils/response";

export const officesRoutes = new Elysia({ prefix: "/offices" })
  .get("/", async ({ set }) => {
    const { data, error } = await supabase
      .from("offices")
      .select("id, sector, name, slug, head, email, address, sort_order, services")
      .order("sector", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      set.status = 500;
      return errorResponse("OFFICES_FETCH_FAILED", error.message);
    }

    return successResponse(data);
  })

  .get(
    "/slug/:slug",
    async ({ params, set }) => {
      const { data, error } = await supabase
        .from("offices")
        .select("id, sector, name, slug, head, email, address, sort_order, services")
        .eq("slug", params.slug)
        .maybeSingle();

      if (error) {
        set.status = 500;
        return errorResponse("OFFICES_FETCH_FAILED", error.message);
      }

      if (!data) {
        set.status = 404;
        return errorResponse("OFFICE_NOT_FOUND", `No office found for slug "${params.slug}"`);
      }

      return successResponse(data);
    },
    { params: t.Object({ slug: t.String() }) }
  );