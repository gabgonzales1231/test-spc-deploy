//spc-website\src\lib\flowData.ts

export const MAIN_MENU_KEY = "main";

export const STATIC_FLOW_NODES: Record<string, FlowNode> = {

  main: {
    key: "main",
    message:
      "Kamusta! Welcome sa Opisyal na chatbot ng San Pablo.\n\nI-type o piliin ang iyong kailangan mula sa mga sumusunod na pagpipilian:",
    options: [
      { label: "Serbisyo",            value: "serbisyo" },
      { label: "Tanong o Suhestiyon", value: "tanong" },
      { label: "Iba Pa",              value: "iba-pa" },
    ],
    inputMode: "buttons",
  },

  serbisyo: {
    key: "serbisyo",
    message: "🟩 Pumili ka ng \"Serbisyo.\" Pumili mula sa mga sumusunod na kategorya:",
    options: [], // populated at runtime by buildDynamicNodes()
    inputMode: "buttons",
  },

  tanong: {
    key: "tanong",
    message: "🟨 Pumili ka ng \"Tanong o Suhestiyon\". Pumili ng kategorya:",
    options: [], // populated at runtime by buildDynamicNodes()
    inputMode: "buttons",
  },

  "iba-pa": {
    key: "iba-pa",
    message: "Isend ang iyong tanong para masagot ng aming help desk.",
    options: [],
    inputMode: "helpdesk-text",
    isTerminal: true,
  },
};

export const KEYWORD_MAP: Record<string, string> = {
  serbisyo:               "serbisyo",
  "tanong o suhestiyon":  "tanong",
  tanong:                 "tanong",
  suhestiyon:             "tanong",
  "iba pa":               "iba-pa",
};