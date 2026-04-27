import { useRef, useEffect } from "react";
import { ChatMessage, formatTime } from "@/lib/chatTypes";
import { JPAvatar } from "./ui/JPAvatar";
import { QuickReplies } from "./ui/QuickReplies";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onQuickReply: (value: string, label: string) => void;
}

// Renders text with URLs converted to clickable <a> tags
function MessageText({ text }: { text: string }) {
  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(URL_REGEX);

  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline opacity-90 hover:opacity-100 break-all"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function ChatMessages({ messages, isTyping, onQuickReply }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      role="log"
      aria-live="polite"
      className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col gap-2.5 bg-background"
    >
      {messages.map((msg) => (
        <div key={msg.id}>
          <div className={`flex items-end gap-1.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "bot" && <JPAvatar size={24} />}
            <div className={`min-w-0 max-w-[80%] flex flex-col gap-0.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`w-full px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words overflow-hidden ${
                  msg.role === "user"
                    ? "rounded-[14px_14px_4px_14px] bg-[#08A872] text-white"
                    : "rounded-[14px_14px_14px_4px] bg-muted text-foreground"
                }`}
              >
                <MessageText text={msg.text} />
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>

          {msg.role === "bot" && msg.quickReplies?.length ? (
            <QuickReplies replies={msg.quickReplies} onSelect={onQuickReply} />
          ) : null}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-end gap-1.5">
          <JPAvatar size={24} />
          <div className="px-3.5 py-2.5 rounded-[14px_14px_14px_4px] bg-muted flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-[chatBounce_1.2s_ease_infinite]"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />

      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}