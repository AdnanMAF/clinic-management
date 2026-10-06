"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { validatePatientInput, type PatientInput } from "../schema";
import { ApiError } from "../client";
import Link from "next/link";

type FormValues = {
  medicalRecordNo: string;
  name: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
};

const EMPTY: FormValues = {
  medicalRecordNo: "",
  name: "",
  birthDate: "",
  gender: "",
  phone: "",
  address: "",
};

type Props = {
  initialValues?: PatientInput;
  submitLabel: string;
  onSubmit: (input: PatientInput) => Promise<void>;
};

export function PatientForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const result = validatePatientInput(values);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(result.value);
      // sukses: halaman akan berpindah, tombol sengaja tetap nonaktif
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else if (err instanceof ApiError && err.status === 409) {
        setErrors({ medicalRecordNo: err.message });
      } else {
        setFormError(err instanceof Error ? err.message : "Terjadi kesalahan");
      }
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl p-4">
      <TextField
        label="No. RM"
        name="medicalRecordNo"
        value={values.medicalRecordNo}
        onChange={(v) => setField("medicalRecordNo", v)}
        error={errors.medicalRecordNo}
        required
      />
      <TextField
        label="Nama"
        name="name"
        value={values.name}
        onChange={(v) => setField("name", v)}
        error={errors.name}
        required
      />
      <TextField
        label="Tanggal lahir"
        name="birthDate"
        type="date"
        value={values.birthDate}
        onChange={(v) => setField("birthDate", v)}
        error={errors.birthDate}
        required
      />
      <div className="mb-4">
        <label htmlFor="gender" className="mb-1 block text-sm font-medium">
          Gender<span className="text-red-500"> *</span>
        </label>
        <select
          id="gender"
          value={values.gender}
          onChange={(e) => setField("gender", e.target.value)}
          className="w-full rounded border border-gray-500 bg-transparent px-3 py-2"
        >
          <option value="">Pilih...</option>
          <option value="M">Laki-laki</option>
          <option value="F">Perempuan</option>
        </select>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
        )}
      </div>
      <TextField
        label="Telepon"
        name="phone"
        value={values.phone}
        onChange={(v) => setField("phone", v)}
      />
      <TextField
        label="Alamat"
        name="address"
        value={values.address}
        onChange={(v) => setField("address", v)}
      />
      {formError && <p className="mb-4 text-red-500">{formError}</p>}
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Menyimpan..." : submitLabel}
        </Button>
        <Link href="/patients" className="rounded border border-gray-500 px-4 py-2">
          Batal
        </Link>
      </div>
    </form>
  );
}