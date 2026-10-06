"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { editPatient } from "../client";
import { usePatient } from "../hooks/usePatient";
import { PatientForm } from "./PatientForm";

export function EditPatient({ id }: { id: string }) {
  const router = useRouter();
  const { patient, loading, error, notFound } = usePatient(id);

  const title = patient ? `Ubah Pasien: ${patient.name}` : "Ubah Pasien";
  
  let content: ReactNode;
  if (loading) {
    content = <p className="p-4">Memuat data pasien...</p>;
  } else if (notFound) {
    content = <p className="p-4">Pasien tidak ditemukan.</p>;
  } else if (error || !patient) {
    content = (
      <p className="p-4 text-red-600">
        Gagal memuat data: {error ?? "data kosong"}
      </p>
    );
  } else {
    content = (
      <PatientForm
        initialValues={{
          medicalRecordNo: patient.medicalRecordNo,
          name: patient.name,
          birthDate: patient.birthDate,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address,
        }}
        submitLabel="Simpan perubahan"
        onSubmit={async (input) => {
          await editPatient(id, input);
          router.push("/patients");
        }}
      />
    );
  }
  
  return (
    <>
      <h1 className="p-4 text-2xl font-bold">{title}</h1>
      {content}
    </>
  );
}