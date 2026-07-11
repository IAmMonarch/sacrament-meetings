import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

async function getAllMeetings(): Promise<SacramentMeeting[]> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to load meetings.');
  }

  return response.json();
}

export default async function MeetingsPage() {
  const meetings = await getAllMeetings();
  const sortedByRecent = [...meetings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="sr-only">All Sacrament Meetings</h1>
      <div className="space-y-3">
        {sortedByRecent.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
}
