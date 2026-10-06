# Clinic Management

Aplikasi manajemen klinik sederhana: pendataan pasien, obat, dan jadwal dokter.

> Status: dalam pengerjaan. Modul Pasien sudah berfungsi penuh.
> Data yang dipakai hanya data fiktif. Jangan gunakan data pasien sungguhan.

## Fitur saat ini

- Daftar pasien dengan keadaan memuat, kosong, dan error
- Tambah, ubah, dan hapus pasien (dengan konfirmasi hapus)
- Validasi input di browser dan di server
- REST API untuk pasien, diuji manual dengan skenario kasus tepi

## Tumpukan teknologi

Next.js 16, React, TypeScript, Tailwind CSS. Penyimpanan berupa file JSON di server.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000/patients. File `data/db.json` dibuat otomatis dari
`server/seed.json` saat pertama kali dibutuhkan. Hapus file itu untuk mengembalikan data awal.

## API pasien

| Metode | Path | Hasil |
|---|---|---|
| GET | `/api/patients` | 200, daftar pasien |
| POST | `/api/patients` | 201; 400 input tidak valid; 409 No. RM duplikat |
| GET | `/api/patients/[id]` | 200; 404 |
| PUT | `/api/patients/[id]` | 200 (mengganti seluruh data); 400; 404; 409 |
| DELETE | `/api/patients/[id]` | 204; 404 |

## Struktur folder

```
app/          # hanya routing: halaman dan route handler
components/   # UI generik yang tidak tahu domain (Button, TextField)
features/     # satu folder per domain (patients: types, schema, repository, client, hooks, components)
server/       # akses data (db.ts) dan data awal (seed.json)
data/         # data runtime, tidak di-commit
```

## Keputusan desain

- **Berbasis fitur.** Kode per domain berada di `features/<domain>`, sehingga modul baru tidak menyentuh modul lain.
- **Validasi satu sumber.** `schema.ts` murni (tanpa `fs` atau Next) dan dipakai di browser dan server. Server tetap memvalidasi ulang.
- **Batas client/server.** `repository.ts` dan `db.ts` memakai `server-only`. Kode server yang tidak sengaja ter-import ke client akan gagal saat build.
- **Lapisan data bisa diganti.** Komponen hanya bicara lewat REST API. Mengganti file JSON dengan database cukup mengubah `server/db.ts`.
- **Pengecekan duplikat atomik.** Cek No. RM dan penulisan terjadi dalam satu antrean penulisan, dan file ditulis lewat file sementara lalu `rename`.

## Keterbatasan yang diketahui

- Penyimpanan JSON hanya aman untuk satu proses Node. Bukan pengganti database.
- Belum ada autentikasi.
- Belum ada tes otomatis. Pengujian masih manual.
- Telepon dan format No. RM belum divalidasi. Batas "tanggal lahir di masa depan" memakai UTC.

## Rencana

- [x] API dan UI Pasien (daftar, tambah, ubah, hapus)
- [ ] Sidebar dan tata letak aplikasi
- [ ] Pencarian pasien
- [ ] Modul Obat (stok, kedaluwarsa)
- [ ] Modul Dokter
- [ ] Modul Jadwal dokter dengan deteksi jadwal bentrok
- [ ] Dashboard ringkasan
- [ ] Tes otomatis untuk fungsi validasi
- [ ] Migrasi penyimpanan ke database