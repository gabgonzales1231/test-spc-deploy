import { motion } from "framer-motion";
import { fadeInUp } from "./csmContent";
import type { Lang } from "./types";

export function CSMStepProgress({
  steps,
  step,
  lang,
}: {
  steps: readonly string[];
  step: number;
  lang: Lang;
}) {
  return (
    <motion.div variants={fadeInUp} transition={{ duration: 0.4, ease: "easeOut" }} className="px-6 sm:px-8 pb-1">
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-emerald-600" : "bg-gray-200"}`}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] font-medium text-gray-500">
        {lang === "en" ? "Step" : "Hakbang"} {step + 1} {lang === "en" ? "of" : "ng"} {steps.length}{" "}
        &middot; {steps[step]}
      </p>
    </motion.div>
  );
}

export default CSMStepProgress;
