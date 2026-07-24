import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

interface MeetingsPageProps {
  searchParams?: Promise<{ query?: string; page?: string }>;
}

export default async function MeetingsPage({ searchParams }: MeetingsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query ?? '';
  const requestedPage = Number(resolvedSearchParams?.page) || 1;

  const totalPages = await getMeetingsTotalPages(query);
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

  const meetings = await getMeetings(query, currentPage);

  return (
    <div>
      <h1 className="sr-only">All Sacrament Meetings</h1>
      <MeetingSearch />
      <div className="space-y-3">
        {meetings.length > 0 ? (
          meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)
        ) : (
          <p className="text-sm text-muted">No meetings match your search.</p>
        )}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
}
