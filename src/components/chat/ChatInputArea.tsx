import { useEffect, useRef, useState } from "react";
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

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
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
      <span className="text-[#2563EB]"><Spinner /></span>
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
      <div className={`flex gap-2 items-end ${isClosed ? "opacity-60" : ""}`}>
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

// ── AttachmentButtons ─────────────────────────────────────────────────────
// Paperclip = PDFs + images. Image icon = images only (shortcut).
// Selecting a file only STAGES it — it does not upload/send immediately.

interface AttachmentButtonsProps {
  isClosed?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
}

function AttachmentButtons({ isClosed, disabled, onFileSelect }: AttachmentButtonsProps) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const isDisabled = isClosed || disabled;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = ""; // allow re-selecting the same file
  }

  return (
    <>
      <input
        ref={docInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isDisabled}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => docInputRef.current?.click()}
        disabled={isDisabled}
        title="Attach file (PDF or image)"
        className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 text-muted-foreground transition-opacity ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted"
        }`}
      >
        <PaperclipIcon />
      </button>

      <input
        ref={imgInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isDisabled}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => imgInputRef.current?.click()}
        disabled={isDisabled}
        title="Attach photo"
        className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 text-muted-foreground transition-opacity ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted"
        }`}
      >
        <ImageIcon />
      </button>
    </>
  );
}

// ── StagedAttachmentChip ──────────────────────────────────────────────────
// Preview shown above the input row while a file is staged but not yet sent.

interface StagedAttachmentChipProps {
  file: File;
  onRemove: () => void;
}

function StagedAttachmentChip({ file, onRemove }: StagedAttachmentChipProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1.5 mb-1.5">
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="w-8 h-8 rounded object-cover shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded bg-background flex items-center justify-center shrink-0 text-muted-foreground">
          <FileIcon />
        </div>
      )}
      <span className="text-[12px] truncate flex-1 text-foreground">{file.name}</span>
      <button
        type="button"
        onClick={onRemove}
        title="Remove attachment"
        className="w-5 h-5 flex items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground shrink-0"
      >
        <XIcon />
      </button>
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────────────────
// (helpdesk-mode text input — no attachment support, unchanged)

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
        className={`bg-[#2563EB] border-none rounded-full w-9 h-9 flex items-center justify-center shrink-0 transition-opacity ${
          isClosed ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90 disabled:opacity-50"
        }`}
      >
        <SendIcon />
      </button>
    </InputWrapper>
  );
}

// ── FreeTextInput ─────────────────────────────────────────────────────────
// Attaching a file only stages it (preview shown above the input). The user
// can then type an optional caption and press Send — text and attachment
// (if any) go out together, on a single explicit action.

interface FreeTextInputProps {
  inputError?: string | null;
  isClosed?: boolean;
  cooldownUntil?: number | null;
  uploading?: boolean;
  onSend: (text: string) => void;
  onSendAttachment?: (file: File, caption: string) => void;
  onClearError?: () => void;
}

function FreeTextInput({
  inputError, isClosed, cooldownUntil, uploading,
  onSend, onSendAttachment, onClearError,
}: FreeTextInputProps) {
  const textInputRef = useRef<HTMLInputElement>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [hasText, setHasText] = useState(false);

  function handleFileSelect(file: File) {
    setStagedFile(file);
    onClearError?.();
  }

  function handleSend() {
    if (isClosed || uploading) return;
    const input = textInputRef.current;
    const text = input?.value.trim() ?? "";

    if (stagedFile) {
      onSendAttachment?.(stagedFile, text);
      setStagedFile(null);
    } else if (text) {
      onSend(text);
    } else {
      return; // nothing staged and nothing typed
    }

    if (input) input.value = "";
    setHasText(false);
  }

  const canSend = !isClosed && !uploading && (!!stagedFile || hasText);

  return (
    <InputWrapper inputError={inputError} isClosed={isClosed} cooldownUntil={cooldownUntil}>
      <div className="flex-1 min-w-0 flex flex-col">
        {stagedFile && (
          <StagedAttachmentChip file={stagedFile} onRemove={() => setStagedFile(null)} />
        )}
        <input
          ref={textInputRef}
          placeholder={
            isClosed
              ? "Conversation is closed"
              : stagedFile
              ? "Magdagdag ng mensahe (opsyonal)..."
              : "I-type ang iyong mensahe..."
          }
          disabled={isClosed}
          onChange={(e) => { setHasText(!!e.target.value.trim()); onClearError?.(); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          className={`w-full border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none ${isClosed ? "cursor-not-allowed" : ""}`}
        />
      </div>

      {onSendAttachment && (
        <AttachmentButtons
          isClosed={isClosed}
          disabled={uploading}
          onFileSelect={handleFileSelect}
        />
      )}

      <button
        disabled={!canSend}
        onClick={handleSend}
        title="Send"
        className={`bg-[#2563EB] border-none rounded-full w-9 h-9 flex items-center justify-center shrink-0 transition-opacity ${
          !canSend ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
        }`}
      >
        {uploading ? <Spinner /> : <SendIcon />}
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
  uploading?: boolean;
  onHelpdeskChange: (value: string) => void;
  onHelpdeskSubmit: () => void;
  onTextSend?: (text: string) => void;
  onAttachmentSend?: (file: File, caption: string) => void;
  onClearError?: () => void;
}

export function ChatInputArea({
  mode, submitting, helpdeskText, inputError,
  isClosed, cooldownUntil, uploading, onHelpdeskChange,
  onHelpdeskSubmit, onTextSend, onAttachmentSend, onClearError,
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
        uploading={uploading}
        onSend={onTextSend}
        onSendAttachment={onAttachmentSend}
        onClearError={onClearError}
      />
    );
  }

  return <DisabledInput />;
}