import { UserInfo } from "@/lib/chatTypes";
import { JPAvatar } from "./ui/JPAvatar";
import { OnlineDot } from "./ui/OnlineDot";

const BOT_NAME = "Juan Pablo";

interface ChatFormProps {
  userInfo: UserInfo;
  formErrors: Partial<UserInfo>;
  onChange: (field: keyof UserInfo, value: string) => void;
  onBlur?: (field: keyof UserInfo, value: string) => void;
  onSubmit: () => void;
}

const baseInput =
  "w-full border rounded-lg py-2 px-3 text-[13px] bg-background text-foreground outline-none focus:border-[#2563EB] transition-colors";

export function ChatForm({ userInfo, formErrors, onChange, onBlur, onSubmit }: ChatFormProps) {
  const inputClass = (field: keyof UserInfo) =>
    `${baseInput} ${formErrors[field] ? "border-red-500" : "border-border"}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#2563EB] px-4 py-3.5 flex items-center gap-2.5 shrink-0">
        <JPAvatar size={32} />
        <div className="flex-1">
          <div className="text-white text-sm font-medium leading-tight">{BOT_NAME}</div>
          <div className="text-white/75 text-xs flex items-center gap-1">
            <OnlineDot /> Virtual Assistant
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 bg-background">
        <p className="text-[13px] text-foreground mb-4 leading-relaxed">
          Punan ang form sa ibaba para magsimula ng pakikipag-usap.
        </p>

        {/* Full Name */}
        <label className="block text-xs font-medium text-foreground mb-1">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          value={userInfo.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          onBlur={(e) => onBlur?.("fullName", e.target.value)}
          placeholder="Juan dela Cruz"
          className={inputClass("fullName")}
        />
        {formErrors.fullName && (
          <p className="text-red-600 text-[11px] mt-1">{formErrors.fullName}</p>
        )}

        {/* Email */}
        <label className="block text-xs font-medium text-foreground mb-1 mt-3">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          value={userInfo.email}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={(e) => onBlur?.("email", e.target.value)}
          placeholder="juan@email.com"
          className={inputClass("email")}
        />
        {formErrors.email && (
          <p className="text-red-600 text-[11px] mt-1">{formErrors.email}</p>
        )}

        {/* Phone */}
        <label className="block text-xs font-medium text-foreground mb-1 mt-3">
          Phone No. <span className="text-red-600">*</span>
        </label>
<input
  type="tel"
  value={userInfo.phone}
  onChange={(e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    onChange("phone", digits);
  }}
  onBlur={(e) => onBlur?.("phone", e.target.value)}
  placeholder="09XX-XXX-XXXX"
  className={inputClass("phone")}
/>
        {formErrors.phone && (
          <p className="text-red-600 text-[11px] mt-1">{formErrors.phone}</p>
        )}

        <button
          onClick={onSubmit}
          className="mt-4 w-full bg-[#2563EB] text-white border-none rounded-full py-2.5 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
}