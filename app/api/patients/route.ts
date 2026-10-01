import { NextResponse } from "next/server";
import { validatePatientInput } from "@/features/patients/schema";
import { listPatients, createPatient } from "@/features/patients/repository";

export async function GET() {
  return NextResponse.json(await listPatients());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body bukan JSON valid" }, { status: 400 });
  }

  const parsed = validatePatientInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  }

  const created = await createPatient(parsed.value);
  if (!created.ok) {
    return NextResponse.json({ error: "No. RM sudah dipakai" }, { status: 409 });
  }
  return NextResponse.json(created.value, { status: 201 });
}