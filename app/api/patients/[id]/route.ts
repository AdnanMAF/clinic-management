import { NextResponse } from "next/server";
import { validatePatientInput } from "@/features/patients/schema";
import {
  getPatient,
  deletePatient,
  updatePatient,
} from "@/features/patients/repository";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const patient = await getPatient(id);
  if (!patient) {
    return NextResponse.json({ error: "Pasien tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json(patient);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const found = await deletePatient(id);
  if (!found) {
    return NextResponse.json({ error: "Pasien tidak ditemukan" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;

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

  const updated = await updatePatient(id, parsed.value);
  if (!updated.ok) {
    if (updated.reason === "not_found") {
      return NextResponse.json({ error: "Pasien tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "No. RM sudah dipakai" }, { status: 409 });
  }
  return NextResponse.json(updated.value);
}