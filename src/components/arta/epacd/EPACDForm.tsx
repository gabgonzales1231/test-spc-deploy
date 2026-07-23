"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Send, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

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

interface EPACDFormProps {
  onClose?: () => void;
}

export default function EPACDForm({ onClose }: EPACDFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<SubmitStatus>("idle");
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
    if (form.message.length > 255) {
      return "Message must be 255 characters or fewer.";
    }
    return null;
  }, [form]);

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
      const res = await fetch("/api/epacd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to send your complaint.");
      }

      setStatus("success");
      setForm(initialState);

      // Auto-close the modal shortly after a successful submission
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const messageCount = form.message.length;
  const emailCount = form.email.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white">
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-emerald-700">
            City Government of San Pablo
          </p>
          <h2 className="mt-1 text-[22px] sm:text-[24px] font-semibold text-gray-900 tracking-tight">
            Electronic Public Assistance Complaints Desk
          </h2>
          <p className="mt-1 text-[13px] text-gray-500">
            Submit your concern and our office will get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-7 space-y-5 max-h-[75vh] overflow-y-auto">
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
                className={`${inputClass} uppercase placeholder:normal-case`}
              />
              <p className="mt-1 text-[12px] text-gray-400">
                {emailCount}/30 characters
              </p>
            </div>
          </div>

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
              maxLength={255}
              placeholder="Describe your concern or complaint in detail..."
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-[12px] text-gray-400">
              {messageCount}/255 characters
            </p>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[13.5px] text-emerald-800">
                Your complaint has been sent successfully. Thank you for reaching out.
              </p>
            </div>
          )}

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
              disabled={status === "submitting"}
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
        </form>
      </div>
    </div>
  );
}