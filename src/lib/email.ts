/**
 * Minimal compatible email utility for FixMate
 * Uses existing infrastructure check — no new third-party provider
 * Currently no working email transport configured, reports what is missing
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Checks if email transport env vars are configured
 */
function getMissingEnvVars(): string[] {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
  ];
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  return missing;
}

/**
 * Minimal sendEmail implementation
 * - Does NOT use Resend, Brevo, or other new providers per assignment restriction
 * - Checks for SMTP env vars, throws clear error if missing so Better Auth can handle delivery failure
 * - If env vars present and nodemailer is available (already part of existing utility), would send via nodemailer
 * - Currently no nodemailer installed and no SMTP env vars, so reports missing transport
 * - Never logs passwords, tokens, or reset URLs
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject } = options;

  // Never log sensitive content like reset URL or token
  // Only log non-sensitive metadata for debugging
  console.log(`[FixMate Email] Attempting to send email to ${to} with subject "${subject}"`);

  const missing = getMissingEnvVars();
  if (missing.length > 0) {
    const message = `Email transport not configured. Missing environment variables: ${missing.join(", ")}. Required for real email delivery: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM. Currently no working email transport exists.`;
    console.error(`[FixMate Email] ${message}`);
    // Throw so Better Auth can handle delivery failure correctly (do not silently swallow)
    throw new Error(message);
  }

  // If we reach here, SMTP env vars are present
  // Check if nodemailer is available (would be part of existing utility if previously installed)
  let nodemailer: any;
  try {
    // Dynamic import to avoid hard dependency if not installed
    // @ts-ignore - nodemailer may not be installed, handled via try-catch
    nodemailer = await import("nodemailer");
  } catch {
    const message =
      "Nodemailer not installed and no existing email utility found. Email transport requires nodemailer or existing email infrastructure. Install nodemailer or configure existing transport.";
    console.error(`[FixMate Email] ${message}`);
    throw new Error(message);
  }

  // If nodemailer is available, create transporter and send
  // This uses existing SMTP env vars, no new provider
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Never include password/token/URL in logs
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`[FixMate Email] Email sent successfully to ${to}`);
  } catch (err: any) {
    console.error(`[FixMate Email] Failed to send email to ${to}: ${err.message}`);
    // Do not swallow, let Better Auth handle
    throw err;
  }
}
