export default function MeetingsLoading() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading meetings">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg border border-border bg-surface"
        />
      ))}
    </div>
  );
}
