import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const languagesSnapshot = await getDocs(collection(db, 'languages'));
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    return NextResponse.json({
      ok: true,
      languages: languagesSnapshot.size,
      categories: categoriesSnapshot.size,
    });
  } catch (error) {
    const err = error as { code?: string; message?: string; name?: string };

    return NextResponse.json(
      {
        ok: false,
        name: err?.name ?? 'UnknownError',
        code: err?.code ?? null,
        message: err?.message ?? String(error),
      },
      { status: 500 }
    );
  }
}
