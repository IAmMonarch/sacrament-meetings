import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from './types';

// Constructed lazily so that importing this module (e.g. during `next build`'s
// page-data collection) doesn't require DATABASE_URL to be set yet.
let sqlClient: NeonQueryFunction<false, false> | undefined;

function sql(): NeonQueryFunction<false, false> {
  sqlClient ??= neon(process.env.DATABASE_URL!);
  return sqlClient;
}

const PAGE_SIZE = 5;

interface MeetingRow {
  id: number;
  date: string | Date;
  meeting_type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  opening_hymn: Hymn;
  opening_prayer: string;
  ward_business: WardBusinessItem[] | null;
  stake_business: boolean;
  sacrament_hymn: Hymn;
  speakers: SpeakerItem[] | null;
  closing_hymn: Hymn;
  closing_prayer: string;
}

function toISODate(value: string | Date): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value.slice(0, 10);
}

function mapRowToMeeting(row: MeetingRow): SacramentMeeting {
  return {
    id: row.id,
    date: toISODate(row.date),
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements ?? [],
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business ?? [],
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers ?? [],
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

const SEARCH_CLAUSE = `
  WHERE presiding ILIKE $1
     OR conducting ILIKE $1
     OR meeting_type ILIKE $1
     OR speakers::text ILIKE $1
`;

/**
 * Returns meetings matching the search query, sorted by most recent first.
 * When `page` is omitted, all matching rows are returned (used by the API).
 */
export async function getMeetings(query: string = '', page?: number): Promise<SacramentMeeting[]> {
  const search = `%${query}%`;
  const params: unknown[] = [search];
  let text = `SELECT * FROM meetings ${SEARCH_CLAUSE} ORDER BY date DESC`;

  if (page !== undefined) {
    params.push(PAGE_SIZE, (page - 1) * PAGE_SIZE);
    text += ` LIMIT $2 OFFSET $3`;
  }

  const rows = (await sql().query(text, params)) as MeetingRow[];
  return rows.map(mapRowToMeeting);
}

export async function getMeetingsTotalPages(query: string = ''): Promise<number> {
  const search = `%${query}%`;
  const rows = (await sql().query(
    `SELECT COUNT(*)::int AS count FROM meetings ${SEARCH_CLAUSE}`,
    [search]
  )) as { count: number }[];

  return Math.max(1, Math.ceil(rows[0].count / PAGE_SIZE));
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | undefined> {
  const rows = (await sql()`SELECT * FROM meetings WHERE id = ${id}`) as MeetingRow[];
  return rows[0] ? mapRowToMeeting(rows[0]) : undefined;
}

export async function getMeetingByDate(date: string): Promise<SacramentMeeting | undefined> {
  const rows = (await sql()`SELECT * FROM meetings WHERE date = ${date}`) as MeetingRow[];
  return rows[0] ? mapRowToMeeting(rows[0]) : undefined;
}

/**
 * Returns the ISO date (YYYY-MM-DD) of the most recent Sunday on or
 * before the given reference date (defaults to today).
 */
export function getMostRecentSundayISO(referenceDate: Date = new Date()): string {
  const date = new Date(referenceDate);
  const dayOfWeek = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - dayOfWeek);
  return date.toISOString().slice(0, 10);
}

export async function getCurrentMeeting(referenceDate: Date = new Date()): Promise<SacramentMeeting | undefined> {
  const targetDate = getMostRecentSundayISO(referenceDate);
  const rows = (await sql()`
    SELECT * FROM meetings WHERE date <= ${targetDate} ORDER BY date DESC LIMIT 1
  `) as MeetingRow[];
  return rows[0] ? mapRowToMeeting(rows[0]) : undefined;
}

export async function addMeeting(meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  const rows = (await sql()`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${meeting.date}, ${meeting.meetingType}, ${meeting.presiding}, ${meeting.conducting}, ${meeting.announcements ?? []},
      ${JSON.stringify(meeting.openingHymn)}::jsonb, ${meeting.openingPrayer}, ${JSON.stringify(meeting.wardBusiness)}::jsonb, ${meeting.stakeBusiness},
      ${JSON.stringify(meeting.sacramentHymn)}::jsonb, ${JSON.stringify(meeting.speakers)}::jsonb, ${JSON.stringify(meeting.closingHymn)}::jsonb, ${meeting.closingPrayer}
    )
    RETURNING *
  `) as MeetingRow[];

  return mapRowToMeeting(rows[0]);
}

const MEETING_COLUMNS: Record<keyof Omit<SacramentMeeting, 'id'>, string> = {
  date: 'date',
  meetingType: 'meeting_type',
  presiding: 'presiding',
  conducting: 'conducting',
  announcements: 'announcements',
  openingHymn: 'opening_hymn',
  openingPrayer: 'opening_prayer',
  wardBusiness: 'ward_business',
  stakeBusiness: 'stake_business',
  sacramentHymn: 'sacrament_hymn',
  speakers: 'speakers',
  closingHymn: 'closing_hymn',
  closingPrayer: 'closing_prayer',
};

const JSONB_COLUMNS = new Set<keyof Omit<SacramentMeeting, 'id'>>([
  'openingHymn',
  'wardBusiness',
  'sacramentHymn',
  'speakers',
  'closingHymn',
]);

export async function updateMeeting(
  id: number,
  meeting: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting> {
  const entries = Object.entries(meeting) as [keyof Omit<SacramentMeeting, 'id'>, unknown][];

  if (entries.length === 0) {
    const existing = await getMeetingById(id);
    if (!existing) throw new Error('Meeting not found.');
    return existing;
  }

  const setClauses: string[] = [];
  const params: unknown[] = [];

  entries.forEach(([key, value]) => {
    const column = MEETING_COLUMNS[key];
    params.push(JSONB_COLUMNS.has(key) ? JSON.stringify(value) : value);
    setClauses.push(JSONB_COLUMNS.has(key) ? `${column} = $${params.length}::jsonb` : `${column} = $${params.length}`);
  });

  params.push(id);

  const rows = (await sql().query(
    `UPDATE meetings SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  )) as MeetingRow[];

  if (rows.length === 0) {
    throw new Error('Meeting not found.');
  }

  return mapRowToMeeting(rows[0]);
}

export async function deleteMeeting(id: number): Promise<void> {
  await sql()`DELETE FROM meetings WHERE id = ${id}`;
}
