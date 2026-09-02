import { CheckCircle2, Loader2 } from "lucide-react";

export function CSMSuccessOverlay({
  status,
  showSuccessOverlay,
  pdfDownloadFailed,
  successTitle,
  successMsg,
  pdfFailedNote,
  redirectMsg,
}: {
  status: string;
  showSuccessOverlay: boolean;
  pdfDownloadFailed: boolean;
  successTitle: string;
  successMsg: string;
  pdfFailedNote: string;
  redirectMsg: string;
}) {
  if (status !== "success") return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        showSuccessOverlay ? "opacity-100" : "opacity-0"
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
    >
      <div
        className={`mx-4 w-full max-w-sm rounded-2xl bg-white px-8 py-9 text-center shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 ease-out ${
          showSuccessOverlay ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-[16px] font-semibold text-gray-900">{successTitle}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">{successMsg}</p>
        {pdfDownloadFailed && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            {pdfFailedNote}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-gray-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {redirectMsg}
        </div>
      </div>
    </div>
  );
}

export default CSMSuccessOverlay;
