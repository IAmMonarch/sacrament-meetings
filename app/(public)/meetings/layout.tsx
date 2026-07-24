import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="font-serif text-2xl font-bold">Sacrament Meetings</p>
        <nav aria-label="Meetings" className="flex gap-4 text-sm">
          <Link href="/meetings" className="hover:text-accent">
            All Meetings
          </Link>
          <Link href="/meetings/current" className="hover:text-accent">
            This Week
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
