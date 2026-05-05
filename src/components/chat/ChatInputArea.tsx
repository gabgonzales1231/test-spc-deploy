//spc-website\src\components\chat\ChatInputArea.tsx

import { InputMode } from "@/lib/flowData";

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Helpdesk Text Input ───────────────────────────────────────────────────

interface TextInputProps {
  value: string;
  placeholder: string;
  submitting: boolean;
  inputError?: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function TextInput({ value, placeholder, submitting, inputError, onChange, onSubmit }: TextInputProps) {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      {inputError && (
        <p className="text-xs text-red-500 px-1 pb-1">{inputError}</p>
      )}
      <div className="flex gap-2 items-center">
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
          className="flex-1 border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none"
        />
        <button
          onClick={onSubmit}
          disabled={submitting || !value.trim()}
          className="bg-[#08A872] disabled:opacity-50 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-90"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

// ── Free-text Input (keyword / small-talk mode) ───────────────────────────

interface FreeTextInputProps {
  inputError?: string | null;
  onSend: (text: string) => void;
  onClearError?: () => void;
}

function FreeTextInput({ inputError, onSend, onClearError }: FreeTextInputProps) {
  function send(input: HTMLInputElement) {
    onSend(input.value);
    input.value = "";
  }

  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      {inputError && (
        <p className="text-xs text-red-500 px-1 pb-1">{inputError}</p>
      )}
      <div className="flex gap-2 items-center">
        <input
          placeholder="I-type ang iyong mensahe..."
          onChange={onClearError}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(e.currentTarget);
          }}
          className="flex-1 border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none"
        />
        <button
          onClick={(e) => {
            const input = e.currentTarget
              .closest("div")
              ?.querySelector("input") as HTMLInputElement | null;
            if (input) send(input);
          }}
          className="bg-[#08A872] border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shrink-0 transition-opacity hover:opacity-90"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

// ── Disabled Buttons Hint ─────────────────────────────────────────────────

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
  onHelpdeskChange: (value: string) => void;
  onHelpdeskSubmit: () => void;
  onTextSend?: (text: string) => void;
  onClearError?: () => void;
}

export function ChatInputArea({
  mode,
  submitting,
  helpdeskText,
  inputError,
  onHelpdeskChange,
  onHelpdeskSubmit,
  onTextSend,
  onClearError,
}: ChatInputAreaProps) {
  if (mode === "helpdesk-text") {
    return (
      <TextInput
        value={helpdeskText}
        placeholder="I-type ang iyong tanong..."
        submitting={submitting}
        inputError={inputError}
        onChange={onHelpdeskChange}
        onSubmit={onHelpdeskSubmit}
      />
    );
  }

  if (mode === "free-text" && onTextSend) {
    return (
      <FreeTextInput
        inputError={inputError}
        onSend={onTextSend}
        onClearError={onClearError}
      />
    );
  }

  return <DisabledInput />;
}