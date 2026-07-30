'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-foreground transition-colors hover:text-accent cursor-pointer bg-transparent border-none p-0 outline-none"
    >
      Sign Out
    </button>
  );
}
