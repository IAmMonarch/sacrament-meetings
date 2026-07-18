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
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

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
