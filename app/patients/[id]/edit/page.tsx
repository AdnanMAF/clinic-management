import { EditPatient } from "@/features/patients/components/EditPatient";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <EditPatient key={id} id={id} />
    </main>
  );
}