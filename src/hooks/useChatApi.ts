// src/hooks/useChatApi.ts

import { useState, useEffect, useRef } from "react";

const MAX_LEN       = 1000;
const DAY_CAP       = 25;
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
  const [error, setError]                 = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  // Generic no-arg thunk — works for a delayed text send, a delayed attachment
  // send, or anything else that needs to retry once the rate window clears.
  const pendingRef                        = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (cooldownUntil === null) return;
    const remaining = Math.max(0, cooldownUntil - Date.now());
    const t = setTimeout(() => {
      setCooldownUntil(null);
      if (pendingRef.current) {
        const fn = pendingRef.current;
        pendingRef.current = null;
        fn();
      }
    }, remaining);
    return () => clearTimeout(t);
  }, [cooldownUntil]);

  // Shared rate-limit / daily-cap gate. Consumes one "slot" (day count +
  // last-sent timestamp) whenever a send is allowed to proceed — either
  // immediately, or scheduled via onDelayed once the rate window clears.
  function checkLimit(onDelayed?: () => void): boolean {
    const now     = Date.now();
    const elapsed = now - getLastSentAt();

    if (elapsed < RATE_WINDOW) {
      if (onDelayed) {
        setLastSentAt(now);
        incrementDayCount();
        setError(null);
        pendingRef.current = onDelayed;
        setCooldownUntil(now + RATE_WINDOW - elapsed); // remaining ms, not a new full window
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

  // Text-message path — sanitizes/spam-checks first, then applies the shared gate.
  function validate(text: string, onDelayed?: (t: string) => void): boolean {
    const t = sanitizeInput(text);

    if (!t || SPAM_RE.test(t)) {
      setError("This is an invalid inquiry.");
      return false;
    }

    return checkLimit(onDelayed ? () => onDelayed(t) : undefined);
  }

  // Attachment path — no text to sanitize/spam-check, but still burns the
  // same daily cap and rate-limit window as a text message.
  function validateAttachment(onDelayed?: () => void): boolean {
    return checkLimit(onDelayed);
  }

  function clearError() { setError(null); }

  function getRemainingCount(): number {
    return Math.max(0, DAY_CAP - getDayCount());
  }

  return {
    validate, validateAttachment, sanitizeInput,
    error, clearError, getRemainingCount, cooldownUntil,
  };
}