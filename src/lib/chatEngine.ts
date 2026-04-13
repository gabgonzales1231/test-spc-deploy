import { FAQ_DATA, FaqEntry } from "./faq-data";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "kumusta", "musta"];
const THANKS = ["thank", "thanks", "thank you", "salamat", "ok", "okay", "noted"];
const FAREWELLS = ["bye", "goodbye", "paalam", "see you"];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function scoreEntry(query: string, entry: FaqEntry): number {
  const words = normalize(query).split(/\s+/);
  let score = 0;
  for (const word of words) {
    if (word.length < 2) continue;
    for (const keyword of entry.keywords) {
      if (keyword === word) {
        score += 3; // exact match
      } else if (keyword.includes(word) || word.includes(keyword)) {
        score += 1; // partial match
      }
    }
  }
  return score;
}

export function getBotResponse(userInput: string): string {
  const normalized = normalize(userInput);

  // Greetings
  if (GREETINGS.some((g) => normalized.includes(g))) {
    return "Magandang araw! 👋 I'm the San Pablo City virtual assistant. I can help you with office hours, fees, department contacts, and city services. What would you like to know?";
  }

  // Thank you
  if (THANKS.some((t) => normalized.includes(t))) {
    return "You're welcome! Is there anything else I can help you with? 😊";
  }

  // Farewell
  if (FAREWELLS.some((f) => normalized.includes(f))) {
    return "Goodbye! Feel free to come back if you have more questions. Have a great day! 🙏";
  }

  // Score all FAQ entries
  const scored = FAQ_DATA.map((entry) => ({
    entry,
    score: scoreEntry(userInput, entry),
  })).filter((r) => r.score > 0);

  if (scored.length === 0) {
    return "I'm sorry, I couldn't find an answer to that. For more specific inquiries, please visit City Hall during office hours (Mon–Fri, 8AM–5PM) or call our hotline. Is there something else I can help you with?";
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return the best match
  const best = scored[0];

  // If multiple entries tie closely, list them
  const topMatches = scored.filter((r) => r.score >= best.score - 1 && r.score > 1);
  if (topMatches.length > 1 && best.score <= 2) {
    const options = topMatches
      .slice(0, 3)
      .map((r) => `• ${r.entry.question}`)
      .join("\n");
    return `I found a few topics that might help:\n\n${options}\n\nCould you be more specific about what you need?`;
  }

  return best.entry.answer;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
