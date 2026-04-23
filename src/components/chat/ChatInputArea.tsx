import { InputMode } from "@/lib/flowData";

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Negosyo Form ──────────────────────────────────────────────────────────

interface NegosyoInputProps {
  businessId: string;
  complaint: string;
  submitting: boolean;
  onChange: (field: "businessId" | "complaint", value: string) => void;
  onSubmit: () => void;
}

export function NegosyoInput({ businessId, complaint, submitting, onChange, onSubmit }: NegosyoInputProps) {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      <input
        placeholder="Business No. o Pangalan ng Negosyo"
        value={businessId}
        onChange={(e) => onChange("businessId", e.target.value)}
        className="w-full border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none"
      />
      <textarea
        placeholder="Reklamo tungkol sa negosyo"
        value={complaint}
        onChange={(e) => onChange("complaint", e.target.value)}
        rows={2}
        className="w-full border border-border rounded-[20px] py-2 px-3.5 text-[13px] bg-background text-foreground outline-none resize-none mt-1.5"
      />
      <button
        onClick={onSubmit}
        disabled={submitting || !businessId.trim() || !complaint.trim()}
        className="mt-2 w-full bg-[#08A872] text-white disabled:opacity-50 border-none rounded-full py-2.5 text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-90"
      >
        Isend ang Reklamo
      </button>
    </div>
  );
}

// ── Traysikel Form ────────────────────────────────────────────────────────

interface TraysikelInputProps {
  plateNumber: string;
  complaint: string;
  submitting: boolean;
  onChange: (field: "plateNumber" | "complaint", value: string) => void;
  onSubmit: () => void;
}

export function TraysikelInput({ plateNumber, complaint, submitting, onChange, onSubmit }: TraysikelInputProps) {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      <input
        placeholder="Plate No. o No. ng Traysikel"
        value={plateNumber}
        onChange={(e) => onChange("plateNumber", e.target.value)}
        className="w-full border border-border rounded-full py-2 px-3.5 text-[13px] bg-background text-foreground outline-none"
      />
      <textarea
        placeholder="Reklamo tungkol sa traysikel"
        value={complaint}
        onChange={(e) => onChange("complaint", e.target.value)}
        rows={2}
        className="w-full border border-border rounded-[20px] py-2 px-3.5 text-[13px] bg-background text-foreground outline-none resize-none mt-1.5"
      />
      <button
        onClick={onSubmit}
        disabled={submitting || !plateNumber.trim() || !complaint.trim()}
        className="mt-2 w-full bg-[#08A872] text-white disabled:opacity-50 border-none rounded-full py-2.5 text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-90"
      >
        Isend ang Reklamo
      </button>
    </div>
  );
}

// ── Helpdesk / Papuri Text Input ──────────────────────────────────────────

interface TextInputProps {
  value: string;
  placeholder: string;
  submitting: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function TextInput({ value, placeholder, submitting, onChange, onSubmit }: TextInputProps) {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
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

interface NegosyoForm { businessId: string; complaint: string }
interface TraysikelForm { plateNumber: string; complaint: string }

interface ChatInputAreaProps {
  mode: InputMode;
  submitting: boolean;
  negosyoForm: NegosyoForm;
  traysikelForm: TraysikelForm;
  helpdeskText: string;
  papuriText: string;
  onNegosyoChange: (field: "businessId" | "complaint", value: string) => void;
  onTraysikelChange: (field: "plateNumber" | "complaint", value: string) => void;
  onHelpdeskChange: (value: string) => void;
  onPapuriChange: (value: string) => void;
  onNegosyoSubmit: () => void;
  onTraysikelSubmit: () => void;
  onHelpdeskSubmit: () => void;
  onPapuriSubmit: () => void;
}

export function ChatInputArea({
  mode,
  submitting,
  negosyoForm,
  traysikelForm,
  helpdeskText,
  papuriText,
  onNegosyoChange,
  onTraysikelChange,
  onHelpdeskChange,
  onPapuriChange,
  onNegosyoSubmit,
  onTraysikelSubmit,
  onHelpdeskSubmit,
  onPapuriSubmit,
}: ChatInputAreaProps) {
  if (mode === "complaint-negosyo") {
    return (
      <NegosyoInput
        businessId={negosyoForm.businessId}
        complaint={negosyoForm.complaint}
        submitting={submitting}
        onChange={onNegosyoChange}
        onSubmit={onNegosyoSubmit}
      />
    );
  }

  if (mode === "complaint-traysikel") {
    return (
      <TraysikelInput
        plateNumber={traysikelForm.plateNumber}
        complaint={traysikelForm.complaint}
        submitting={submitting}
        onChange={onTraysikelChange}
        onSubmit={onTraysikelSubmit}
      />
    );
  }

  if (mode === "helpdesk-text") {
    return (
      <TextInput
        value={helpdeskText}
        placeholder="I-type ang iyong tanong..."
        submitting={submitting}
        onChange={onHelpdeskChange}
        onSubmit={onHelpdeskSubmit}
      />
    );
  }

  if (mode === "papuri-text") {
    return (
      <TextInput
        value={papuriText}
        placeholder="Ibigay ang iyong mensahe..."
        submitting={submitting}
        onChange={onPapuriChange}
        onSubmit={onPapuriSubmit}
      />
    );
  }

  return <DisabledInput />;
}
