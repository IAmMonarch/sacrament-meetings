import Link from 'next/link';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import { formatMeetingDate, formatMeetingType } from '@/lib/format';
import { getMeetings } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

export default async function AdminMeetingsPage() {
  const meetings = await getMeetings();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-xl font-semibold">Manage Meetings</h1>
        <Link
          href="/meetings/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent"
        >
          New Meeting
        </Link>
      </div>

      <div className="space-y-3">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
            >
              <div>
                <p className="font-serif text-lg font-semibold">{formatMeetingDate(meeting.date)}</p>
                <p className="text-sm text-muted">{formatMeetingType(meeting.meetingType)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/meetings/${meeting.id}/edit`}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
                >
                  Edit
                </Link>
                <DeleteMeetingButton id={meeting.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No meetings yet.</p>
        )}
      </div>
    </div>
  );
}
