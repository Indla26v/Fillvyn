import { NextRequest, NextResponse } from 'next/server';
import {
  adminAuthService,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from '@/lib/admin/adminAuth';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

const COOKIE_PATH = '/api/admin';

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, authenticated: adminAuthService.isAuthorized(req) });
}

export async function POST(req: NextRequest) {
  const { allowed, retryAfterSeconds } = checkRateLimit(`admin-auth:${getClientIp(req)}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  if (!adminAuthService.isConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Admin access is not configured on this deployment.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { passkey } = body;

    if (!passkey || typeof passkey !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Passkey is required.' },
        { status: 400 }
      );
    }

    const token = adminAuthService.createSessionToken(passkey);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passkey.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true, message: 'Authentication successful.' });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: COOKIE_PATH,
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    console.error('Admin auth error:', err);
    return NextResponse.json(
      { success: false, message: 'Authentication request failed.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true, message: 'Logged out.' });
  res.cookies.set(ADMIN_SESSION_COOKIE, '', { path: COOKIE_PATH, maxAge: 0 });
  return res;
}
