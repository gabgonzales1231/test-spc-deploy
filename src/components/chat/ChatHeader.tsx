import { useRef, useEffect } from "react";
import { JPAvatar } from "./ui/JPAvatar";
import { OnlineDot } from "./ui/OnlineDot";

const BOT_NAME = "Juan Pablo";

interface ChatHeaderProps {
  menuOpen: boolean;
  hasHistory: boolean;
  onToggleMenu: () => void;
  onBack: () => void;
  onGoToMenu: () => void;
  onEndSession: () => void;
  onCloseMenu: () => void;
}

export function ChatHeader({
  menuOpen,
  hasHistory,
  onToggleMenu,
  onBack,
  onGoToMenu,
  onEndSession,
  onCloseMenu,
}: ChatHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, onCloseMenu]);

  return (
    <div className="bg-[#08A872] px-4 py-3.5 flex items-center gap-2.5 shrink-0">
      <JPAvatar size={32} />
      <div className="flex-1">
        <div className="text-white text-sm font-medium leading-tight">{BOT_NAME}</div>
        <div className="text-white/75 text-xs flex items-center gap-1">
          <OnlineDot /> Virtual Assistant
        </div>
      </div>

      {/* Hamburger */}
      <div ref={menuRef} className="relative">
        <button
          onClick={onToggleMenu}
          aria-label="Menu"
          className="bg-white/15 border-none rounded-md text-white cursor-pointer px-2 py-1 flex items-center justify-center hover:bg-white/25 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] z-10 overflow-hidden">
            {hasHistory && (
              <button
                onClick={onBack}
                className="block w-full py-2.5 px-3.5 bg-transparent border-none text-left text-[13px] cursor-pointer text-gray-900 hover:bg-gray-50"
              >
                ← Back
              </button>
            )}
            <button
              onClick={onGoToMenu}
              className="block w-full py-2.5 px-3.5 bg-transparent border-none text-left text-[13px] cursor-pointer text-gray-900 hover:bg-gray-50"
            >
              ☰ Refresh Menu
            </button>
            <div className="h-px bg-gray-200 my-0.5" />
            <button
              onClick={onEndSession}
              className="block w-full py-2.5 px-3.5 bg-transparent border-none text-left text-[13px] cursor-pointer text-red-600 hover:bg-red-50"
            >
              ✕ End this chat session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
