import { UserInfo } from "@/lib/chatTypes";
import { JPAvatar } from "./ui/JPAvatar";
import { OnlineDot } from "./ui/OnlineDot";

const BOT_NAME = "Juan Pablo ChatBot";

interface ChatFormProps {
  userInfo: UserInfo;
  formErrors: Partial<UserInfo>;
  onChange: (field: keyof UserInfo, value: string) => void;
  onSubmit: () => void;
}

export function ChatForm({ userInfo, formErrors, onChange, onSubmit }: ChatFormProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#08A872] px-4 py-3.5 flex items-center gap-2.5 shrink-0">
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
          placeholder="Juan dela Cruz"
          className="w-full border border-border rounded-lg py-2 px-3 text-[13px] bg-background text-foreground outline-none focus:border-[#08A872]"
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
          placeholder="juan@email.com"
          className="w-full border border-border rounded-lg py-2 px-3 text-[13px] bg-background text-foreground outline-none focus:border-[#08A872]"
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
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="09XX-XXX-XXXX"
          className="w-full border border-border rounded-lg py-2 px-3 text-[13px] bg-background text-foreground outline-none focus:border-[#08A872]"
        />
        {formErrors.phone && (
          <p className="text-red-600 text-[11px] mt-1">{formErrors.phone}</p>
        )}

        <button
          onClick={onSubmit}
          className="mt-4 w-full bg-[#08A872] text-white border-none rounded-full py-2.5 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-90"
        >
          Start Conversation
        </button>
      </div>
    </div>
  );
}
