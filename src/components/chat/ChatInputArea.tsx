import { useEffect, useState } from "react";
import { InputMode } from "@/lib/flowData";

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ── Cooldown overlay ──────────────────────────────────────────────────────
// Renders a pill over the input row while the sliding-window timer is active.

interface CooldownOverlayProps {
  cooldownUntil: number;
  onExpired: () => void;
}

function CooldownOverlay({ cooldownUntil, onExpired }: CooldownOverlayProps) {
  const [secsLeft, setSecsLeft] = useState(() =>
    Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
  );

  useEffect(() => {
    if (secsLeft <= 0) { onExpired(); return; }
    const t = setInterval(() => {
      const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setSecsLeft(left);
      if (left <= 0) { clearInterval(t); onExpired(); }
    }, 250);
    return () => clearInterval(t);
  }, [cooldownUntil, onExpired]);

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-background/80 backdrop-blur-[2px] z-10">
      <span className="text-[#08A872]"><Spinner /></span>
      <span className="text-[12px] text-muted-foreground">
        Please wait…
      </span>
    </div>
  );
}

// ── Shared wrapper ────────────────────────────────────────────────────────

interface InputWrapperProps {
  inputError?: string | null;
  isClosed?: boolean;
  cooldownUntil?: number | null;
  children: React.ReactNode;
}

function InputWrapper({ inputError, isClosed, cooldownUntil, children }: InputWrapperProps) {
  const [localCooldown, setLocalCooldown] = useState<number | null>(cooldownUntil ?? null);

  // Sync when parent updates cooldownUntil (e.g. a new rate-limit hit)
  useEffect(() => {
    if (cooldownUntil && cooldownUntil > Date.now()) setLocalCooldown(cooldownUntil);
  }, [cooldownUntil]);

  const title = isClosed ? "Conversation is closed" : undefined;

  return (
    <div className="relative p-3 border-t border-border bg-background shrink-0" title={title}>
      {inputError && (
        <p className="text-xs text-red-500 px-1 pb-1">{inputError}</p>
      )}
      <div className={`flex gap-2 items-center ${isClosed ? "opacity-60" : ""}`}>
        {children}
      </div>
      {localCooldown && localCooldown > Date.now() && (
        <CooldownOverlay
          cooldownUntil={localCooldown}
          onExpired={() => setLocalCooldown(null)}
        />
      )}
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────────────────

interface TextInputProps {
  value: string;
  placeholder: string;
  submitting: boolean;
  inputError?: string | null;
  isClosed?: boolean;
  cooldownUntil?: number | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function TextInput({
  value, placeholder, submitting, inputError,
  isClosed, cooldownUntil, onChange, onSubmit,
}: TextInputProps) {
  return (
    <InputWrapper inputError={inputError} isClosed={isClosed} cooldownUntil={cooldownUntil}>
      <input
        placeholder={isClosed ? "Conversation is closed" : placeholder}
        value={value}
        disabled={isClosed}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        className={`flex-1 border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none ${isClosed ? "cursor-not-allowed" : ""}`}
      />
      <button
        onClick={onSubmit}
        disabled={submitting || !value.trim() || isClosed}
        className={`bg-[#08A872] border-none rounded-full w-9 h-9 flex items-center justify-center shrink-0 transition-opacity ${
          isClosed ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90 disabled:opacity-50"
        }`}
      >
        <SendIcon />
      </button>
    </InputWrapper>
  );
}

// ── FreeTextInput ─────────────────────────────────────────────────────────

interface FreeTextInputProps {
  inputError?: string | null;
  isClosed?: boolean;
  cooldownUntil?: number | null;
  onSend: (text: string) => void;
  onClearError?: () => void;
}

function FreeTextInput({ inputError, isClosed, cooldownUntil, onSend, onClearError }: FreeTextInputProps) {
  function send(input: HTMLInputElement) {
    if (isClosed) return;
    onSend(input.value);
    input.value = "";
  }

  return (
    <InputWrapper inputError={inputError} isClosed={isClosed} cooldownUntil={cooldownUntil}>
      <input
        placeholder={isClosed ? "Conversation is closed" : "I-type ang iyong mensahe..."}
        disabled={isClosed}
        onChange={onClearError}
        onKeyDown={(e) => { if (e.key === "Enter") send(e.currentTarget); }}
        className={`flex-1 border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none ${isClosed ? "cursor-not-allowed" : ""}`}
      />
      <button
        disabled={isClosed}
        onClick={(e) => {
          const input = e.currentTarget
            .closest("div")
            ?.querySelector("input") as HTMLInputElement | null;
          if (input) send(input);
        }}
        className={`bg-[#08A872] border-none rounded-full w-9 h-9 flex items-center justify-center shrink-0 transition-opacity ${
          isClosed ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90 disabled:opacity-50"
        }`}
      >
        <SendIcon />
      </button>
    </InputWrapper>
  );
}

// ── DisabledInput ─────────────────────────────────────────────────────────

export function DisabledInput() {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      <div className="flex gap-2 items-center opacity-50">
        <input
          placeholder="Pumili mula sa mga pagpipilian sa itaas..."
          disabled
          className="flex-1 border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none cursor-not-allowed"
        />
      </div>
    </div>
  );
}

// ── ChatInputArea orchestrator ────────────────────────────────────────────

interface ChatInputAreaProps {
  mode: InputMode | null;
  submitting: boolean;
  helpdeskText: string;
  inputError?: string | null;
  isClosed?: boolean;
  cooldownUntil?: number | null;
  onHelpdeskChange: (value: string) => void;
  onHelpdeskSubmit: () => void;
  onTextSend?: (text: string) => void;
  onClearError?: () => void;
}

export function ChatInputArea({
  mode, submitting, helpdeskText, inputError,
  isClosed, cooldownUntil, onHelpdeskChange,
  onHelpdeskSubmit, onTextSend, onClearError,
}: ChatInputAreaProps) {
  if (mode === "helpdesk-text") {
    return (
      <TextInput
        value={helpdeskText}
        placeholder="I-type ang iyong tanong..."
        submitting={submitting}
        inputError={inputError}
        isClosed={isClosed}
        cooldownUntil={cooldownUntil}
        onChange={onHelpdeskChange}
        onSubmit={onHelpdeskSubmit}
      />
    );
  }

  if (mode === "free-text" && onTextSend) {
    return (
      <FreeTextInput
        inputError={inputError}
        isClosed={isClosed}
        cooldownUntil={cooldownUntil}
        onSend={onTextSend}
        onClearError={onClearError}
      />
    );
  }

  return <DisabledInput />;
}