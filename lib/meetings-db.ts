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

// Mutation functions are stubbed out for now and will be wired to the
// database in Week 04 when the create/edit forms are built.

export async function addMeeting(_meeting: Omit<SacramentMeeting, 'id'>): Promise<SacramentMeeting> {
  throw new Error('addMeeting is not implemented yet.');
}

export async function updateMeeting(
  _id: number,
  _meeting: Partial<Omit<SacramentMeeting, 'id'>>
): Promise<SacramentMeeting> {
  throw new Error('updateMeeting is not implemented yet.');
}

export async function deleteMeeting(_id: number): Promise<void> {
  throw new Error('deleteMeeting is not implemented yet.');
}
