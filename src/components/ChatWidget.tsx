//spc-website\src\components\ChatWidget.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessage, ChatStage, UserInfo, CMSContent, generateId } from "@/lib/chatTypes";
import { buildDynamicNodes, getNode, getMainMenuNode, resolveNodeByKeyword, getSmallTalkResponse, injectContent, submitFeedback, fetchCMSContent } from "@/lib/chatEngine";
import { FlowNode, MAIN_MENU_KEY } from "@/lib/flowData";

import { ChatForm }      from "./chat/ChatForm";
import { ChatHeader }    from "./chat/ChatHeader";
import { ChatMessages }  from "./chat/ChatMessages";
import { ChatInputArea } from "./chat/ChatInputArea";
import { ChatEnded }     from "./chat/ChatEnded";
import { PreOpenBubble } from "./chat/ui/PreOpenBubble";
import { JPAvatar }      from "./chat/ui/JPAvatar";

import { useInputGuard } from "@/hooks/useChatApi";



interface NegosyoForm   { businessId: string; complaint: string }
interface TraysikelForm { plateNumber: string; complaint: string }

export default function ChatWidget() {

  // ── Widget ────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen]           = useState(false);
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


  // ── Forms ─────────────────────────────────────────────────────────────
  const [helpdeskText, setHelpdesk] = useState("");
  const [formSubmitting, setSubmitting] = useState(false);

  // ── CMS ───────────────────────────────────────────────────────────────
  const [cms, setCms] = useState<CMSContent>({ services: {}, faqs: {}, loaded: false, error: null });

  // ── Effects ───────────────────────────────────────────────────────────

useEffect(() => {
  fetchCMSContent()
    .then(({ services, faqs }) => {
      const loaded = { services, faqs, loaded: true, error: null };
      setCms(loaded);
      buildDynamicNodes(loaded); // ← builds dynamic nodes into the engine
    })
    .catch(() => {
      setCms((p) => ({ ...p, loaded: true, error: "CMS unavailable." }));
    });
}, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jp_user");
      if (saved) setUserInfo(JSON.parse(saved) as UserInfo);
    } catch {}
  }, []);

  // Auto-dismiss the tooltip bubble after 6 seconds
  useEffect(() => {
    if (!isOpen && !bubbleDismissed) {
      const timer = setTimeout(() => {
        setBubble(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, bubbleDismissed]);

  useEffect(() => {
  const handler = () => {
    setIsOpen(true);
    setBubble(true);
  };
  window.addEventListener("open-chat", handler);
  return () => window.removeEventListener("open-chat", handler);
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
    setMessages((prev) => [...prev, { id: generateId(), role: "user", text, timestamp: new Date() }]);
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
// replace the existing validateForm function

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
    try { localStorage.setItem("jp_user", JSON.stringify(userInfo)); } catch {}
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
        "Hindi ko maintindihan ang iyong mensahe. Piliin ang isa sa mga pagpipilian:\n\n" + injectContent(main.message, cms),
        main
      );
      setNodeKey(MAIN_MENU_KEY);
      setIsTyping(false);
    }, 600);
  }, [cms, currentNodeKey, navigateTo, pushBotMessage, pushUserMessage]);

  // ── Feedback shared helper ────────────────────────────────────────────

async function submitAndReturn(subject: string, message: string) {
  const result = await submitFeedback({
    name:        userInfo.fullName,
    email:       userInfo.email || null,
    phone:       userInfo.phone || null,
    subject,
    message,
    source_node: currentNodeKey,
  });
  setSubmitting(false);
  setIsTyping(true);
  setTimeout(() => {
    const main = getMainMenuNode();
    pushBotMessage(
      (result.success
        ? "✅ Message sent successfully, we will respond as soon as possible."
        : `May error: ${result.error}`) +
      "\n\n" + injectContent(main.message, cms),
      main
    );
    setNodeKey(MAIN_MENU_KEY);
    setIsTyping(false);
  }, 600);
}

async function handleHelpdeskSubmit() {
if (!validate(helpdeskText)) return;  
  setSubmitting(true);
  pushUserMessage(helpdeskText.trim());
  const msg = helpdeskText.trim();
  setHelpdesk("");
  await submitAndReturn("Iba Pa", msg);
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
  }

  // ── Reset ─────────────────────────────────────────────────────────────

  function handleNewChat() {
    setMessages([]);
    setHistory([]);
    setNodeKey(MAIN_MENU_KEY);

    setHelpdesk("");

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

      {/* Chat panel */}
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
    // validate only the blurred field
    const single = { ...userInfo, [field]: value };
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_RE = /^(09|\+639)\d{9}$/;
    const err: Partial<UserInfo> = {};
    if (field === "fullName" && !value.trim()) err.fullName = "Kinakailangan ang buong pangalan.";
    if (field === "email") {
      if (!value.trim()) err.email = "Kinakailangan ang email.";
      else if (!EMAIL_RE.test(value.trim())) err.email = "Magbigay ng valid na email.";
    }
    if (field === "phone") {
      if (!value.trim()) err.phone = "Kinakailangan ang numero.";
      else if (!PHONE_RE.test(value.trim().replace(/[-\s]/g, ""))) err.phone = "Magbigay ng valid na numero (hal. 09XX-XXX-XXXX).";
    }
    setFormErrors((prev) => ({ ...prev, ...err, ...(Object.keys(err).length === 0 ? { [field]: undefined } : {}) }));
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

      {/* FAB */}
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