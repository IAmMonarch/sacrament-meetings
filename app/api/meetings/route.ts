import { NextRequest, NextResponse } from 'next/server';
import { getMeetingByDate, getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse<SacramentMeeting[]>> {
  const date = request.nextUrl.searchParams.get('date') ?? undefined;

  if (date) {
    const meeting = await getMeetingByDate(date);
    return NextResponse.json(meeting ? [meeting] : []);
  }

  const meetings = await getMeetings();
  return NextResponse.json(meetings);
}
