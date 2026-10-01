import type { Patient } from "./types";

export type PatientInput = Omit<Patient, "id">;

export type ValidationResult =
  | { ok: true; value: PatientInput }
  | { ok: false; errors: Record<string, string> };

export function validatePatientInput(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: { body: "Body harus berupa objek JSON" } };
  }
  const data = input as Record<string, unknown>;
  const str = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";

  const medicalRecordNo = str("medicalRecordNo");
  const name = str("name");
  const birthDate = str("birthDate");
  const phone = str("phone");
  const address = str("address");
  const gender = data.gender;

  const errors: Record<string, string> = {};

  if (!medicalRecordNo) errors.medicalRecordNo = "Wajib diisi";
  if (!name) errors.name = "Wajib diisi";
  if (gender !== "M" && gender !== "F") errors.gender = "Harus M atau F";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    errors.birthDate = "Format harus YYYY-MM-DD";
  } else {
    const parsed = new Date(birthDate + "T00:00:00Z");
    const isRealDate =
      !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === birthDate; // menolak 2024-02-31
    const today = new Date().toISOString().slice(0, 10);
    if (!isRealDate) errors.birthDate = "Tanggal tidak valid";
    else if (birthDate > today) errors.birthDate = "Tidak boleh di masa depan";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      medicalRecordNo,
      name,
      birthDate,
      gender: gender as "M" | "F",
      phone,
      address,
    },
  };
}