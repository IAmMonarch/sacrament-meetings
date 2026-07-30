import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';
import type { Metadata } from 'next';

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MeetingPageProps): Promise<Metadata> {
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) {
    return {
      title: 'Meeting Not Found',
    };
  }

  const formattedDate = new Date(meeting.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const title = `Program - ${formattedDate}`;
  const description = `Sacrament meeting program for the Maple Grove Ward on ${formattedDate}. Presiding: ${meeting.presiding}, Conducting: ${meeting.conducting}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: meeting.date,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `Sacrament Meeting Program for ${formattedDate}`,
        },
      ],
    },
  };
}

async function getMeeting(id: string): Promise<SacramentMeeting | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings/${id}`, { cache: 'no-store' });

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load meeting.');
  }

  return response.json();
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) {
    notFound();
  }

  return (
    <div>
      <div className="no-print mb-4 flex justify-end">
        <PrintButton />
      </div>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}
