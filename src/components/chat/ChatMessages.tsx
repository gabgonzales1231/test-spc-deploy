//src/components/chat/ChatMessages.tsx

import { useRef, useEffect } from "react";
import { ChatMessage, formatTime } from "@/lib/chatTypes";
import { JPAvatar } from "./ui/JPAvatar";
import { QuickReplies } from "./ui/QuickReplies";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onQuickReply: (value: string, label: string) => void;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentSize?: number;
}

function MessageText({ text }: { text: string }) {
  const URL_REGEX = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(URL_REGEX);

  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (

           <a key={i}
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

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface AttachmentPreviewProps {
  url: string;
  type?: string;
  size?: number;
  isUser: boolean;
}

function AttachmentPreview({ url, type, size, isUser }: AttachmentPreviewProps) {
  const isImage = type?.startsWith("image/");

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1 max-w-[220px]">
        <img
          src={url}
          alt="Attachment"
          className="rounded-lg border border-border max-h-[180px] w-auto object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-1 flex items-center gap-2 rounded-lg border px-2.5 py-2 max-w-[220px] transition-opacity hover:opacity-80 ${
        isUser
          ? "border-white/30 bg-white/10 text-white"
          : "border-border bg-background text-foreground"
      }`}
    >
      <FileIcon />
      <div className="min-w-0 flex flex-col">
        <span className="text-[12px] truncate">Attachment</span>
        {size ? <span className="text-[10px] opacity-70">{formatFileSize(size)}</span> : null}
      </div>
    </a>
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
                    ? "rounded-[14px_14px_4px_14px] bg-[#2563EB] text-white"
                    : "rounded-[14px_14px_14px_4px] bg-muted text-foreground"
                }`}
              >
                <MessageText text={msg.text} />
                {msg.attachmentUrl && (
                  <AttachmentPreview
                    url={msg.attachmentUrl}
                    type={msg.attachmentType}
                    size={msg.attachmentSize}
                    isUser={msg.role === "user"}
                  />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {formatTime(msg.timestamp)}
              </span>
              {msg.role === "user" && msg.delivered && (
                <span className="text-[10px] text-green-600 px-1">✓ Delivered</span>
              )}
            </div>
          </div>

          {msg.role === "bot" && msg.quickReplies?.length ? (
            <QuickReplies replies={msg.quickReplies} onSelect={onQuickReply} />
          ) : null}
        </div>
      ))}

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