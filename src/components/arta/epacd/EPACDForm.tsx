"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, Send, RotateCcw, CheckCircle2, AlertCircle, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import gsap from "gsap";

// ---- reCAPTCHA v2 -------------------------------------------------------
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      render: (
        container: HTMLElement,
        params: Record<string, unknown>
      ) => number;
      ready: (cb: () => void) => void;
    };
    onEpacdCaptchaVerified?: (token: string) => void;
    onEpacdCaptchaExpired?: () => void;
  }
}

// ---- Attachment rules ----------------------------------------------
const ALLOWED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_TOTAL_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB combined

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ---- PSGC address types ------------------------------------------------
interface PsgcOption {
  code: string;
  name: string;
}

interface FormState {
  givenName: string;
  middleName: string;
  surname: string;
  suffix: string;

  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  barangayCode: string;
  barangayName: string;
  streetName: string;

  contact: string;
  email: string;
  message: string;
}

const initialState: FormState = {
  givenName: "",
  middleName: "",
  surname: "",
  suffix: "",

  regionCode: "",
  regionName: "",
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  barangayCode: "",
  barangayName: "",
  streetName: "",

  contact: "",
  email: "",
  message: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const PSGC_BASE = "/api/psgc";

// PSGC Cloud (and our proxy's error responses) can return a few different
// shapes: a plain array, a { data: [...] } wrapper, or a paginated
// { data: [...], meta: {...} } object, or (on our proxy's own errors) a
// { success: false, message } object. Normalize defensively so a bad shape
// never gets handed to .map().
// Repairs the classic "UTF-8 bytes misread as Latin-1/Windows-1252" mojibake
// (e.g. "BiÃ±an" -> "Biñan"). Safe no-op on strings that are already correct.
function fixMojibake(str: string): string {
  if (!/[\u00c2\u00c3\u00e2][\u0080-\u00bf]/.test(str)) return str;
  try {
    const bytes = Uint8Array.from(str, (ch) => ch.charCodeAt(0));
    const repaired = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return repaired;
  } catch {
    // Not valid UTF-8 once reinterpreted as bytes — leave the original alone.
    return str;
  }
}

function extractArray(json: unknown): PsgcOption[] {
  const normalize = (arr: PsgcOption[]) =>
    arr.map((item) => ({ ...item, name: fixMojibake(item.name) }));

  if (Array.isArray(json)) return normalize(json as PsgcOption[]);
  if (json && typeof json === "object" && Array.isArray((json as any).data)) {
    return normalize((json as any).data as PsgcOption[]);
  }
  return [];
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

export default function EPACDForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // PSGC dropdown data
  const [regions, setRegions] = useState<PsgcOption[]>([]);
  const [provinces, setProvinces] = useState<PsgcOption[]>([]);
  const [cities, setCities] = useState<PsgcOption[]>([]);
  const [barangays, setBarangays] = useState<PsgcOption[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Attachments (photos / PDFs), 5MB combined cap
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // reCAPTCHA v2
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);
  const [recaptchaScriptLoaded, setRecaptchaScriptLoaded] = useState(false);

  // ---- GSAP entrance animation on mount ----
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!cardRef.current || !headerRef.current || !formRef.current) return;

    const ctx = gsap.context(() => {
      // Simple page-appropriate entrance: a light fade + upward slide,
      // header leading slightly ahead of the form fields.
      gsap.set(cardRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(headerRef.current, { autoAlpha: 0, y: 8 });
      gsap.set(formRef.current, { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(cardRef.current, { autoAlpha: 1, y: 0, duration: 0.4 })
        .to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.25")
        .to(formRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2")
        .set([cardRef.current, headerRef.current, formRef.current], {
          clearProps: "opacity,transform,visibility",
        });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // ---- reCAPTCHA global callbacks (the widget calls these by name) ----
  useEffect(() => {
    window.onEpacdCaptchaVerified = (token: string) => setCaptchaToken(token);
    window.onEpacdCaptchaExpired = () => setCaptchaToken(null);
    return () => {
      delete window.onEpacdCaptchaVerified;
      delete window.onEpacdCaptchaExpired;
    };
  }, []);

  // ---- Success overlay enter transition ----
  useEffect(() => {
    if (status !== "success") {
      setShowSuccessOverlay(false);
      return;
    }
    // Mount the overlay at opacity/scale 0 first, then flip the visible
    // class on the next frame so the transition actually animates instead
    // of snapping straight to its end state.
    const raf = requestAnimationFrame(() => setShowSuccessOverlay(true));
    return () => cancelAnimationFrame(raf);
  }, [status]);

  // ---- reCAPTCHA explicit render ----
  // We render the widget ourselves instead of relying on the implicit
  // `g-recaptcha` class auto-scan. The auto-scan only runs once, right when
  // recaptcha/api.js first finishes loading — if the script is already
  // cached (e.g. the user navigated back to this form, or this component
  // remounted) that scan never happens again for our (new) container div,
  // so the widget silently never appears. Explicit rendering lets us
  // (re)render on every mount as long as the grecaptcha library is ready.
  useEffect(() => {
    if (!recaptchaScriptLoaded) return;
    if (!captchaContainerRef.current) return;
    if (captchaWidgetIdRef.current !== null) return; // already rendered

    const renderWidget = () => {
      if (!window.grecaptcha || !captchaContainerRef.current) return;
      // Guard against re-rendering into a container that already has a
      // widget (e.g. React StrictMode double-invoking effects in dev).
      if (captchaContainerRef.current.childElementCount > 0) return;

      captchaWidgetIdRef.current = window.grecaptcha.render(
        captchaContainerRef.current,
        {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: "onEpacdCaptchaVerified",
          "expired-callback": "onEpacdCaptchaExpired",
        }
      );
    };

    if (window.grecaptcha?.ready) {
      window.grecaptcha.ready(renderWidget);
    } else {
      renderWidget();
    }
  }, [recaptchaScriptLoaded]);

  // ---- Load regions on mount ----
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
        if (!cancelled)
          setAddressError(
            "Couldn't load regions right now. Please refresh and try again."
          );
      })
      .finally(() => {
        if (!cancelled) setLoadingRegions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Load provinces when region changes ----
  useEffect(() => {
    if (!form.regionCode) {
      setProvinces([]);
      return;
    }
    let cancelled = false;
    setLoadingProvinces(true);
    fetch(`${PSGC_BASE}/regions/${form.regionCode}/provinces`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load provinces");
        return res.json();
      })
      .then((data: unknown) => {
        if (!cancelled) setProvinces(extractArray(data));
      })
      .catch(() => {
        if (!cancelled) setAddressError("Couldn't load provinces for that region.");
      })
      .finally(() => {
        if (!cancelled) setLoadingProvinces(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.regionCode]);

  // ---- Load cities/municipalities when province changes ----
  useEffect(() => {
    if (!form.provinceCode) {
      setCities([]);
      return;
    }
    let cancelled = false;
    setLoadingCities(true);
    fetch(`${PSGC_BASE}/provinces/${form.provinceCode}/cities-municipalities`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cities");
        return res.json();
      })
      .then((json: unknown) => {
        if (!cancelled) setCities(extractArray(json));
      })
      .catch(() => {
        if (!cancelled) setAddressError("Couldn't load cities/municipalities for that province.");
      })
      .finally(() => {
        if (!cancelled) setLoadingCities(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.provinceCode]);

  // ---- Load barangays when city changes ----
  useEffect(() => {
    if (!form.cityCode) {
      setBarangays([]);
      return;
    }
    let cancelled = false;
    setLoadingBarangays(true);
    fetch(`${PSGC_BASE}/cities-municipalities/${form.cityCode}/barangays`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load barangays");
        return res.json();
      })
      .then((json: unknown) => {
        if (!cancelled) setBarangays(extractArray(json));
      })
      .catch(() => {
        if (!cancelled) setAddressError("Couldn't load barangays for that city/municipality.");
      })
      .finally(() => {
        if (!cancelled) setLoadingBarangays(false);
      });
    return () => {
      cancelled = true;
    };
  }, [form.cityCode]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "contact") {
      // Digits only, hard-capped at 11
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({ ...prev, contact: digitsOnly }));
      return;
    }

    if (name === "message") {
      // Message is the only field left as-typed (not forced uppercase)
      setForm((prev) => ({ ...prev, message: value }));
      return;
    }

    if (name === "email") {
      // Email is case-sensitive-ish and looks broken uppercased — keep it
      // exactly as typed, same treatment as the message field.
      setForm((prev) => ({ ...prev, email: value }));
      return;
    }

    if (name === "streetName") {
      setForm((prev) => ({ ...prev, streetName: value.toUpperCase().slice(0, 155) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = regions.find((r) => r.code === code)?.name ?? "";
    setForm((prev) => ({
      ...prev,
      regionCode: code,
      regionName: name,
      // reset everything downstream
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
      barangayCode: "",
      barangayName: "",
    }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = provinces.find((p) => p.code === code)?.name ?? "";
    setForm((prev) => ({
      ...prev,
      provinceCode: code,
      provinceName: name,
      cityCode: "",
      cityName: "",
      barangayCode: "",
      barangayName: "",
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = cities.find((c) => c.code === code)?.name ?? "";
    setForm((prev) => ({
      ...prev,
      cityCode: code,
      cityName: name,
      barangayCode: "",
      barangayName: "",
    }));
  };

  const handleBarangayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = barangays.find((b) => b.code === code)?.name ?? "";
    setForm((prev) => ({ ...prev, barangayCode: code, barangayName: name }));
  };

  // "Clear" only resets the Mensahe field, per spec
  const handleClear = () => {
    setForm((prev) => ({ ...prev, message: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    // Allow re-selecting the same file after removing it
    e.target.value = "";
    if (picked.length === 0) return;

    setFileError("");

    const rejectedType = picked.find(
      (f) => !ALLOWED_ATTACHMENT_TYPES.includes(f.type)
    );
    if (rejectedType) {
      setFileError("Only JPG, PNG, WEBP images and PDF files are allowed.");
      return;
    }

    setFiles((prev) => {
      const combined = [...prev, ...picked];
      const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
      if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
        setFileError(
          `Attachments must not exceed 5MB in total (currently ${formatBytes(
            totalBytes
          )}).`
        );
        return prev;
      }
      return combined;
    });
  };

  const handleRemoveFile = (index: number) => {
    setFileError("");
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAttachmentBytes = files.reduce((sum, f) => sum + f.size, 0);

  const validate = useCallback((): string | null => {
    if (!form.givenName.trim() || !form.surname.trim()) {
      return "Given name and surname are required.";
    }
    if (
      !form.regionCode ||
      !form.provinceCode ||
      !form.cityCode ||
      !form.barangayCode
    ) {
      return "Please select region, province, city/municipality, and barangay.";
    }
    if (!/^[0-9]{11}$/.test(form.contact)) {
      return "Contact number must be exactly 11 digits.";
    }
    if (form.email && form.email.length > 30) {
      return "Email must be 30 characters or fewer.";
    }
    if (!form.message.trim()) {
      return "Please enter your message.";
    }
    if (form.message.length > 500) {
      return "Message must be 500 characters or fewer.";
    }
    if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      return "Attachments must not exceed 5MB in total.";
    }
    if (!captchaToken) {
      return "Please complete the CAPTCHA before submitting.";
    }
    return null;
  }, [form, totalAttachmentBytes, captchaToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });
      files.forEach((file) => fd.append("attachments", file));
      fd.append("recaptchaToken", captchaToken ?? "");

      const res = await fetch("/api/epacd", {
        method: "POST",
        // No Content-Type header — the browser sets the correct
        // multipart/form-data boundary automatically for FormData bodies.
        body: fd,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to send your complaint.");
      }

      setStatus("success");
      setForm(initialState);
      setFiles([]);
      setFileError("");
      setCaptchaToken(null);
      window.grecaptcha?.reset(captchaWidgetIdRef.current ?? undefined);

      // Give the person a moment to see the success message, then send
      // them back to wherever they came from.
      setTimeout(() => {
        router.back();
      }, 3500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      // A used or expired token can't be reused — force a fresh checkbox
      // solve before the next attempt.
      setCaptchaToken(null);
      window.grecaptcha?.reset(captchaWidgetIdRef.current ?? undefined);
    }
  };

  const messageCount = form.message.length;
  const emailCount = form.email.length;

  return (
    <div className="w-full max-w-2xl lg:max-w-6xl mx-auto mt-10 lg:mt-10">
      <div
        ref={cardRef}
        className="bg-gray-50/60 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="px-6 sm:px-8 py-6 bg-gray-50/60"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-emerald-700">
            City Government of San Pablo
          </p>
          <h2 className="mt-1 text-[22px] sm:text-[24px] font-semibold text-gray-900 tracking-tight">
            Electronic Public Assistance and Complaints Desk
          </h2>
          <p className="mt-1 text-[13px] text-gray-500">
            Submit your concern and our office will get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 py-7 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5 lg:items-start"
        >
          {/* Left column: identity + address */}
          <div className="space-y-5">
          {/* Name */}
          <div>
            <p className="text-[13px] font-medium text-gray-700 mb-1.5">
              Name <span className="text-emerald-600">*</span>
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="givenName"
                type="text"
                value={form.givenName}
                onChange={handleTextChange}
                required
                maxLength={50}
                placeholder="Given Name"
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              <input
                name="middleName"
                type="text"
                value={form.middleName}
                onChange={handleTextChange}
                maxLength={50}
                placeholder="Middle Name (optional)"
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              <input
                name="surname"
                type="text"
                value={form.surname}
                onChange={handleTextChange}
                required
                maxLength={50}
                placeholder="Surname"
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              <input
                name="suffix"
                type="text"
                value={form.suffix}
                onChange={handleTextChange}
                maxLength={10}
                placeholder="Suffix (e.g. Jr., III) — optional"
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-[13px] font-medium text-gray-700 mb-1.5">
              Address <span className="text-emerald-600">*</span>
            </p>


            <div className="grid sm:grid-cols-2 gap-3">
              <select
                name="regionCode"
                value={form.regionCode}
                onChange={handleRegionChange}
                required
                disabled={loadingRegions}
                className={inputClass}
              >
                <option value="">
                  {loadingRegions ? "Loading regions..." : "Select Region"}
                </option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                name="provinceCode"
                value={form.provinceCode}
                onChange={handleProvinceChange}
                required
                disabled={!form.regionCode || loadingProvinces}
                className={inputClass}
              >
                <option value="">
                  {loadingProvinces ? "Loading provinces..." : "Select Province"}
                </option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                name="cityCode"
                value={form.cityCode}
                onChange={handleCityChange}
                required
                disabled={!form.provinceCode || loadingCities}
                className={inputClass}
              >
                <option value="">
                  {loadingCities ? "Loading cities..." : "Select City / Municipality"}
                </option>
                {cities.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                name="barangayCode"
                value={form.barangayCode}
                onChange={handleBarangayChange}
                required
                disabled={!form.cityCode || loadingBarangays}
                className={inputClass}
              >
                <option value="">
                  {loadingBarangays ? "Loading barangays..." : "Select Barangay"}
                </option>
                {barangays.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            
            {addressError && (
              <p className="mt-1.5 text-[12.5px] text-red-600">{addressError}</p>
            )}
          </div>

           <div className="mb-3">
              <input
                name="streetName"
                type="text"
                value={form.streetName}
                onChange={handleTextChange}
                maxLength={155}
                placeholder="Street Name (e.g. house no., street, subdivision)"
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              <p className="mt-1 text-[12px] text-gray-400">
                {form.streetName.length}/155 characters
              </p>
            </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="contact"
                className="block text-[13px] font-medium text-gray-700 mb-1.5"
              >
                Contact No. <span className="text-emerald-600">*</span>
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                inputMode="numeric"
                value={form.contact}
                onChange={handleTextChange}
                required
                maxLength={11}
                placeholder="09XXXXXXXXX"
                className={inputClass}
              />
              <p className="mt-1 text-[12px] text-gray-400">
                {form.contact.length}/11 digits
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-gray-700 mb-1.5"
              >
                Email{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleTextChange}
                maxLength={30}
                placeholder="juan@email.com"
                className={inputClass}
              />
              <p className="mt-1 text-[12px] text-gray-400">
                {emailCount}/30 characters
              </p>
            </div>
          </div>
          </div>

          {/* Right column: message, attachments, captcha, actions */}
          <div className="space-y-5">
          <div>
            <label
              htmlFor="message"
              className="block text-[13px] font-medium text-gray-700 mb-1.5"
            >
              Mensahe <span className="text-emerald-600">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={handleTextChange}
              required
              maxLength={500}
              placeholder="Describe your concern or complaint in detail..."
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-[12px] text-gray-400">
              {messageCount}/500 characters
            </p>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-[13px] font-medium text-gray-700 mb-1.5">
              Attachments{" "}
              <span className="text-gray-400 font-normal">
                (optional — photos or PDF, 5MB total)
              </span>
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="attachments"
            />

            <label
              htmlFor="attachments"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Add files
            </label>

            {files.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {files.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-[13px] text-gray-700"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {file.type === "application/pdf" ? (
                        <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-gray-400 shrink-0" />
                      )}
                      <span className="truncate">{file.name}</span>
                      <span className="text-gray-400 shrink-0">
                        ({formatBytes(file.size)})
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="text-gray-400 hover:text-red-600 shrink-0"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-1.5 text-[12px] text-gray-400">
              {formatBytes(totalAttachmentBytes)} / 5 MB used
            </p>

            {fileError && (
              <p className="mt-1 text-[12.5px] text-red-600">{fileError}</p>
            )}
          </div>

          {/* CAPTCHA */}
          <div>
            <Script
              src="https://www.google.com/recaptcha/api.js?render=explicit"
              strategy="afterInteractive"
              onReady={() => setRecaptchaScriptLoaded(true)}
            />
            <div ref={captchaContainerRef} />
          </div>

          {/* Status messages */}
          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={status === "submitting"}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
            <button
              type="submit"
              disabled={status === "submitting" || !captchaToken}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13.5px] font-semibold text-white rounded-lg bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send
                </>
              )}
            </button>
          </div>
          </div>
        </form>
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
              showSuccessOverlay
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>

            <h3 className="mt-4 text-[16px] font-semibold text-gray-900">
              Complaint sent successfully
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">
              Thank you for reaching out. We&apos;ve received your submission
              and will get back to you soon.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-gray-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              You are now being redirected back to the previous page...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}