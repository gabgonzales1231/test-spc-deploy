// src/backend/routes/chat.ts

import { Elysia, t } from "elysia";
import { supabase } from "@/backend/config/database";

export const chatRoutes = new Elysia({ prefix: "/chat" })

  // ── Start a new conversation ──────────────────────────────────────────
  .post("/conversations", async ({ body, request, set }) => {
    const { full_name, email, phone, subject, message, source_node } = body;

    const forwardedFor =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip");
    const ip_address = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        full_name:   full_name.trim(),
        email:       email?.trim()      || null,
        phone:       phone?.trim()      || null,
        subject:     subject.trim(),
        message:     message.trim(),
        source_node: source_node?.trim() || null,
        ip_address,
        status:      "open",
      })
      .select("id")
      .single();

    if (convError || !conversation) {
      set.status = 500;
      return { success: false, error: convError?.message ?? "Failed to create conversation" };
    }

    const { error: msgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversation.id,
        sender_type:     "visitor",
        sender_id:       null,
        content:         message.trim(),
        is_read:         false,
      });

    if (msgError) {
      set.status = 500;
      return { success: false, error: msgError.message };
    }

    return { success: true, conversation_id: conversation.id };
  }, {
    body: t.Object({
      full_name:   t.String({ minLength: 1 }),
      email:       t.Optional(t.String()),
      phone:       t.Optional(t.String()),
      subject:     t.String({ minLength: 1 }),
      message:     t.String({ minLength: 1 }),
      source_node: t.Optional(t.String()),
    }),
  })

  // ── Visitor follow-up message ─────────────────────────────────────────
  // Must be declared before GET /conversations/:id to avoid param swallowing
  .post("/conversations/:id/messages", async ({ params, body, set }) => {
    const conversationId = parseInt(params.id);

    const { data: conversation, error: fetchError } = await supabase
      .from("conversations")
      .select("id, status")
      .eq("id", conversationId)
      .single();

    if (fetchError || !conversation) {
      set.status = 404;
      return { success: false, error: "Conversation not found" };
    }

    if (conversation.status === "closed") {
      set.status = 400;
      return { success: false, error: "This conversation has been closed" };
    }

    const { error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        sender_type:     "visitor",
        sender_id:       null,
        content:         body.content.trim(),
        is_read:         false,
      });

    if (error) {
      set.status = 500;
      return { success: false, error: error.message };
    }

    return { success: true };
  }, {
    params: t.Object({ id: t.String() }),
    body:   t.Object({ content: t.String({ minLength: 1 }) }),
  })

  // ── Public message history (session restore on page refresh) ──────────
  .get("/conversations/:id/messages", async ({ params, set }) => {
    const convId = parseInt(params.id);

    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, sender_type, content, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (error) {
      set.status = 500;
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  }, {
    params: t.Object({ id: t.String() }),
  });