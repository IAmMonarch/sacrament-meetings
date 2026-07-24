import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, formatMeetingType } from '@/lib/format';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function HymnLine({ label, hymn }: { label: string; hymn: SacramentMeeting['openingHymn'] }) {
  return (
    <p>
      <span className="font-medium">{label}:</span> #{hymn.number} &ldquo;{hymn.title}&rdquo;
    </p>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  return (
    <article className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 sm:p-8">
      <header className="mb-6 border-b border-border pb-4 text-center">
        <p className="text-sm uppercase tracking-wide text-muted">
          {formatMeetingType(meeting.meetingType)}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold">{formatMeetingDate(meeting.date)}</h1>
        <p className="mt-2 text-sm text-muted">
          Presiding: {meeting.presiding} &middot; Conducting: {meeting.conducting}
        </p>
      </header>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section aria-labelledby="announcements-heading" className="mb-6">
          <h2 id="announcements-heading" className="mb-2 font-serif text-lg font-semibold">
            Announcements
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {meeting.announcements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 space-y-1 text-sm">
        <HymnLine label="Opening Hymn" hymn={meeting.openingHymn} />
        <p>
          <span className="font-medium">Opening Prayer:</span> {meeting.openingPrayer}
        </p>
      </section>

      {meeting.stakeBusiness && (
        <p className="mb-6 rounded-md bg-background px-3 py-2 text-sm font-medium">
          Stake business will be conducted during this meeting.
        </p>
      )}

      {meeting.wardBusiness.length > 0 && (
        <section aria-labelledby="ward-business-heading" className="mb-6">
          <h2 id="ward-business-heading" className="mb-2 font-serif text-lg font-semibold">
            Ward Business
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {meeting.wardBusiness.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 text-sm">
        <HymnLine label="Sacrament Hymn" hymn={meeting.sacramentHymn} />
      </section>

      {meeting.speakers.length > 0 && (
        <section aria-labelledby="program-heading" className="mb-6">
          <h2 id="program-heading" className="mb-2 font-serif text-lg font-semibold">
            Program
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            {meeting.speakers.map((item, index) => (
              <li key={index}>
                <span className="font-medium">{item.name}</span>
                {item.type === 'musical-number' ? ' — Musical Number: ' : ' — '}
                {item.topic}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="space-y-1 text-sm">
        <HymnLine label="Closing Hymn" hymn={meeting.closingHymn} />
        <p>
          <span className="font-medium">Closing Prayer:</span> {meeting.closingPrayer}
        </p>
      </section>
    </article>
  );
}
