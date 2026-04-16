"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Keep the dynamic import so the bundle is separated
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { 
  ssr: false,
  loading: () => null 
});

export default function ChatWidgetLoader() {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // If the user has already interacted, no need to set up listeners again
    if (hasInteracted) return;

    // The function that triggers the widget to load
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    // List of events that indicate the user is actively engaging with the page
    const interactionEvents = ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'];

    // Attach the listeners. 
    // { once: true } ensures the listener fires only one time and auto-removes.
    // { passive: true } ensures scrolling performance isn't blocked.
    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Cleanup function in case the component unmounts before interaction
    return () => {
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted]);

  // Return absolutely nothing until the interaction fires
  if (!hasInteracted) return null;

  return <ChatWidget />;
}