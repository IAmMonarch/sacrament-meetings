'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Sign in to manage the sacrament meeting schedule
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="bishop@example.com"
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-semibold uppercase tracking-wider text-muted"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            minLength={6}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-lg border border-red-200/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:border-red-500/10"
          >
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <button
          disabled={isPending}
          type="submit"
          className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin text-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}
