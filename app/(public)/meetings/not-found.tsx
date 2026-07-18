import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <h2 className="font-serif text-xl font-semibold">Meeting Not Found</h2>
      <p className="mt-2 text-sm text-muted">
        We couldn&apos;t find a sacrament meeting with that ID.
      </p>
      <Link href="/meetings" className="mt-4 inline-block text-sm text-accent hover:underline">
        Back to all meetings
      </Link>
    </div>
  );
}
