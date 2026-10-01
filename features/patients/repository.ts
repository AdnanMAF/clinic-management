import "server-only";
import { randomUUID } from "node:crypto";
import { getCollection, updateCollection } from "@/server/db";
import type { PatientInput } from "./schema";
import type { Patient } from "./types";

const COLLECTION = "patients";

export type RepoResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "duplicate" | "not_found" };

export function listPatients(): Promise<Patient[]> {
  return getCollection<Patient>(COLLECTION);
}

export async function getPatient(id: string): Promise<Patient | null> {
  const items = await getCollection<Patient>(COLLECTION);
  return items.find((p) => p.id === id) ?? null;
}

export async function createPatient(
  input: PatientInput,
): Promise<RepoResult<Patient>> {
  let result: RepoResult<Patient> = { ok: false, reason: "duplicate" };
  await updateCollection<Patient>(COLLECTION, (items) => {
    if (items.some((p) => p.medicalRecordNo === input.medicalRecordNo)) {
      return items;
    }
    const patient: Patient = { id: randomUUID(), ...input };
    result = { ok: true, value: patient };
    return [...items, patient];
  });
  return result;
}

export async function updatePatient(
  id: string,
  input: PatientInput,
): Promise<RepoResult<Patient>> {
  let result: RepoResult<Patient> = { ok: false, reason: "not_found" };
  await updateCollection<Patient>(COLLECTION, (items) => {
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) return items;
    // No. RM boleh sama dengan miliknya sendiri, tidak boleh sama dengan pasien lain
    if (items.some((p) => p.id !== id && p.medicalRecordNo === input.medicalRecordNo)) {
      result = { ok: false, reason: "duplicate" };
      return items;
    }
    const updated: Patient = { id, ...input };
    result = { ok: true, value: updated };
    return items.map((p, i) => (i === index ? updated : p));
  });
  return result;
}

export async function deletePatient(id: string): Promise<boolean> {
  let found = false;
  await updateCollection<Patient>(COLLECTION, (items) => {
    found = items.some((p) => p.id === id);
    return found ? items.filter((p) => p.id !== id) : items;
  });
  return found;
}