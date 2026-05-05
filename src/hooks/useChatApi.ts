import { useState } from "react";

const SPAM_RE   = /https?:\/\/|(\S)\1{6,}|[^\w\s,.!?'"()\-:]{4,}/i;
const MAX_LEN   = 300;
const DAY_CAP   = 3;
const WINDOW_MS = 3 * 60 * 60 * 1000; // 3 hours in ms

const DAY_KEY = "jp_msg_day";
const CNT_KEY = "jp_msg_count";
const WIN_KEY = "jp_msg_window"; // JSON: { windowStart: number }

// ── Day counter (resets at midnight) ─────────────────────────────────────

function getDayCount(): number {
  try {
    const today = new Date().toDateString();
    if (localStorage.getItem(DAY_KEY) !== today) {
      localStorage.setItem(DAY_KEY, today);
      localStorage.setItem(CNT_KEY, "0");
    }
    return parseInt(localStorage.getItem(CNT_KEY) ?? "0", 10);
  } catch {
    return 0;
  }
}

function incrementDayCount() {
  try {
    localStorage.setItem(CNT_KEY, String(getDayCount() + 1));
  } catch {}
}

// ── 3-hour window (1 message allowed per window) ──────────────────────────

interface WindowState { windowStart: number }

function getWindow(): WindowState | null {
  try {
    const raw = localStorage.getItem(WIN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WindowState;
      if (Date.now() - parsed.windowStart < WINDOW_MS) return parsed;
    }
  } catch {}
  return null; // no active window
}

function startWindow() {
  try {
    localStorage.setItem(WIN_KEY, JSON.stringify({ windowStart: Date.now() }));
  } catch {}
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useInputGuard() {
  const [error, setError] = useState<string | null>(null);

  function validate(text: string): boolean {
    const t = text.trim();

    if (!t || t.length > MAX_LEN || SPAM_RE.test(t)) {
      setError("This is an invalid inquiry.");
      return false;
    }

    // Daily cap
    if (getDayCount() >= DAY_CAP) {
      setError("Inquiry limit reached. Thank you for using our service.");
      return false;
    }

    // 1 message per 3-hour window
    const win = getWindow();
    if (win !== null) {
      setError("Inquiry already sent, please come back later.");
      return false;
    }

    // All clear — commit
    incrementDayCount();
    startWindow();
    setError(null);
    return true;
  }

  function clearError() { setError(null); }

  return { validate, error, clearError };
}