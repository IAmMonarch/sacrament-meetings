import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, formatMeetingType } from '@/lib/format';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-semibold">{formatMeetingDate(meeting.date)}</h2>
        <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-accent">
          {formatMeetingType(meeting.meetingType)}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Presiding: {meeting.presiding} &middot; Conducting: {meeting.conducting}
      </p>
      {meeting.speakers.length > 0 && (
        <p className="mt-1 text-sm text-muted">
          {meeting.speakers.length} speaker{meeting.speakers.length === 1 ? '' : 's'} on the program
        </p>
      )}
    </Link>
  );
}
