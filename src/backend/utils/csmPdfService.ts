import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { supabase } from "../config/database"; // adjust import to your actual supabase client export
import {
  CHECKBOXES,
  OFFICE_NAME_FIELD,
  PAGE_HEIGHT,
  SQD_COLUMN_X,
  SQD_ROW_Y,
  TEXT_FIELDS,
  TextFieldSpec,
} from "./csmPdfCoordinates";

const TEMPLATE_BUCKET = "documents";
const TEMPLATE_PATH = "forms/csm/csmform.pdf";

const TEXT_COLOR = rgb(0, 0, 0);
const LINE_HEIGHT_RATIO = 1.15;

export interface CsmResponseForPdf {
  control_no: string;
  client_type: "citizen" | "business" | "government";
  transaction_date: string; // ISO date
  sex?: "male" | "female" | null;
  age?: number | null;
  region: string;
  service: string;
  cc1: number;
  cc2: number;
  cc3: number;
  sqd0: string;
  sqd1: string;
  sqd2: string;
  sqd3: string;
  sqd4: string;
  sqd5: string;
  sqd6: string;
  sqd7: string;
  sqd8: string;
  comments?: string | null;
  email_address?: string | null;
  /** Denormalized office name (csm_response.office_name), used only for the
   * header placeholder — not required for the row to otherwise be valid. */
  office_name?: string | null;
}

/** Convert a top-based y (distance from top of page) to pdf-lib's bottom-left origin. */
function topToPdfY(top: number): number {
  return PAGE_HEIGHT - top;
}

/**
 * Shrinks font size to fit `text` within `maxWidth` at `font`, down to `minSize`.
 * Returns the chosen size and, if it still doesn't fit at minSize, a truncated
 * (ellipsized) version of the text.
 */
function fitSingleLine(
  font: PDFFont,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
): { size: number; text: string } {
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  if (font.widthOfTextAtSize(text, size) <= maxWidth) {
    return { size, text };
  }
  // Still doesn't fit at minSize — truncate with ellipsis.
  let truncated = text;
  while (
    truncated.length > 1 &&
    font.widthOfTextAtSize(truncated + "…", minSize) > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return { size: minSize, text: truncated + "…" };
}

/** Greedy word-wrap of `text` into lines that fit `maxWidth` at the given font/size. */
function wrapText(font: PDFFont, text: string, maxWidth: number, size: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

/**
 * Fits multi-line `text` into a maxWidth x maxHeight box by shrinking font size
 * until all wrapped lines fit vertically, down to minSize. If it still overflows
 * at minSize, remaining lines are dropped and the last visible line gets an ellipsis.
 */
function fitMultiLine(
  font: PDFFont,
  text: string,
  maxWidth: number,
  maxHeight: number,
  maxSize: number,
  minSize: number,
  lineHeightRatio: number = LINE_HEIGHT_RATIO
): { size: number; lines: string[] } {
  let size = maxSize;
  let lines = wrapText(font, text, maxWidth, size);

  const fits = (s: number, ls: string[]) => ls.length * s * lineHeightRatio <= maxHeight;

  while (size > minSize && !fits(size, lines)) {
    size -= 0.5;
    lines = wrapText(font, text, maxWidth, size);
  }

  if (fits(size, lines)) {
    return { size, lines };
  }

  // Still overflowing at minSize: truncate to however many lines fit, ellipsize the last one.
  const maxLines = Math.max(1, Math.floor(maxHeight / (size * lineHeightRatio)));
  const visible = lines.slice(0, maxLines);
  let last = visible[visible.length - 1] ?? "";
  while (last.length > 1 && font.widthOfTextAtSize(last + "…", size) > maxWidth) {
    last = last.slice(0, -1);
  }
  visible[visible.length - 1] = last + "…";
  return { size, lines: visible };
}

function drawSingleLineField(
  page: PDFPage,
  font: PDFFont,
  spec: TextFieldSpec,
  value: string | number | null | undefined
) {
  if (value === null || value === undefined || value === "") return;
  const text = String(value);
  const { size, text: fitted } = fitSingleLine(
    font,
    text,
    spec.maxWidth,
    spec.maxFontSize,
    spec.minFontSize
  );
  page.drawText(fitted, {
    x: spec.x,
    y: topToPdfY(spec.top) - size, // top-align the text within its line
    size,
    font,
    color: TEXT_COLOR,
  });
}

/**
 * Draws single-line text horizontally centered within [boxLeft, boxRight],
 * shrinking to fit maxWidth like drawSingleLineField. Used for the office
 * name placeholder above the title, where names vary in length.
 */
function drawCenteredField(
  page: PDFPage,
  font: PDFFont,
  spec: { boxLeft: number; boxRight: number; top: number; maxWidth: number; maxFontSize: number; minFontSize: number },
  value: string | null | undefined
) {
  if (!value) return;
  const { size, text: fitted } = fitSingleLine(
    font,
    value,
    spec.maxWidth,
    spec.maxFontSize,
    spec.minFontSize
  );
  const textWidth = font.widthOfTextAtSize(fitted, size);
  const boxCenter = (spec.boxLeft + spec.boxRight) / 2;
  const x = boxCenter - textWidth / 2;
  page.drawText(fitted, {
    x,
    y: topToPdfY(spec.top) - size,
    size,
    font,
    color: TEXT_COLOR,
  });
}

function drawMultiLineField(
  page: PDFPage,
  font: PDFFont,
  spec: TextFieldSpec,
  value: string | null | undefined
) {
  if (!value) return;
  const lineHeightRatio = spec.lineHeightRatio ?? LINE_HEIGHT_RATIO;
  const { size, lines } = fitMultiLine(
    font,
    value,
    spec.maxWidth,
    spec.maxHeight ?? 9999,
    spec.maxFontSize,
    spec.minFontSize,
    lineHeightRatio
  );
  let y = topToPdfY(spec.top) - size;
  for (const line of lines) {
    page.drawText(line, { x: spec.x, y, size, font, color: TEXT_COLOR });
    y -= size * lineHeightRatio;
  }
}

/** Draws a checkmark (✓) as vector line segments, centered at (centerX, centerTop). */
function drawCheckmark(page: PDFPage, centerX: number, centerTop: number, sizePt = 9) {
  const cx = centerX;
  const cy = topToPdfY(centerTop);
  const half = sizePt / 2;
  // Short down-stroke then long up-stroke, classic checkmark proportions.
  const p1 = { x: cx - half, y: cy };
  const p2 = { x: cx - half / 4, y: cy - half * 0.7 };
  const p3 = { x: cx + half, y: cy + half * 0.8 };

  page.drawLine({ start: p1, end: p2, thickness: 1.3, color: TEXT_COLOR });
  page.drawLine({ start: p2, end: p3, thickness: 1.3, color: TEXT_COLOR });
}

function checkClientType(page: PDFPage, value: CsmResponseForPdf["client_type"]) {
  const pt = CHECKBOXES.clientType[value];
  if (pt) drawCheckmark(page, pt.x, pt.y);
}

function checkSex(page: PDFPage, value: CsmResponseForPdf["sex"]) {
  if (!value) return;
  const pt = CHECKBOXES.sex[value];
  if (pt) drawCheckmark(page, pt.x, pt.y);
}

function checkCC(page: PDFPage, group: "cc1" | "cc2" | "cc3", code: number) {
  const pt = (CHECKBOXES[group] as Record<number, { x: number; y: number }>)[code];
  if (pt) drawCheckmark(page, pt.x, pt.y);
}

function checkSqd(page: PDFPage, rowKey: keyof typeof SQD_ROW_Y, phrase: string) {
  const colX = (SQD_COLUMN_X as Record<string, number>)[phrase];
  const rowY = SQD_ROW_Y[rowKey];
  if (colX === undefined || rowY === undefined) return;
  drawCheckmark(page, colX, rowY);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "2-digit", day: "2-digit" });
}

/**
 * Fetches the CSM template from Supabase Storage and returns overlaid PDF bytes
 * for a single response row.
 */
export async function generateCsmPdf(response: CsmResponseForPdf): Promise<Uint8Array> {
  const { data: templateBlob, error } = await supabase.storage
    .from(TEMPLATE_BUCKET)
    .download(TEMPLATE_PATH);

  if (error || !templateBlob) {
    throw new Error(`Failed to load CSM PDF template: ${error?.message ?? "not found"}`);
  }

  const templateBytes = new Uint8Array(await templateBlob.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // --- Text fields ---
  drawSingleLineField(page, font, TEXT_FIELDS.controlNo, response.control_no);
  drawCenteredField(page, font, OFFICE_NAME_FIELD, response.office_name);
  drawSingleLineField(page, font, TEXT_FIELDS.date, formatDate(response.transaction_date));
  drawSingleLineField(page, font, TEXT_FIELDS.age, response.age ?? "N/A");
  drawSingleLineField(page, font, TEXT_FIELDS.region, response.region);
  drawSingleLineField(page, font, TEXT_FIELDS.service, response.service);
  drawSingleLineField(page, font, TEXT_FIELDS.email, response.email_address ?? "");
  drawMultiLineField(page, font, TEXT_FIELDS.comments, response.comments ?? "");

  // --- Checkboxes ---
  checkClientType(page, response.client_type);
  checkSex(page, response.sex ?? undefined);
  checkCC(page, "cc1", response.cc1);
  checkCC(page, "cc2", response.cc2);
  checkCC(page, "cc3", response.cc3);

  (["sqd0", "sqd1", "sqd2", "sqd3", "sqd4", "sqd5", "sqd6", "sqd7", "sqd8"] as const).forEach(
    (key) => checkSqd(page, key, response[key])
  );

  return pdfDoc.save();
}

/**
 * Calibration helper — NOT used in production. Loads the template and stamps
 * a checkmark on every single checkbox coordinate in the map simultaneously
 * (client type x3, sex x2, cc1 x4, cc2 x5, cc3 x4, sqd0-8 x6 = 54 marks),
 * ignoring the fact that a real submission only ever selects one option per
 * group. Use this while trial-and-error tuning csmPdfCoordinates.ts so you
 * can see every checkbox's position in a single render instead of one at a time.
 */
export async function generateCalibrationPdf(): Promise<Uint8Array> {
  const { data: templateBlob, error } = await supabase.storage
    .from(TEMPLATE_BUCKET)
    .download(TEMPLATE_PATH);

  if (error || !templateBlob) {
    throw new Error(`Failed to load CSM PDF template: ${error?.message ?? "not found"}`);
  }

  const templateBytes = new Uint8Array(await templateBlob.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0);
  const calibrationFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  drawCenteredField(page, calibrationFont, OFFICE_NAME_FIELD, "City Treasurer's Office");

  Object.values(CHECKBOXES.clientType).forEach((pt) => drawCheckmark(page, pt.x, pt.y));
  Object.values(CHECKBOXES.sex).forEach((pt) => drawCheckmark(page, pt.x, pt.y));
  Object.values(CHECKBOXES.cc1).forEach((pt) => drawCheckmark(page, pt.x, pt.y));
  Object.values(CHECKBOXES.cc2).forEach((pt) => drawCheckmark(page, pt.x, pt.y));
  Object.values(CHECKBOXES.cc3).forEach((pt) => drawCheckmark(page, pt.x, pt.y));

  (Object.keys(SQD_ROW_Y) as (keyof typeof SQD_ROW_Y)[]).forEach((rowKey) => {
    Object.keys(SQD_COLUMN_X).forEach((phrase) => checkSqd(page, rowKey, phrase));
  });

  return pdfDoc.save();
}