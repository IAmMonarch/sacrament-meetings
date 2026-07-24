'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <h2 className="font-serif text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">
        We couldn&apos;t load the sacrament meetings. Please try again.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
        >
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}
