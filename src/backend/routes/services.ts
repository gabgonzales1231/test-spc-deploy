// ─────────────────────────────────────────────
// backend/routes/services.ts
// Elysia route — /api/services
// ─────────────────────────────────────────────

import { Elysia, t } from "elysia";
import { supabase } from "../config/database";
import { successResponse, errorResponse } from "../utils/response";

export const servicesRouter = new Elysia({ prefix: "/services" })

  // ── GET /api/services ──────────────────────────────────────────────
  // Public — returns all services, used by chatbot CMS fetch
  .get("/", async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("service_id", { ascending: true });

    if (error)
      return errorResponse("FETCH_ERROR", "Failed to retrieve services", error.message);

    return successResponse(data, "Services retrieved successfully");
  })

  // ── GET /api/services/slug/:slug ───────────────────────────────────
  // Public — used by chatbot to resolve {{citizens_charter_link}} etc.
  // Must be declared BEFORE /:id to avoid slug being matched as an id
  .get(
    "/slug/:slug",
    async ({ params }) => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (error || !data)
        return errorResponse("NOT_FOUND", "Service not found");

      return successResponse(data, "Service retrieved successfully");
    },
    {
      params: t.Object({ slug: t.String() }),
    }
  )

  // ── GET /api/services/:id ──────────────────────────────────────────
  // Public
  .get(
    "/:id",
    async ({ params }) => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("service_id", Number(params.id))
        .single();

      if (error || !data)
        return errorResponse("NOT_FOUND", "Service not found");

      return successResponse(data, "Service retrieved successfully");
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )

  // ── POST /api/services ─────────────────────────────────────────────
  // Admin — protected at middleware level in elysia.ts
  .post(
    "/",
    async ({ body }) => {
      const { data, error } = await supabase
        .from("services")
        .insert({
          name:                   body.name,
          slug:                   body.slug,
          description:            body.description            ?? null,
          requirements:           body.requirements           ?? null,
          fees:                   body.fees                   ?? null,
          processing_time:        body.processing_time        ?? null,
          online_application_url: body.online_application_url ?? null,
        })
        .select()
        .single();

      if (error || !data)
        return errorResponse("CREATE_ERROR", "Failed to create service", error?.message);

      return successResponse(data, "Service created successfully");
    },
    {
      body: t.Object({
        name:                   t.String({ maxLength: 255 }),
        slug:                   t.String({ maxLength: 255 }),
        description:            t.Optional(t.Nullable(t.String())),
        requirements:           t.Optional(t.Nullable(t.String())),
        fees:                   t.Optional(t.Nullable(t.String())),
        processing_time:        t.Optional(t.Nullable(t.String({ maxLength: 100 }))),
        online_application_url: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
      }),
    }
  )

  // ── PUT /api/services/:id ──────────────────────────────────────────
  // Admin
  .put(
    "/:id",
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from("services")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("service_id", Number(params.id))
        .select()
        .single();

      if (error || !data)
        return errorResponse("UPDATE_ERROR", "Failed to update service", error?.message);

      return successResponse(data, "Service updated successfully");
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name:                   t.Optional(t.String({ maxLength: 255 })),
        slug:                   t.Optional(t.String({ maxLength: 255 })),
        description:            t.Optional(t.Nullable(t.String())),
        requirements:           t.Optional(t.Nullable(t.String())),
        fees:                   t.Optional(t.Nullable(t.String())),
        processing_time:        t.Optional(t.Nullable(t.String({ maxLength: 100 }))),
        online_application_url: t.Optional(t.Nullable(t.String({ maxLength: 255 }))),
      }),
    }
  )

  // ── DELETE /api/services/:id ───────────────────────────────────────
  // Admin
  .delete(
    "/:id",
    async ({ params }) => {
      const { data, error } = await supabase
        .from("services")
        .delete()
        .eq("service_id", Number(params.id))
        .select()
        .single();

      if (error || !data)
        return errorResponse("DELETE_ERROR", "Failed to delete service", error?.message);

      return successResponse(data, "Service deleted successfully");
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );