   "use client";

   import { usePatients } from "../hooks/usePatients";

   export function PatientList() {
     const { patients, loading, error, reload } = usePatients();

     if (loading) {
       return <p className="p-4">Memuat data pasien...</p>;
     }

     if (error) {
       return (
         <div className="p-4">
           <p className="text-red-600">Gagal memuat data: {error}</p>
           <button onClick={reload} className="mt-2 rounded border px-3 py-1">
             Coba lagi
           </button>
         </div>
       );
     }

     if (patients.length === 0) {
       return <p className="p-4">Belum ada data pasien.</p>;
     }

     return (
       <div className="p-4">
         <table className="w-full border-collapse text-left">
           <thead>
             <tr className="border-b">
               <th className="py-2">No. RM</th>
               <th>Nama</th>
               <th>Tanggal lahir</th>
               <th>Gender</th>
               <th>Telepon</th>
             </tr>
           </thead>
           <tbody>
             {patients.map((p) => (
               <tr key={p.id} className="border-b">
                 <td className="py-2">{p.medicalRecordNo}</td>
                 <td>{p.name}</td>
                 <td>{p.birthDate}</td>
                 <td>{p.gender === "M" ? "Laki-laki" : "Perempuan"}</td>
                 <td>{p.phone}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }