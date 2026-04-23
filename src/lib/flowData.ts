// ─────────────────────────────────────────────
// flowData.ts — Node-based conversation tree
// ─────────────────────────────────────────────
// Each node defines:
//   key         — unique identifier
//   message     — bot message (supports {{placeholders}} for CMS injection)
//   options     — quick-reply buttons shown to the user
//   inputMode   — "buttons" | "text" | "complaint-form" | "name-prompt" | null
//   isTerminal  — if true, show main menu after response
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
  label: string;   // displayed on the button
  value: string;   // next node key
}

export interface FlowNode {
  key: string;
  message: string;
  options: FlowOption[];
  inputMode: InputMode;
  isTerminal?: boolean; // returns to main menu after user input
  parentKey?: string;   // set dynamically by engine; stored in history
}

// ─── Node Registry ───────────────────────────

export const FLOW_NODES: Record<string, FlowNode> = {

  // ── Main Menu ─────────────────────────────
  main: {
    key: "main",
    message:
      "Kamusta! Welcome sa Opisyal na chatbot ng San Pablo.\n\nI-type o piliin ang iyong kailangan mula sa mga sumusunod na pagpipilian:",
    options: [
      { label: "Serbisyo", value: "serbisyo" },
      { label: "Tanong o Suhestiyon", value: "tanong" },
      { label: "Sumbong", value: "sumbong" },
      { label: "Papuri", value: "papuri" },
    ],
    inputMode: "buttons",
  },

  // ── Serbisyo ──────────────────────────────
  serbisyo: {
    key: "serbisyo",
    message:
      "🟩 Pumili ka ng \"Serbisyo.\" Pumili mula sa mga sumusunod na kategorya:",
    options: [
      { label: "Citizens Charter", value: "citizens-charter" },
      { label: "Iba Pa", value: "serbisyo-iba" },
    ],
    inputMode: "buttons",
  },

  "citizens-charter": {
    key: "citizens-charter",
    message:
      "Pinili mo ang 'Citizens Charter'. Narito ang presyo ng pamasahe sa tricycle sa San Pablo, Laguna.\n\nI-click mo lang ang link para mabuksan o i-open ito sa browser:\n{{citizens_charter_link}}",
    options: [],
    inputMode: null,
    isTerminal: true,
  },

  "serbisyo-iba": {
    key: "serbisyo-iba",
    message:
      "Isend ang iyong tanong para masagot ng aming help desk.",
    options: [],
    inputMode: "helpdesk-text",
    isTerminal: true,
  },

  // ── Tanong o Suhestiyon ───────────────────
  tanong: {
    key: "tanong",
    message:
      "🟨 Pumili ka ng \"Tanong o Suhestiyon\". Pumili ng kategorya:",
    options: [
      { label: "Mga Contact ng Opisina", value: "contacts" },
      { label: "Transportasyon", value: "transportasyon" },
    ],
    inputMode: "buttons",
  },

  contacts: {
    key: "contacts",
    message:
      "Pinili mo ang 'Mga Contact ng Opisina'. Narito ang mga contact number ng mga opisina:\n\n{{office_contacts}}",
    options: [],
    inputMode: null,
    isTerminal: true,
  },

  transportasyon: {
    key: "transportasyon",
    message:
      "Kung Pumili ang 'Transportasyon'. Ano ang nais mong malaman tungkol sa transportasyon?\n\nPumili mula sa mga sumusunod:",
    options: [
      { label: "Lokasyon ng Terminal", value: "terminal-location" },
      { label: "Presyo ng Pamasahe", value: "fare-price" },
    ],
    inputMode: "buttons",
  },

  "terminal-location": {
    key: "terminal-location",
    message:
      "Anong sakayan ang nais mong mahanap?\n\n{{terminal_locations}}",
    options: [],
    inputMode: null,
    isTerminal: true,
  },

  "fare-price": {
    key: "fare-price",
    message:
      "Pinili mo ang 'Presyo ng Pamasahe.' Narito ang presyo ng pamasahe sa tricycle sa San Pablo, Laguna.\n\nI-click mo lang ang link para mabuksan o i-open ito sa browser:\n{{fare_price_link}}",
    options: [],
    inputMode: null,
    isTerminal: true,
  },

  // ── Sumbong ───────────────────────────────
  sumbong: {
    key: "sumbong",
    message:
      "🟦 Pumili ka ng \"Sumbong\". Pakibigay ang detalye ng iyong sumbong at pumili ng kategorya:",
    options: [
      { label: "Sumbong sa Negosyo", value: "sumbong-negosyo" },
      { label: "Sumbong sa Traysikel", value: "sumbong-traysikel" },
      { label: "Iba Pa", value: "sumbong-iba" },
    ],
    inputMode: "buttons",
  },

  "sumbong-negosyo": {
    key: "sumbong-negosyo",
    message:
      "Isend ang iyong reklamo tungkol sa negosyo:",
    options: [],
    inputMode: "complaint-negosyo",
    isTerminal: true,
  },

  "sumbong-traysikel": {
    key: "sumbong-traysikel",
    message:
      "Isend ang iyong reklamo tungkol sa traysikel:",
    options: [],
    inputMode: "complaint-traysikel",
    isTerminal: true,
  },

  "sumbong-iba": {
    key: "sumbong-iba",
    message:
      "Isend ang iyong tanong para masagot ng aming help desk.",
    options: [],
    inputMode: "helpdesk-text",
    isTerminal: true,
  },

  // ── Papuri ────────────────────────────────
  papuri: {
    key: "papuri",
    message:
      "🟪 Pumili ka ng \"Papuri\". Salamat sa iyong mga opinyon!\n\nIbigay ang iyong mensahe at ipapasa namin ito sa tamang departamento.",
    options: [],
    inputMode: "papuri-text",
    isTerminal: true,
  },
};

// ── Keyword → Node mapping (for typed navigation) ──
export const KEYWORD_MAP: Record<string, string> = {
  serbisyo: "serbisyo",
  "tanong o suhestiyon": "tanong",
  tanong: "tanong",
  suhestiyon: "tanong",
  sumbong: "sumbong",
  papuri: "papuri",
  "citizens charter": "citizens-charter",
  "iba pa": "serbisyo-iba",
  "mga contact ng opisina": "contacts",
  contacts: "contacts",
  transportasyon: "transportasyon",
  transportation: "transportasyon",
  "lokasyon ng terminal": "terminal-location",
  "terminal location": "terminal-location",
  "presyo ng pamasahe": "fare-price",
  "fare price": "fare-price",
  "fare price matrix": "fare-price",
  "sumbong sa negosyo": "sumbong-negosyo",
  "sumbong sa traysikel": "sumbong-traysikel",
};

export const MAIN_MENU_KEY = "main";
