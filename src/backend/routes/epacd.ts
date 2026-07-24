import { Elysia, t } from "elysia";
import nodemailer from "nodemailer";

// EPACD (Electronic Public Assistance Complaints Desk) route
// Receives complaint submissions from the public site and forwards
// them via email to the designated recipient.

const RECIPIENT_EMAIL = "epacd.spc@gmail.com";

// ---- Validation rules -----------------------------------------------
// givenName / surname: required
// middleName / suffix: optional
// address: region/province/city/barangay come from PSGC dropdowns (codes + labels),
//          so they're validated as non-empty strings (selection required), plus
//          an optional free-text street/unit line capped at a sane length.
// contact: exactly 11 digits (PH mobile format, e.g. 09XXXXXXXXX)
// email: optional, max 30 chars
// message: required, max 255 chars

const epacdBody = t.Object({
  givenName: t.String({ minLength: 1, maxLength: 50 }),
  middleName: t.Optional(t.String({ maxLength: 50 })),
  surname: t.String({ minLength: 1, maxLength: 50 }),
  suffix: t.Optional(t.String({ maxLength: 10 })),

  regionCode: t.String({ minLength: 1 }),
  regionName: t.String({ minLength: 1 }),
  provinceCode: t.String({ minLength: 1 }),
  provinceName: t.String({ minLength: 1 }),
  cityCode: t.String({ minLength: 1 }),
  cityName: t.String({ minLength: 1 }),
  barangayCode: t.String({ minLength: 1 }),
  barangayName: t.String({ minLength: 1 }),
  streetName: t.Optional(t.String({ maxLength: 155 })),

  contact: t.String({ minLength: 11, maxLength: 11, pattern: "^[0-9]{11}$" }),
  email: t.Optional(t.String({ maxLength: 50 })),
  message: t.String({ minLength: 1, maxLength: 500 }),
});

// Configure via environment variables. Example for Gmail SMTP:
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=465
// SMTP_SECURE=true
// SMTP_USER=your-sending-address@gmail.com
// SMTP_PASS=app-password  (use a Gmail App Password, not the account password)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildFullName(
  givenName: string,
  middleName: string | undefined,
  surname: string,
  suffix: string | undefined
) {
  const parts = [givenName, middleName, surname, suffix].filter(
    (p) => p && p.trim().length > 0
  );
  return parts.join(" ");
}

function buildFullAddress(fields: {
  streetName?: string;
  barangayName: string;
  cityName: string;
  provinceName: string;
  regionName: string;
}) {
  const parts = [
    fields.streetName,
    fields.barangayName,
    fields.cityName,
    fields.provinceName,
    fields.regionName,
  ].filter((p) => p && p.trim().length > 0);
  return parts.join(", ");
}

export const epacdRoutes = new Elysia({ prefix: "/epacd" }).post(
  "/",
  async ({ body, set }) => {
    const {
      givenName,
      middleName,
      surname,
      suffix,
      regionName,
      provinceName,
      cityName,
      barangayName,
      streetName,
      contact,
      email,
      message,
    } = body;

    const fullName = buildFullName(givenName, middleName, surname, suffix);
    const fullAddress = buildFullAddress({
      streetName,
      barangayName,
      cityName,
      provinceName,
      regionName,
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#047857;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h2 style="color:#ffffff;margin:0;font-size:18px;">
            EPACD Submission — City Government of San Pablo
          </h2>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
            <tr>
              <td style="padding:8px 0;font-weight:600;width:120px;vertical-align:top;">Name</td>
              <td style="padding:8px 0;">${escapeHtml(fullName)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;vertical-align:top;">Address</td>
              <td style="padding:8px 0;">${escapeHtml(fullAddress)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;vertical-align:top;">Contact No.</td>
              <td style="padding:8px 0;">${escapeHtml(contact)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;vertical-align:top;">Email</td>
              <td style="padding:8px 0;">${email ? escapeHtml(email) : "—"}</td>
            </tr>
          </table>
          <div style="margin-top:16px;">
            <p style="font-weight:600;font-size:14px;color:#111827;margin:0 0 6px;">Mensahe</p>
            <p style="white-space:pre-wrap;font-size:14px;color:#374151;line-height:1.6;margin:0;">${escapeHtml(
              message
            )}</p>
          </div>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: RECIPIENT_EMAIL,
        replyTo: email && email.length > 0 ? email : undefined,
        subject: `EPACD Complaint — ${fullName}`,
        html,
      });

      return { success: true, message: "Complaint sent successfully." };
    } catch (err) {
      console.error("EPACD email send failed:", err);
      set.status = 500;
      return {
        success: false,
        message: "Failed to send complaint. Please try again later.",
      };
    }
  },
  { body: epacdBody }
);