import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export default function NewMeetingPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-xl font-semibold">Create Meeting</h1>
      <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
    </div>
  );
}
