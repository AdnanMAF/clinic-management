import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCollection, updateCollection } from "@/server/db";
import { validatePatientInput } from "@/features/patients/schema";
import type { Patient } from "@/features/patients/types";

export async function GET() {
  const patients = await getCollection<Patient>("patients");
  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body bukan JSON valid" },
      { status: 400 },
    );
  }

  const result = validatePatientInput(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  // Cek duplikat HARUS di dalam updateCollection, supaya cek dan tulis
  // terjadi dalam satu antrean. Cek di luar bisa lolos dua kali saat
  // dua request datang bersamaan.
  const outcome: { patient?: Patient } = {};
  await updateCollection<Patient>("patients", (items) => {
    if (items.some((p) => p.medicalRecordNo === result.value.medicalRecordNo)) {
      return items;
    }
    outcome.patient = { id: randomUUID(), ...result.value };
    return [...items, outcome.patient];
  });

  if (!outcome.patient) {
    return NextResponse.json({ error: "No. RM sudah dipakai" }, { status: 409 });
  }
  return NextResponse.json(outcome.patient, { status: 201 });
}