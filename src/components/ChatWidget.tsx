"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { ChatMessage, ChatStage, UserInfo, CMSContent, generateId } from "@/lib/chatTypes";
import {
  buildDynamicNodes, getNode, getMainMenuNode,
  resolveNodeByKeyword, getSmallTalkResponse,
  injectContent, submitFeedback, sendFollowUp, fetchCMSContent,
} from "@/lib/chatEngine";
import { FlowNode, MAIN_MENU_KEY } from "@/lib/flowData";

import { ChatForm }      from "./chat/ChatForm";
import { ChatHeader }    from "./chat/ChatHeader";
import { ChatMessages }  from "./chat/ChatMessages";
import { ChatInputArea } from "./chat/ChatInputArea";
import { ChatEnded }     from "./chat/ChatEnded";
import { PreOpenBubble } from "./chat/ui/PreOpenBubble";
import { JPAvatar }      from "./chat/ui/JPAvatar";

import { useInputGuard } from "@/hooks/useChatApi";

const supabaseRealtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SESSION_KEY  = "jp_conv_id";
const USER_KEY     = "jp_user";
const STAGE_KEY    = "jp_stage";

export default function ChatWidget() {

  // ── Widget ────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen]          = useState(false);
  const [bubbleDismissed, setBubble] = useState(false);
  const [stage, setStage]            = useState<ChatStage>("form");

  // ── User ──────────────────────────────────────────────────────────────
  const [userInfo, setUserInfo]     = useState<UserInfo>({ fullName: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({});

  // ── Chat ──────────────────────────────────────────────────────────────
  const [messages, setMessages]      = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping]      = useState(false);
  const [currentNodeKey, setNodeKey] = useState<string>(MAIN_MENU_KEY);
  const [history, setHistory]        = useState<string[]>([]);
  const [menuOpen, setMenuOpen]      = useState(false);
  const { validate, error: inputError, clearError } = useInputGuard();

  // ── Helpdesk / live session ───────────────────────────────────────────
  const [helpdeskText, setHelpdesk]     = useState("");
  const [formSubmitting, setSubmitting] = useState(false);
  const [conversationId, setConvId]     = useState<number | null>(null);
  const [liveMode, setLiveMode]         = useState(false);
  const channelRef                      = useRef<ReturnType<typeof supabaseRealtime.channel> | null>(null);

  // ── CMS ───────────────────────────────────────────────────────────────
  const [cms, setCms] = useState<CMSContent>({ services: {}, faqs: {}, loaded: false, error: null });

  // ── Restore session on mount ──────────────────────────────────────────

  useEffect(() => {
    try {
      // Restore user info
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUserInfo(JSON.parse(savedUser) as UserInfo);

      // Restore active conversation
      const savedConvId = sessionStorage.getItem(SESSION_KEY);
      const savedStage  = sessionStorage.getItem(STAGE_KEY) as ChatStage | null;

      if (savedConvId && savedStage === "chat") {
        const convId = parseInt(savedConvId);
        setConvId(convId);
        setStage("chat");
        setLiveMode(true);

        // Restore messages from DB so history isn't lost on refresh
        fetch(`/api/chat/conversations/${convId}/messages`)
          .then(r => r.json())
          .then(json => {
            const rows: { id: number; sender_type: string; content: string; created_at: string }[] =
              json?.data ?? [];
            const restored: ChatMessage[] = rows.map(row => ({
              id:        String(row.id),
              role:      row.sender_type === "agent" ? "bot" : "user",
              text:      row.content,
              timestamp: new Date(row.created_at),
            }));
            setMessages(restored);
          })
          .catch(() => {
            // If fetch fails just show a holding message
            setMessages([{
              id:        generateId(),
              role:      "bot",
              text:      "Maligayang pagbabalik! Ang iyong pag-uusap ay nananatili. Abangan ang tugon ng aming staff.",
              timestamp: new Date(),
            }]);
          });
      }
    } catch {}
  }, []);

  // ── CMS fetch ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetchCMSContent()
      .then(({ services, faqs }) => {
        const loaded = { services, faqs, loaded: true, error: null };
        setCms(loaded);
        buildDynamicNodes(loaded);
      })
      .catch(() => {
        setCms((p) => ({ ...p, loaded: true, error: "CMS unavailable." }));
      });
  }, []);

  // ── Pre-open bubble ───────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen && !bubbleDismissed) {
      const timer = setTimeout(() => setBubble(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, bubbleDismissed]);

  useEffect(() => {
    const handler = () => { setIsOpen(true); setBubble(true); };
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  // ── Persist stage to sessionStorage ──────────────────────────────────

  useEffect(() => {
    try { sessionStorage.setItem(STAGE_KEY, stage); } catch {}
  }, [stage]);

  // ── Realtime subscription ─────────────────────────────────────────────

  useEffect(() => {
    if (!conversationId) return;

    if (channelRef.current) supabaseRealtime.removeChannel(channelRef.current);

const channel = supabaseRealtime
  .channel(`conversation-${conversationId}`)
  .on(
    "postgres_changes",
    {
      event:  "INSERT",
      schema: "public",
      table:  "chat_messages",
      // Remove the filter — Supabase sometimes drops filtered subscriptions silently
    },
    (payload) => {
      const row = payload.new as {
        id: number;
        conversation_id: number;
        sender_type: string;
        content: string;
        created_at: string;
      };

      // Filter client-side instead
      if (row.conversation_id !== conversationId) return;
      if (row.sender_type !== "agent") return;

      setLiveMode(true);
      setMessages((prev) => {
        if (prev.find(m => m.id === String(row.id))) return prev;
        return [...prev, {
          id:        String(row.id),
          role:      "bot" as const,
          text:      row.content,
          timestamp: new Date(row.created_at),
        }];
      });
    }
  )
  .subscribe((status) => {
    console.log('[Realtime] subscription status:', status);
  });

    channelRef.current = channel;

    return () => {
      supabaseRealtime.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (channelRef.current) supabaseRealtime.removeChannel(channelRef.current);
    };
  }, []);

  // ── Message helpers ───────────────────────────────────────────────────

  const pushBotMessage = useCallback((text: string, node?: FlowNode) => {
    setMessages((prev) => [...prev, {
      id: generateId(), role: "bot", text, timestamp: new Date(),
      quickReplies: node?.options?.length
        ? node.options.map((o) => ({ label: o.label, value: o.value }))
        : undefined,
    }]);
  }, []);

  const pushUserMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, {
      id: generateId(), role: "user", text, timestamp: new Date(),
    }]);
  }, []);

  const navigateTo = useCallback((nodeKey: string, pushToHistory = true, fromKey?: string) => {
    const node = getNode(nodeKey);
    if (pushToHistory) setHistory((h) => [...h, fromKey ?? currentNodeKey]);
    setNodeKey(nodeKey);
    setIsTyping(true);
    setTimeout(() => {
      pushBotMessage(injectContent(node.message, cms), node);
      setIsTyping(false);
    }, 600);
  }, [cms, currentNodeKey, pushBotMessage]);

  // ── Registration ──────────────────────────────────────────────────────

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^(09|\+639)\d{9}$/;

  function validateForm(): boolean {
    const errors: Partial<UserInfo> = {};
    if (!userInfo.fullName.trim())
      errors.fullName = "Kinakailangan ang buong pangalan.";
    if (!userInfo.email.trim())
      errors.email = "Kinakailangan ang email.";
    else if (!EMAIL_RE.test(userInfo.email.trim()))
      errors.email = "Magbigay ng valid na email.";
    if (!userInfo.phone.trim())
      errors.phone = "Kinakailangan ang numero.";
    else if (!PHONE_RE.test(userInfo.phone.trim().replace(/[-\s]/g, "")))
      errors.phone = "Magbigay ng valid na numero (hal. 09XX-XXX-XXXX).";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleStartChat() {
    if (!validateForm()) return;
    try { localStorage.setItem(USER_KEY, JSON.stringify(userInfo)); } catch {}
    setStage("chat");
    setTimeout(() => {
      const main = getMainMenuNode();
      pushBotMessage(
        `Kamusta, ${userInfo.fullName.split(" ")[0]}! 👋 Welcome sa Opisyal na chatbot ng San Pablo.\n\nI-type o piliin ang iyong kailangan:`,
        main
      );
      setNodeKey(MAIN_MENU_KEY);
    }, 300);
  }

  // ── Navigation ────────────────────────────────────────────────────────

  const handleQuickReply = useCallback((value: string, label: string) => {
    pushUserMessage(label);
    navigateTo(value, true, currentNodeKey);
  }, [currentNodeKey, navigateTo, pushUserMessage]);

  const handleTextSend = useCallback((text: string) => {
    // Live mode — send as follow-up to agent
    if (liveMode && conversationId) {
      if (!validate(text)) return;
      pushUserMessage(text.trim());
      sendFollowUp(conversationId, text.trim()).then((result) => {
        if (!result.success) {
          setIsTyping(true);
          setTimeout(() => {
            pushBotMessage(`May error: ${result.error}`);
            setIsTyping(false);
          }, 400);
        }
      });
      clearError();
      return;
    }

    // Flow mode
    if (!validate(text)) return;
    pushUserMessage(text.trim());
    const smallTalk = getSmallTalkResponse(text);
    if (smallTalk) {
      setIsTyping(true);
      setTimeout(() => {
        const main = getMainMenuNode();
        pushBotMessage(smallTalk + "\n\n" + injectContent(main.message, cms), main);
        setNodeKey(MAIN_MENU_KEY);
        setIsTyping(false);
      }, 600);
      return;
    }
    const matched = resolveNodeByKeyword(text);
    if (matched) { navigateTo(matched.key, true, currentNodeKey); return; }
    setIsTyping(true);
    setTimeout(() => {
      const main = getMainMenuNode();
      pushBotMessage(
        "Hindi ko maintindihan ang iyong mensahe. Piliin ang isa sa mga pagpipilian:\n\n" +
        injectContent(main.message, cms),
        main
      );
      setNodeKey(MAIN_MENU_KEY);
      setIsTyping(false);
    }, 600);
  }, [cms, currentNodeKey, navigateTo, pushBotMessage, pushUserMessage, liveMode, conversationId, validate, clearError]);

  // ── Helpdesk submit ───────────────────────────────────────────────────

  async function handleHelpdeskSubmit() {
    if (!validate(helpdeskText)) return;
    setSubmitting(true);

    const msg   = helpdeskText.trim();
    const msgId = generateId();
    setHelpdesk("");

    setMessages((prev) => [...prev, {
      id: msgId, role: "user", text: msg, timestamp: new Date(),
    }]);

    const result = await submitFeedback({
      name:        userInfo.fullName,
      email:       userInfo.email || null,
      phone:       userInfo.phone || null,
      subject:     "Iba Pa",
      message:     msg,
      source_node: currentNodeKey,
    });

    setSubmitting(false);

    if (result.success && result.conversation_id) {
      setConvId(result.conversation_id);
      try {
        sessionStorage.setItem(SESSION_KEY, String(result.conversation_id));
        sessionStorage.setItem(STAGE_KEY, "chat");
      } catch {}

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, delivered: true } : m))
      );

      setTimeout(() => {
        pushBotMessage(
          "✅ Natanggap ang iyong mensahe! Abangan ang tugon ng aming staff."
        );
      }, 600);

      setNodeKey(MAIN_MENU_KEY);
    } else if (!result.success) {
      setIsTyping(true);
      setTimeout(() => {
        pushBotMessage(`May error: ${result.error}`);
        setIsTyping(false);
      }, 600);
    }
  }

  // ── Hamburger ─────────────────────────────────────────────────────────

  function handleBack() {
    setMenuOpen(false);
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    navigateTo(prev, false);
  }

  function handleGoToMenu() {
    setMenuOpen(false);
    setHistory([]);
    navigateTo(MAIN_MENU_KEY, false);
  }

  function handleEndSession() {
    setMenuOpen(false);
    setStage("ended");
    // Clear session so next visit starts fresh
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(STAGE_KEY);
    } catch {}
  }

  // ── Reset ─────────────────────────────────────────────────────────────

  function handleNewChat() {
    setMessages([]);
    setHistory([]);
    setNodeKey(MAIN_MENU_KEY);
    setHelpdesk("");
    setConvId(null);
    setLiveMode(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(STAGE_KEY);
    } catch {}
    setStage("form");
  }

  // ── Derived ───────────────────────────────────────────────────────────

  const currentNode = getNode(currentNodeKey);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <>
      {!isOpen && !bubbleDismissed && (
        <PreOpenBubble onDismiss={() => setBubble(true)} />
      )}

      <div
        aria-label="City virtual assistant chat"
        aria-hidden={!isOpen}
        className={`fixed bottom-[88px] right-6 w-[340px] max-h-[420px] h-[calc(100vh-120px)] z-[9998] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] border border-black/10 bg-background transition-all duration-200 ${
          isOpen
            ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 invisible translate-y-3 scale-95 pointer-events-none"
        }`}
      >
        {stage === "form" && (
          <ChatForm
            userInfo={userInfo}
            formErrors={formErrors}
            onChange={(field, value) => setUserInfo((u) => ({ ...u, [field]: value }))}
            onBlur={(field, value) => {
              const err: Partial<UserInfo> = {};
              if (field === "fullName" && !value.trim())
                err.fullName = "Kinakailangan ang buong pangalan.";
              if (field === "email") {
                if (!value.trim()) err.email = "Kinakailangan ang email.";
                else if (!EMAIL_RE.test(value.trim())) err.email = "Magbigay ng valid na email.";
              }
              if (field === "phone") {
                if (!value.trim()) err.phone = "Kinakailangan ang numero.";
                else if (!PHONE_RE.test(value.trim().replace(/[-\s]/g, "")))
                  err.phone = "Magbigay ng valid na numero (hal. 09XX-XXX-XXXX).";
              }
              setFormErrors((prev) => ({
                ...prev, ...err,
                ...(Object.keys(err).length === 0 ? { [field]: undefined } : {}),
              }));
            }}
            onSubmit={handleStartChat}
          />
        )}

        {stage === "chat" && (
          <>
            <ChatHeader
              menuOpen={menuOpen}
              hasHistory={history.length > 0}
              onToggleMenu={() => setMenuOpen((v) => !v)}
              onBack={handleBack}
              onGoToMenu={handleGoToMenu}
              onEndSession={handleEndSession}
              onCloseMenu={() => setMenuOpen(false)}
            />
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
              onQuickReply={handleQuickReply}
            />
            <ChatInputArea
              mode={currentNode.inputMode}
              submitting={formSubmitting}
              helpdeskText={helpdeskText}
              inputError={inputError}
              onHelpdeskChange={(v) => { setHelpdesk(v); clearError(); }}
              onHelpdeskSubmit={handleHelpdeskSubmit}
              onTextSend={handleTextSend}
              onClearError={clearError}
            />
          </>
        )}

        {stage === "ended" && <ChatEnded onNewChat={handleNewChat} />}
      </div>

      <button
        onClick={() => { setIsOpen((v) => !v); setBubble(true); }}
        aria-label={isOpen ? "Close chat" : "Open city virtual assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#08A872] border-none cursor-pointer z-[9999] flex items-center justify-center shadow-[0_4px_16px_rgba(8,168,114,0.35),0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.08]"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <JPAvatar size={40} />
        )}
      </button>
    </>
  );
}