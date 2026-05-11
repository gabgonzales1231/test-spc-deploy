// src/components/DisableRightClick.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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
      
      // Capture the position only at the moment of the click
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
      setShaking(false);

      // Retrigger shake animation
      requestAnimationFrame(() => setShaking(true));

      // Clear existing timers if user right-clicks rapidly
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (shakeRef.current) clearTimeout(shakeRef.current);

      shakeRef.current = setTimeout(() => setShaking(false), 350);
      timeoutRef.current = setTimeout(() => setVisible(false), 350);
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
          0%    { transform: translate(-50%, -50%) rotate(0deg); }
          15%   { transform: translate(calc(-50% + 4px), calc(-50% - 3px)) rotate(-6deg); }
          30%   { transform: translate(calc(-50% - 4px), calc(-50% + 3px)) rotate(6deg); }
          45%   { transform: translate(calc(-50% + 3px), calc(-50% - 2px)) rotate(-4deg); }
          60%   { transform: translate(calc(-50% - 3px), calc(-50% + 2px)) rotate(4deg); }
          75%   { transform: translate(calc(-50% + 2px), calc(-50% - 1px)) rotate(-2deg); }
          90%   { transform: translate(calc(-50% - 1px), calc(-50% + 1px)) rotate(2deg); }
          100%  { transform: translate(-50%, -50%) rotate(0deg); }
        }
      `}</style>
      <div
        className="pointer-events-none fixed z-[9999] transition-opacity duration-300"
        style={{
          left: position.x,
          top: position.y,
          opacity: visible ? 1 : 0,
          transform: "translate(-50%, -50%)",
          animation: shaking ? "shake 0.5s ease-in-out" : undefined,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 shadow-md">
          <X className="h-4 w-4 text-white" strokeWidth={3} />
        </div>
      </div>
    </>
  );
}