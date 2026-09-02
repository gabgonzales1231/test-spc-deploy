"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./csmContent";
import { CSMIntroSplash } from "./CSMIntroSplash";
import { CSMStepProgress } from "./CSMStepProgress";
import { CSMBody } from "./CSMBody";
import { CSMSuccessOverlay } from "./CSMSuccessOverlay";
import { useCSMForm } from "@/hooks/useCSMForm";
import type { CSMFormProps } from "./types";

export default function CSMForm({ officeSlug }: CSMFormProps) {
  const router = useRouter();
  const csm = useCSMForm({ officeSlug });
  const { showIntro, lang, setLang, chooseLanguage, office, loadingOffice, officeError, officeNotFound, t, formTopRef, step, status, pdfDownloadFailed, showSuccessOverlay } = csm;

  return (
    <>
      <CSMIntroSplash
        show={showIntro}
        officeSlug={officeSlug}
        office={office}
        loadingOffice={loadingOffice}
        officeError={officeError}
        officeNotFound={officeNotFound}
        onChooseLanguage={chooseLanguage}
        onReturn={() => router.push("/")}
      />

      {/* Main form content */}
      {!showIntro && (
        <motion.div
          ref={formTopRef}
          className="w-full max-w-2xl mx-auto mt-12 scroll-mt-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="bg-white rounded-2xl overflow-hidden drop-shadow-lg shadow-gray-900/5 border border-gray-200">
            {/* Header */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="px-6 sm:px-8 py-6 bg-gray-50/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-emerald-700">
                    {t.orgLabel}
                  </p>
                  <h2 className="mt-1 text-[22px] sm:text-[24px] font-semibold text-gray-900 tracking-tight">
                    {t.appTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setLang(lang === "en" ? "tl" : "en")}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] font-medium text-gray-500 transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-800"
                  title="Switch language"
                >
                  <Languages className="h-3.5 w-3.5" />
                  {lang === "en" ? "Tagalog" : "English"}
                </button>
              </div>
              <p className="mt-1 text-[13px] text-gray-500 leading-relaxed">{t.appDesc}</p>
              {office && (
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full  px-3 py-1 text-[11.5px] font-medium text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {office.name}
                </p>
              )}
            </motion.div>

            <CSMStepProgress steps={t.steps} step={step} lang={lang} />

            <CSMBody csm={csm} />
          </div>

          <CSMSuccessOverlay
            status={status}
            showSuccessOverlay={showSuccessOverlay}
            pdfDownloadFailed={pdfDownloadFailed}
            successTitle={t.successTitle}
            successMsg={t.successMsg}
            pdfFailedNote={t.pdfFailedNote}
            redirectMsg={t.redirectMsg}
          />
        </motion.div>
      )}
    </>
  );
}