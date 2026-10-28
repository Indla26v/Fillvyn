import { NextRequest, NextResponse } from 'next/server';
import { defaultFeedbackRepository } from '@/lib/storage/store';
import { adminAuthService } from '@/lib/admin/adminAuth';

const DATA_URI_PATTERN = /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/i;

export async function GET(req: NextRequest) {
  if (!adminAuthService.isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'ID is required.' }, { status: 400 });
  }

  try {
    const feedback = await defaultFeedbackRepository.findById(id);
    const match = feedback?.imageUrl?.match(DATA_URI_PATTERN);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Image not found.' }, { status: 404 });
    }

    const [, mimeType, base64] = match;
    return new NextResponse(Buffer.from(base64, 'base64'), {
      headers: {
        'Content-Type': mimeType.toLowerCase() === 'image/jpg' ? 'image/jpeg' : mimeType.toLowerCase(),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Admin feedback image error:', err);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
