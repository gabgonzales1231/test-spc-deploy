// src/components/explore/ViewMoreButton.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ViewMoreButtonProps {
  expanded: boolean;
  onToggle: () => void;
  expandedLabel?: string;
  collapsedLabel?: string;
}

// Small, playful toggle used to reveal additional cards below a section
// (e.g. Tourism's hidden highlights). The chevron bounces gently at rest
// to invite a click, and the whole button bounces on interaction —
// deliberately more energetic than a plain text link, but still compact
// enough not to compete with the cards themselves.
export default function ViewMoreButton({
  expanded,
  onToggle,
  expandedLabel = "Show less",
  collapsedLabel = "View more",
}: ViewMoreButtonProps) {
  return (
    <div className="flex justify-center pt-2 mt-7">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md transition-colors duration-200"
      >
        {expanded ? expandedLabel : collapsedLabel}
        <motion.span
          className="inline-flex"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ y: [0, -3, 0] }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </motion.button>
    </div>
  );
}