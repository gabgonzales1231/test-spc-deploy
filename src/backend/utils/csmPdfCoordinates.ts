/**
 * Coordinate map for the CSM (Client Satisfaction Measurement) PDF template.
 *
 * Source template: Supabase Storage bucket "documents", path "forms/csm/<template file>"
 * Page size: 612 x 936 pt (confirmed from template)
 * Origin note: all coordinates below are TOP-based (distance from top of page, in points),
 * matching how they were measured off the template. Convert to pdf-lib's bottom-left
 * origin at draw time with `topToPdfY()` in csmPdfService.ts.
 *
 * These were derived directly from the template's embedded text layer / vector geometry
 * (word bounding boxes + detected table gridlines), then hand-tuned by trial-and-error
 * against real renders. If the template file is ever replaced/re-exported, re-derive
 * this map before trusting it.
 */

export const PAGE_WIDTH = 612;
export const PAGE_HEIGHT = 936;

/** Checkbox center point. Unlike TextFieldSpec, `y` here is the vertical CENTER
 * of the checkbox (top-based, i.e. distance from top of page), not a text baseline top. */
export interface Point {
  x: number;
  y: number;
}

export interface TextFieldSpec {
  x: number;
  top: number;
  maxWidth: number;
  maxFontSize: number;
  minFontSize: number;
  /** Only 'comments' is multi-line; everything else is single-line. */
  multiline?: boolean;
  maxHeight?: number; // only relevant when multiline
  /** Line spacing multiplier for multiline fields, e.g. 1.15 = tight, 1.5 = airy.
   * Defaults to 1.15 in csmPdfService.ts if omitted. Only relevant when multiline. */
  lineHeightRatio?: number;
}

/** Checkbox center points, keyed by field group -> option value. */
export const CHECKBOXES = {
  clientType: {
    citizen: { x: 95.9, y: 150 } as Point,
    business: { x: 143.0, y: 150 } as Point,
    government: { x: 198.2, y: 150 } as Point,
  },
  sex: {
    male: { x: 206.8, y: 172 } as Point,
    female: { x: 245.6, y: 172 } as Point,
  },
  cc1: {
    1: { x: 82, y: 300.45 } as Point,
    2: { x: 82, y: 313.0 } as Point,
    3: { x: 82, y: 326.7 } as Point,
    4: { x: 82, y: 338.55 } as Point,
  },
  cc2: {
    1: { x: 82, y: 372.7 } as Point,
    2: { x: 82, y: 386.85 } as Point,
    3: { x: 82, y: 396.65 } as Point,
    4: { x: 253.9, y: 373.15 } as Point,
    5: { x: 253.9, y: 386.15 } as Point, // N/A
  },
  cc3: {
    1: { x: 82, y: 432.0 } as Point,
    2: { x: 82, y: 444.6 } as Point,
    3: { x: 216.9, y: 434.15 } as Point,
    4: { x: 217.8, y: 443.7 } as Point, // N/A
  },
} as const;

/** SQD table: 6 answer columns (center-x) x 9 rows (center-y), in points. */
export const SQD_COLUMN_X = {
  "Strongly Disagree": 273.25,
  Disagree: 325.25,
  "Neither Agree nor Disagree": 385.5,
  Agree: 439.5,
  "Strongly Agree": 483.65,
  "Not Applicable": 531.9,
} as const;

export const SQD_ROW_Y: Record<
  "sqd0" | "sqd1" | "sqd2" | "sqd3" | "sqd4" | "sqd5" | "sqd6" | "sqd7" | "sqd8",
  number
> = {
  sqd0: 544.75,
  sqd1: 571.9,
  sqd2: 602.65,
  sqd3: 632.85,
  sqd4: 657.5,
  sqd5: 685.5,
  sqd6: 713.5,
  sqd7: 742.3,
  sqd8: 776.65,
};

/** Free-text field placements. */
export const TEXT_FIELDS: Record<string, TextFieldSpec> = {
  controlNo: { x: 87, top: 16, maxWidth: 60, maxFontSize: 11, minFontSize: 6 },
  date: { x: 68, top: 163.9, maxWidth: 100, maxFontSize: 11, minFontSize: 6 },
  age: { x: 350, top: 165.9, maxWidth: 35, maxFontSize: 11, minFontSize: 6 },
  region: { x: 135, top: 185.5, maxWidth: 100, maxFontSize: 11, minFontSize: 6 },
  service: { x: 333, top: 185.5, maxWidth: 240, maxFontSize: 11, minFontSize: 6 },
  email: { x: 155, top: 870.1, maxWidth: 245, maxFontSize: 11, minFontSize: 6 },
  comments: {
    x: 31,
    top: 825,
    maxWidth: 545,
    maxHeight: 45, // was 35 — too tight to ever show a real line gap; template has
                   // ~54.5pt between the label and the Email row, this leaves a buffer
    maxFontSize: 11,
    minFontSize: 6,
    multiline: true,
    lineHeightRatio: 2, // was tested up to 50/2.5 with no visible change — the old
                          // maxHeight forced font-shrink to compensate for any ratio
                          // increase, canceling it out. With more room, this now
                          // actually widens the gap instead of just shrinking text.
  },
};

/**
 * Office name placeholder area — the template already reserves a box here
 * ("(Insert agency logo here)" / "(Insert agency name here)"), directly above
 * the "HELP US SERVE YOU BETTER!" title. `x` is unused for this field; it's
 * drawn horizontally centered within [boxLeft, boxRight] by csmPdfService.ts.
 */
export const OFFICE_NAME_FIELD = {
  boxLeft: 195.6,
  boxRight: 419.6,
  top: 42, // vertically centered within the box (38.7–76.7)
  maxWidth: 224, // boxRight - boxLeft
  maxFontSize: 22,
  minFontSize: 7,
} as const;