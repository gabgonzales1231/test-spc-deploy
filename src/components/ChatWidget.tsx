"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { getBotResponse, generateId, ChatMessage } from "@/lib/chatEngine";
import { SUGGESTED_QUESTIONS } from "@/lib/faq-data";

const BOT_AVATAR = "/seal.webp";

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "bot",
  text: "Magandang araw! 👋 I'm the San Pablo City virtual assistant. Ask me about office hours, fees, departments, or city services.",
  timestamp: new Date(),
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: generateId(),
        role: "bot",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat panel */}
      <div
        aria-label="City virtual assistant chat"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          bottom: "88px",
          right: "24px",
          width: "340px",
          maxHeight: "520px",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          border: "0.5px solid rgba(0,0,0,0.08)",
          background: "var(--background)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#1a6b3c",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <Image
            src={BOT_AVATAR}
            alt="San Pablo City Seal"
            width={32}
            height={32}
            loading="lazy"
            style={{
              borderRadius: "50%",
              background: "white",
              padding: "2px",
              objectFit: "contain",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontSize: "14px", fontWeight: 500, lineHeight: 1.2 }}>
              San Pablo City
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }}
              />
              Virtual Assistant
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: "18px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "var(--background)",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: "6px",
              }}
            >
              {msg.role === "bot" && (
                <Image
                  src={BOT_AVATAR}
                  alt=""
                  aria-hidden={true}
                  width={24}
                  height={24}
                  loading="lazy"
                  style={{
                    borderRadius: "50%",
                    background: "#1a6b3c",
                    padding: "2px",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: "2px", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    padding: "9px 12px",
                    borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: msg.role === "user" ? "#1a6b3c" : "var(--muted, #f3f4f6)",
                    color: msg.role === "user" ? "white" : "var(--foreground)",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: "10px", color: "var(--muted-foreground, #9ca3af)", padding: "0 4px" }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
              <Image
                src={BOT_AVATAR}
                alt=""
                aria-hidden={true}
                width={24}
                height={24}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  background: "#1a6b3c",
                  padding: "2px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <div style={{
                padding: "10px 14px",
                borderRadius: "14px 14px 14px 4px",
                background: "var(--muted, #f3f4f6)",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#9ca3af",
                      display: "inline-block",
                      animation: "chatBounce 1.2s ease infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {showSuggestions && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--muted-foreground, #9ca3af)", paddingLeft: "2px" }}>
                Suggested questions
              </span>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestion(q)}
                  style={{
                    background: "transparent",
                    border: "0.5px solid #1a6b3c",
                    borderRadius: "20px",
                    color: "#1a6b3c",
                    fontSize: "12px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.4,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "10px 12px",
            borderTop: "0.5px solid var(--border, #e5e7eb)",
            display: "flex",
            gap: "8px",
            background: "var(--background)",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            aria-label="Type your message"
            disabled={isTyping}
            style={{
              flex: 1,
              border: "0.5px solid var(--border, #e5e7eb)",
              borderRadius: "20px",
              padding: "8px 14px",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--foreground)",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6b3c")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border, #e5e7eb)")}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            style={{
              background: input.trim() && !isTyping ? "#1a6b3c" : "var(--muted, #e5e7eb)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open city virtual assistant"}
        aria-expanded={isOpen}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#1a6b3c",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(26,107,60,0.35), 0 2px 4px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(26,107,60,0.45), 0 2px 6px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,107,60,0.35), 0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}