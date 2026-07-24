'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  function createPageURL(page: number): string {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Meetings pagination" className="mt-6 flex items-center justify-between gap-4">
      {hasPrevious ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
        >
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted opacity-50"
        >
          Previous
        </span>
      )}

      <p className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </p>

      {hasNext ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
        >
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted opacity-50"
        >
          Next
        </span>
      )}
    </nav>
  );
}
