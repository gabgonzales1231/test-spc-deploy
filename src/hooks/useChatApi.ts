// src/hooks/useChatApi.ts

import { useState, useEffect, useRef } from "react";

const MAX_LEN       = 1000;
const DAY_CAP       = 10;
const RATE_WINDOW   = 4_000;
const DAY_KEY       = "jp_msg_day";
const CNT_KEY       = "jp_msg_count";
const LAST_SENT_KEY = "jp_last_sent";
const SPAM_RE       = /https?:\/\/|(\S)\1{6,}|[^\w\s,.!?'"()\-:]{4,}/i;

export function sanitizeInput(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_LEN);
}

function getDayCount(): number {
  try {
    const today = new Date().toDateString();
    if (localStorage.getItem(DAY_KEY) !== today) {
      localStorage.setItem(DAY_KEY, today);
      localStorage.setItem(CNT_KEY, "0");
    }
    return parseInt(localStorage.getItem(CNT_KEY) ?? "0", 10);
  } catch { return 0; }
}

function incrementDayCount() {
  try { localStorage.setItem(CNT_KEY, String(getDayCount() + 1)); } catch {}
}

function getLastSentAt(): number {
  try { return parseInt(localStorage.getItem(LAST_SENT_KEY) ?? "0", 10); } catch { return 0; }
}

function setLastSentAt(ts: number) {
  try { localStorage.setItem(LAST_SENT_KEY, String(ts)); } catch {}
}

export function useInputGuard() {
  const [error, setError]                   = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil]   = useState<number | null>(null);
  const pendingRef                          = useRef<{ text: string; send: (t: string) => void } | null>(null);

  useEffect(() => {
    if (cooldownUntil === null) return;
    const remaining = Math.max(0, cooldownUntil - Date.now());
    const t = setTimeout(() => {
      setCooldownUntil(null);
      if (pendingRef.current) {
        const { text, send } = pendingRef.current;
        pendingRef.current = null;
        send(text);
      }
    }, remaining);
    return () => clearTimeout(t);
  }, [cooldownUntil]);

  // send callback is passed in so the hook can fire it after the delay
  function validate(text: string, onDelayed?: (t: string) => void): boolean {
    const t = sanitizeInput(text);

    if (!t || SPAM_RE.test(t)) {
      setError("This is an invalid inquiry.");
      return false;
    }

    const now     = Date.now();
    const elapsed = now - getLastSentAt();
if (elapsed < RATE_WINDOW) {
  if (onDelayed) {
    setLastSentAt(now);
    incrementDayCount();
    setError(null);
    pendingRef.current = { text: t, send: onDelayed };
    setCooldownUntil(now + RATE_WINDOW - elapsed);   // remaining ms, not a new full window
  }
  return false;
}

    if (getDayCount() >= DAY_CAP) {
      setError("Daily message limit reached. Please try again tomorrow.");
      return false;
    }

    setLastSentAt(now);
    incrementDayCount();
    setError(null);
    return true;
  }

  function clearError() { setError(null); }

  function getRemainingCount(): number {
    return Math.max(0, DAY_CAP - getDayCount());
  }

  return { validate, sanitizeInput, error, clearError, getRemainingCount, cooldownUntil };
}