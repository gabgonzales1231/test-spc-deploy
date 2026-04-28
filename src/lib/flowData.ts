// ─────────────────────────────────────────────
// flowData.ts — Static structural nodes only.
// Content nodes (tanong, serbisyo children) are
// built dynamically from CMS in chatEngine.ts
// ─────────────────────────────────────────────

export type InputMode =
  | "buttons"
  | "text"
  | "complaint-negosyo"
  | "complaint-traysikel"
  | "complaint-iba"
  | "papuri-text"
  | "helpdesk-text"
  | null;

export interface FlowOption {
  label: string;
  value: string;
}

export interface FlowNode {
  key: string;
  message: string;
  options: FlowOption[];
  inputMode: InputMode;
  isTerminal?: boolean;
  parentKey?: string;
}

export const MAIN_MENU_KEY = "main";

// ── Static nodes that never change ───────────

export const STATIC_FLOW_NODES: Record<string, FlowNode> = {

  main: {
    key: "main",
    message:
      "Kamusta! Welcome sa Opisyal na chatbot ng San Pablo.\n\nI-type o piliin ang iyong kailangan mula sa mga sumusunod na pagpipilian:",
    options: [
      { label: "Serbisyo",             value: "serbisyo" },
      { label: "Tanong o Suhestiyon",  value: "tanong" },
      { label: "Sumbong",              value: "sumbong" },
      { label: "Papuri",               value: "papuri" },
    ],
    inputMode: "buttons",
  },

  // ── Serbisyo — options built dynamically from services table
  serbisyo: {
    key: "serbisyo",
    message: "🟩 Pumili ka ng \"Serbisyo.\" Pumili mula sa mga sumusunod na kategorya:",
    options: [], // populated at runtime by buildDynamicNodes()
    inputMode: "buttons",
  },

  "serbisyo-iba": {
    key: "serbisyo-iba",
    message: "Isend ang iyong tanong para masagot ng aming help desk.",
    options: [],
    inputMode: "helpdesk-text",
    isTerminal: true,
  },

  // ── Tanong — options built dynamically from faqs table
  tanong: {
    key: "tanong",
    message: "🟨 Pumili ka ng \"Tanong o Suhestiyon\". Pumili ng kategorya:",
    options: [], // populated at runtime by buildDynamicNodes()
    inputMode: "buttons",
  },

  // ── Sumbong — fully static
  sumbong: {
    key: "sumbong",
    message:
      "🟦 Pumili ka ng \"Sumbong\". Pakibigay ang detalye ng iyong sumbong at pumili ng kategorya:",
    options: [
      { label: "Sumbong sa Negosyo",   value: "sumbong-negosyo" },
      { label: "Sumbong sa Traysikel", value: "sumbong-traysikel" },
      { label: "Iba Pa",               value: "sumbong-iba" },
    ],
    inputMode: "buttons",
  },

  "sumbong-negosyo": {
    key: "sumbong-negosyo",
    message: "Isend ang iyong reklamo tungkol sa negosyo:",
    options: [],
    inputMode: "complaint-negosyo",
    isTerminal: true,
  },

  "sumbong-traysikel": {
    key: "sumbong-traysikel",
    message: "Isend ang iyong reklamo tungkol sa traysikel:",
    options: [],
    inputMode: "complaint-traysikel",
    isTerminal: true,
  },

  "sumbong-iba": {
    key: "sumbong-iba",
    message: "Isend ang iyong tanong para masagot ng aming help desk.",
    options: [],
    inputMode: "helpdesk-text",
    isTerminal: true,
  },

  // ── Papuri — fully static
  papuri: {
    key: "papuri",
    message:
      "🟪 Pumili ka ng \"Papuri\". Salamat sa iyong mga opinyon!\n\nIbigay ang iyong mensahe at ipapasa namin ito sa tamang departamento.",
    options: [],
    inputMode: "papuri-text",
    isTerminal: true,
  },
};

// ── Keyword → Node mapping ───────────────────

export const KEYWORD_MAP: Record<string, string> = {
  serbisyo:                  "serbisyo",
  "tanong o suhestiyon":     "tanong",
  tanong:                    "tanong",
  suhestiyon:                "tanong",
  sumbong:                   "sumbong",
  papuri:                    "papuri",
  "iba pa":                  "serbisyo-iba",
  "sumbong sa negosyo":      "sumbong-negosyo",
  "sumbong sa traysikel":    "sumbong-traysikel",
};