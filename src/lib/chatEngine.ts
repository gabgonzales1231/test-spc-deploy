// ─────────────────────────────────────────────
// chatEngine.ts — Flow-based navigation engine
// ─────────────────────────────────────────────

import {
  FLOW_NODES,
  KEYWORD_MAP,
  MAIN_MENU_KEY,
  FlowNode,
} from "./flowData";
import { CMSContent, ComplaintPayload } from "./chatTypes";

// ── Placeholder injection ──────────────────────────────────────────────────

const STATIC_FALLBACKS: Record<string, string> = {
  citizens_charter_link:
    "https://files.sanpablocity.gov.ph/A7d9F3kH2mX0QwL5Z8vR1tY4nP6sB0.pdf",
  fare_price_link:
    "https://files.sanpablocity.gov.ph/A7d9F3kH2mX0QwL5Z8vR1tY4nP6sB0.pdf",
  office_contacts: `Bureau of Fire Protection:\nLandline: 5627-654\n\nCDRRMO\nLandline: 8000-405\nSmart: 09089078124\nGlobe: 09955619456\n\nCHO\nLandline: 576-9119\nSmart: 09392022318\nGlobe: 09673625480\n\nPolice\nLandline: 5626-474\nLandline: 5210-610\n\nWelfare & Development Office\nLandline: (049) 3000-065`,
  terminal_locations:
    "Para sa kumpletong listahan ng mga terminal, mangyaring bisitahin ang City Hall o makipag-ugnayan sa LTFRB San Pablo.",
};

export function injectContent(
  template: string,
  cms: CMSContent
): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    // Try CMS services by slug-derived key first
    if (key === "citizens_charter_link" || key === "fare_price_link") {
      const slug =
        key === "citizens_charter_link" ? "citizens-charter" : "fare-price";
      const svc = cms.services[slug];
      if (svc?.online_application_url) return svc.online_application_url;
    }

    // Try CMS FAQs for contacts / terminal
    if (key === "office_contacts") {
      const faq = Object.values(cms.faqs).find(
        (f) => f.category_id === 1 // convention: category 1 = contacts
      );
      if (faq?.answer) return faq.answer;
    }

    if (key === "terminal_locations") {
      const faq = Object.values(cms.faqs).find(
        (f) => f.category_id === 2 // convention: category 2 = transport
      );
      if (faq?.answer) return faq.answer;
    }

    // Static fallback
    return STATIC_FALLBACKS[key] ?? `[${key}]`;
  });
}

// ── Node resolution ────────────────────────────────────────────────────────

export function resolveNodeByKeyword(input: string): FlowNode | null {
  const normalized = input.toLowerCase().trim();

  // Exact match in keyword map
  if (KEYWORD_MAP[normalized]) {
    return FLOW_NODES[KEYWORD_MAP[normalized]] ?? null;
  }

  // Partial match
  for (const [kw, nodeKey] of Object.entries(KEYWORD_MAP)) {
    if (normalized.includes(kw)) {
      return FLOW_NODES[nodeKey] ?? null;
    }
  }

  return null;
}

export function getNode(key: string): FlowNode {
  return FLOW_NODES[key] ?? FLOW_NODES[MAIN_MENU_KEY];
}

export function getMainMenuNode(): FlowNode {
  return FLOW_NODES[MAIN_MENU_KEY];
}

// ── Greeting / small talk ──────────────────────────────────────────────────

const GREETINGS = ["hi", "hello", "hey", "kumusta", "musta", "good morning", "good afternoon", "good evening"];
const THANKS    = ["thank", "thanks", "thank you", "salamat", "ok", "okay", "noted"];

export function getSmallTalkResponse(input: string): string | null {
  const n = input.toLowerCase();
  if (GREETINGS.some((g) => n.includes(g))) {
    return "Magandang araw! 😊 Piliin ang iyong kailangan sa ibaba.";
  }
  if (THANKS.some((t) => n.includes(t))) {
    return "Walang anuman! May iba pa ba akong maitutulong? 😊";
  }
  return null;
}

// ── Feedback / complaint submission ───────────────────────────────────────

export async function submitFeedback(
  payload: ComplaintPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data?.error?.message ?? "Hindi natanggap ang mensahe." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error. Subukan ulit." };
  }
}

// ── CMS fetcher ───────────────────────────────────────────────────────────

export async function fetchCMSContent(): Promise<
  Pick<CMSContent, "services" | "faqs">
> {
  const [svcRes, faqRes] = await Promise.allSettled([
    fetch("/api/services").then((r) => r.json()),
    fetch("/api/faqs").then((r) => r.json()),
  ]);

  const services: CMSContent["services"] = {};
  const faqs: CMSContent["faqs"] = {};

  if (svcRes.status === "fulfilled" && svcRes.value?.success) {
    for (const svc of svcRes.value.data ?? []) {
      services[svc.slug] = svc;
    }
  }

  if (faqRes.status === "fulfilled" && faqRes.value?.success) {
    for (const faq of faqRes.value.data ?? []) {
      faqs[String(faq.faq_id)] = faq;
    }
  }

  return { services, faqs };
}