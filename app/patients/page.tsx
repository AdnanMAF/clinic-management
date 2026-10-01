   import { PatientList } from "@/features/patients/components/PatientList";

   export default function PatientsPage() {
     return (
       <main>
         <h1 className="p-4 text-2xl font-bold">Data Pasien</h1>
         <PatientList />
       </main>
     );
   }