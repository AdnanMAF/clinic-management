   "use client";

   import { useEffect, useState } from "react";
   import { fetchPatients } from "../client";
   import type { Patient } from "../types";

   export function usePatients() {
     const [patients, setPatients] = useState<Patient[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [reloadKey, setReloadKey] = useState(0);

     useEffect(() => {
       let cancelled = false;

       fetchPatients()
         .then((data) => {
           if (cancelled) return;
           setPatients(data);
           setError(null);
         })
         .catch((err: unknown) => {
           if (cancelled) return;
           setError(err instanceof Error ? err.message : "Terjadi kesalahan");
         })
         .finally(() => {
           if (!cancelled) setLoading(false);
         });

       return () => {
         cancelled = true;
       };
     }, [reloadKey]);

     function reload() {
       setLoading(true);
       setReloadKey((k) => k + 1);
     }

     return { patients, loading, error, reload };
   }