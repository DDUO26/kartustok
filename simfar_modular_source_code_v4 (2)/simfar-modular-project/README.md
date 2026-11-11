# SIMFAR v4.2 — Arsitektur Kode Modular Profesional (UPTD Puskesmas Silian)

Paket source code ini telah disusun secara **modular dan terpisah per bagian** agar ketika ke depan ada pembaruan fitur, perubahan format dokumen BA, atau penyesuaian tampilan, Anda **hanya perlu mengganti file modul terkait** tanpa harus mengubah keseluruhan kode aplikasi.

## 📁 Struktur Folder & Panduan Pembaruan per Bagian

```text
simfar-modular-project/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                           # Entry point React
    ├── App.tsx                            # Komponen induk perakit modul & state utama
    ├── types/
    │   └── inventory.ts                   # Definisi tipe data Obat, Batch, Transaksi & BA
    ├── data/
    │   └── initialData.ts                 # Data awal Puskesmas Silian, Peran Petugas & Kamus
    ├── components/
    │   └── ArtAndCharts.tsx               # Ilustrasi SVG, Logo SIMFAR & Grafik Spline Stok
    └── services/
        ├── imageOcrParser.ts              # [BAGIAN 1] Mesin Pembaca Foto/JPG BA (Grid Eraser + OCR)
        ├── pdfBastParser.ts               # [BAGIAN 2] Mesin Pembaca PDF BAST (/ToUnicode CMap + Koordinat)
        ├── sheetAndDocParser.ts           # [BAGIAN 3] Mesin Pembaca Excel (.xlsx/.csv) & Word (.docx)
        ├── barcodeAndQrEngine.ts          # [BAGIAN 4] Mesin Barcode 1D (Code-39), QR & Cetak Label Rak
        ├── kfaAndAnalyticsEngine.ts       # [BAGIAN 5] Mesin KFA SatuSehat, Multi-Satuan, RKO & ABC-VEN
        └── supabaseOnlineSync.ts          # [BAGIAN 6] Koneksi Cloud Online & Portal Audit Tim Pemeriksa
```

## 🔧 Bagian Mana yang Harus Diganti Saat Ada Update?

1. **Jika ingin meng-update pembacaan foto/gambar `.JPG` / `.PNG` BA:**
   Cukup edit/ganti file `src/services/imageOcrParser.ts`.
2. **Jika ada format cetak `.PDF` baru dari aplikasi Dinkes / SIAP BMD:**
   Cukup edit/ganti file `src/services/pdfBastParser.ts`.
3. **Jika ada istilah kolom baru pada file Excel (`.xlsx`) atau Word (`.docx`):**
   Cukup edit/ganti file `src/services/sheetAndDocParser.ts`.
4. **Jika ingin mengubah desain cetakan stiker Barcode/QR tempat obat:**
   Cukup edit/ganti file `src/services/barcodeAndQrEngine.ts`.
5. **Jika ingin menghubungkan ke database cloud Supabase untuk Tim Pemeriksa Online:**
   Cukup isi URL & Anon Key di `src/services/supabaseOnlineSync.ts`.

## 🚀 Cara Menjalankan di Komputer Lokal & Deploy ke Vercel

```bash
npm install
npm run dev
```
Untuk meng-online-kan ke Vercel: unggah folder ini ke GitHub lalu hubungkan ke https://vercel.com/solutions/react.
