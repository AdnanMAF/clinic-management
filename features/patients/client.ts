   import type { Patient } from "./types";
   import type { PatientInput } from "./schema";

   export class ApiError extends Error {
     status: number;
     fieldErrors?: Record<string, string>;
     constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
       super(message);
       this.status = status;
       this.fieldErrors = fieldErrors;
     }
   }

   async function request<T>(url: string, init?: RequestInit): Promise<T> {
     const res = await fetch(url, init);
     if (res.status === 204) return undefined as T;
     const data = await res.json().catch(() => null);
     if (!res.ok) {
       throw new ApiError(res.status, data?.error ?? "Terjadi kesalahan", data?.errors);
     }
     return data as T;
   }

   const jsonInit = (method: string, body: unknown): RequestInit => ({
     method,
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(body),
   });

   export const fetchPatients = () =>
     request<Patient[]>("/api/patients", { cache: "no-store" });
   export const fetchPatient = (id: string) =>
     request<Patient>(`/api/patients/${id}`, { cache: "no-store" });
   export const addPatient = (input: PatientInput) =>
     request<Patient>("/api/patients", jsonInit("POST", input));
   export const editPatient = (id: string, input: PatientInput) =>
     request<Patient>(`/api/patients/${id}`, jsonInit("PUT", input));
   export const removePatient = (id: string) =>
     request<void>(`/api/patients/${id}`, { method: "DELETE" });