// ─────────────────────────────────────────────
// backend/routes/faqs.ts
// Elysia route — /api/faqs
// ─────────────────────────────────────────────

import { Elysia, t } from "elysia";
import { supabase } from "../config/database";
import { successResponse, errorResponse } from "../utils/response";

export const faqsRouter = new Elysia({ prefix: "/faqs" })

  // ── GET /api/faqs ──────────────────────────────────────────────────
  // Public — optional ?service_id= or ?category_id= filters
  .get(
    "/",
    async ({ query }) => {
      let builder = supabase
        .from("faqs")
        .select("*")
        .order("faq_id", { ascending: true });

      if (query.service_id)
        builder = builder.eq("service_id", Number(query.service_id));
      if (query.category_id)
        builder = builder.eq("category_id", Number(query.category_id));

      const { data, error } = await builder;

      if (error)
        return errorResponse("FETCH_ERROR", "Failed to retrieve FAQs", error.message);

      return successResponse(data, "FAQs retrieved successfully");
    },
    {
      query: t.Object({
        service_id:  t.Optional(t.String()),
        category_id: t.Optional(t.String()),
      }),
    }
  )

  // ── GET /api/faqs/:id ──────────────────────────────────────────────
  // Public
  .get(
    "/:id",
    async ({ params }) => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("faq_id", Number(params.id))
        .single();

      if (error || !data)
        return errorResponse("NOT_FOUND", "FAQ not found");

      return successResponse(data, "FAQ retrieved successfully");
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )

  // ── POST /api/faqs ─────────────────────────────────────────────────
  // Admin — protected at middleware level in elysia.ts
  .post(
    "/",
    async ({ body }) => {
      const { data, error } = await supabase
        .from("faqs")
        .insert({
          question:    body.question,
          answer:      body.answer,
          service_id:  body.service_id  ?? null,
          category_id: body.category_id ?? null,
        })
        .select()
        .single();

      if (error || !data)
        return errorResponse("CREATE_ERROR", "Failed to create FAQ", error?.message);

      return successResponse(data, "FAQ created successfully");
    },
    {
      body: t.Object({
        question:    t.String(),
        answer:      t.String(),
        service_id:  t.Optional(t.Nullable(t.Number())),
        category_id: t.Optional(t.Nullable(t.Number())),
      }),
    }
  )

  // ── PUT /api/faqs/:id ──────────────────────────────────────────────
  // Admin
  .put(
    "/:id",
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from("faqs")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("faq_id", Number(params.id))
        .select()
        .single();

      if (error || !data)
        return errorResponse("UPDATE_ERROR", "Failed to update FAQ", error?.message);

      return successResponse(data, "FAQ updated successfully");
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        question:    t.Optional(t.String()),
        answer:      t.Optional(t.String()),
        service_id:  t.Optional(t.Nullable(t.Number())),
        category_id: t.Optional(t.Nullable(t.Number())),
      }),
    }
  )

  // ── DELETE /api/faqs/:id ───────────────────────────────────────────
  // Admin
  .delete(
    "/:id",
    async ({ params }) => {
      const { data, error } = await supabase
        .from("faqs")
        .delete()
        .eq("faq_id", Number(params.id))
        .select()
        .single();

      if (error || !data)
        return errorResponse("DELETE_ERROR", "Failed to delete FAQ", error?.message);

      return successResponse(data, "FAQ deleted successfully");
    },
    {
      params: t.Object({ id: t.String() }),
    }
  );