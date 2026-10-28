/**
 * Admin Authentication Service (SRP)
 * Verifies the admin passkey and issues HMAC-signed, expiring session tokens.
 * The passkey must come from the ADMIN_PASSKEY environment variable; with no
 * passkey configured, admin access is disabled entirely.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'fillvyn_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

const MIN_PASSKEY_LENGTH = 12;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export class AdminAuthService {
  private getPasskey(): string | null {
    const passkey = process.env.ADMIN_PASSKEY?.trim();
    if (!passkey || passkey.length < MIN_PASSKEY_LENGTH) return null;
    return passkey;
  }

  // Signing key is derived from the passkey (or an explicit secret), so rotating
  // the passkey invalidates every existing session.
  private getSigningKey(passkey: string): string {
    return process.env.ADMIN_SESSION_SECRET?.trim() || `fillvyn-admin-session:${passkey}`;
  }

  private sign(payload: string, passkey: string): string {
    return createHmac('sha256', this.getSigningKey(passkey)).update(payload).digest('base64url');
  }

  isConfigured(): boolean {
    return this.getPasskey() !== null;
  }

  verifyPasskey(passkey: string): boolean {
    const expected = this.getPasskey();
    if (!expected || !passkey || typeof passkey !== 'string') return false;
    return safeEqual(passkey.trim(), expected);
  }

  createSessionToken(passkey: string): string | null {
    const expected = this.getPasskey();
    if (!expected || !this.verifyPasskey(passkey)) return null;
    const expiry = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
    const payload = Buffer.from(JSON.stringify({ exp: expiry })).toString('base64url');
    return `${payload}.${this.sign(payload, expected)}`;
  }

  verifySessionToken(token: string | undefined): boolean {
    const expected = this.getPasskey();
    if (!expected || !token) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;
    if (!safeEqual(signature, this.sign(payload, expected))) return false;
    try {
      const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
      return typeof exp === 'number' && Date.now() < exp;
    } catch {
      return false;
    }
  }

  isAuthorized(req: NextRequest): boolean {
    return this.verifySessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  }
}

export const adminAuthService = new AdminAuthService();
