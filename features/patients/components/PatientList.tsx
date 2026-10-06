"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ApiError, removePatient } from "../client";
import { usePatients } from "../hooks/usePatients";
import type { Patient } from "../types";

export function PatientList() {
  const { patients, loading, error, reload } = usePatients();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(patient: Patient) {
    const ok = window.confirm(
      `Hapus pasien ${patient.name} (${patient.medicalRecordNo})? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!ok) return;

    setDeleteError(null);
    setDeletingId(patient.id);
    try {
      await removePatient(patient.id);
      reload();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Gagal menghapus pasien");
      // 404 berarti datanya sudah hilang di tempat lain: segarkan daftar
      if (err instanceof ApiError && err.status === 404) reload();
    } finally {
      setDeletingId(null);
    }
  }

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
      {deleteError && <p className="mb-2 text-red-500">{deleteError}</p>}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">No. RM</th>
            <th>Nama</th>
            <th>Tanggal lahir</th>
            <th>Gender</th>
            <th>Telepon</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.medicalRecordNo}</td>
              <td>{p.name}</td>
              <td>{p.birthDate}</td>
              <td>{p.gender === "M" ? "Laki-laki" : "Perempuan"}</td>
              <td>{p.phone || "-"}</td>
              <td>{p.address || "-"}</td>
              <td className="space-x-2 py-2">
                <Link
                  href={`/patients/${p.id}/edit`}
                  className="rounded border border-gray-500 px-3 py-1"
                >
                  Ubah
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(p)}
                  disabled={deletingId === p.id}
                >
                  {deletingId === p.id ? "Menghapus..." : "Hapus"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}