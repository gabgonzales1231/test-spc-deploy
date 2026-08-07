"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Languages,
  CheckCircle,
} from "lucide-react";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------
interface PsgcOption {
  code: string;
  name: string;
}

interface Office {
  id: string;
  name: string;
  slug: string;
  sector?: string | null;
  services?: string[] | null;
}

interface CSMFormProps {
  // Set when rendered from /arta/client-feedback/[officeSlug]. When absent
  // (base /arta/client-feedback route), the splash still renders but shows
  // an "unavailable" message instead of the office selector / language
  // buttons — there is no dropdown picker anymore.
  officeSlug?: string;
}

type ClientType = "citizen" | "business" | "government";
type Sex = "male" | "female";
type Lang = "en" | "tl";

interface FormState {
  clientType: ClientType | "";
  transactionDate: string; // yyyy-mm-dd
  sex: Sex | "";
  age: string;
  region: string; // region NAME is what's stored, per spec
  service: string;

  cc1: number | null;
  cc2: number | null;
  cc3: number | null;

  sqd0: string | null;
  sqd1: string | null;
  sqd2: string | null;
  sqd3: string | null;
  sqd4: string | null;
  sqd5: string | null;
  sqd6: string | null;
  sqd7: string | null;
  sqd8: string | null;

  comments: string;
  emailAddress: string;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const initialState: FormState = {
  clientType: "",
  transactionDate: todayIso(),
  sex: "",
  age: "",
  region: "",
  service: "",
  cc1: null,
  cc2: null,
  cc3: null,
  sqd0: null,
  sqd1: null,
  sqd2: null,
  sqd3: null,
  sqd4: null,
  sqd5: null,
  sqd6: null,
  sqd7: null,
  sqd8: null,
  comments: "",
  emailAddress: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const PSGC_BASE = "/api/psgc";

function extractArray(json: unknown): PsgcOption[] {
  if (Array.isArray(json)) return json as PsgcOption[];
  if (json && typeof json === "object" && Array.isArray((json as any).data)) {
    return (json as any).data as PsgcOption[];
  }
  return [];
}

const CC2_NA_VALUE = 5;
const CC3_NA_VALUE = 4;

// ---------------------------------------------------------------------
// Bilingual content
// ---------------------------------------------------------------------
const CONTENT: Record<
  Lang,
  {
    orgLabel: string;
    appTitle: string;
    appDesc: string;
    steps: [string, string, string, string];
    clientTypeLabel: string;
    clientTypes: Record<ClientType, string>;
    dateLabel: string;
    sexLabel: string;
    sexOptions: Record<Sex, string>;
    optionalTag: string;
    ageLabel: string;
    agePlaceholder: string;
    regionLabel: string;
    regionPlaceholder: string;
    regionLoading: string;
    serviceLabel: string;
    servicePlaceholder: string;
    serviceNoOfficeMsg: string;
    serviceNoneMsg: string;
    ccIntro: string;
    cc1Title: string;
    cc1Options: string[];
    cc2Title: string;
    cc2Options: string[];
    cc3Title: string;
    cc3Options: string[];
    naNote: string;
    sqdIntro: string;
    sqdItems: string[];
    sqdOptions: string[];
    commentsLabel: string;
    commentsPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    backBtn: string;
    nextBtn: string;
    submitBtn: string;
    sendingBtn: string;
    successTitle: string;
    successMsg: string;
    pdfFailedNote: string;
    redirectMsg: string;
    errClientType: string;
    errDate: string;
    errRegion: string;
    errService: string;
    errAge: string;
    errCc1: string;
    errCc2: string;
    errCc3: string;
    errSqd: string;
    errEmail: string;
    errGeneric: string;
  }
> = {
  en: {
    orgLabel: "City Government of San Pablo",
    appTitle: "Help Us Serve You Better!",
    appDesc:
      "This Client Satisfaction Measurement (CSM) tracks the customer experience of government offices. Your feedback on your recently concluded transaction will help this office provide a better service. Personal information shared will be kept confidential and you always have the option to not answer this form.",
    steps: ["Respondent Info", "Citizen's Charter", "Service Quality", "Feedback"],
    clientTypeLabel: "Client type",
    clientTypes: { citizen: "Citizen", business: "Business", government: "Government" },
    dateLabel: "Date",
    sexLabel: "Sex",
    sexOptions: { male: "Male", female: "Female" },
    optionalTag: "(optional)",
    ageLabel: "Age",
    agePlaceholder: "e.g. 34",
    regionLabel: "Region of Residence",
    regionPlaceholder: "Select region",
    regionLoading: "Loading regions...",
    serviceLabel: "Service Availed",
    servicePlaceholder: "Select a service",
    serviceNoOfficeMsg: "Select an office first",
    serviceNoneMsg: "No services listed for this office",
    ccIntro:
      "Please select the answer that corresponds to your experience with this office's Citizen's Charter (CC) — an official document reflecting the office's services, requirements, fees, and processing times.",
    cc1Title: "CC1. Which of the following best describes your awareness of a CC?",
    cc1Options: [
      "I know what a CC is and I saw this office's CC.",
      "I know what a CC is but I did NOT see this office's CC.",
      "I learned of the CC only when I saw this office's CC.",
      "I do not know what a CC is and I did not see one in this office.",
    ],
    cc2Title: "CC2. If aware of CC, would you say that the CC of this office was...?",
    cc2Options: ["Easy to see", "Somewhat easy to see", "Difficult to see", "Not visible at all", "Not Applicable"],
    cc3Title: "CC3. If aware of CC, how much did the CC help you in your transaction?",
    cc3Options: ["Helped very much", "Somewhat helped", "Did not help", "Not Applicable"],
    naNote: "Not applicable — marked automatically.",
    sqdIntro: "For SQD0–8, please select the rating that best corresponds to your answer.",
    sqdItems: [
      "I am satisfied with the service that I availed.",
      "I spent a reasonable amount of time for my transaction.",
      "The office followed the transaction's requirements and steps based on the information provided.",
      "The steps (including payment) I needed to do for my transaction were easy and simple.",
      "I easily found information about my transaction from the office or its website.",
      "I paid a reasonable amount of fees for my transaction. (If service was free, mark the 'N/A' column)",
      "I feel the office was fair to everyone, or \u201Cwalang palakasan\u201D, during my transaction.",
      "I was treated courteously by the staff, and (if asked for help) the staff was helpful.",
      "I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me.",
    ],
    sqdOptions: ["Strongly Disagree", "Disagree", "Neither Agree nor Disagree", "Agree", "Strongly Agree", "Not Applicable"],
    commentsLabel: "Suggestions on how we can further improve our services",
    commentsPlaceholder: "Tell us how we can do better...",
    emailLabel: "Email address",
    emailPlaceholder: "juan@email.com",
    backBtn: "Back",
    nextBtn: "Next",
    submitBtn: "Submit and Download Form",
    sendingBtn: "Sending...",
    successTitle: "Feedback sent successfully",
    successMsg: "Thank you for helping us serve you better.",
    pdfFailedNote:
      "Your feedback was saved, but we couldn't generate your copy of the form. No action is needed on your part.",
    redirectMsg: "You are now being redirected back to the previous page, or you can leave this page now.",
    errClientType: "Please select a client type.",
    errDate: "Please select the transaction date.",
    errRegion: "Please select your region of residence.",
    errService: "Please select the service you availed.",
    errAge: "Please enter a valid age.",
    errCc1: "Please answer CC1.",
    errCc2: "Please answer CC2.",
    errCc3: "Please answer CC3.",
    errSqd: "Please rate all service quality statements.",
    errEmail: "Please enter a valid email address.",
    errGeneric: "Something went wrong. Please try again.",
  },
  tl: {
    orgLabel: "Pamahalaan ng Lungsod ng San Pablo",
    appTitle: "Tulungan Kami na Paglingkuran Kayo nang Mas Mabuti!",
    appDesc:
      "Sinusubaybayan ng Client Satisfaction Measurement (CSM) na ito ang karanasan ng mga mamamayan sa mga tanggapan ng pamahalaan. Ang inyong puna sa transaksyong kaka-tapos lamang ay makakatulong sa tanggapang ito upang magbigay ng mas mahusay na serbisyo. Ang personal na impormasyong ibinahagi ay mananatiling kumpidensyal at may karapatan kayo na hindi sagutin ang bahaging ito.",
    steps: ["Impormasyon", "Citizen's Charter", "Kalidad ng Serbisyo", "Puna"],
    clientTypeLabel: "Uri ng kliyente",
    clientTypes: { citizen: "Mamamayan", business: "Negosyo", government: "Pamahalaan" },
    dateLabel: "Petsa",
    sexLabel: "Kasarian",
    sexOptions: { male: "Lalaki", female: "Babae" },
    optionalTag: "(opsyonal)",
    ageLabel: "Edad",
    agePlaceholder: "hal. 34",
    regionLabel: "Rehiyon ng paninirahan",
    regionPlaceholder: "Pumili ng rehiyon",
    regionLoading: "Ikinakarga ang mga rehiyon...",
    serviceLabel: "Serbisyong natanggap",
    servicePlaceholder: "Pumili ng serbisyo",
    serviceNoOfficeMsg: "Pumili muna ng tanggapan",
    serviceNoneMsg: "Walang nakalistang serbisyo para sa tanggapang ito",
    ccIntro:
      "Piliin ang sagot na tumutugma sa inyong karanasan sa Citizen's Charter (CC) ng tanggapang ito — isang opisyal na dokumento na naglalaman ng mga serbisyo, kinakailangan, bayad, at oras ng pagproseso ng tanggapan.",
    cc1Title: "CC1. Alin sa mga sumusunod ang naglalarawan sa inyong kaalaman tungkol sa CC?",
    cc1Options: [
      "Alam ko kung ano ang CC at nakita ko ang CC ng tanggapang ito.",
      "Alam ko kung ano ang CC ngunit HINDI ko nakita ang CC ng tanggapang ito.",
      "Nalaman ko lamang ang tungkol sa CC nang makita ko ang CC ng tanggapang ito.",
      "Hindi ko alam kung ano ang CC at wala akong nakita nito sa tanggapang ito.",
    ],
    cc2Title: "CC2. Kung alam ninyo ang CC, masasabi ba ninyong ang CC ng tanggapang ito ay...?",
    cc2Options: ["Madaling makita", "Medyo madaling makita", "Mahirap makita", "Hindi talaga makita", "Hindi Aplikable"],
    cc3Title: "CC3. Kung alam ninyo ang CC, gaano ito nakatulong sa inyong transaksyon?",
    cc3Options: ["Malaking tulong", "May kaunting tulong", "Hindi nakatulong", "Hindi Aplikable"],
    naNote: "Hindi aplikable — awtomatikong minarkahan.",
    sqdIntro: "Para sa SQD0–8, piliin ang sagot na pinakatumutugma sa inyong karanasan.",
    sqdItems: [
      "Nasisiyahan ako sa serbisyong aking natanggap.",
      "Naglaan ako ng makatwirang oras para sa aking transaksyon.",
      "Sinunod ng tanggapan ang mga kinakailangan at hakbang ng transaksyon batay sa ibinigay na impormasyon.",
      "Ang mga hakbang (kasama ang pagbabayad) na kailangan ko para sa aking transaksyon ay madali at simple.",
      "Madali kong nahanap ang impormasyon tungkol sa aking transaksyon mula sa tanggapan o sa kanilang website.",
      "Nagbayad ako ng makatwirang halaga ng bayad para sa aking transaksyon. (Kung libre ang serbisyo, markahan ang 'N/A')",
      "Naramdaman kong patas ang tanggapan sa lahat, o \u201Cwalang palakasan\u201D, sa aking transaksyon.",
      "Magalang akong pinakitunguhan ng kawani, at (kung humingi ng tulong) ang kawani ay nakatulong.",
      "Natanggap ko ang aking kailangan mula sa tanggapan ng pamahalaan, o (kung tinanggihan) sapat na ipinaliwanag ang dahilan ng pagtanggi.",
    ],
    sqdOptions: [
      "Lubos na Hindi Sumasang-ayon",
      "Hindi Sumasang-ayon",
      "Hindi Sumasang-ayon o Sumasang-ayon",
      "Sumasang-ayon",
      "Lubos na Sumasang-ayon",
      "Hindi Aplikable",
    ],
    commentsLabel: "Mungkahi kung paano pa namin mapapahusay ang aming serbisyo",
    commentsPlaceholder: "Sabihin sa amin kung paano kami makakapagpabuti...",
    emailLabel: "Email address",
    emailPlaceholder: "juan@email.com",
    backBtn: "Bumalik",
    nextBtn: "Susunod",
    submitBtn: "Ipasa at I-download ang Form",
    sendingBtn: "Ipinapadala...",
    successTitle: "Matagumpay na naipadala ang puna",
    successMsg: "Salamat sa pagtulong sa amin na maglingkod nang mas mabuti.",
    pdfFailedNote:
      "Naisave ang inyong puna, ngunit hindi namin nagawang buuin ang kopya ng form. Walang kailangan pang gawin sa inyong panig.",
    redirectMsg: "Maaari ka nang umalis sa page na ito.",
    errClientType: "Piliin ang uri ng kliyente.",
    errDate: "Piliin ang petsa ng transaksyon.",
    errRegion: "Piliin ang rehiyon ng inyong paninirahan.",
    errService: "Piliin ang serbisyong inyong natanggap.",
    errAge: "Maglagay ng tamang edad.",
    errCc1: "Sagutan ang CC1.",
    errCc2: "Sagutan ang CC2.",
    errCc3: "Sagutan ang CC3.",
    errSqd: "Markahan lahat ng SQD statements.",
    errEmail: "Maglagay ng wastong email address.",
    errGeneric: "May naganap na error. Subukan muli.",
  },
};

// The literal phrases stored on submit are always the English canonical
// values (matches the DB CHECK constraint / Zod enum), regardless of the
// language the respondent answered in. sqdOptions above is display-only;
// SQD_CANONICAL maps a display index back to its English phrase.
const SQD_CANONICAL = [
  "Strongly Disagree",
  "Disagree",
  "Neither Agree nor Disagree",
  "Agree",
  "Strongly Agree",
  "Not Applicable",
] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

// Shared hover/selection treatment for all choice buttons — subtle lift +
// tint on hover, stronger emerald fill when selected.
const choiceBtnClass = (selected: boolean, disabled?: boolean) =>
  `text-left rounded-sm border px-3 py-4 text-[12.5px] leading-snug transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${
    selected
      ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-medium shadow-sm"
      : "border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-800 hover:-translate-y-0.5 hover:shadow-sm"
  } ${disabled ? "opacity-50" : ""}`;

// ---------------------------------------------------------------------
// CsmIllustration — custom inline SVG: a feedback clipboard with a star
// rating, built entirely from shapes (no external image asset needed).
// ---------------------------------------------------------------------
function CsmIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      {/* Soft backdrop circle */}
      <circle cx="60" cy="60" r="56" fill="#ECFDF5" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#A7F3D0" strokeWidth="1.5" />

      {/* Clipboard body */}
      <rect x="34" y="26" width="52" height="66" rx="7" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
      {/* Clipboard clip */}
      <rect x="49" y="20" width="22" height="12" rx="4" fill="#059669" />
      <rect x="53" y="24" width="14" height="4" rx="2" fill="#D1FAE5" />

      {/* Checklist lines */}
      <g stroke="#10B981" strokeWidth="2.4" strokeLinecap="round">
        <path d="M42 42 L46 46 L52 38" fill="none" />
        <line x1="58" y1="42" x2="78" y2="42" />

        <path d="M42 56 L46 60 L52 52" fill="none" />
        <line x1="58" y1="56" x2="78" y2="56" />
      </g>

      {/* Star rating row */}
      <g fill="#FBBF24">
        <path d="M44 72 l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" />
        <path d="M58 72 l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" />
        <path d="M72 72 l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" fillOpacity="0.35" />
      </g>

      {/* Chat bubble accent, top-right */}
      <g transform="translate(80,14)">
        <path
          d="M0 10c0-5.5 4.5-10 10-10h6c5.5 0 10 4.5 10 10s-4.5 10-10 10h-2l-4.5 4.5V20C5.7 19.3 0 15.2 0 10z"
          fill="#059669"
        />
        <circle cx="9" cy="10" r="1.6" fill="#ECFDF5" />
        <circle cx="14.5" cy="10" r="1.6" fill="#ECFDF5" />
        <circle cx="20" cy="10" r="1.6" fill="#ECFDF5" />
      </g>
    </svg>
  );
}

export default function CSMForm({ officeSlug }: CSMFormProps) {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState<Lang>("en");

  // Office is locked in from the URL slug only — there is no dropdown
  // picker anymore. When there's no slug at all (base route), we never
  // fetch anything and just show the "unavailable" message in the splash.
  const [office, setOffice] = useState<Office | null>(null);
  const [loadingOffice, setLoadingOffice] = useState(!!officeSlug);
  const [officeError, setOfficeError] = useState("");
  const [officeNotFound, setOfficeNotFound] = useState(false);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [pdfDownloadFailed, setPdfDownloadFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const t = CONTENT[lang];

  // PSGC regions only — the CSM form asks for "region of residence", not a
  // full address, so no province/city/barangay cascade is needed.
  const [regions, setRegions] = useState<PsgcOption[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [regionError, setRegionError] = useState("");

  useEffect(() => {
    if (!officeSlug) {
      // Base route, no slug — nothing to fetch.
      setLoadingOffice(false);
      return;
    }

    let cancelled = false;
    setLoadingOffice(true);
    setOfficeError("");
    setOfficeNotFound(false);

    // Locked-in office via URL — fetch just that one office.
    fetch(`/api/offices/slug/${encodeURIComponent(officeSlug)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setOfficeNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to load office");
        const json = await res.json();
        const data = (json?.data ?? json) as Office;
        if (!cancelled) setOffice(data);
      })
      .catch(() => {
        if (!cancelled) setOfficeError("Couldn't load this office right now. Please refresh and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingOffice(false);
      });

    return () => {
      cancelled = true;
    };
  }, [officeSlug]);

  useEffect(() => {
    let cancelled = false;
    setLoadingRegions(true);
    fetch(`${PSGC_BASE}/regions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load regions");
        return res.json();
      })
      .then((data: unknown) => {
        if (!cancelled) setRegions(extractArray(data));
      })
      .catch(() => {
        if (!cancelled) setRegionError("Couldn't load regions right now. Please refresh and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoadingRegions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "success") {
      setShowSuccessOverlay(false);
      return;
    }
    const raf = requestAnimationFrame(() => setShowSuccessOverlay(true));
    return () => cancelAnimationFrame(raf);
  }, [status]);

  // When CC1 = 4 ("does not know what a CC is"), CC2/CC3 are not
  // applicable and are auto-set + locked, per the paper form's instructions.
  const cc1IsNotAware = form.cc1 === 4;
  useEffect(() => {
    if (cc1IsNotAware) {
      setForm((prev) => ({ ...prev, cc2: CC2_NA_VALUE, cc3: CC3_NA_VALUE }));
    }
  }, [cc1IsNotAware]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Reset the selected service whenever the office changes (or is cleared)
  // so a stale value from a previously-selected office's list can never be
  // submitted. Keyed on office.id so this doesn't fire on every re-render.
  useEffect(() => {
    setForm((prev) => (prev.service ? { ...prev, service: "" } : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [office?.id]);

  // ---- Intro -> Form transition ----
  const chooseLanguage = (l: Lang) => {
    setLang(l);
    setShowIntro(false);
  };

  // ---- Per-step validation ----
  const stepError = useMemo((): string | null => {
    if (step === 0) {
      if (!form.clientType) return t.errClientType;
      if (!form.transactionDate) return t.errDate;
      if (!form.region) return t.errRegion;
      if (!form.service.trim()) return t.errService;
      if (form.age && (Number(form.age) < 1 || Number(form.age) > 129)) return t.errAge;
      return null;
    }
    if (step === 1) {
      if (!form.cc1) return t.errCc1;
      if (!cc1IsNotAware && !form.cc2) return t.errCc2;
      if (!cc1IsNotAware && !form.cc3) return t.errCc3;
      return null;
    }
    if (step === 2) {
      const keys: (keyof FormState)[] = [
        "sqd0", "sqd1", "sqd2", "sqd3", "sqd4", "sqd5", "sqd6", "sqd7", "sqd8",
      ];
      const missing = keys.some((k) => !form[k]);
      if (missing) return t.errSqd;
      return null;
    }
    if (step === 3) {
      if (form.emailAddress && !/^\S+@\S+\.\S+$/.test(form.emailAddress)) return t.errEmail;
      return null;
    }
    return null;
  }, [step, form, cc1IsNotAware, t]);

  const goNext = () => {
    if (stepError) {
      setErrorMsg(stepError);
      setStatus("error");
      return;
    }
    setErrorMsg("");
    setStatus("idle");
    setStep((s) => Math.min(s + 1, t.steps.length - 1));
  };

  const goBack = () => {
    setErrorMsg("");
    setStatus("idle");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (stepError) {
      setErrorMsg(stepError);
      setStatus("error");
      return;
    }
    if (!office) {
      setErrorMsg(t.errGeneric);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    setPdfDownloadFailed(false);

    try {
      const res = await fetch("/api/csm-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officeId: office.id,
          clientType: form.clientType,
          transactionDate: form.transactionDate,
          sex: form.sex || undefined,
          age: form.age ? Number(form.age) : undefined,
          region: form.region,
          service: form.service.trim(),
          cc1: form.cc1,
          cc2: form.cc2,
          cc3: form.cc3,
          // sqdN are always stored as their canonical English phrase
          // regardless of display language — see setSqd below.
          sqd0: form.sqd0,
          sqd1: form.sqd1,
          sqd2: form.sqd2,
          sqd3: form.sqd3,
          sqd4: form.sqd4,
          sqd5: form.sqd5,
          sqd6: form.sqd6,
          sqd7: form.sqd7,
          sqd8: form.sqd8,
          comments: form.comments.trim() || undefined,
          emailAddress: form.emailAddress.trim() || undefined,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      // Validation/server errors always come back as JSON, regardless of the
      // success-path content type below.
      if (!res.ok) {
        let message = t.errGeneric;
        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {
          // response body wasn't JSON (e.g. a raw 500) — fall back to generic message
        }
        throw new Error(message);
      }

      if (contentType.includes("application/pdf")) {
        // Submission succeeded and the server generated the filled-in form —
        // trigger a browser download of it.
        const blob = await res.blob();
        const disposition = res.headers.get("content-disposition") || "";
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : "CSM-form.pdf";

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setStatus("success");
      } else {
        // Submission succeeded but the PDF couldn't be generated server-side
        // (see pdfError flag) — the response row was still saved.
        const data = await res.json();
        if (!data.success) {
          throw new Error(data?.message || t.errGeneric);
        }
        setStatus("success");
        setPdfDownloadFailed(Boolean(data.pdfError));
      }

      setTimeout(() => {
        router.back();
      }, 6000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.errGeneric);
    }
  };

  // Sets an SQD field by display index (0-5), always storing the canonical
  // English phrase so the backend/DB never has to know the display language.
  const setSqd = (key: keyof FormState, displayIndex: number) => {
    setField(key, SQD_CANONICAL[displayIndex] as never);
  };
  const sqdDisplayIndex = (value: string | null) =>
    value ? SQD_CANONICAL.indexOf(value as (typeof SQD_CANONICAL)[number]) : -1;

  return (
    <>
      {/* Full-Screen Splash Overlay — language selection */}
      <AnimatePresence>
        {showIntro && (
          <motion.section
            key="csm-splash-overlay"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white flex items-center justify-center px-4"
          >
            {/* Decorative background accents */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
              <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
              <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-teal-100/50 blur-2xl hidden sm:block" />
              <svg
                className="absolute inset-0 h-full w-full opacity-[0.05]"
                aria-hidden="true"
              >
                <defs>
                  <pattern id="csm-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="#047857" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#csm-dot-grid)" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="relative w-full max-w-md rounded-3xl border border-emerald-100 bg-white/90 backdrop-blur-sm shadow-xl shadow-emerald-900/5 px-7 sm:px-10 py-10 text-center"
            >
              {/* Custom illustration */}
              <div className="mx-auto mb-6 h-24 w-24">
                <CsmIllustration />
              </div>

              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-emerald-600">
                City Government of San Pablo
              </p>
              <h1 className="mt-2 text-[24px] sm:text-[27px] font-bold text-gray-900 tracking-tight leading-snug">
                We value your feedback!
              </h1>
              <p className="mt-2 text-[13px] text-gray-500">Help us improve our services by sharing your experience with us.</p>

              {!officeSlug ? (
                // Base route — no office slug at all. No form was ever
                // reachable here without a QR/office link, so just show
                // the unavailable notice in place of the picker/language UI.
                <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center">
                  <p className="text-[13.5px] font-medium text-gray-700">
                    This feature is only available after availing our service. Thank you!
                  </p>
                </div>
              ) : (
                <>
                  {officeNotFound ? (
                    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
                      <p className="text-[13px] font-medium text-amber-800">Office not found</p>
                      <p className="mt-0.5 text-[12.5px] text-amber-700">
                        This feedback link doesn&apos;t match any office on record. Please check the
                        link or QR code and try again, or contact the office directly.
                      </p>
                    </div>
                  ) : null}

                  {officeError ? (
                    <p className="mt-4 text-[12.5px] text-red-600">{officeError}</p>
                  ) : null}

                  {/* Locked-in office (from URL slug) */}
                  {!officeNotFound && !officeError ? (
                    <div className="mt-6 text-left">
                      <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                        Office / Tanggapan
                      </p>

                      {loadingOffice ? (
                        <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
                          <p className="text-[13px] text-gray-500">Loading office...</p>
                        </div>
                      ) : office ? (
                        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-semibold text-emerald-900">
                              {office.name}
                            </p>
                            <p className="text-[11.5px] text-emerald-700">Giving feedback for this office</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-gray-500">
                    <span className="h-px w-6 bg-gray-200" />
                    <span>Select language &middot; Piliin ang wika</span>
                    <span className="h-px w-6 bg-gray-200" />
                  </div>

                  <div
                    className={`mt-5 grid grid-cols-2 gap-3 transition-opacity duration-200 ${
                      office ? "opacity-100" : "opacity-40 pointer-events-none"
                    }`}
                    aria-disabled={!office}
                  >
                    <motion.button
                      type="button"
                      onClick={() => office && chooseLanguage("en")}
                      whileHover={office ? { y: -3 } : undefined}
                      whileTap={office ? { scale: 0.97 } : undefined}
                      className="group flex flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-50/70 hover:shadow-md disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:shadow-none"
                      disabled={!office}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700 transition-colors group-hover:bg-emerald-100">
                        EN
                      </span>
                      <span className="text-[14px] font-semibold text-gray-700 group-hover:text-emerald-800">
                        English
                      </span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => office && chooseLanguage("tl")}
                      whileHover={office ? { y: -3 } : undefined}
                      whileTap={office ? { scale: 0.97 } : undefined}
                      className="group flex flex-col items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-50/70 hover:shadow-md disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:shadow-none"
                      disabled={!office}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700 transition-colors group-hover:bg-emerald-100">
                        TL
                      </span>
                      <span className="text-[14px] font-semibold text-gray-700 group-hover:text-emerald-800">
                        Tagalog
                      </span>
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main form content */}
      {!showIntro && (
        <motion.div
          className="w-full max-w-2xl mx-auto mt-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
      <div className="bg-gray-50/60 rounded-2xl overflow-hidden">
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

        {/* Progress */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="px-6 sm:px-8 pb-1"
        >
          <div className="flex items-center gap-2">
            {t.steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i <= step ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12px] font-medium text-gray-500">
            {lang === "en" ? "Step" : "Hakbang"} {step + 1} {lang === "en" ? "of" : "ng"} {t.steps.length}{" "}
            &middot; {t.steps[step]}
          </p>
        </motion.div>

        {/* Form body */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="px-6 sm:px-8 py-7"
        >
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className="text-[13px] font-medium text-gray-700 mb-1.5">
                  {t.clientTypeLabel} <span className="text-emerald-600">*</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["citizen", "business", "government"] as ClientType[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setField("clientType", v)}
                      className={choiceBtnClass(form.clientType === v) + " text-center font-medium"}
                    >
                      {t.clientTypes[v]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    {t.dateLabel} <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.transactionDate}
                    onChange={(e) => setField("transactionDate", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-700 mb-1.5">
                    {t.sexLabel} <span className="text-gray-400 font-normal">{t.optionalTag}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["male", "female"] as Sex[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setField("sex", form.sex === v ? "" : v)}
                        className={choiceBtnClass(form.sex === v) + " text-center font-medium"}
                      >
                        {t.sexOptions[v]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    {t.ageLabel} <span className="text-gray-400 font-normal">{t.optionalTag}</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={129}
                    value={form.age}
                    onChange={(e) => setField("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder={t.agePlaceholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    {t.regionLabel} <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    value={form.region}
                    onChange={(e) => setField("region", e.target.value)}
                    disabled={loadingRegions}
                    className={inputClass}
                  >
                    <option value="">{loadingRegions ? t.regionLoading : t.regionPlaceholder}</option>
                    {regions.map((r) => (
                      <option key={r.code} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {regionError && <p className="mt-1 text-[12px] text-red-600">{regionError}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {t.serviceLabel} <span className="text-emerald-600">*</span>
                </label>
                {(() => {
                  const officeServices = office?.services ?? [];
                  const noOffice = !office;
                  const noServices = !noOffice && officeServices.length === 0;
                  return (
                    <>
                      <select
                        value={form.service}
                        onChange={(e) => setField("service", e.target.value)}
                        disabled={noOffice || noServices}
                        className={inputClass}
                      >
                        <option value="">
                          {noOffice
                            ? t.serviceNoOfficeMsg
                            : noServices
                            ? t.serviceNoneMsg
                            : t.servicePlaceholder}
                        </option>
                        {officeServices.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {noServices && (
                        <p className="mt-1 text-[12px] text-gray-400">{t.serviceNoneMsg}</p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{t.ccIntro}</p>

              <RadioGroup
                title={t.cc1Title}
                required
                options={t.cc1Options.map((label, i) => ({ value: i + 1, label }))}
                value={form.cc1}
                onChange={(v) => setField("cc1", v)}
              />

              <RadioGroup
                title={t.cc2Title}
                required
                disabled={cc1IsNotAware}
                helperText={cc1IsNotAware ? t.naNote : undefined}
                options={t.cc2Options.map((label, i) => ({ value: i + 1, label }))}
                value={form.cc2}
                onChange={(v) => setField("cc2", v)}
              />

              <RadioGroup
                title={t.cc3Title}
                required
                disabled={cc1IsNotAware}
                helperText={cc1IsNotAware ? t.naNote : undefined}
                options={t.cc3Options.map((label, i) => ({ value: i + 1, label }))}
                value={form.cc3}
                onChange={(v) => setField("cc3", v)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-[12.5px] text-gray-500 leading-relaxed">{t.sqdIntro}</p>
              {(["sqd0", "sqd1", "sqd2", "sqd3", "sqd4", "sqd5", "sqd6", "sqd7", "sqd8"] as const).map(
                (key, idx) => (
                  <RadioGroup
                    key={key}
                    title={`SQD${idx}. ${t.sqdItems[idx]}`}
                    required
                    compact
                    options={t.sqdOptions.map((label, i) => ({ value: i, label }))}
                    value={sqdDisplayIndex(form[key])}
                    onChange={(displayIndex) => setSqd(key, displayIndex)}
                  />
                )
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {t.commentsLabel} <span className="text-gray-400 font-normal">{t.optionalTag}</span>
                </label>
                <textarea
                  rows={5}
                  value={form.comments}
                  onChange={(e) => setField("comments", e.target.value.slice(0, 1000))}
                  placeholder={t.commentsPlaceholder}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-[12px] text-gray-400">{form.comments.length}/1000</p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {t.emailLabel} <span className="text-gray-400 font-normal">{t.optionalTag}</span>
                </label>
                <input
                  type="email"
                  value={form.emailAddress}
                  onChange={(e) => setField("emailAddress", e.target.value)}
                  maxLength={100}
                  placeholder={t.emailPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Status message */}
          {status === "error" && errorMsg && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0 || status === "submitting"}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {t.backBtn}
            </button>

            {step < t.steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold text-white rounded-lg bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm"
              >
                {t.nextBtn}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "submitting"}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold text-white rounded-lg bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {t.sendingBtn}
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    {t.submitBtn}
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Success overlay */}
      {status === "success" && (
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
            <h3 className="mt-4 text-[16px] font-semibold text-gray-900">{t.successTitle}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">{t.successMsg}</p>
            {pdfDownloadFailed && (
              <p className="mt-3 text-[12.5px] leading-relaxed text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                {t.pdfFailedNote}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t.redirectMsg}
            </div>
          </div>
        </div>
      )}
        </motion.div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------
// RadioGroup — shared control for CC/SQD single-choice questions
// ---------------------------------------------------------------------
function RadioGroup({
  title,
  options,
  value,
  onChange,
  required,
  disabled,
  compact,
  helperText,
}: {
  title: string;
  options: { value: number; label: string }[];
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
  helperText?: string;
}) {
  return (
    <div className={disabled ? "opacity-50" : ""}>
      <p className="text-[13px] font-medium text-gray-700 mb-2 leading-relaxed">
        {title} {required && <span className="text-emerald-600">*</span>}
      </p>
      {helperText && <p className="mb-2 text-[12px] text-gray-400">{helperText}</p>}
      <div className={`grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={choiceBtnClass(value === opt.value, disabled)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}