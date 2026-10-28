import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './rateLimit';

/** Hidden form field that real visitors never fill in; bots that auto-fill every input do. */
export const HONEYPOT_FIELD = 'website';

const SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Returns a response to send instead of processing the submission, or null to continue.
 */
export function guardPublicSubmission(
  req: NextRequest,
  formName: string,
  body: Record<string, unknown>
): NextResponse | null {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `${formName}:${getClientIp(req)}`,
    SUBMISSIONS_PER_WINDOW,
    WINDOW_MS
  );
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many submissions. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  // Answer bots with a normal-looking success so they don't adapt, but store nothing.
  const honeypot = body[HONEYPOT_FIELD];
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return NextResponse.json({ success: true, message: 'Thank you for your submission.' });
  }

  return null;
}
