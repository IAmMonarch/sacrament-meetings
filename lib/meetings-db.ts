import type { SacramentMeeting } from './types';

// Temporary in-memory data store. This will be replaced by a real
// database in a later assignment.
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-06-14',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother Daniel Reyes',
    announcements: [
      'Ward temple trip is scheduled for June 27th.',
      'Youth activity moved to Wednesday this week.',
    ],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'Sister Emily Hansen',
    wardBusiness: [
      { description: 'Release of Sister Maria Lopez as Primary chorister, with a vote of thanks.' },
      { description: 'Sustaining of Brother Tyler Nguyen as new Primary chorister.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "'Tis Sweet to Sing the Matchless Love" },
    speakers: [
      { name: 'Sister Rachel Kim', topic: 'Enduring to the End', type: 'speaker' },
      { name: 'Ward Choir', topic: 'Come, Thou Fount of Every Blessing', type: 'musical-number' },
      { name: 'Brother Mark Whitfield', topic: 'The Power of the Atonement', type: 'speaker' },
    ],
    closingHymn: { number: 85, title: 'How Firm a Foundation' },
    closingPrayer: 'Brother Andrew Palmer',
  },
  {
    id: 2,
    date: '2026-06-21',
    meetingType: 'testimony',
    presiding: 'Bishop James Carter',
    conducting: 'Brother Daniel Reyes',
    announcements: [
      'Fast offerings may be dropped off at the clerk\'s office.',
      'Ward campout is next Friday and Saturday.',
    ],
    openingHymn: { number: 4, title: 'Praise to the Man' },
    openingPrayer: 'Brother Kevin Osei',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [],
    closingHymn: { number: 129, title: 'Do What Is Right' },
    closingPrayer: 'Sister Grace Whitmore',
  },
  {
    id: 3,
    date: '2026-06-28',
    meetingType: 'stake',
    presiding: 'President Robert Anderson',
    conducting: 'President Robert Anderson',
    announcements: ['This week\'s meeting is a broadcast of Stake Conference.'],
    openingHymn: { number: 1, title: 'The Morning Breaks' },
    openingPrayer: 'Sister Olivia Bennett',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'Elder Samuel Whitaker', topic: 'Strengthening Our Stakes', type: 'speaker' },
    ],
    closingHymn: { number: 219, title: 'Should You Feel Inclined to Censure' },
    closingPrayer: 'Brother Thomas Reid',
  },
  {
    id: 4,
    date: '2026-07-05',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother Daniel Reyes',
    announcements: [
      'Primary program practice begins this week.',
      'New meetinghouse library hours posted in the foyer.',
    ],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'Brother Ethan Brooks',
    wardBusiness: [
      { description: 'Baby blessing for Henry David Coleman.' },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 174, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Sister Hannah Foster', topic: 'Family History and Temple Work', type: 'speaker' },
      { name: 'Brother Isaac Delgado', topic: 'How Great Thou Art', type: 'musical-number' },
      { name: 'Bishop James Carter', topic: 'Ministering to One Another', type: 'speaker' },
    ],
    closingHymn: { number: 249, title: 'Called to Serve' },
    closingPrayer: 'Sister Natalie Cho',
  },
  {
    id: 5,
    date: '2026-07-12',
    meetingType: 'regular',
    presiding: 'Bishop James Carter',
    conducting: 'Brother Daniel Reyes',
    announcements: ['Linger longer social following the meeting.'],
    openingHymn: { number: 66, title: 'Rejoice, the Lord Is King!' },
    openingPrayer: 'Brother Caleb Munro',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 197, title: 'Reverently and Meekly Now' },
    speakers: [
      { name: 'Sister Priya Suresh', topic: 'Faith in Christ', type: 'speaker' },
      { name: 'Brother Owen Sinclair', topic: 'Charity Never Faileth', type: 'speaker' },
    ],
    closingHymn: { number: 259, title: 'Choose the Right' },
    closingPrayer: 'Sister Megan Aldridge',
  },
  {
    id: 6,
    date: '2026-04-05',
    meetingType: 'general',
    presiding: 'Bishop James Carter',
    conducting: 'Bishop James Carter',
    announcements: ['This week\'s meeting is a broadcast of General Conference.'],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Brother Samuel Okafor',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 190, title: 'In Remembrance of the Lord' },
    speakers: [],
    closingHymn: { number: 5, title: "High on the Mountain Top" },
    closingPrayer: 'Sister Linda Marsh',
  },
];

export function getMeetings(date?: string): SacramentMeeting[] {
  const sorted = [...meetings].sort((a, b) => a.date.localeCompare(b.date));
  if (!date) return sorted;
  return sorted.filter((meeting) => meeting.date === date);
}

export function getMeetingById(id: number): SacramentMeeting | undefined {
  return meetings.find((meeting) => meeting.id === id);
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

export function getCurrentMeeting(referenceDate: Date = new Date()): SacramentMeeting | undefined {
  const targetDate = getMostRecentSundayISO(referenceDate);
  const upcoming = getMeetings().filter((meeting) => meeting.date <= targetDate);
  return upcoming[upcoming.length - 1];
}
