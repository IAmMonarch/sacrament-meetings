'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';

export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/meetings', label: 'All Meetings' },
    { href: '/meetings/current', label: 'This Week' },
  ];

  if (isLoggedIn) {
    links.push({ href: '/meetings/manage', label: 'Manage' });
  }

  return (
    <nav aria-label="Primary" className="flex items-center gap-4">
      {links.map((link) => {
        const isActive =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`text-sm font-medium transition-colors hover:text-accent ${
              isActive
                ? 'text-accent underline underline-offset-4'
                : 'text-foreground'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      {isLoggedIn ? (
        <SignOutButton />
      ) : (
        <Link
          href="/login"
          className={`text-sm font-medium transition-colors hover:text-accent ${
            pathname === '/login'
              ? 'text-accent underline underline-offset-4'
              : 'text-foreground'
          }`}
        >
          Sign In
        </Link>
      )}
    </nav>
  );
}

