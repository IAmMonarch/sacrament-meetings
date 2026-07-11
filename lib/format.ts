import type { MeetingType } from './types';

const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  testimony: 'Testimony Meeting',
  regular: 'Sacrament Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};

export function formatMeetingType(type: MeetingType): string {
  return MEETING_TYPE_LABELS[type];
}

export function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
