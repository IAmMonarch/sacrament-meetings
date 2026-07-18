'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mb-4">
      <label htmlFor="meeting-search" className="sr-only">
        Search meetings by speaker, presiding, conducting, or meeting type
      </label>
      <input
        id="meeting-search"
        type="text"
        placeholder="Search by speaker, presiding, conducting, or meeting type..."
        aria-label="Search meetings by speaker, presiding, conducting, or meeting type"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(event) => handleSearch(event.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent"
      />
    </div>
  );
}
