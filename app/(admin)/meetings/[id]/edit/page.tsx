interface EditMeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage({ params }: EditMeetingPageProps) {
  const { id } = await params;
  return (
    <h1 className="font-serif text-xl font-semibold">
      Edit Meeting {id} — Coming in Week 04
    </h1>
  );
}
