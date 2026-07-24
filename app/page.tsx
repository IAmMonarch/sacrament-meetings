import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="grid gap-8 sm:grid-cols-2 sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Sacrament Meeting Planner
          </h1>
          <p className="mt-4 text-muted">
            Plan, manage, and review sacrament meeting agendas from week to
            week. Track announcements, prayers, ward business, hymns, musical
            numbers, and speakers &mdash; then share or print the program for
            any Sunday.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/meetings/current"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              View This Week&apos;s Program
            </Link>
            <Link
              href="/meetings"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Browse All Meetings
            </Link>
          </div>
        </div>
        <Image
          src="/chapel-hero.png"
          alt="Illustration of a meetinghouse chapel with a steeple at sunrise"
          width={960}
          height={540}
          unoptimized
          className="w-full rounded-lg border border-border"
          priority
        />
      </section>
    </div>
  );
}
