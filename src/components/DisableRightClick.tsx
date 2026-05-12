// src/components/DisableRightClick.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export default function DisableRightClick() {
  const [position, setPosition] = useState<Position | null>(null);
  const [visible, setVisible] = useState(false);
  const [shaking, setShaking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const shakeRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
      setShaking(false);

      requestAnimationFrame(() => setShaking(true));

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (shakeRef.current) clearTimeout(shakeRef.current);

      shakeRef.current = setTimeout(() => setShaking(false), 500);
      timeoutRef.current = setTimeout(() => setVisible(false), 1200);
    };

    document.addEventListener("contextmenu", onContextMenu);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (shakeRef.current) clearTimeout(shakeRef.current);
    };
  }, []);

  if (!position) return null;

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          15%       { transform: translate(3px, -2px) rotate(-8deg); }
          30%       { transform: translate(-3px, 2px) rotate(8deg); }
          45%       { transform: translate(2px, -1px) rotate(-5deg); }
          60%       { transform: translate(-2px, 1px) rotate(5deg); }
          80%       { transform: translate(1px, 0px) rotate(-2deg); }
        }
      `}</style>
      <div
        className="pointer-events-none fixed z-[9999] transition-opacity duration-200"
        style={{
          left: position.x,
          top: position.y,
          opacity: visible ? 1 : 0,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center gap-1.5 rounded-sm bg-white px-5 py-1.5 shadow-md">
          <svg
            width="25"
            height="25"
            viewBox="0 0 35 35"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: shaking ? "shake 0.5s ease-in-out" : undefined,
            }}
          >
            <circle cx="16" cy="16" r="16" fill="#ffd67d"/>
            <rect x="13.5" y="7" width="5" height="12" rx="2.5" fill="white"/>
            <circle cx="16" cy="23" r="2.5" fill="white"/>
          </svg>
          <span className="text-sm font-medium text-black-500 whitespace-nowrap">
            Restricted action.
          </span>
        </div>
      </div>
    </>
  );
}