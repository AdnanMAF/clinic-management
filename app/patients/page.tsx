   import Link from "next/link";
   import { PatientList } from "@/features/patients/components/PatientList";

   export default function PatientsPage() {
     return (
       <main>
         <div className="flex items-center justify-between p-4">
           <h1 className="text-2xl font-bold">Data Pasien</h1>
           <Link
             href="/patients/new"
             className="rounded bg-blue-600 px-4 py-2 text-white"
           >
             Tambah pasien
           </Link>
         </div>
         <PatientList />
       </main>
     );
   }