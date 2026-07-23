import { QuickReply } from "@/lib/chatTypes";

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (value: string, label: string) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  if (!replies.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5 pl-[30px]">
      {replies.map((qr) => (
        <button
          key={qr.value}
          onClick={() => onSelect(qr.value, qr.label)}
          className="bg-transparent border border-[#2563EB] rounded-full text-[#2563EB] text-xs py-1.5 px-3 cursor-pointer text-left leading-relaxed transition-colors hover:bg-[#2563EB]/10"
        >
          {qr.label}
        </button>
      ))}
    </div>
  );
}