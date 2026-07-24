'use client';

import { useActionState, useId, useState } from 'react';
import type { MeetingFormState } from '@/lib/actions';
import type { MeetingType, SacramentMeeting, SpeakerItem } from '@/lib/types';

interface MeetingFormProps {
  action: (prevState: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

const MEETING_TYPE_OPTIONS: { value: MeetingType; label: string }[] = [
  { value: 'regular', label: 'Sacrament Meeting' },
  { value: 'testimony', label: 'Testimony Meeting' },
  { value: 'stake', label: 'Stake Conference' },
  { value: 'general', label: 'General Conference' },
  { value: 'special', label: 'Special Meeting' },
];

const initialState: MeetingFormState = {};

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} aria-live="polite" className="mt-1 text-xs text-red-600">
      {message ?? ''}
    </p>
  );
}

const inputClasses =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent';
const labelClasses = 'mb-1 block text-sm font-medium';
const fieldsetClasses = 'mb-6 space-y-4 rounded-lg border border-border p-4';
const legendClasses = 'px-1 font-serif text-lg font-semibold';

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [speakers, setSpeakers] = useState<SpeakerItem[]>(meeting?.speakers ?? []);
  const formId = useId();

  function addSpeaker() {
    setSpeakers((current) => [...current, { name: '', topic: '', type: 'speaker' }]);
  }

  function removeSpeaker(index: number) {
    setSpeakers((current) => current.filter((_, i) => i !== index));
  }

  function updateSpeaker(index: number, patch: Partial<SpeakerItem>) {
    setSpeakers((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="speakers" value={JSON.stringify(speakers)} />

      {state.message && (
        <p aria-live="polite" className="mb-4 rounded-md bg-background px-3 py-2 text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}

      <fieldset className={fieldsetClasses}>
        <legend className={legendClasses}>Meeting Details</legend>

        <div>
          <label htmlFor={`${formId}-date`} className={labelClasses}>
            Date
          </label>
          <input
            id={`${formId}-date`}
            name="date"
            type="date"
            defaultValue={meeting?.date}
            aria-describedby={`${formId}-date-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-date-error`} message={state.errors?.date?.[0]} />
        </div>

        <div>
          <label htmlFor={`${formId}-meetingType`} className={labelClasses}>
            Meeting Type
          </label>
          <select
            id={`${formId}-meetingType`}
            name="meetingType"
            defaultValue={meeting?.meetingType ?? 'regular'}
            aria-describedby={`${formId}-meetingType-error`}
            className={inputClasses}
          >
            {MEETING_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError id={`${formId}-meetingType-error`} message={state.errors?.meetingType?.[0]} />
        </div>

        <div>
          <label htmlFor={`${formId}-presiding`} className={labelClasses}>
            Presiding
          </label>
          <input
            id={`${formId}-presiding`}
            name="presiding"
            type="text"
            defaultValue={meeting?.presiding}
            aria-describedby={`${formId}-presiding-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-presiding-error`} message={state.errors?.presiding?.[0]} />
        </div>

        <div>
          <label htmlFor={`${formId}-conducting`} className={labelClasses}>
            Conducting
          </label>
          <input
            id={`${formId}-conducting`}
            name="conducting"
            type="text"
            defaultValue={meeting?.conducting}
            aria-describedby={`${formId}-conducting-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-conducting-error`} message={state.errors?.conducting?.[0]} />
        </div>

        <div>
          <label htmlFor={`${formId}-announcements`} className={labelClasses}>
            Announcements (one per line)
          </label>
          <textarea
            id={`${formId}-announcements`}
            name="announcements"
            rows={3}
            defaultValue={meeting?.announcements?.join('\n')}
            aria-describedby={`${formId}-announcements-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-announcements-error`} message={state.errors?.announcements?.[0]} />
        </div>

        <div className="flex items-center gap-2">
          <input
            id={`${formId}-stakeBusiness`}
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={meeting?.stakeBusiness}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor={`${formId}-stakeBusiness`} className="text-sm font-medium">
            Stake business will be conducted
          </label>
        </div>

        <div>
          <label htmlFor={`${formId}-wardBusiness`} className={labelClasses}>
            Ward Business (one item per line)
          </label>
          <textarea
            id={`${formId}-wardBusiness`}
            name="wardBusiness"
            rows={3}
            defaultValue={meeting?.wardBusiness.map((item) => item.description).join('\n')}
            aria-describedby={`${formId}-wardBusiness-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-wardBusiness-error`} message={state.errors?.wardBusiness?.[0]} />
        </div>
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className={legendClasses}>Opening</legend>

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label htmlFor={`${formId}-openingHymnNumber`} className={labelClasses}>
              Hymn #
            </label>
            <input
              id={`${formId}-openingHymnNumber`}
              name="openingHymnNumber"
              type="number"
              min={1}
              defaultValue={meeting?.openingHymn.number}
              aria-describedby={`${formId}-openingHymnNumber-error`}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-openingHymnTitle`} className={labelClasses}>
              Hymn Title
            </label>
            <input
              id={`${formId}-openingHymnTitle`}
              name="openingHymnTitle"
              type="text"
              defaultValue={meeting?.openingHymn.title}
              aria-describedby={`${formId}-openingHymnTitle-error`}
              className={inputClasses}
            />
          </div>
        </div>
        <FieldError id={`${formId}-openingHymnNumber-error`} message={state.errors?.openingHymnNumber?.[0]} />
        <FieldError id={`${formId}-openingHymnTitle-error`} message={state.errors?.openingHymnTitle?.[0]} />

        <div>
          <label htmlFor={`${formId}-openingPrayer`} className={labelClasses}>
            Opening Prayer
          </label>
          <input
            id={`${formId}-openingPrayer`}
            name="openingPrayer"
            type="text"
            defaultValue={meeting?.openingPrayer}
            aria-describedby={`${formId}-openingPrayer-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-openingPrayer-error`} message={state.errors?.openingPrayer?.[0]} />
        </div>
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className={legendClasses}>Sacrament</legend>

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label htmlFor={`${formId}-sacramentHymnNumber`} className={labelClasses}>
              Hymn #
            </label>
            <input
              id={`${formId}-sacramentHymnNumber`}
              name="sacramentHymnNumber"
              type="number"
              min={1}
              defaultValue={meeting?.sacramentHymn.number}
              aria-describedby={`${formId}-sacramentHymnNumber-error`}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-sacramentHymnTitle`} className={labelClasses}>
              Hymn Title
            </label>
            <input
              id={`${formId}-sacramentHymnTitle`}
              name="sacramentHymnTitle"
              type="text"
              defaultValue={meeting?.sacramentHymn.title}
              aria-describedby={`${formId}-sacramentHymnTitle-error`}
              className={inputClasses}
            />
          </div>
        </div>
        <FieldError id={`${formId}-sacramentHymnNumber-error`} message={state.errors?.sacramentHymnNumber?.[0]} />
        <FieldError id={`${formId}-sacramentHymnTitle-error`} message={state.errors?.sacramentHymnTitle?.[0]} />
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className={legendClasses}>Program</legend>

        <div id={`${formId}-speakers-error`} aria-live="polite" className="text-xs text-red-600">
          {state.errors?.speakers?.[0] ?? ''}
        </div>

        <div className="space-y-3">
          {speakers.map((speaker, index) => (
            <div key={index} className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSpeaker(index)}
                  className="text-xs text-accent hover:underline"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <label htmlFor={`${formId}-speaker-${index}-name`} className={labelClasses}>
                    Name
                  </label>
                  <input
                    id={`${formId}-speaker-${index}-name`}
                    type="text"
                    value={speaker.name}
                    onChange={(event) => updateSpeaker(index, { name: event.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-speaker-${index}-topic`} className={labelClasses}>
                    Topic
                  </label>
                  <input
                    id={`${formId}-speaker-${index}-topic`}
                    type="text"
                    value={speaker.topic}
                    onChange={(event) => updateSpeaker(index, { topic: event.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-speaker-${index}-type`} className={labelClasses}>
                    Type
                  </label>
                  <select
                    id={`${formId}-speaker-${index}-type`}
                    value={speaker.type}
                    onChange={(event) =>
                      updateSpeaker(index, { type: event.target.value as SpeakerItem['type'] })
                    }
                    className={inputClasses}
                  >
                    <option value="speaker">Speaker</option>
                    <option value="musical-number">Musical Number</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSpeaker}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background focus-visible:outline-2 focus-visible:outline-accent"
        >
          Add Program Item
        </button>
      </fieldset>

      <fieldset className={fieldsetClasses}>
        <legend className={legendClasses}>Closing</legend>

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label htmlFor={`${formId}-closingHymnNumber`} className={labelClasses}>
              Hymn #
            </label>
            <input
              id={`${formId}-closingHymnNumber`}
              name="closingHymnNumber"
              type="number"
              min={1}
              defaultValue={meeting?.closingHymn.number}
              aria-describedby={`${formId}-closingHymnNumber-error`}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-closingHymnTitle`} className={labelClasses}>
              Hymn Title
            </label>
            <input
              id={`${formId}-closingHymnTitle`}
              name="closingHymnTitle"
              type="text"
              defaultValue={meeting?.closingHymn.title}
              aria-describedby={`${formId}-closingHymnTitle-error`}
              className={inputClasses}
            />
          </div>
        </div>
        <FieldError id={`${formId}-closingHymnNumber-error`} message={state.errors?.closingHymnNumber?.[0]} />
        <FieldError id={`${formId}-closingHymnTitle-error`} message={state.errors?.closingHymnTitle?.[0]} />

        <div>
          <label htmlFor={`${formId}-closingPrayer`} className={labelClasses}>
            Closing Prayer
          </label>
          <input
            id={`${formId}-closingPrayer`}
            name="closingPrayer"
            type="text"
            defaultValue={meeting?.closingPrayer}
            aria-describedby={`${formId}-closingPrayer-error`}
            className={inputClasses}
          />
          <FieldError id={`${formId}-closingPrayer-error`} message={state.errors?.closingPrayer?.[0]} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
