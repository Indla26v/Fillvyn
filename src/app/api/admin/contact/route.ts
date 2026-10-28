import { NextRequest, NextResponse } from 'next/server';
import { defaultContactRepository } from '@/lib/storage/store';
import { adminAuthService } from '@/lib/admin/adminAuth';
import { CONTACT_STATUSES } from '@/lib/storage/types';


export async function GET(req: NextRequest) {
  if (!adminAuthService.isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const items = await defaultContactRepository.findAll({
      category,
      status,
      search,
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (err) {
    console.error('Admin contact GET error:', err);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!adminAuthService.isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'ID and Status are required.' },
        { status: 400 }
      );
    }

    if (!CONTACT_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status.' }, { status: 400 });
    }

    const updated = await defaultContactRepository.updateStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Admin contact PATCH error:', err);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!adminAuthService.isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required.' }, { status: 400 });
    }

    const deleted = await defaultContactRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Contact not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Contact inquiry deleted successfully.' });
  } catch (err) {
    console.error('Admin contact DELETE error:', err);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
