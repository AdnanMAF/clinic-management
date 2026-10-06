   import { CreatePatient } from "@/features/patients/components/CreatePatient";

   export default function NewPatientPage() {
     return (
       <main>
         <h1 className="p-4 text-2xl font-bold">Tambah Pasien</h1>
         <CreatePatient />
       </main>
     );
   }