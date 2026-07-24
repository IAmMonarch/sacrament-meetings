// Authentication will be scaffolded in Week 05.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="mb-6 font-serif text-2xl font-bold">Meeting Admin</p>
      {children}
    </div>
  );
}
