import Link from 'next/link';
import NavLinks from './NavLinks';

const WARD_NAME = 'Maple Grove Ward';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-xl font-serif font-semibold tracking-tight">
            {WARD_NAME}
          </Link>
          <p className="text-sm text-muted">{today}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
