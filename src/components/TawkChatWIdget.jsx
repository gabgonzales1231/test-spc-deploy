"use client";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function TawkChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Tawk.to script
  useEffect(() => {
    var Tawk_API = window.Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/68d9ea26438b6919521c9c5d/1j69jlabv";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    
    s1.onload = () => {
      setIsLoaded(true);
      
      // Hide the default Tawk widget
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
    
    document.body.appendChild(s1);

    // Cleanup on unmount
    return () => {
      if (document.body.contains(s1)) {
        document.body.removeChild(s1);
      }
    };
  }, []);

  // Handle opening/closing chat
  const toggleChat = () => {
    if (window.Tawk_API) {
      if (isOpen) {
        window.Tawk_API.minimize();
      } else {
        window.Tawk_API.maximize();
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
    </>
  );
}