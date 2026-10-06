   "use client";

   import { useRouter } from "next/navigation";
   import { addPatient } from "../client";
   import { PatientForm } from "./PatientForm";

   export function CreatePatient() {
     const router = useRouter();

     return (
       <PatientForm
         submitLabel="Simpan"
         onSubmit={async (input) => {
           await addPatient(input);
           router.push("/patients");
         }}
       />
     );
   }