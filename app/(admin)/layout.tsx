import Link from 'next/link';

// Authentication will be scaffolded in Week 05.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="font-serif text-2xl font-bold">Meeting Admin</p>
        <Link href="/meetings/manage" className="text-sm font-medium hover:text-accent">
          Manage Meetings
        </Link>
      </div>
      {children}
    </div>
  );
}
