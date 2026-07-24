'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  addMeeting,
  deleteMeeting as deleteMeetingRecord,
  updateMeeting as updateMeetingRecord,
} from './meetings-db';
import type { SacramentMeeting } from './types';

const MEETING_TYPES = ['testimony', 'regular', 'stake', 'general', 'special'] as const;

const SpeakerItemSchema = z.object({
  name: z.string().trim().min(1, 'Speaker name is required.'),
  topic: z.string().trim().min(1, 'Speaker topic is required.'),
  type: z.enum(['speaker', 'musical-number'], { error: 'Select a valid program item type.' }),
});

const MeetingFormSchema = z.object({
  date: z
    .string({ error: 'Date is required.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.'),
  meetingType: z.enum(MEETING_TYPES, { error: 'Select a meeting type.' }),
  presiding: z.string().trim().min(1, 'Presiding is required.'),
  conducting: z.string().trim().min(1, 'Conducting is required.'),
  announcements: z.string().optional(),
  openingHymnNumber: z.coerce
    .number({ error: 'Enter a hymn number.' })
    .int('Hymn number must be a whole number.')
    .positive('Hymn number must be a positive number.'),
  openingHymnTitle: z.string().trim().min(1, 'Hymn title is required.'),
  openingPrayer: z.string().trim().min(1, 'Opening prayer is required.'),
  wardBusiness: z.string().optional(),
  stakeBusiness: z.coerce.boolean().optional(),
  sacramentHymnNumber: z.coerce
    .number({ error: 'Enter a hymn number.' })
    .int('Hymn number must be a whole number.')
    .positive('Hymn number must be a positive number.'),
  sacramentHymnTitle: z.string().trim().min(1, 'Hymn title is required.'),
  speakers: z.string().optional(),
  closingHymnNumber: z.coerce
    .number({ error: 'Enter a hymn number.' })
    .int('Hymn number must be a whole number.')
    .positive('Hymn number must be a positive number.'),
  closingHymnTitle: z.string().trim().min(1, 'Hymn title is required.'),
  closingPrayer: z.string().trim().min(1, 'Closing prayer is required.'),
});

export interface MeetingFormState {
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof MeetingFormSchema>, string[]>>;
}

function readRawFormData(formData: FormData) {
  return {
    date: formData.get('date'),
    meetingType: formData.get('meetingType'),
    presiding: formData.get('presiding'),
    conducting: formData.get('conducting'),
    announcements: formData.get('announcements'),
    openingHymnNumber: formData.get('openingHymnNumber'),
    openingHymnTitle: formData.get('openingHymnTitle'),
    openingPrayer: formData.get('openingPrayer'),
    wardBusiness: formData.get('wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness'),
    sacramentHymnNumber: formData.get('sacramentHymnNumber'),
    sacramentHymnTitle: formData.get('sacramentHymnTitle'),
    speakers: formData.get('speakers'),
    closingHymnNumber: formData.get('closingHymnNumber'),
    closingHymnTitle: formData.get('closingHymnTitle'),
    closingPrayer: formData.get('closingPrayer'),
  };
}

function linesToList(value: string | undefined): string[] {
  return (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function parseSpeakers(raw: string | undefined): SacramentMeeting['speakers'] | { error: string } {
  if (!raw || raw.trim().length === 0) return [];

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { error: 'Speakers could not be read. Please re-add them.' };
  }

  const result = z.array(SpeakerItemSchema).safeParse(parsedJson);
  if (!result.success) {
    return { error: 'One or more speaker entries are incomplete.' };
  }

  return result.data;
}

function buildMeetingInput(data: z.infer<typeof MeetingFormSchema>): Omit<SacramentMeeting, 'id'> | { error: string } {
  const speakers = parseSpeakers(data.speakers);
  if ('error' in speakers) return speakers;

  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: linesToList(data.announcements),
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: linesToList(data.wardBusiness).map((description) => ({ description })),
    stakeBusiness: data.stakeBusiness ?? false,
    sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
    speakers,
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const parsed = MeetingFormSchema.safeParse(readRawFormData(formData));

  if (!parsed.success) {
    return { message: 'Please fix the errors below.', errors: parsed.error.flatten().fieldErrors };
  }

  const meetingInput = buildMeetingInput(parsed.data);
  if ('error' in meetingInput) {
    return { message: 'Please fix the errors below.', errors: { speakers: [meetingInput.error] } };
  }

  try {
    await addMeeting(meetingInput);
  } catch (error) {
    console.error('Failed to create meeting:', error);
    throw new Error('Something went wrong while saving the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const parsed = MeetingFormSchema.safeParse(readRawFormData(formData));

  if (!parsed.success) {
    return { message: 'Please fix the errors below.', errors: parsed.error.flatten().fieldErrors };
  }

  const meetingInput = buildMeetingInput(parsed.data);
  if ('error' in meetingInput) {
    return { message: 'Please fix the errors below.', errors: { speakers: [meetingInput.error] } };
  }

  try {
    await updateMeetingRecord(id, meetingInput);
  } catch (error) {
    console.error('Failed to update meeting:', error);
    throw new Error('Something went wrong while saving the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  try {
    await deleteMeetingRecord(id);
  } catch (error) {
    console.error('Failed to delete meeting:', error);
    throw new Error('Something went wrong while deleting the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}
