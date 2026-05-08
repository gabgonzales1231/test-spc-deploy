// src/backend/routes/chat.ts

import { Elysia, t } from "elysia";
import { supabase } from "@/backend/config/database"; // adjust to your actual supabase client path

export const chatRoutes = new Elysia({ prefix: "/chat" }).post(
  "/",
  async ({ body, request, set }) => {
    const { full_name, email, phone, subject, message, source_node } = body;
    const forwardedFor =
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
    const ip_address = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

    const { error } = await supabase.from("chat").insert({
      full_name:   full_name.trim(),
      email:       email?.trim()       || null,
      phone:       phone?.trim()       || null,
      subject:     subject.trim(),
      message:     message.trim(),
      source_node: source_node?.trim() || null,
      ip_address,
    });

    if (error) {
      set.status = 500;
      return { success: false, error: error.message };
    }

    return { success: true };
  },
  {
    body: t.Object({
      full_name:   t.String({ minLength: 1 }),
      email:       t.Optional(t.String()),
      phone:       t.Optional(t.String()),
      subject:     t.String({ minLength: 1 }),
      message:     t.String({ minLength: 1 }),
      source_node: t.Optional(t.String()),
      ip_address:  t.Optional(t.Nullable(t.String())),
    }),
  }
);