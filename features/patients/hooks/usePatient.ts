"use client";

import { useEffect, useState } from "react";
import { ApiError, fetchPatient } from "../client";
import type { Patient } from "../types";

export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetchPatient(id)
      .then((data) => {
        if (cancelled) return;
        setPatient(data);
        setError(null);
        setNotFound(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);
  return { patient, loading, error, notFound };
}