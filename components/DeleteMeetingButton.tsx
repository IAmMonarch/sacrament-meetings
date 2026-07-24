'use client';

import { deleteMeeting } from '@/lib/actions';

export default function DeleteMeetingButton({ id }: { id: number }) {
  return (
    <form
      action={deleteMeeting.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm('Delete this meeting? This cannot be undone.')) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
      >
        Delete
      </button>
    </form>
  );
}
