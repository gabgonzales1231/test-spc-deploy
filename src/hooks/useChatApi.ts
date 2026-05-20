// src/hooks/useChatApi.ts

import { useState } from "react";

const SPAM_RE  = /https?:\/\/|(\S)\1{6,}|[^\w\s,.!?'"()\-:]{4,}/i;
const MAX_LEN  = 300;
const DAY_CAP  = 5;
const DAY_KEY  = "jp_msg_day";
const CNT_KEY  = "jp_msg_count";

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

export function useInputGuard() {
  const [error, setError] = useState<string | null>(null);

  function validate(text: string): boolean {
    const t = text.trim();

    if (!t || t.length > MAX_LEN || SPAM_RE.test(t)) {
      setError("This is an invalid inquiry.");
      return false;
    }

    if (getDayCount() >= DAY_CAP) {
      setError("Daily message limit reached. Please try again tomorrow.");
      return false;
    }

    incrementDayCount();
    setError(null);
    return true;
  }

  function clearError() { setError(null); }

  // Expose remaining count so UI can display it
  function getRemainingCount(): number {
    return Math.max(0, DAY_CAP - getDayCount());
  }

  return { validate, error, clearError, getRemainingCount };
}