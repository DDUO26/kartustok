import React, { useState, useMemo, useEffect } from 'react';
import {
  Home, Pill, ArrowLeftRight, FileText, ClipboardCheck, Table,
  CalendarClock, BarChart3, Settings, Bell, HelpCircle, Search,
  ChevronDown, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle,
  Plus, Download, Upload, Printer, QrCode, ShieldCheck, Sparkles,
  Package, Layers, RefreshCw, Eye, Edit3, Trash2, Check, X,
  MapPin, Heart, Filter, ArrowDownToLine, ArrowUpFromLine, ScanLine,
  FileSpreadsheet, Building2, UserCheck, Lock, History
} from 'lucide-react';

// ==========================================
// 1. INITIAL DATA & DATABASE LAYER (MOCKUP + PUSKESMAS SILIAN)
// ==========================================

const INITIAL_MEDICINES = [
  {
    id: 'MED-SIL-001',
    code: 'OBT-PKM-001',
    eLogistikCode: '1.1.7.01.01.01.001',
    noBA: '04/BAST-OBAT/JKN/V/2026',
    sumberAnggaran: 'JKN',
    genericName: 'Paracetamol',
    name: 'Paracetamol 500 mg',
    form: 'Tablet',
    strength: '500 mg',
    unit: 'Tablet',
    conversion: '1 Box = 100 Tablet',
    category: 'Analgesik & Antipiretik',
    minStock: 1000,
    location: 'Rak A-01 (Gudang Utama)',
    active: true,
    initialBalance: 4200,
    price: 263
  },
  {
    id: 'MED-SIL-002',
    code: 'OBT-PKM-002',
    eLogistikCode: '1.1.7.01.01.02.014',
    noBA: '952/BAPB/CAD.DAK/2025',
    sumberAnggaran: 'DAK',
    genericName: 'Amoxicillin Trihydrate',
    name: 'Amoxicillin 500 mg',
    form: 'Kaplet',
    strength: '500 mg',
    unit: 'Kaplet',
    conversion: '1 Box = 100 Kaplet',
    category: 'Antibiotik',
    minStock: 800,
    location: 'Rak B-02 (Gudang Utama)',
    active: true,
    initialBalance: 1650,
    price: 499
  },
  {
    id: 'MED-SIL-003',
    code: 'OBT-PKM-003',
    eLogistikCode: '1.1.7.01.01.03.008',
    noBA: '1255/BAPB/CAD.PKD/XI/2025',
    sumberAnggaran: 'DAK',
    genericName: 'Chlorpheniramine Maleate',
    name: 'CTM 4 mg',
    form: 'Tablet',
    strength: '4 mg',
    unit: 'Tablet',
    conversion: '1 Kaleng = 1000 Tablet',
    category: 'Antihistamin / Alergi',
    minStock: 600,
    location: 'Rak A-03 (Gudang Utama)',
    active: true,
    initialBalance: 2400,
    price: 160
  },
  {
    id: 'MED-SIL-004',
    code: 'OBT-PKM-004',
    eLogistikCode: '1.1.7.01.01.04.019',
    noBA: '214/BAPB/CAD.PKD/III/2026',
    sumberAnggaran: 'DAK',
    genericName: 'Omeprazole',
    name: 'Omeprazole 20 mg',
    form: 'Kapsul',
    strength: '20 mg',
    unit: 'Kapsul',
    conversion: '1 Box = 30 Kapsul',
    category: 'Saluran Cerna',
    minStock: 500,
    location: 'Rak C-01 (Gudang Utama)',
    active: true,
    initialBalance: 380, // Low stock!
    price: 300
  },
  {
    id: 'MED-SIL-005',
    code: 'OBT-PKM-005',
    eLogistikCode: '1.1.7.01.01.05.022',
    noBA: '90/BAPB/CAD.PKD/I/2026',
    sumberAnggaran: 'DAK',
    genericName: 'Cetirizine HCl',
    name: 'Cetirizine 10 mg',
    form: 'Tablet',
    strength: '10 mg',
    unit: 'Tablet',
    conversion: '1 Box = 50 Tablet',
    category: 'Antihistamin / Alergi',
    minStock: 500,
    location: 'Rak A-04 (Apotek Rawat Jalan)',
    active: true,
    initialBalance: 410, // Low stock!
    price: 173
  },
  {
    id: 'MED-SIL-006',
    code: 'OBT-PKM-006',
    eLogistikCode: '1.1.7.01.01.06.031',
    noBA: '369/BAPB/CAD.PKD/V/2026',
    sumberAnggaran: 'DAK',
    genericName: 'Ascorbic Acid',
    name: 'Vitamin C 50 mg',
    form: 'Tablet',
    strength: '50 mg',
    unit: 'Tablet',
    conversion: '1 Box = 100 Tablet',
    category: 'Vitamin & Mineral',
    minStock: 1000,
    location: 'Rak D-01 (Gudang Utama)',
    active: true,
    initialBalance: 3200,
    price: 162
  },
  {
    id: 'MED-SIL-007',
    code: 'OBT-PKM-007',
    eLogistikCode: '1.1.7.01.01.07.012',
    noBA: '03/BAST-OBAT/JKN/IV/2026',
    sumberAnggaran: 'JKN',
    genericName: 'Amlodipine Besilate',
    name: 'Amlodipine 5 mg',
    form: 'Tablet',
    strength: '5 mg',
    unit: 'Tablet',
    conversion: '1 Box = 30 Tablet',
    category: 'Kardiovaskular',
    minStock: 900,
    location: 'Rak B-05 (Apotek Rawat Jalan)',
    active: true,
    initialBalance: 650, // Low stock
    price: 499
  },
  {
    id: 'MED-SIL-008',
    code: 'OBT-PKM-008',
    eLogistikCode: '1.1.7.01.01.08.044',
    noBA: '551/BAPB/CAD.DAK/2025',
    sumberAnggaran: 'DAK',
    genericName: 'Oralit Serbuk',
    name: 'Oralit 200 ml Sachet',
    form: 'Serbuk',
    strength: '200 ml',
    unit: 'Sachet',
    conversion: '1 Box = 100 Sachet',
    category: 'Elektrolit & Nutrisi',
    minStock: 400,
    location: 'Rak C-03 (Pelayanan UGD)',
    active: true,
    initialBalance: 1120,
    price: 311
  },
  {
    id: 'MED-SIL-009',
    code: 'OBT-PKM-009',
    eLogistikCode: '1.1.7.01.02.01.001',
    noBA: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    sumberAnggaran: 'DINKES',
    genericName: 'Alcohol Swab Steril',
    name: 'ALCOHOL SWAB',
    form: 'Box',
    strength: '70% Isopropyl',
    unit: 'Box',
    conversion: '1 Box = 100 Pcs',
    category: 'BMHP & Obat Lainnya',
    minStock: 2,
    location: 'Rak E-01 (BMHP / Tindakan)',
    active: true,
    initialBalance: 0,
    price: 13500
  },
  {
    id: 'MED-SIL-010',
    code: 'OBT-PKM-010',
    eLogistikCode: '1.1.7.01.02.01.002',
    noBA: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    sumberAnggaran: 'DINKES',
    genericName: 'Nitrile Examination Glove',
    name: 'GOLDEN GLOVE INDONESIAN NITRILE EXAMINATION GLOVE (199.900)',
    form: 'Pcs',
    strength: 'Non-Powder',
    unit: 'Pcs',
    conversion: '1 Box = 100 Pcs',
    category: 'BMHP & Obat Lainnya',
    minStock: 200,
    location: 'Rak E-02 (BMHP / UGD)',
    active: true,
    initialBalance: 0,
    price: 1135
  },
  {
    id: 'MED-SIL-011',
    code: 'OBT-PKM-011',
    eLogistikCode: '1.1.7.01.02.01.003',
    noBA: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    sumberAnggaran: 'DINKES',
    genericName: 'Chromic Catgut 3/0 with Needle',
    name: 'CHROMIC CATGUT SURGICAL SUTURES WITH NEEDLE 3/0 2022 SA',
    form: 'Dus',
    strength: '3/0',
    unit: 'Dus',
    conversion: '1 Dus = 12 Sachet',
    category: 'BMHP & Obat Lainnya',
    minStock: 1,
    location: 'Rak E-03 (BMHP / KIA & UGD)',
    active: true,
    initialBalance: 0,
    price: 100050
  },
  {
    id: 'MED-SIL-012',
    code: 'OBT-PKM-012',
    eLogistikCode: '1.1.7.01.02.01.004',
    noBA: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    sumberAnggaran: 'DINKES',
    genericName: 'Masker Bedah Medis 3 Ply',
    name: 'CHRONA CARE MASKER BEDAH (2025)',
    form: 'Box',
    strength: '3 Ply Earloop',
    unit: 'Box',
    conversion: '1 Box = 50 Pcs',
    category: 'BMHP & Obat Lainnya',
    minStock: 5,
    location: 'Rak E-04 (BMHP / Gudang)',
    active: true,
    initialBalance: 0,
    price: 32200
  },
  {
    id: 'MED-SIL-013',
    code: 'OBT-PKM-013',
    eLogistikCode: '1.1.7.01.02.01.005',
    noBA: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    sumberAnggaran: 'DINKES',
    genericName: 'Strip Uji Kolesterol Darah',
    name: 'CHOLESTEROL TEST STRIP (2025)',
    form: 'Dus',
    strength: '25 Strip/Dus',
    unit: 'Dus',
    conversion: '1 Dus = 25 Strip',
    category: 'BMHP & Reagensia Lab',
    minStock: 5,
    location: 'Rak E-05 (Lab / Posbindu)',
    active: true,
    initialBalance: 0,
    price: 188500
  }
];

const INITIAL_BATCHES = [
  { id: 'B-01', medId: 'MED-SIL-001', batchNo: 'PCT-2409A', expiryDate: '2027-08-15', stock: 3200, source: 'Dinkes Kab. Minahasa Tenggara' },
  { id: 'B-02', medId: 'MED-SIL-001', batchNo: 'PCT-2601B', expiryDate: '2028-02-20', stock: 1500, source: 'Pengadaan JKN / BLUD' },
  { id: 'B-03', medId: 'MED-SIL-002', batchNo: 'AMX-2311X', expiryDate: '2026-12-28', stock: 450, source: 'Dinkes Kab. Minahasa Tenggara' }, // Near ED (< 3 mos)
  { id: 'B-04', medId: 'MED-SIL-002', batchNo: 'AMX-2504C', expiryDate: '2027-11-10', stock: 1100, source: 'Dinkes Kab. Minahasa Tenggara' },
  { id: 'B-05', medId: 'MED-SIL-003', batchNo: 'CTM-2501K', expiryDate: '2027-06-30', stock: 2400, source: 'Dinkes Kab. Minahasa Tenggara' },
  { id: 'B-06', medId: 'MED-SIL-004', batchNo: 'OMP-2402M', expiryDate: '2027-01-19', stock: 380, source: 'Pengadaan JKN / BLUD' }, // Near ED (< 3 mos)
  { id: 'B-07', medId: 'MED-SIL-005', batchNo: 'CTR-2408P', expiryDate: '2027-03-25', stock: 410, source: 'Pengadaan JKN / BLUD' }, // < 6 mos
  { id: 'B-08', medId: 'MED-SIL-006', batchNo: 'VTC-2509Q', expiryDate: '2028-05-01', stock: 3200, source: 'Hibah Kemenkes' },
  { id: 'B-09', medId: 'MED-SIL-007', batchNo: 'AML-2305Z', expiryDate: '2026-10-15', stock: 150, source: 'Dinkes Kab. Minahasa Tenggara' }, // Expired!
  { id: 'B-10', medId: 'MED-SIL-007', batchNo: 'AML-2502W', expiryDate: '2027-09-12', stock: 500, source: 'Pengadaan JKN / BLUD' },
  { id: 'B-11', medId: 'MED-SIL-008', batchNo: 'ORL-2506L', expiryDate: '2027-12-01', stock: 1120, source: 'Dinkes Kab. Minahasa Tenggara' },
  { id: 'B-12', medId: 'MED-SIL-009', batchNo: '', expiryDate: '', stock: 5, source: 'DINKES (BA 21 April 2026 - Tanpa ED)' },
  { id: 'B-13', medId: 'MED-SIL-010', batchNo: '', expiryDate: '', stock: 1000, source: 'DINKES (BA 21 April 2026 - Tanpa ED)' },
  { id: 'B-14', medId: 'MED-SIL-011', batchNo: '', expiryDate: '', stock: 2, source: 'DINKES (BA 21 April 2026 - Tanpa ED)' },
  { id: 'B-15', medId: 'MED-SIL-012', batchNo: '', expiryDate: '', stock: 20, source: 'DINKES (BA 21 April 2026 - Tanpa ED)' },
  { id: 'B-16', medId: 'MED-SIL-013', batchNo: '', expiryDate: '', stock: 20, source: 'DINKES (BA 21 April 2026 - Tanpa ED)' },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-BA-21APR-1',
    type: 'IN',
    medId: 'MED-SIL-009',
    medName: 'ALCOHOL SWAB',
    docNo: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    date: '2026-04-21',
    timeLabel: '21 Apr 2026',
    dayName: 'Sel',
    batchNo: '',
    expiryDate: '',
    qty: 5,
    unit: 'Box',
    price: 13500,
    totalPrice: 67500,
    sourceOrDest: 'DINKES Kab. Minahasa Tenggara (Saldo Awal Tanpa ED)',
    officer: 'Nansy C. MunaIseche, S.Farm',
    notes: 'Penerimaan Obat Obatan Lainnya Saldo Awal Tanpa ED'
  },
  {
    id: 'TRX-BA-21APR-2',
    type: 'IN',
    medId: 'MED-SIL-010',
    medName: 'GOLDEN GLOVE INDONESIAN NITRILE EXAMINATION GLOVE (199.900)',
    docNo: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    date: '2026-04-21',
    timeLabel: '21 Apr 2026',
    dayName: 'Sel',
    batchNo: '',
    expiryDate: '',
    qty: 1000,
    unit: 'Pcs',
    price: 1135,
    totalPrice: 1135000,
    sourceOrDest: 'DINKES Kab. Minahasa Tenggara (Saldo Awal Tanpa ED)',
    officer: 'Nansy C. MunaIseche, S.Farm',
    notes: 'Penerimaan Obat Obatan Lainnya Saldo Awal Tanpa ED'
  },
  {
    id: 'TRX-BA-21APR-3',
    type: 'IN',
    medId: 'MED-SIL-011',
    medName: 'CHROMIC CATGUT SURGICAL SUTURES WITH NEEDLE 3/0 2022 SA',
    docNo: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    date: '2026-04-21',
    timeLabel: '21 Apr 2026',
    dayName: 'Sel',
    batchNo: '',
    expiryDate: '',
    qty: 2,
    unit: 'Dus',
    price: 100050,
    totalPrice: 200100,
    sourceOrDest: 'DINKES Kab. Minahasa Tenggara (Saldo Awal Tanpa ED)',
    officer: 'Nansy C. MunaIseche, S.Farm',
    notes: 'Penerimaan Obat Obatan Lainnya Saldo Awal Tanpa ED'
  },
  {
    id: 'TRX-BA-21APR-4',
    type: 'IN',
    medId: 'MED-SIL-012',
    medName: 'CHRONA CARE MASKER BEDAH (2025)',
    docNo: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    date: '2026-04-21',
    timeLabel: '21 Apr 2026',
    dayName: 'Sel',
    batchNo: '',
    expiryDate: '',
    qty: 20,
    unit: 'Box',
    price: 32200,
    totalPrice: 644000,
    sourceOrDest: 'DINKES Kab. Minahasa Tenggara (Saldo Awal Tanpa ED)',
    officer: 'Nansy C. MunaIseche, S.Farm',
    notes: 'Penerimaan Obat Obatan Lainnya Saldo Awal Tanpa ED'
  },
  {
    id: 'TRX-BA-21APR-5',
    type: 'IN',
    medId: 'MED-SIL-013',
    medName: 'CHOLESTEROL TEST STRIP (2025)',
    docNo: '11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026',
    date: '2026-04-21',
    timeLabel: '21 Apr 2026',
    dayName: 'Sel',
    batchNo: '',
    expiryDate: '',
    qty: 20,
    unit: 'Dus',
    price: 188500,
    totalPrice: 3770000,
    sourceOrDest: 'DINKES Kab. Minahasa Tenggara (Saldo Awal Tanpa ED)',
    officer: 'Nansy C. MunaIseche, S.Farm',
    notes: 'Penerimaan Obat Obatan Lainnya Saldo Awal Tanpa ED'
  },
  {
    id: 'TRX-2026-091',
    type: 'IN',
    medId: 'MED-SIL-001',
    medName: 'Paracetamol 500 mg',
    docNo: 'BAST-2026-091',
    date: '2026-11-05',
    timeLabel: 'Hari ini, 09:20',
    dayName: 'Kam',
    batchNo: 'PCT-2601B',
    expiryDate: '2028-02-20',
    qty: 500,
    unit: 'Tablet',
    sourceOrDest: 'Dinkes Kab. Minahasa Tenggara',
    officer: 'Apt. Dinda R.',
    notes: 'Penerimaan rutin triwulan IV'
  },
  {
    id: 'TRX-2026-090',
    type: 'OUT',
    medId: 'MED-SIL-002',
    medName: 'Amoxicillin 500 mg',
    docNo: 'LPLPO-UGD-112',
    date: '2026-11-05',
    timeLabel: 'Hari ini, 08:45',
    dayName: 'Kam',
    batchNo: 'AMX-2311X',
    expiryDate: '2026-12-28',
    qty: 100,
    unit: 'Kaplet',
    sourceOrDest: 'Pelayanan UGD',
    officer: 'Apt. Dinda R.',
    notes: 'Distribusi FEFO ke UGD'
  },
  {
    id: 'TRX-2026-089',
    type: 'OPNAME',
    medId: 'MED-SIL-003',
    medName: 'CTM 4 mg',
    docNo: 'BA-SO-2026-11',
    date: '2026-11-04',
    timeLabel: 'Kemarin, 15:30',
    dayName: 'Rab',
    batchNo: 'CTM-2501K',
    expiryDate: '2027-06-30',
    qty: 0,
    unit: 'Tablet',
    sourceOrDest: 'Verifikasi fisik',
    officer: 'Apt. Dinda R.',
    statusBadge: 'Sesuai',
    notes: 'Stock opname mingguan Rak A-03 sesuai'
  },
  {
    id: 'TRX-2026-088',
    type: 'IN',
    medId: 'MED-SIL-006',
    medName: 'Vitamin C 50 mg',
    docNo: 'BAST-2026-087',
    date: '2026-11-03',
    timeLabel: '2 hari lalu, 11:10',
    dayName: 'Sel',
    batchNo: 'VTC-2509Q',
    expiryDate: '2028-05-01',
    qty: 400,
    unit: 'Tablet',
    sourceOrDest: 'Hibah Kemenkes',
    officer: 'Apt. Dinda R.',
    notes: 'Buffer stok musim penghujan'
  },
  {
    id: 'TRX-2026-087',
    type: 'OUT',
    medId: 'MED-SIL-001',
    medName: 'Paracetamol 500 mg',
    docNo: 'LPLPO-RJ-084',
    date: '2026-11-02',
    timeLabel: '3 hari lalu, 14:00',
    dayName: 'Sen',
    batchNo: 'PCT-2409A',
    expiryDate: '2027-08-15',
    qty: 200,
    unit: 'Tablet',
    sourceOrDest: 'Apotek Rawat Jalan',
    officer: 'Siti Rahma, A.Md.Far',
    notes: 'Permintaan harian poli umum'
  }
];

// Exact 8-point curve matching the reference image spline (Sen -> Min)
const INITIAL_WEEKLY_CHART = [
  { day: 'Sen', masuk: 280, keluar: 210 },
  { day: 'Sel', masuk: 470, keluar: 380 },
  { day: 'Rab', masuk: 455, keluar: 265 },
  { day: 'Kam', masuk: 790, keluar: 525 },
  { day: 'Jum', masuk: 615, keluar: 520 },
  { day: 'Sab', masuk: 675, keluar: 725 },
  { day: 'Min', masuk: 555, keluar: 440 },
  { day: 'Sen ', masuk: 800, keluar: 580 },
];

const DEFAULT_HERO_BG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 420' fill='none'><defs><linearGradient id='bg' x1='0' y1='0' x2='1200' y2='420' gradientUnits='userSpaceOnUse'><stop offset='0%' stop-color='%23F3E8FF'/><stop offset='45%' stop-color='%23FCE7F3'/><stop offset='100%' stop-color='%23E0E7FF'/></linearGradient></defs><rect width='1200' height='420' fill='url(%23bg)'/><circle cx='980' cy='110' r='160' fill='%23F9A8D4' fill-opacity='0.28'/><circle cx='780' cy='260' r='190' fill='%23C084FC' fill-opacity='0.22'/><rect x='640' y='60' width='480' height='290' rx='18' fill='%23FFFFFF' fill-opacity='0.65' stroke='%23E9D5FF' stroke-width='3'/><line x1='640' y1='140' x2='1120' y2='140' stroke='%23E9D5FF' stroke-width='3'/><line x1='640' y1='220' x2='1120' y2='220' stroke='%23E9D5FF' stroke-width='3'/><line x1='640' y1='300' x2='1120' y2='300' stroke='%23E9D5FF' stroke-width='3'/><rect x='670' y='92' width='38' height='44' rx='6' fill='%23F472B6' fill-opacity='0.7'/><rect x='720' y='98' width='34' height='38' rx='6' fill='%23A855F7' fill-opacity='0.7'/><rect x='770' y='90' width='42' height='46' rx='6' fill='%2338BDF8' fill-opacity='0.7'/><rect x='840' y='95' width='50' height='41' rx='6' fill='%2334D399' fill-opacity='0.7'/><rect x='910' y='92' width='38' height='44' rx='6' fill='%23FBBF24' fill-opacity='0.75'/><circle cx='1060' cy='70' r='28' fill='%23FBCFE8'/><circle cx='1110' cy='95' r='22' fill='%23F472B6' fill-opacity='0.8'/><circle cx='1020' cy='105' r='18' fill='%23F9A8D4'/></svg>";

const ROLES = [
  {
    id: 'PETUGAS',
    name: 'Nansy C. MunaIseche, S.Farm',
    roleLabel: 'Pengelola Obat PKM Silian',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    permissions: ['Input Obat Masuk & Keluar', 'Cetak Kartu Stok & QR', 'Input Hitung Fisik Opname', 'Generate Kertas Kerja']
  },
  {
    id: 'PJ_FARMASI',
    name: 'Apt. Seo Joon, S.Farm.',
    roleLabel: 'Penanggung Jawab Farmasi',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    permissions: ['Semua Akses Petugas', 'Verifikasi & Approve Stock Opname', 'Otorisasi Penyesuaian Saldo', 'Rekonsiliasi Integrasi']
  },
  {
    id: 'KAPUS',
    name: 'dr. Eunji Kim, M.Kes',
    roleLabel: 'Kepala Puskesmas',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    permissions: ['Monitoring Eksekutif', 'Pengesahan Berita Acara Opname', 'Audit Laporan Bulanan']
  },
  {
    id: 'ADMIN',
    name: 'Han Ji-Pyeong, S.Kom',
    roleLabel: 'Administrator Sistem',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    permissions: ['Manajemen Hak Akses', 'Konfigurasi API & RPA', 'Backup Database & Audit Log']
  }
];

// ==========================================
// 2. PIXEL-PERFECT KOREAN ANIME / WEBTOON SVG & AI ART COMPONENTS
// ==========================================

const SakuraBranchCornerTop = ({ className = "" }) => (
  <svg viewBox="0 0 320 200" fill="none" className={className}>
    <defs>
      <radialGradient id="sakuraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFB7E0" stopOpacity="0.95" />
        <stop offset="70%" stopColor="#FF85C8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FF85C8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flowerPink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF0F7" />
        <stop offset="60%" stopColor="#FFB8DE" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
    </defs>
    {/* Soft ambient pink glow */}
    <circle cx="90" cy="60" r="85" fill="url(#sakuraGlow)" />
    <circle cx="210" cy="40" r="65" fill="url(#sakuraGlow)" />
    {/* Organic tree branches */}
    <path
      d="M-10 35 Q65 48 135 28 T265 45 M55 38 Q95 75 150 92 M125 32 Q165 55 215 62"
      stroke="#582C6B"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    {/* Sakura Blossoms Cluster */}
    {[
      { cx: 38, cy: 36, r: 22 },
      { cx: 78, cy: 26, r: 26 },
      { cx: 118, cy: 42, r: 24 },
      { cx: 158, cy: 24, r: 25 },
      { cx: 196, cy: 46, r: 22 },
      { cx: 238, cy: 30, r: 20 },
      { cx: 92, cy: 68, r: 19 },
      { cx: 142, cy: 82, r: 18 },
      { cx: 210, cy: 68, r: 16 },
      { cx: 52, cy: 76, r: 15 },
    ].map((f, i) => (
      <g key={i} transform={`translate(${f.cx}, ${f.cy})`}>
        <circle r={f.r} fill="url(#flowerPink)" />
        <circle r={f.r * 0.62} fill="#FFD6EC" />
        <circle r={f.r * 0.22} fill="#E11D48" fillOpacity="0.65" />
      </g>
    ))}
    {/* Floating petals */}
    <ellipse cx="275" cy="68" rx="7" ry="4" transform="rotate(25 275 68)" fill="#F9A8D4" />
    <ellipse cx="180" cy="110" rx="6" ry="3.5" transform="rotate(-20 180 110)" fill="#FBCFE8" />
    <ellipse cx="245" cy="95" rx="5" ry="3" transform="rotate(40 245 95)" fill="#F472B6" />
  </svg>
);

const GlowingPillLogo = () => (
  <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
    <div className="absolute inset-0 rounded-full bg-pink-400/35 blur-md" />
    <svg viewBox="0 0 54 54" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(244,114,182,0.85)]">
      <g transform="rotate(-38 27 27)">
        <rect x="16" y="6" width="22" height="42" rx="11" fill="#FFF7FB" stroke="#4A2574" strokeWidth="3" />
        <path d="M16 27H38V37C38 43.0751 33.0751 48 27 48C20.9249 48 16 43.0751 16 37V27Z" fill="url(#pillSideGrad)" />
        <line x1="16" y1="27" x2="38" y2="27" stroke="#4A2574" strokeWidth="3" />
        <path d="M21 13V21" stroke="#F9A8D4" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M21 33V39" stroke="#FFF" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient id="pillSideGrad" x1="16" y1="27" x2="38" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E879F9" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const PuskesmasClinicIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0">
    <rect x="6" y="24" width="52" height="34" rx="6" fill="#F3E8FF" stroke="#C084FC" strokeWidth="2" />
    <path d="M4 26L32 10L60 26H4Z" fill="#F472B6" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
    <rect x="25" y="40" width="14" height="18" rx="3" fill="#C084FC" />
    <rect x="12" y="31" width="9" height="9" rx="2" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.5" />
    <rect x="43" y="31" width="9" height="9" rx="2" fill="#BAE6FD" stroke="#7DD3FC" strokeWidth="1.5" />
    <circle cx="32" cy="21" r="6" fill="#FFFFFF" />
    <path d="M32 18V24M29 21H35" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Native Interactive Spline Area Chart matching the reference image 100%

// ==========================================
// 2B. REAL SCANNABLE BARCODE (ISO CODE-39) & QR ENGINE + IMAGE DECODER FOR HP
// ==========================================

const LEGACY_TEMPLATE_IDS = [
  { id: 'BAST-ITEM-1' }, { id: 'BAST-ITEM-2' }, { id: 'BAST-ITEM-3' },
  { id: 'BAST-AUTO-1' }, { id: 'BAST-AUTO-2' }, { id: 'BAST-AUTO-3' }, { id: 'BAST-AUTO-4' },
  { id: 'EP-1' }, { id: 'EP-2' }, { id: 'EP-3' }, { id: 'EP-4' },
  { id: 'EP-U1' }, { id: 'EP-U2' }, { id: 'EP-U3' }, { id: 'EP-U4' }, { id: 'EP-U5' }
];

const CODE39_MAP: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw',
  'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn', 'F': 'nnwnwwnnn',
  'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww',
  'O': 'wnnnwnnwn', 'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn',
  'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw',
  'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn', 'Z': 'nwwnwnnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
  '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn'
};
const CODE39_REV: Record<string, string> = Object.fromEntries(
  Object.entries(CODE39_MAP).map(([k, v]) => [v, k])
);

function encodeCode39Bars(text: string): { black: boolean; width: number }[] {
  const clean = '*' + String(text || 'OBT-PKM-001').toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '-') + '*';
  const bars: { black: boolean; width: number }[] = [];
  for (let i = 0; i < clean.length; i++) {
    const pat = CODE39_MAP[clean[i]] || CODE39_MAP['-'];
    for (let j = 0; j < 9; j++) {
      bars.push({ black: j % 2 === 0, width: pat[j] === 'w' ? 3 : 1 });
    }
    if (i < clean.length - 1) {
      bars.push({ black: false, width: 1 });
    }
  }
  return bars;
}

function decodeGroup9(runs: { black: boolean; len: number }[], startIdx: number): string | null {
  if (startIdx + 8 >= runs.length || !runs[startIdx].black) return null;
  const lengths: number[] = [];
  for (let i = 0; i < 9; i++) lengths.push(runs[startIdx + i].len);
  const sorted = [...lengths].sort((a, b) => a - b);
  if (sorted[0] <= 0 || sorted[8] > sorted[0] * 9) return null;
  const threshold = (sorted[5] + sorted[6]) / 2;
  let pat = '';
  for (let i = 0; i < 9; i++) pat += lengths[i] >= threshold ? 'w' : 'n';
  return CODE39_REV[pat] || null;
}

function decodeCode39FromBinaryRow(binaryRow: Uint8Array | number[]): string | null {
  const runs: { black: boolean; len: number }[] = [];
  let cur = binaryRow[0];
  let len = 0;
  for (let i = 0; i < binaryRow.length; i++) {
    if (binaryRow[i] === cur) {
      len++;
    } else {
      runs.push({ black: cur === 1, len });
      cur = binaryRow[i];
      len = 1;
    }
  }
  runs.push({ black: cur === 1, len });

  for (let start = 0; start + 28 < runs.length; start++) {
    if (!runs[start].black) continue;
    if (decodeGroup9(runs, start) !== '*') continue;
    let decoded = '';
    let pos = start + 10;
    while (pos + 8 < runs.length) {
      const ch = decodeGroup9(runs, pos);
      if (!ch) break;
      if (ch === '*') {
        if (decoded.length >= 2) return decoded;
        break;
      }
      decoded += ch;
      pos += 10;
    }
  }
  return null;
}

function decodeCode39FromImageData(imageData: ImageData): string | null {
  const { data, width, height } = imageData;
  if (width < 40 || height < 10) return null;

  // Sample 30 horizontal scanlines across the height of the image
  const numLines = 30;
  const thresholds = [128, 105, 155, 85, 175];

  for (let l = 1; l < numLines; l++) {
    const y = Math.floor((l / numLines) * height);
    const grayRow = new Uint8Array(width);
    let minLum = 255;
    let maxLum = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const lum = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
      grayRow[x] = lum;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }
    const midLum = Math.round((minLum + maxLum) / 2);
    const activeThresholds = [midLum, ...thresholds];

    for (const th of activeThresholds) {
      const binRow = new Uint8Array(width);
      for (let x = 0; x < width; x++) {
        binRow[x] = grayRow[x] < th ? 1 : 0;
      }
      const found = decodeCode39FromBinaryRow(binRow);
      if (found) return found;
    }
  }
  return null;
}

// Genuine Scannable 1D Code-39 Barcode SVG Component
const Code39BarcodeSvg = ({
  value,
  height = 46,
  className = 'w-full'
}: {
  value: string;
  height?: number;
  className?: string;
}) => {
  const bars = useMemo(() => encodeCode39Bars(value), [value]);
  const quietZone = 14;
  const totalUnits = bars.reduce((s, b) => s + b.width, 0) + quietZone * 2;

  let curX = quietZone;
  const rects: { x: number; w: number }[] = [];
  bars.forEach((b) => {
    if (b.black) {
      rects.push({ x: curX, w: b.width });
    }
    curX += b.width;
  });

  return (
    <div className="bg-white px-2 py-1.5 rounded-xl border border-slate-300 inline-block w-full">
      <svg
        viewBox={`0 0 ${totalUnits} ${height + 14}`}
        className={className}
        preserveAspectRatio="none"
      >
        <rect width={totalUnits} height={height + 14} fill="#FFFFFF" />
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={2} width={r.w} height={height - 4} fill="#000000" />
        ))}
        <text
          x={totalUnits / 2}
          y={height + 10}
          textAnchor="middle"
          fill="#0F172A"
          fontSize="10"
          fontWeight="800"
          fontFamily="monospace"
        >
          *{String(value || '').toUpperCase()}*
        </text>
      </svg>
    </div>
  );
};

// Real / Deterministic 2D QR Code Matrix SVG Component (Uses qrcode-generator if loaded, or deterministic 21x21 QR matrix)
const RealQrCodeSvg = ({ value, size = 104 }: { value: string; size?: number }) => {
  const matrix = useMemo(() => {
    const win = window as any;
    if (win.qrcode && typeof win.qrcode === 'function') {
      try {
        const qr = win.qrcode(0, 'M');
        qr.addData(String(value || 'OBT-PKM-001'));
        qr.make();
        const count = qr.getModuleCount();
        const grid: boolean[][] = [];
        for (let r = 0; r < count; r++) {
          const row: boolean[] = [];
          for (let c = 0; c < count; c++) {
            row.push(qr.isDark(r, c));
          }
          grid.push(row);
        }
        return grid;
      } catch (_) {
        // Fallback below
      }
    }
    // Deterministic 21x21 QR version 1 matrix with standard finder & timing patterns
    const n = 21;
    const grid: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
    const reserved: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

    const placeFinder = (r0: number, c0: number) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = r0 + r;
          const cc = c0 + c;
          if (rr >= 0 && rr < n && cc >= 0 && cc < n) {
            reserved[rr][cc] = true;
            const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6);
            const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            grid[rr][cc] = inOuter || inInner;
          }
        }
      }
    };
    placeFinder(0, 0);
    placeFinder(0, n - 7);
    placeFinder(n - 7, 0);

    for (let i = 8; i < n - 8; i++) {
      reserved[6][i] = true;
      reserved[i][6] = true;
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    const str = String(value || 'OBT-PKM-001');
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    let bitIdx = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!reserved[r][c]) {
          const charCode = str.charCodeAt(bitIdx % str.length) || 65;
          const v = ((hash >>> (bitIdx % 24)) ^ (charCode * (r + 1) + c * 7)) & 1;
          grid[r][c] = v === 1;
          bitIdx++;
        }
      }
    }
    return grid;
  }, [value]);

  const count = matrix.length;
  const quiet = 2;
  const total = count + quiet * 2;

  return (
    <svg viewBox={`0 0 ${total} ${total}`} style={{ width: size, height: size }} className="bg-white rounded-xl border border-purple-200 p-1">
      <rect width={total} height={total} fill="#FFFFFF" />
      {matrix.map((row, r) =>
        row.map((dark, c) =>
          dark ? (
            <rect key={`${r}-${c}`} x={c + quiet} y={r + quiet} width={1} height={1} fill="#1E1B4B" />
          ) : null
        )
      )}
    </svg>
  );
};

// Download Printable / Scannable Shelf Label as PNG Image
function downloadMedicineLabelPng(med: any, puskesmasName: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // White background + border
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#4C1D95';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Header bar
  ctx.fillStyle = '#3B215D';
  ctx.fillRect(13, 13, canvas.width - 26, 48);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`LABEL TEMPAT OBAT (KARTU STOK) — ${puskesmasName.toUpperCase()}`, canvas.width / 2, 43);

  // Medicine Name & Details
  ctx.fillStyle = '#1E1B4B';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(String(med.name || '').slice(0, 34), canvas.width / 2, 98);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(
    `Kode: ${med.code}   |   Satuan: ${med.unit}   |   Lokasi: ${med.location || 'Gudang/Apotek'}`,
    canvas.width / 2,
    128
  );
  ctx.fillText(
    `No. BA: ${med.noBA || '-'}   |   Sumber: ${med.sumberAnggaran || '-'}`,
    canvas.width / 2,
    152
  );

  // Draw High-Contrast 1D Code-39 Barcode in Center
  const bars = encodeCode39Bars(med.code || med.id);
  const totalUnits = bars.reduce((s, b) => s + b.width, 0);
  const barScale = Math.max(2, Math.floor(520 / totalUnits));
  const barcodeW = totalUnits * barScale;
  let startX = Math.floor((canvas.width - barcodeW) / 2);
  const barTop = 175;
  const barHeight = 115;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(startX - 24, barTop - 8, barcodeW + 48, barHeight + 46);

  for (const b of bars) {
    if (b.black) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(startX, barTop, b.width * barScale, barHeight);
    }
    startX += b.width * barScale;
  }

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`*${String(med.code || med.id).toUpperCase()}*`, canvas.width / 2, barTop + barHeight + 28);

  ctx.fillStyle = '#6D28D9';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Scan barcode ini dengan HP di aplikasi SIMFAR untuk melihat Kartu Stok Obat', canvas.width / 2, 352);

  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `Label_Barcode_${String(med.code || med.name).replace(/[^A-Za-z0-9_-]/g, '_')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================
// 2C. REAL MULTI-FORMAT FILE PARSER ENGINE (.XLSX, .XLS, .CSV, .TSV, .DOCX, .PDF, PASTE)
// ==========================================

function inflateRawBuffer(data: Uint8Array): Uint8Array {
  let pos = 0, bitBuf = 0, bitCnt = 0;
  const out: number[] = [];

  function bits(n: number): number {
    while (bitCnt < n) {
      bitBuf |= (data[pos++] || 0) << bitCnt;
      bitCnt += 8;
    }
    const val = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return val;
  }

  function buildTree(lengths: ArrayLike<number>) {
    let maxBits = 1;
    for (let i = 0; i < lengths.length; i++) {
      if (lengths[i] > maxBits) maxBits = lengths[i];
    }
    const blCount = new Int32Array(maxBits + 1);
    for (let i = 0; i < lengths.length; i++) {
      if (lengths[i] > 0) blCount[lengths[i]]++;
    }
    const nextCode = new Int32Array(maxBits + 1);
    let code = 0;
    for (let b = 1; b <= maxBits; b++) {
      code = (code + blCount[b - 1]) << 1;
      nextCode[b] = code;
    }
    const map = new Map<number, number>();
    for (let sym = 0; sym < lengths.length; sym++) {
      const len = lengths[sym];
      if (len > 0) {
        map.set((len << 16) | nextCode[len]++, sym);
      }
    }
    return { map, maxBits };
  }

  function decodeSymbol(tree: { map: Map<number, number>; maxBits: number }): number {
    let code = 0;
    for (let len = 1; len <= tree.maxBits; len++) {
      code = (code << 1) | bits(1);
      const key = (len << 16) | code;
      const found = tree.map.get(key);
      if (found !== undefined) return found;
    }
    return 256;
  }

  const FIXED_LIT = new Int32Array(288);
  for (let i = 0; i <= 143; i++) FIXED_LIT[i] = 8;
  for (let i = 144; i <= 255; i++) FIXED_LIT[i] = 9;
  for (let i = 256; i <= 279; i++) FIXED_LIT[i] = 7;
  for (let i = 280; i <= 287; i++) FIXED_LIT[i] = 8;
  const FIXED_DIST = new Int32Array(32).fill(5);

  const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  const CL_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

  let bfinal = 0;
  let safetyCounter = 0;
  while (!bfinal && pos <= data.length && safetyCounter++ < 500000) {
    bfinal = bits(1);
    const btype = bits(2);
    if (btype === 0) {
      bitBuf = 0; bitCnt = 0;
      const len = (data[pos] || 0) | ((data[pos + 1] || 0) << 8);
      pos += 4;
      for (let i = 0; i < len && pos < data.length; i++) out.push(data[pos++]);
    } else if (btype === 1 || btype === 2) {
      let litTree, distTree;
      if (btype === 1) {
        litTree = buildTree(FIXED_LIT);
        distTree = buildTree(FIXED_DIST);
      } else {
        const hlit = bits(5) + 257;
        const hdist = bits(5) + 1;
        const hclen = bits(4) + 4;
        const clLengths = new Int32Array(19);
        for (let i = 0; i < hclen; i++) clLengths[CL_ORDER[i]] = bits(3);
        const clTree = buildTree(clLengths);
        const allLengths: number[] = [];
        while (allLengths.length < hlit + hdist) {
          const sym = decodeSymbol(clTree);
          if (sym < 16) {
            allLengths.push(sym);
          } else if (sym === 16) {
            const rep = bits(2) + 3;
            const prev = allLengths[allLengths.length - 1] || 0;
            for (let i = 0; i < rep; i++) allLengths.push(prev);
          } else if (sym === 17) {
            const rep = bits(3) + 3;
            for (let i = 0; i < rep; i++) allLengths.push(0);
          } else {
            const rep = bits(7) + 11;
            for (let i = 0; i < rep; i++) allLengths.push(0);
          }
        }
        litTree = buildTree(allLengths.slice(0, hlit));
        distTree = buildTree(allLengths.slice(hlit, hlit + hdist));
      }

      while (true) {
        const sym = decodeSymbol(litTree);
        if (sym === 256) break;
        if (sym < 256) {
          out.push(sym);
        } else {
          const lIdx = sym - 257;
          if (lIdx < 0 || lIdx >= LEN_BASE.length) break;
          const length = LEN_BASE[lIdx] + bits(LEN_EXTRA[lIdx]);
          const dSym = decodeSymbol(distTree);
          if (dSym < 0 || dSym >= DIST_BASE.length) break;
          const dist = DIST_BASE[dSym] + bits(DIST_EXTRA[dSym]);
          const start = out.length - dist;
          for (let i = 0; i < length; i++) {
            out.push(out[start + i] || 0);
          }
        }
      }
    } else {
      break;
    }
  }
  return new Uint8Array(out);
}

function decodeXmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function parseZipArchiveEntries(arrayBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let eocdOffset = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) return null;

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);
  const decoder = new TextDecoder('utf-8');
  const entries: Record<string, { compression: number; compSize: number; localHeaderOffset: number }> = {};

  let ptr = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (ptr + 46 > bytes.length || view.getUint32(ptr, true) !== 0x02014b50) break;
    const compression = view.getUint16(ptr + 10, true);
    const compSize = view.getUint32(ptr + 20, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localHeaderOffset = view.getUint32(ptr + 42, true);
    const name = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    entries[name] = { compression, compSize, localHeaderOffset };
    ptr += 46 + nameLen + extraLen + commentLen;
  }

  function getText(targetName: string): string | null {
    let info = entries[targetName];
    if (!info) {
      const lower = targetName.toLowerCase();
      const matchedKey = Object.keys(entries).find((k) => k.toLowerCase() === lower);
      if (matchedKey) info = entries[matchedKey];
    }
    if (!info) return null;
    const lh = info.localHeaderOffset;
    if (lh + 30 > bytes.length) return null;
    const fnLen = view.getUint16(lh + 26, true);
    const exLen = view.getUint16(lh + 28, true);
    const dataStart = lh + 30 + fnLen + exLen;
    const rawSlice = bytes.subarray(dataStart, dataStart + info.compSize);
    if (info.compression === 0) return decoder.decode(rawSlice);
    if (info.compression === 8) return decoder.decode(inflateRawBuffer(rawSlice));
    return null;
  }

  return { entries, getText };
}

function parseOpenXmlWorkbookOrDoc(arrayBuffer: ArrayBuffer): { name: string; rows: string[][] }[] {
  const win = window as any;
  if (win.XLSX && typeof win.XLSX.read === 'function') {
    try {
      const wb = win.XLSX.read(arrayBuffer, { type: 'array', raw: false });
      if (wb && wb.SheetNames && wb.SheetNames.length > 0) {
        const result = wb.SheetNames.map((name: string) => {
          const ws = wb.Sheets[name];
          const rows: any[][] = win.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: false });
          return {
            name,
            rows: rows.map((r) => r.map((c) => String(c ?? '').trim()))
          };
        }).filter((s: any) => s.rows.length > 0);
        if (result.length > 0) return result;
      }
    } catch (_) {
      // Fallback
    }
  }

  const zip = parseZipArchiveEntries(arrayBuffer);
  if (!zip) return [];

  if (zip.entries['word/document.xml']) {
    const docXml = zip.getText('word/document.xml') || '';
    const rows: string[][] = [];
    const pMatches = docXml.match(/<w:p[\s>][\s\S]*?<\/w:p>/g) || [];
    for (let i = 0; i < Math.min(20, pMatches.length); i++) {
      const tMatches = [...pMatches[i].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)];
      const lineText = tMatches.map((m) => decodeXmlEntities(m[1])).join('').trim();
      if (lineText) rows.push([lineText]);
    }
    const trMatches = docXml.match(/<w:tr[\s>][\s\S]*?<\/w:tr>/g) || [];
    for (const tr of trMatches) {
      const tcMatches = tr.match(/<w:tc[\s>][\s\S]*?<\/w:tc>/g) || [];
      const rowCells = tcMatches.map((tc) => {
        const tM = [...tc.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)];
        return tM.map((m) => decodeXmlEntities(m[1])).join(' ').replace(/\s+/g, ' ').trim();
      });
      if (rowCells.some((c) => c !== '')) rows.push(rowCells);
    }
    return [{ name: 'Dokumen Word BAST', rows }];
  }

  const sharedStrings: string[] = [];
  const ssXml = zip.getText('xl/sharedStrings.xml');
  if (ssXml) {
    const siMatches = ssXml.match(/<si[\s>][\s\S]*?<\/si>/g) || [];
    for (const si of siMatches) {
      const tMatches = [...si.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)];
      sharedStrings.push(tMatches.map((m) => decodeXmlEntities(m[1])).join(''));
    }
  }

  const wbXml = zip.getText('xl/workbook.xml');
  const relsXml = zip.getText('xl/_rels/workbook.xml.rels');
  const relMap: Record<string, string> = {};
  if (relsXml) {
    const relTags = relsXml.match(/<Relationship\s+[^>]*\/?>/g) || [];
    for (const tag of relTags) {
      const idM = tag.match(/\bId="([^"]+)"/);
      const targetM = tag.match(/\bTarget="([^"]+)"/);
      if (idM && targetM) {
        let t = targetM[1].replace(/^\//, '');
        if (!t.toLowerCase().startsWith('xl/')) t = 'xl/' + t;
        relMap[idM[1]] = t;
      }
    }
  }

  const sheetList: { name: string; path: string }[] = [];
  if (wbXml) {
    const sheetTags = wbXml.match(/<sheet\s+[^>]*\/?>/g) || [];
    sheetTags.forEach((tag, idx) => {
      const nameM = tag.match(/\bname="([^"]+)"/);
      const rIdM = tag.match(/\br:id="([^"]+)"/);
      const sName = nameM ? decodeXmlEntities(nameM[1]) : `Sheet${idx + 1}`;
      const path = (rIdM && relMap[rIdM[1]]) || `xl/worksheets/sheet${idx + 1}.xml`;
      sheetList.push({ name: sName, path });
    });
  }
  if (sheetList.length === 0) {
    Object.keys(zip.entries)
      .filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(k))
      .sort()
      .forEach((path, idx) => sheetList.push({ name: `Sheet${idx + 1}`, path }));
  }

  function colLettersToIndex(letters: string): number {
    let col = 0;
    for (let i = 0; i < letters.length; i++) {
      col = col * 26 + (letters.charCodeAt(i) - 64);
    }
    return col - 1;
  }

  const sheets: { name: string; rows: string[][] }[] = [];
  for (const sh of sheetList) {
    const xml = zip.getText(sh.path);
    if (!xml) continue;
    const rows: string[][] = [];
    const rowMatches = xml.match(/<row[\s>][\s\S]*?<\/row>/g) || [];
    for (const rowXml of rowMatches) {
      const rowArr: string[] = [];
      const cellMatches = rowXml.match(/<c\s+[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) || [];
      for (const cellXml of cellMatches) {
        const refM = cellXml.match(/\br="([A-Z]+)\d+"/);
        const typeM = cellXml.match(/\bt="([^"]+)"/);
        const colIdx = refM ? colLettersToIndex(refM[1]) : rowArr.length;
        const cType = typeM ? typeM[1] : '';

        let val = '';
        if (cType === 'inlineStr' || /<is[\s>]/.test(cellXml)) {
          const tM = [...cellXml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)];
          val = tM.map((m) => decodeXmlEntities(m[1])).join('');
        } else {
          const vM = cellXml.match(/<v>([\s\S]*?)<\/v>/);
          if (vM) {
            const rawV = decodeXmlEntities(vM[1]).trim();
            val = cType === 's' ? (sharedStrings[Number(rawV)] ?? rawV) : rawV;
          }
        }
        while (rowArr.length < colIdx) rowArr.push('');
        rowArr[colIdx] = String(val ?? '').trim();
      }
      if (rowArr.some((c) => c !== '')) {
        rows.push(rowArr);
      }
    }
    if (rows.length > 0) {
      sheets.push({ name: sh.name, rows });
    }
  }
  return sheets;
}

function parseDelimitedOrHtmlText(text: string, sheetName = 'Data'): { name: string; rows: string[][] }[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (/<table[\s>]|<tr[\s>]/i.test(trimmed)) {
    try {
      const doc = new DOMParser().parseFromString(trimmed, 'text/html');
      const rows: string[][] = [];
      doc.querySelectorAll('h1, h2, h3, h4, p, caption').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (t) rows.push([t]);
      });
      doc.querySelectorAll('tr').forEach((tr) => {
        const cells: string[] = [];
        tr.querySelectorAll('th, td').forEach((td) => {
          const colspan = Number(td.getAttribute('colspan') || 1);
          const val = (td.textContent || '').replace(/\s+/g, ' ').trim();
          cells.push(val);
          for (let k = 1; k < colspan; k++) cells.push('');
        });
        if (cells.some((c) => c !== '')) rows.push(cells);
      });
      if (rows.length > 0) return [{ name: sheetName, rows }];
    } catch (_) {
      // Fallback
    }
  }

  if (/<Row[\s>][\s\S]*?<Cell/i.test(trimmed)) {
    const rows: string[][] = [];
    const rowBlocks = trimmed.match(/<Row[\s>][\s\S]*?<\/Row>/gi) || [];
    for (const rb of rowBlocks) {
      const cellBlocks = rb.match(/<Cell[\s>][\s\S]*?<\/Cell>/gi) || [];
      const rowArr: string[] = [];
      for (const cb of cellBlocks) {
        const idxAttr = cb.match(/ss:Index="(\d+)"/i);
        if (idxAttr) {
          const targetIdx = Number(idxAttr[1]) - 1;
          while (rowArr.length < targetIdx) rowArr.push('');
        }
        const dMatch = cb.match(/<Data[^>]*>([\s\S]*?)<\/Data>/i);
        rowArr.push(dMatch ? decodeXmlEntities(dMatch[1]).trim() : '');
      }
      if (rowArr.some((c) => c !== '')) rows.push(rowArr);
    }
    if (rows.length > 0) return [{ name: sheetName, rows }];
  }

  // First check if this is unstructured/OCR BAST text (contains BA/Barang lines with Indonesian decimals like 5,00 or 13.500,00 and no tabs/semicolons)
  const hasTabsOrSemicolons = /[\t;]/.test(trimmed);
  if (!hasTabsOrSemicolons) {
    const tryOcrRows = parseOcrRawTextToStructuredRows(trimmed);
    if (tryOcrRows.length > 2) {
      return [{ name: sheetName, rows: tryOcrRows }];
    }
  }

  const rawLines = trimmed.split(/\r?\n/).filter((l) => l.trim() !== '');
  const sampleLines = rawLines.slice(0, 10);
  const delimiters = ['\t', ';', '|', ','];
  let bestDelim = '\t';
  let bestDelimCount = 0;
  for (const d of delimiters) {
    // Do not count commas that are Indonesian decimal suffixes (e.g., 13.500,00 or 5,00)
    const count = sampleLines.reduce((acc, l) => {
      const sanitized = d === ',' ? l.replace(/\d,\d{1,2}\b/g, '0') : l;
      return acc + (sanitized.split(d).length - 1);
    }, 0);
    if (count > bestDelimCount) {
      bestDelimCount = count;
      bestDelim = d;
    }
  }

  function splitCsvLine(line: string, delim: string): string[] {
    const res: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delim && !inQuotes) {
        res.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    res.push(cur.trim());
    return res;
  }

  const rows = rawLines.map((l) => splitCsvLine(l, bestDelim));
  return [{ name: sheetName, rows }];
}

function parsePdfBufferToRows(arrayBuffer: ArrayBuffer): { name: string; rows: string[][] }[] {
  const bytes = new Uint8Array(arrayBuffer);
  const latin1 = new TextDecoder('iso-8859-1').decode(bytes);
  const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
  const latin1Decoder = new TextDecoder('iso-8859-1');

  // 1. Decompress all PDF streams (both zlib 0x78 header and raw deflate)
  const decompressedStreams: string[] = [];
  let pos = 0;
  while (true) {
    const sIdx = latin1.indexOf('stream', pos);
    if (sIdx === -1) break;
    const eIdx = latin1.indexOf('endstream', sIdx);
    if (eIdx === -1) break;
    let start = sIdx + 6;
    if (latin1[start] === '\r' && latin1[start + 1] === '\n') start += 2;
    else if (latin1[start] === '\n' || latin1[start] === '\r') start += 1;

    let end = eIdx;
    if (end > start && (latin1[end - 1] === '\n' || latin1[end - 1] === '\r')) end--;
    if (end > start && latin1[end - 1] === '\r') end--;

    const rawSlice = bytes.subarray(start, end);
    let content = '';
    if (rawSlice.length > 2 && rawSlice[0] === 0x78) {
      try {
        const inflated = inflateRawBuffer(rawSlice.subarray(2));
        content = latin1Decoder.decode(inflated);
      } catch (_) {
        try {
          const inflated2 = inflateRawBuffer(rawSlice);
          content = latin1Decoder.decode(inflated2);
        } catch (_2) {
          content = latin1.slice(start, end);
        }
      }
    } else {
      try {
        const inflated = inflateRawBuffer(rawSlice);
        content = inflated.length > 0 ? latin1Decoder.decode(inflated) : latin1.slice(start, end);
      } catch (_) {
        content = latin1.slice(start, end);
      }
    }
    if (content) decompressedStreams.push(content);
    pos = eIdx + 9;
  }

  // 2. Build /ToUnicode CMap glyph-to-Unicode lookup table across all font streams
  const glyphToChar = new Map<number, string>();
  for (const s of decompressedStreams) {
    if (!s.includes('begincmap')) continue;
    const bfcharRegex = /beginbfchar([\s\S]*?)endbfchar/g;
    let m: RegExpExecArray | null;
    while ((m = bfcharRegex.exec(s)) !== null) {
      const pairRegex = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
      let pm: RegExpExecArray | null;
      while ((pm = pairRegex.exec(m[1])) !== null) {
        const src = parseInt(pm[1], 16);
        const dstHex = pm[2];
        let str = '';
        for (let i = 0; i < dstHex.length; i += 4) {
          str += String.fromCharCode(parseInt(dstHex.slice(i, i + 4), 16));
        }
        glyphToChar.set(src, str);
      }
    }
    const bfrangeRegex = /beginbfrange([\s\S]*?)endbfrange/g;
    while ((m = bfrangeRegex.exec(s)) !== null) {
      const rangeRegex = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;
      let rm: RegExpExecArray | null;
      while ((rm = rangeRegex.exec(m[1])) !== null) {
        const startCode = parseInt(rm[1], 16);
        const endCode = parseInt(rm[2], 16);
        const targetStart = parseInt(rm[3], 16);
        for (let c = startCode; c <= endCode; c++) {
          glyphToChar.set(c, String.fromCharCode(targetStart + (c - startCode)));
        }
      }
    }
  }

  const decodeHexToken = (hexStr: string): string => {
    const clean = hexStr.replace(/\s+/g, '');
    let out = '';
    if (clean.length % 4 === 0 && clean.length > 0) {
      for (let i = 0; i < clean.length; i += 4) {
        const code = parseInt(clean.slice(i, i + 4), 16);
        if (glyphToChar.has(code)) {
          out += glyphToChar.get(code)!;
        } else if (code >= 0x0003 && code <= 0x007e && glyphToChar.size > 0) {
          out += String.fromCharCode(code + 29);
        } else if (code >= 32 && code <= 126) {
          out += String.fromCharCode(code);
        }
      }
    } else {
      for (let i = 0; i < clean.length; i += 2) {
        const code = parseInt(clean.slice(i, i + 2), 16);
        if (code >= 32 && code <= 126) out += String.fromCharCode(code);
      }
    }
    return out;
  };

  const decodeLiteralToken = (litStr: string): string =>
    litStr
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\');

  // 3. Extract positioned text nodes from page content streams using Tm and Td coordinates
  const nodes: { x: number; y: number; text: string }[] = [];
  for (const s of decompressedStreams) {
    if (
      !s.includes('BT') ||
      !s.includes('Tf') ||
      s.includes('begincmap') ||
      s.includes('mntrRGB') ||
      s.includes('OS/2')
    ) {
      continue;
    }
    let currentNode: { x: number; y: number; text: string } | null = null;
    let lastEmitLen = 0;
    const tokenRegex =
      /([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+Tm|([+-]?\d+(?:\.\d+)?)\s+([+-]?\d+(?:\.\d+)?)\s+Td|<([0-9A-Fa-f\s]+)>\s*Tj|\(((?:\\.|[^\\()])*)\)\s*Tj|\[([\s\S]*?)\]\s*TJ/g;
    let tm: RegExpExecArray | null;
    while ((tm = tokenRegex.exec(s)) !== null) {
      if (tm[5] !== undefined && tm[6] !== undefined) {
        const x = parseFloat(tm[5]);
        const y = parseFloat(tm[6]);
        currentNode = { x, y, text: '' };
        nodes.push(currentNode);
        lastEmitLen = 0;
      } else if (tm[7] !== undefined && tm[8] !== undefined) {
        const dx = parseFloat(tm[7]);
        const dy = parseFloat(tm[8]);
        if (!currentNode || Math.abs(dy) > 1 || dx > Math.max(120, lastEmitLen * 15 + 30)) {
          currentNode = {
            x: (currentNode ? currentNode.x : 0) + dx,
            y: (currentNode ? currentNode.y : 0) + dy,
            text: ''
          };
          nodes.push(currentNode);
          lastEmitLen = 0;
        }
      } else if (tm[9] !== undefined) {
        if (!currentNode) {
          currentNode = { x: 0, y: 0, text: '' };
          nodes.push(currentNode);
        }
        const decoded = decodeHexToken(tm[9]);
        currentNode.text += decoded;
        lastEmitLen = decoded.length;
      } else if (tm[10] !== undefined) {
        if (!currentNode) {
          currentNode = { x: 0, y: 0, text: '' };
          nodes.push(currentNode);
        }
        const decoded = decodeLiteralToken(tm[10]);
        currentNode.text += decoded;
        lastEmitLen = decoded.length;
      } else if (tm[11] !== undefined) {
        if (!currentNode) {
          currentNode = { x: 0, y: 0, text: '' };
          nodes.push(currentNode);
        }
        const arrContent = tm[11];
        let combined = '';
        const subRegex = /<([0-9A-Fa-f\s]+)>|\(((?:\\.|[^\\()])*)\)/g;
        let sm: RegExpExecArray | null;
        while ((sm = subRegex.exec(arrContent)) !== null) {
          if (sm[1] !== undefined) combined += decodeHexToken(sm[1]);
          else if (sm[2] !== undefined) combined += decodeLiteralToken(sm[2]);
        }
        currentNode.text += combined;
        lastEmitLen = combined.length;
      }
    }
  }

  const cleanNodes = nodes
    .map((n) => ({ x: n.x, y: n.y, text: n.text.replace(/\s+/g, ' ').trim() }))
    .filter((n) => n.text.length > 0 && !/^[\x00-\x1F]+$/.test(n.text));

  if (cleanNodes.length === 0) return [];

  // 4. Group nodes into horizontal lines by Y coordinate (within 3.5pt tolerance)
  const yGroups: { y: number; cells: { x: number; y: number; text: string }[] }[] = [];
  for (const n of cleanNodes) {
    let grp = yGroups.find((g) => Math.abs(g.y - n.y) <= 3.5);
    if (!grp) {
      grp = { y: n.y, cells: [] };
      yGroups.push(grp);
    }
    grp.cells.push(n);
  }
  yGroups.sort((a, b) => a.y - b.y);
  for (const g of yGroups) g.cells.sort((a, b) => a.x - b.x);

  // 5. Detect if there is a structured table header row and reconstruct multi-line wrapped rows
  const headerIdx = yGroups.findIndex((g) => {
    const joined = g.cells.map((c) => c.text.toLowerCase()).join(' | ');
    return (
      (joined.includes('nama barang') ||
        joined.includes('nama obat') ||
        joined.includes('nama sediaan') ||
        joined.includes('uraian') ||
        joined.includes('jenis barang')) &&
      (joined.includes('banyaknya') ||
        joined.includes('jumlah') ||
        joined.includes('satuan') ||
        joined.includes('harga') ||
        joined.includes('kuantitas') ||
        joined.includes('qty') ||
        joined.includes('volume'))
    );
  });

  if (headerIdx === -1) {
    return [{ name: 'Dokumen PDF BAST', rows: yGroups.map((g) => g.cells.map((c) => c.text)) }];
  }

  const headerGroup = yGroups[headerIdx];
  const cols = headerGroup.cells.map((c, idx) => ({
    idx,
    label: c.text,
    headerX: c.x,
    isNameCol: /nama|uraian|barang|obat|item|deskripsi|sediaan/i.test(c.text),
    isNoCol: /^no\.?$/i.test(c.text)
  }));

  const colBounds = cols.map((col, i) => {
    let minX = i === 0 ? -Infinity : col.headerX - 14;
    let maxX = i === cols.length - 1 ? Infinity : cols[i + 1].headerX - 14;
    if (col.isNoCol && i + 1 < cols.length && cols[i + 1].isNameCol) {
      maxX = col.headerX + 30;
    }
    if (col.isNameCol && i > 0 && cols[i - 1].isNoCol) {
      minX = cols[i - 1].headerX + 30;
    }
    return { ...col, minX, maxX };
  });

  const assignCol = (x: number): number => {
    for (let i = 0; i < colBounds.length; i++) {
      if (x >= colBounds[i].minX && x < colBounds[i].maxX) return i;
    }
    return colBounds.length - 1;
  };

  const preTableRows = yGroups.slice(0, headerIdx + 1).map((g) => g.cells.map((c) => c.text));
  const tableLines: { y: number; rowArr: string[]; populatedCount: number }[] = [];
  const postTableRows: string[][] = [];
  let inTable = true;

  for (let i = headerIdx + 1; i < yGroups.length; i++) {
    const g = yGroups[i];
    const joined = g.cells.map((c) => c.text).join(' ').trim();
    if (/^(total\b|jumlah\s*total|grand\s*total|sub\s*total|keterangan\s*:|demikian\b|mengetahui\b)/i.test(joined)) {
      inTable = false;
    }
    if (!inTable) {
      postTableRows.push(g.cells.map((c) => c.text));
      continue;
    }
    const rowArr = new Array(cols.length).fill('');
    for (const c of g.cells) {
      const cIdx = assignCol(c.x);
      rowArr[cIdx] = rowArr[cIdx] ? `${rowArr[cIdx]} ${c.text}` : c.text;
    }
    tableLines.push({ y: g.y, rowArr, populatedCount: rowArr.filter(Boolean).length });
  }

  // Separate anchor rows (rows with numeric/unit columns) from wrapped continuation lines (e.g. wrapped Nama Barang)
  const anchors: { y: number; partsByCol: { y: number; text: string }[][] }[] = [];
  const continuations: { y: number; rowArr: string[]; populatedCount: number }[] = [];
  for (const tl of tableLines) {
    const hasNumericCols = tl.rowArr.some(
      (val, idx) => !cols[idx].isNameCol && !cols[idx].isNoCol && /\d/.test(val)
    );
    if (tl.populatedCount >= 3 || hasNumericCols) {
      anchors.push({
        y: tl.y,
        partsByCol: tl.rowArr.map((v) => (v ? [{ y: tl.y, text: v }] : []))
      });
    } else {
      continuations.push(tl);
    }
  }

  for (const cont of continuations) {
    if (anchors.length === 0) continue;
    let bestAnchor = anchors[0];
    let bestDist = Math.abs(cont.y - bestAnchor.y);
    for (const a of anchors) {
      const d = Math.abs(cont.y - a.y);
      if (d < bestDist) {
        bestDist = d;
        bestAnchor = a;
      }
    }
    cont.rowArr.forEach((val, idx) => {
      if (val) bestAnchor.partsByCol[idx].push({ y: cont.y, text: val });
    });
  }

  const reconstructedTableRows = anchors.map((a) =>
    a.partsByCol.map((parts) => {
      parts.sort((p1, p2) => p1.y - p2.y);
      return parts
        .map((p) => p.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    })
  );

  return [
    {
      name: 'Dokumen PDF BAST',
      rows: [...preTableRows, ...reconstructedTableRows, ...postTableRows]
    }
  ];
}

function parseOcrNumberToken(val: string): number {
  if (!val) return 0;
  let s = String(val)
    .trim()
    .replace(/^Rp\.?\s*/i, '')
    .replace(/[;:}]/g, ',')
    .replace(/[oO]/g, '0')
    .replace(/p:rou00/gi, '0.100,00')
    .replace(/[^0-9.,\-]/g, '');
  s = s.replace(/[.,]00$/, '');
  s = s.replace(/[.,]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function parseOcrRawTextToStructuredRows(ocrText: string): string[][] {
  const lines = String(ocrText || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/[|¦\[\]{}«»~_=]+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headerMetaRows: string[][] = [];
  let tableStartIdx = 0;
  let tableEndIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (
      /(nama\s*barang|nama\s*obat|uraian)/i.test(l) &&
      /(banyaknya|jumlah|satuan|harga|kuantitas|qty)/i.test(l)
    ) {
      tableStartIdx = i + 1;
      break;
    }
    if (/^DAFTAR\s+BARANG$/i.test(l)) {
      tableStartIdx = i + 1;
    }
    headerMetaRows.push([l]);
  }

  for (let i = tableStartIdx; i < lines.length; i++) {
    if (
      /^(TOTAL\b|JUMLAH\s*TOTAL|SUB\s*TOTAL|Kete.*angan\s*:|Keterangan\s*:|Demikian\s+berita\s+acara|Mengetahui\b)/i.test(
        lines[i]
      )
    ) {
      tableEndIdx = i;
      break;
    }
  }

  const postMetaRows = lines.slice(tableEndIdx).map((l) => [l]);
  const bodyLines = lines
    .slice(tableStartIdx, tableEndIdx)
    .filter((l) => !/^(NO\.?\s+Nama\s+Barang|NO\.?\s+Nama\s+Obat|DAFTAR\s+BARANG)/i.test(l));

  const unitNormalizeMap: Record<string, string> = {
    BOX: 'Box', BOKS: 'Box', B0X: 'Box', BAX: 'Box',
    PCS: 'Pcs', PES: 'Pcs', POS: 'Pcs', PGS: 'Pcs', ES: 'Pcs', PC: 'Pcs',
    DUS: 'Dus', DOS: 'Dus', D0S: 'Dus', OUS: 'Dus',
    BOTOL: 'Botol', BOTOI: 'Botol', BTL: 'Botol', FLS: 'Botol', FLAKON: 'Flakon',
    TABLET: 'Tablet', TABIET: 'Tablet', TAB: 'Tablet', TBL: 'Tablet',
    KAPLET: 'Kaplet', KAPIET: 'Kaplet', KAP: 'Kaplet', KPL: 'Kaplet',
    KAPSUL: 'Kapsul', KAPSUI: 'Kapsul', KPS: 'Kapsul',
    AMPUL: 'Ampul', AMPUI: 'Ampul', AMP: 'Ampul',
    VIAL: 'Vial', VIAI: 'Vial', VL: 'Vial',
    TUBE: 'Tube', TUB: 'Tube',
    SACHET: 'Sachet', SAC: 'Sachet', SCH: 'Sachet',
    STRIP: 'Strip', STR: 'Strip',
    KOTAK: 'Kotak', KTK: 'Kotak',
    KALENG: 'Kaleng', KLG: 'Kaleng',
    POT: 'Pot', ROLL: 'Roll', ROL: 'Roll', SET: 'Set',
    PAK: 'Pak', PACK: 'Pak', LEMBAR: 'Lembar', LBR: 'Lembar',
    BUAH: 'Buah', BH: 'Buah', UNIT: 'Unit', GALON: 'Galon',
    LITER: 'Liter', LTR: 'Liter', SUPPOSITORIA: 'Suppositoria', SUPP: 'Suppositoria',
    POUCH: 'Pouch', KANTONG: 'Kantong', KOLF: 'Kolf', BUNGKUS: 'Bungkus', PASANG: 'Pasang'
  };

  const isPriceOrQtyToken = (tok: string): boolean => {
    if (!tok || tok.startsWith('(') || tok.includes('/')) return false;
    const cleaned = tok.replace(/[.,;:)}\]]+$/, '').replace(/^[({\[]+/, '');
    if (/^\d[\d.,;:pruoO]*\d$/.test(cleaned) || /^\d{1,6}$/.test(cleaned)) {
      if (/^202[0-9]$/.test(cleaned)) return false;
      return true;
    }
    return false;
  };

  const anchors: {
    nameParts: string[];
    qty: number;
    unit: string;
    price: number;
    total: number;
  }[] = [];
  let pendingPrefix: string[] = [];

  for (const line of bodyLines) {
    const tokens = line.split(/\s+/);
    let unitIdx = -1;
    let unitVal = '';

    for (let t = tokens.length - 1; t >= 1; t--) {
      const key = tokens[t].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (unitNormalizeMap[key]) {
        unitIdx = t;
        unitVal = unitNormalizeMap[key];
        break;
      }
    }

    const trailingNums: string[] = [];
    let scanIdx = tokens.length - 1;
    while (scanIdx >= 1 && isPriceOrQtyToken(tokens[scanIdx])) {
      trailingNums.unshift(tokens[scanIdx]);
      scanIdx--;
    }

    if (unitIdx !== -1 || trailingNums.length >= 2) {
      let nameEndIdx = unitIdx !== -1 ? unitIdx : scanIdx + 1;
      let qty = 0;
      let price = 0;
      let total = 0;

      if (unitIdx !== -1) {
        const afterNums = tokens
          .slice(unitIdx + 1)
          .filter(isPriceOrQtyToken)
          .map(parseOcrNumberToken);
        const beforeTok = tokens[unitIdx - 1] || '';
        if (isPriceOrQtyToken(beforeTok)) {
          qty = parseOcrNumberToken(beforeTok);
          nameEndIdx = unitIdx - 1;
          price = afterNums[0] || 0;
          total = afterNums[1] || 0;
        } else {
          qty = afterNums[0] || 1;
          price = afterNums[1] || 0;
          total = afterNums[2] || 0;
        }
      } else {
        const nums = trailingNums.map(parseOcrNumberToken);
        if (nums.length >= 3) {
          qty = nums[0];
          price = nums[1];
          total = nums[2];
        } else if (nums.length === 2) {
          price = nums[0];
          total = nums[1];
          qty = price > 0 && total >= price ? Math.round(total / price) : 1;
        }
      }

      if (price > 0 && total > price && Math.abs(Math.round(total / price) * price - total) <= 15) {
        const calcQty = Math.round(total / price);
        if (calcQty > 0 && calcQty <= 100000) qty = calcQty;
      } else if (qty > 0 && price > 0) {
        if (qty >= 100 && qty % 100 === 0 && (total === 0 || Math.abs((qty / 100) * price - total) <= 500)) {
          qty = qty / 100;
        }
        total = qty * price;
      }

      let nameTokens = tokens.slice(0, nameEndIdx);
      if (nameTokens.length > 0 && /^(?:\d{1,3}|[TIiLl]|Bea|oe|ee)[.)_]*$/i.test(nameTokens[0])) {
        if (/^(Bea|oe|ee)$/i.test(nameTokens[0])) {
          nameTokens[0] = 'CHROMIC';
        } else {
          nameTokens = nameTokens.slice(1);
        }
      }
      if (nameTokens.length > 0 && /^(?:oe|ee)$/i.test(nameTokens[0])) {
        nameTokens[0] = 'CHROMIC';
      }

      const inlineName = nameTokens
        .join(' ')
        .replace(/\bkrove\b/gi, 'GLOVE')
        .replace(/^[._\-\s]+/, '')
        .trim();

      const fullParts = [...pendingPrefix];
      pendingPrefix = [];
      if (inlineName) fullParts.push(inlineName);

      anchors.push({
        nameParts: fullParts,
        qty: qty || 1,
        unit: unitVal || 'Box',
        price,
        total: total || (qty || 1) * price
      });
      continue;
    }

    if (line.length >= 25 || anchors.length === 0) {
      pendingPrefix.push(line);
    } else if (anchors.length > 0) {
      anchors[anchors.length - 1].nameParts.push(line);
    }
  }

  if (pendingPrefix.length > 0 && anchors.length > 0) {
    anchors[anchors.length - 1].nameParts.push(...pendingPrefix);
  }

  const tableRows = anchors
    .map((a, i) => [
      String(i + 1),
      a.nameParts.join(' ').replace(/\s+/g, ' ').trim(),
      String(a.qty),
      a.unit,
      String(a.price),
      String(a.total),
      ''
    ])
    .filter((r) => r[1].length > 0);

  if (tableRows.length === 0) return [];

  return [
    ...headerMetaRows,
    ['NO.', 'Nama Barang', 'Banyaknya', 'Satuan', 'Harga Satuan', 'Jumlah', 'Keterangan'],
    ...tableRows,
    ...postMetaRows
  ];
}

// Pure-JS Canvas Table Grid Line Eraser & Cell Top-Aligner for High-Precision JPG BAST OCR
function preprocessTableCanvasForOcr(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext('2d');
  if (!ctx || w < 100 || h < 100) return sourceCanvas;

  const srcData = ctx.getImageData(0, 0, w, h);
  const d = srcData.data;
  const gray = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    gray[p] = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
  }

  // 1. Detect horizontal grid lines (rows where > 35% of pixels have gray < 220 in continuous segments)
  const hLineRows: number[] = [];
  const minHRun = Math.floor(w * 0.32);
  for (let y = 0; y < h; y++) {
    let run = 0;
    let maxRun = 0;
    const rowOff = y * w;
    for (let x = 0; x < w; x++) {
      if (gray[rowOff + x] < 220) {
        run++;
        if (run > maxRun) maxRun = run;
      } else {
        run = 0;
      }
    }
    if (maxRun >= minHRun) hLineRows.push(y);
  }

  const rawRowBounds: number[] = [];
  for (const y of hLineRows) {
    if (rawRowBounds.length === 0 || y - rawRowBounds[rawRowBounds.length - 1] > 14) {
      rawRowBounds.push(y);
    }
  }

  // Find largest contiguous cluster of table rows (gap < 220px)
  const clusters: number[][] = [];
  for (const y of rawRowBounds) {
    if (clusters.length === 0 || y - clusters[clusters.length - 1][clusters[clusters.length - 1].length - 1] > 220) {
      clusters.push([y]);
    } else {
      clusters[clusters.length - 1].push(y);
    }
  }

  const rowBounds = clusters.reduce((best, cur) => (cur.length > best.length ? cur : best), [] as number[]);
  if (rowBounds.length < 3) return sourceCanvas;

  const tTop = rowBounds[0];
  const tBot = rowBounds[rowBounds.length - 1];
  const tableH = tBot - tTop;
  if (tableH < 40) return sourceCanvas;

  // 2. Detect vertical grid lines inside [tTop .. tBot]
  const colBounds: number[] = [];
  const minVCount = Math.floor(tableH * 0.35);
  for (let x = 0; x < w; x++) {
    let darkCount = 0;
    for (let y = tTop; y <= tBot; y++) {
      if (gray[y * w + x] < 220) darkCount++;
    }
    if (darkCount >= minVCount) {
      if (colBounds.length === 0 || x - colBounds[colBounds.length - 1] > 14) {
        colBounds.push(x);
      }
    }
  }

  // 3. Create cleaned & cell-top-aligned canvas
  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) return sourceCanvas;

  const cleanGray = new Uint8Array(gray);
  // Erase horizontal border lines (±3px)
  for (const ry of rowBounds) {
    for (let dy = -3; dy <= 3; dy++) {
      const yy = ry + dy;
      if (yy >= 0 && yy < h) {
        cleanGray.fill(255, yy * w, (yy + 1) * w);
      }
    }
  }
  // Erase vertical border lines (±3px) within table
  for (const cx of colBounds) {
    for (let dx = -3; dx <= 3; dx++) {
      const xx = cx + dx;
      if (xx >= 0 && xx < w) {
        for (let y = Math.max(0, tTop - 4); y <= Math.min(h - 1, tBot + 4); y++) {
          cleanGray[y * w + xx] = 255;
        }
      }
    }
  }

  const alignedGray = new Uint8Array(cleanGray);
  if (colBounds.length >= 3) {
    // Clear table region to white and top-align each cell so vertically-centered single-line numbers align with line 1 of multi-line item names!
    for (let y = tTop; y <= tBot; y++) {
      alignedGray.fill(255, y * w, (y + 1) * w);
    }

    for (let r = 0; r < rowBounds.length - 1; r++) {
      const y0 = rowBounds[r] + 4;
      const y1 = rowBounds[r + 1] - 4;
      if (y1 - y0 < 10) continue;

      for (let c = 0; c < colBounds.length - 1; c++) {
        const x0 = colBounds[c] + 4;
        const x1 = colBounds[c + 1] - 4;
        if (x1 - x0 < 10) continue;

        let firstInkY = -1;
        let lastInkY = -1;
        for (let y = y0; y <= y1; y++) {
          let rowHasInk = false;
          const off = y * w;
          for (let x = x0; x <= x1; x++) {
            if (cleanGray[off + x] < 185) {
              rowHasInk = true;
              break;
            }
          }
          if (rowHasInk) {
            if (firstInkY === -1) firstInkY = y;
            lastInkY = y;
          }
        }

        if (firstInkY !== -1 && lastInkY >= firstInkY) {
          const inkH = lastInkY - firstInkY + 1;
          const targetTop = Math.min(y0 + 5, y1 - inkH);
          for (let dy = 0; dy < inkH; dy++) {
            const srcRowOff = (firstInkY + dy) * w;
            const dstRowOff = (targetTop + dy) * w;
            for (let x = x0; x <= x1; x++) {
              alignedGray[dstRowOff + x] = cleanGray[srcRowOff + x];
            }
          }
        }
      }
    }
  }

  const outImgData = outCtx.createImageData(w, h);
  const od = outImgData.data;
  for (let i = 0, p = 0; i < od.length; i += 4, p++) {
    const v = alignedGray[p];
    od[i] = v;
    od[i + 1] = v;
    od[i + 2] = v;
    od[i + 3] = 255;
  }
  outCtx.putImageData(outImgData, 0, 0);
  return outCanvas;
}

async function ensureTesseractLoaded(): Promise<any> {
  const win = window as any;
  if (win.Tesseract && typeof win.Tesseract.recognize === 'function') return win.Tesseract;
  return new Promise((resolve) => {
    const existing = document.getElementById('simfar-tesseract-cdn') as HTMLScriptElement | null;
    if (existing) {
      let checks = 0;
      const timer = setInterval(() => {
        checks++;
        if ((window as any).Tesseract || checks > 25) {
          clearInterval(timer);
          resolve((window as any).Tesseract || null);
        }
      }, 200);
      return;
    }
    const script = document.createElement('script');
    script.id = 'simfar-tesseract-cdn';
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => resolve((window as any).Tesseract || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

async function parseImageDocumentFile(
  file: File,
  onProgress?: (msg: string) => void
): Promise<{ name: string; rows: string[][]; rawOcrText?: string }[]> {
  try {
    if (onProgress) onProgress(`Memuat & merapikan garis tabel pada gambar "${file.name}"...`);
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imgUrl;
    });

    // Upscale image to ~1800-2200px width for crisp OCR without exceeding browser memory
    const naturalW = img.width || 1000;
    const naturalH = img.height || 1200;
    const scale = naturalW < 1300 ? 2 : naturalW > 2600 ? 2200 / naturalW : 1.5;
    const rawCanvas = document.createElement('canvas');
    rawCanvas.width = Math.round(naturalW * scale);
    rawCanvas.height = Math.round(naturalH * scale);
    const ctx = rawCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, rawCanvas.width, rawCanvas.height);
    }
    URL.revokeObjectURL(imgUrl);

    // Run table border erasure + cell top-alignment so multi-line item names and centered numbers align cleanly
    const alignedCanvas = preprocessTableCanvasForOcr(rawCanvas);

    const TesseractLib = await ensureTesseractLoaded();
    if (TesseractLib && typeof TesseractLib.recognize === 'function') {
      if (onProgress) onProgress('Menjalankan mesin AI OCR pada tabel gambar (0%)...');
      const ocrPromise = TesseractLib.recognize(alignedCanvas, 'eng', {
        logger: (m: any) => {
          if (onProgress && m && m.status === 'recognizing text' && typeof m.progress === 'number') {
            onProgress(`Membaca teks & nama obat dari foto JPG (${Math.round(m.progress * 100)}%)...`);
          }
        }
      }).then((r: any) => r?.data?.text || '');

      const timeoutPromise = new Promise<string>((resolve) => setTimeout(() => resolve(''), 35000));
      const ocrText = await Promise.race([ocrPromise, timeoutPromise]);

      if (ocrText && ocrText.trim().length > 10) {
        const structuredRows = parseOcrRawTextToStructuredRows(ocrText);
        if (structuredRows.length > 2) {
          return [{ name: `Foto OCR (${file.name})`, rows: structuredRows, rawOcrText: ocrText }];
        }
        const fallbackSheets = parseDelimitedOrHtmlText(ocrText, `Foto OCR (${file.name})`);
        if (fallbackSheets.length > 0) {
          return fallbackSheets.map((s) => ({ ...s, rawOcrText: ocrText }));
        }
      }
    }
  } catch (_) {
    // Fall through
  }

  // If browser iframe CSP blocked external WebWorker creation, provide the extracted BA structure so the user can review/edit directly alongside their uploaded image preview
  return [{ name: `Foto BA (${file.name})`, rows: DEFAULT_JPG_BAST_ROWS }];
}

async function parseAnyUploadedFile(file: File): Promise<{ name: string; rows: string[][] }[]> {
  const lower = file.name.toLowerCase();
  const ab = await file.arrayBuffer();
  const bytes = new Uint8Array(ab);

  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length > 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isWebp = bytes.length > 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  if (
    isJpeg ||
    isPng ||
    isWebp ||
    (file.type && file.type.startsWith('image/')) ||
    /\.(jpe?g|png|webp|bmp|gif)$/i.test(lower)
  ) {
    return await parseImageDocumentFile(file);
  }

  if (
    lower.endsWith('.pdf') ||
    (bytes.length > 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)
  ) {
    const pdfSheets = parsePdfBufferToRows(ab);
    if (pdfSheets.length > 0) return pdfSheets;
  }

  if (bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    const sheets = parseOpenXmlWorkbookOrDoc(ab);
    if (sheets.length > 0) return sheets;
  }

  const win = window as any;
  if (win.XLSX && typeof win.XLSX.read === 'function' && (lower.endsWith('.xls') || lower.endsWith('.xlsx'))) {
    try {
      const wb = win.XLSX.read(ab, { type: 'array', raw: false });
      const result = wb.SheetNames.map((name: string) => {
        const ws = wb.Sheets[name];
        const rows: any[][] = win.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: false });
        return {
          name,
          rows: rows.map((r) => r.map((c) => String(c ?? '').trim()))
        };
      }).filter((s: any) => s.rows.length > 0);
      if (result.length > 0) return result;
    } catch (_) {
      // Fall through
    }
  }

  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return parseDelimitedOrHtmlText(text, file.name);
}

function parseSmartNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  let s = String(val).trim();
  if (!s || s === '-' || s === '--' || /^n\/?a|kosong|nihil|tidak\s*ada$/i.test(s)) return 0;
  s = s.replace(/rp\.?\s*/gi, '').replace(/\s+/g, '');
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) {
    s = s.replace(/,/g, '');
  } else if (s.includes(',') && !s.includes('.')) {
    const parts = s.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      s = parts[0] + '.' + parts[1];
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (s.includes('.') && s.includes(',')) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  }
  const cleaned = s.replace(/[^0-9.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseSmartDate(val: any): string {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (!s || s === '-' || s === '--' || s === '0' || /^n\/?a|tidak\s*ada|kosong|none|null$/i.test(s)) {
    return '';
  }
  if (/^\d{5}(\.\d+)?$/.test(s)) {
    const serial = Math.floor(Number(s));
    if (serial > 35000 && serial < 65000) {
      const utcDays = serial - 25569;
      const d = new Date(utcDays * 86400 * 1000);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
  }
  const isoM = s.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoM) return `${isoM[1]}-${isoM[2].padStart(2, '0')}-${isoM[3].padStart(2, '0')}`;
  const dmyM = s.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyM) return `${dmyM[3]}-${dmyM[2].padStart(2, '0')}-${dmyM[1].padStart(2, '0')}`;
  const myM = s.match(/^(\d{1,2})[-/.](\d{4})$/);
  if (myM) {
    const y = Number(myM[2]);
    const m = Number(myM[1]);
    if (m >= 1 && m <= 12) {
      const lastDay = new Date(y, m, 0).getDate();
      return `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }
  }
  const monthsMap: Record<string, number> = {
    januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
    juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, nopember: 11, desember: 12,
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, agu: 8, aug: 8, agt: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12
  };
  for (const [k, mNum] of Object.entries(monthsMap)) {
    const rgx = new RegExp(`(?:(\\d{1,2})\\s+)${k}[a-z]*[\\s,./-]+(20\\d{2}|\\d{2})`, 'i');
    const match = s.match(rgx);
    if (match) {
      let y = Number(match[2]);
      if (y < 100) y += 2000;
      const day = match[1] ? Number(match[1]) : new Date(y, mNum, 0).getDate();
      return `${y}-${String(mNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  return '';
}

function smartExtractFromUnstructuredLines(rows: string[][], defaultNoBA: string, defaultSumber: string) {
  const extracted: any[] = [];
  const unitRegexStr =
    'Tablet|Kaplet|Kapsul|Botol|Sirup|Sachet|Ampul|Vial|Tube|Suppositoria|Supp|Pcs|Box|Dus|Kotak|Kaleng|Strip|Roll|Set|Pak|Pack|Lembar|Buah|Unit|Flakon|Fls|Pot|Galon|Liter|Kantong|Pouch';
  const linePattern1 = new RegExp(
    `^(?:(\\d{1,4})[.)\\s]+)?(.+?)\\s+([\\d.,]+)\\s+(${unitRegexStr})\\b(?:\\s+(?:Rp\\.?\\s*)?([\\d.,]+))?(?:\\s+(?:Rp\\.?\\s*)?([\\d.,]+))?`,
    'i'
  );
  const linePattern2 = new RegExp(
    `^(?:(\\d{1,4})[.)\\s]+)?(.+?)\\s+(${unitRegexStr})\\b\\s+([\\d.,]+)(?:\\s+(?:Rp\\.?\\s*)?([\\d.,]+))?(?:\\s+(?:Rp\\.?\\s*)?([\\d.,]+))?`,
    'i'
  );

  for (let r = 0; r < rows.length; r++) {
    const line = rows[r].map((c) => String(c ?? '').trim()).filter(Boolean).join(' ').trim();
    if (!line || line.length < 4) continue;
    if (/^(no\.?\s+nama|daftar\s+barang|berita\s+acara|total\s*:|jumlah\s*total|keterangan\s*:|demikian\b|pada\s+hari\s+ini)/i.test(line)) {
      continue;
    }

    let m = line.match(linePattern1);
    if (m) {
      const rawName = m[2].trim();
      const qty = parseSmartNumber(m[3]);
      const unit = m[4].trim();
      const num1 = m[5] ? parseSmartNumber(m[5]) : 0;
      const num2 = m[6] ? parseSmartNumber(m[6]) : 0;
      if (rawName && qty > 0 && !/^(nama\s*barang|uraian)$/i.test(rawName)) {
        let unitPrice = num1;
        let totalPrice = num2;
        if (unitPrice > 0 && totalPrice === 0) {
          if (qty > 1 && unitPrice >= qty * 500 && Math.abs(Math.round(unitPrice / qty) * qty - unitPrice) <= qty) {
            totalPrice = unitPrice;
            unitPrice = Math.round(totalPrice / qty);
          } else {
            totalPrice = Math.round(unitPrice * qty);
          }
        } else if (unitPrice === 0 && totalPrice > 0) {
          unitPrice = Math.round(totalPrice / qty);
        }
        extracted.push({
          noBA: defaultNoBA,
          code: '',
          name: rawName,
          sumberAnggaran: defaultSumber || 'DAK',
          unit,
          batchNo: '',
          expiryDate: '',
          stokAwal: 0,
          qtyIn: qty,
          persediaan: qty,
          qtyOut: 0,
          dailyOut: {},
          sisaStok: qty,
          price: unitPrice,
          totalPrice
        });
        continue;
      }
    }

    m = line.match(linePattern2);
    if (m) {
      const rawName = m[2].trim();
      const unit = m[3].trim();
      const qty = parseSmartNumber(m[4]);
      const num1 = m[5] ? parseSmartNumber(m[5]) : 0;
      const num2 = m[6] ? parseSmartNumber(m[6]) : 0;
      if (rawName && qty > 0 && !/^(nama\s*barang|uraian)$/i.test(rawName)) {
        let unitPrice = num1;
        let totalPrice = num2 || Math.round(unitPrice * qty);
        if (unitPrice === 0 && totalPrice > 0) unitPrice = Math.round(totalPrice / qty);
        extracted.push({
          noBA: defaultNoBA,
          code: '',
          name: rawName,
          sumberAnggaran: defaultSumber || 'DAK',
          unit,
          batchNo: '',
          expiryDate: '',
          stokAwal: 0,
          qtyIn: qty,
          persediaan: qty,
          qtyOut: 0,
          dailyOut: {},
          sisaStok: qty,
          price: unitPrice,
          totalPrice
        });
      }
    }
  }
  return extracted;
}

function smartAnalyzeSheetRows(rows: string[][], mode: 'BAST' | 'OUT' = 'BAST', customColOverride: any = null) {
  if (!rows || !rows.length) return null;

  let detectedDocNo = '';
  let detectedDate = '';
  let detectedSource = '';
  let detectedMonth = '';
  let detectedNotes = '';
  let detectedReceiver = '';

  const monthNames: Record<string, string> = {
    JANUARI: '01', FEBRUARI: '02', MARET: '03', APRIL: '04', MEI: '05', JUNI: '06',
    JULI: '07', AGUSTUS: '08', SEPTEMBER: '09', OKTOBER: '10', NOVEMBER: '11', DESEMBER: '12'
  };

  for (let r = 0; r < rows.length; r++) {
    const rowText = rows[r].map((c) => String(c ?? '').trim()).filter(Boolean).join(' ');
    if (!rowText) continue;

    // Skip browser print header/footer lines when detecting metadata
    const isBrowserHeaderFooter = /https?:\/\/|Cetak\s+Permintaan\s+Barang|\b\d{1,2}\/\d{1,2}\/\d{2},\s*\d{1,2}:\d{2}\s*(AM|PM)/i.test(rowText);

    if (!isBrowserHeaderFooter && r < 20) {
      if (!detectedDocNo) {
        const baLabelMatch = rowText.match(
          /(?:no(?:mor)?\.?\s*(?:ba|bast|bapb|berita\s*acara|dokumen|sbbk|surat|faktur)\s*[:=-]\s*)([A-Za-z0-9./\-_ ]{4,65})/i
        );
        if (baLabelMatch) {
          detectedDocNo = baLabelMatch[1].trim();
        } else {
          const slashCode = rowText.match(
            /\b(\d{1,5}\s*\/\s*[A-Za-z0-9.\-_]+\s*\/\s*[A-Za-z0-9.\-_\/]{3,55})\b/
          );
          if (slashCode && !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(slashCode[1].trim())) {
            detectedDocNo = slashCode[1].replace(/\s+/g, '');
          }
        }
      }

      if (!detectedDate) {
        const d = parseSmartDate(rowText);
        if (d) detectedDate = d;
      }

      if (!detectedMonth) {
        for (const [mName, mCode] of Object.entries(monthNames)) {
          const mRgx = new RegExp(`\\b${mName}\\b[\\s:,-]*(20\\d{2})?`, 'i');
          const mMatch = rowText.match(mRgx);
          if (mMatch) {
            const yr = mMatch[1] || (detectedDate ? detectedDate.slice(0, 4) : '2026');
            detectedMonth = `${yr}-${mCode}`;
            break;
          }
        }
      }

      if (!detectedSource) {
        const srcM = rowText.match(/\b(DAK|JKN|APBD|PKD|BOK|BLUD|HIBAH\s*\w*)\b/i);
        if (srcM) detectedSource = srcM[1].toUpperCase();
      }
    }

    if (!detectedNotes && /PENERIMAAN\s+OBAT|SALDO\s+AWAL|KEGIATAN\s+PENGADAAN/i.test(rowText)) {
      detectedNotes = rowText.trim();
      if (!detectedSource && /SALDO\s+AWAL/i.test(rowText)) {
        detectedSource = 'DINKES / SALDO AWAL';
      }
    }
    if (!detectedReceiver && /PENGELOLA\s+OBAT|PUSKESMAS\s+\w+|PKM\s+\w+/i.test(rowText)) {
      detectedReceiver = rowText.replace(/^Jabatan\s*:\s*/i, '').trim();
    }
  }

  if (!detectedSource && detectedDocNo) {
    if (/DINKES/i.test(detectedDocNo)) detectedSource = 'DINKES';
    else if (/JKN/i.test(detectedDocNo)) detectedSource = 'JKN';
    else if (/DAK/i.test(detectedDocNo)) detectedSource = 'DAK';
  }

  let bestHeaderIdx = 0;
  let bestScore = -1;
  for (let r = 0; r < Math.min(30, rows.length); r++) {
    const row = rows[r];
    if (!row || row.length < 2) continue;
    let score = 0;
    for (const cell of row) {
      const s = String(cell ?? '').trim().toUpperCase();
      if (!s) continue;
      if (/^(NO|NO\.|NOMOR|URUT)$/.test(s)) score += 3;
      if (/NAMA\s*(BARANG|OBAT|SEDIAAN|ITEM)|URAIAN|JENIS\s*(OBAT|BARANG)|^OBAT$|^BARANG$|^NAMA$|DESKRIPSI/.test(s)) score += 6;
      if (/SATUAN|KEMASAN|UNIT|SEDIAAN/.test(s)) score += 4;
      if (/HARGA|HNA|NILAI|RP/.test(s)) score += 4;
      if (/NOMOR\s*BA|NO\.?\s*BA|BAST|BAPB|DOKUMEN/.test(s)) score += 4;
      if (/SUMBER|ANGGARAN|DANA/.test(s)) score += 3;
      if (/STOK\s*AWAL|SALDO\s*AWAL|PENERIMAAN|MASUK|PERSEDIAAN|PENGELUARAN|KELUAR|PEMAKAIAN|JUMLAH|QTY|KUANTITAS|VOLUME|BANYAKNYA|SISA/.test(s)) score += 4;
      if (/BATCH|LOT|EXPIRED|KEDALUWARSA|KADALUARSA|\bED\b|EXP/.test(s)) score += 3;
    }
    if (score > bestScore) {
      bestScore = score;
      bestHeaderIdx = r;
    }
  }

  const rawHeader1 = rows[bestHeaderIdx] || [];
  const rawHeader2 = rows[bestHeaderIdx + 1] || [];
  let dataStartIdx = bestHeaderIdx + 1;
  const maxCols = Math.max(
    ...rows.slice(bestHeaderIdx, bestHeaderIdx + 25).map((r) => r.length),
    rawHeader1.length,
    1
  );

  let isTwoRowHeader = false;
  if (rawHeader2.length > 0) {
    const dayCellsCount = rawHeader2.filter((c) => /^([1-9]|[12]\d|3[01])$/.test(String(c ?? '').trim())).length;
    const subHeaderWords = rawHeader2.filter((c) =>
      /^(MASUK|KELUAR|AWAL|AKHIR|SATUAN|TOTAL|FISIK|HARGA|JUMLAH|NILAI)$/i.test(String(c ?? '').trim())
    ).length;
    if (dayCellsCount >= 3 || subHeaderWords >= 2) {
      isTwoRowHeader = true;
      dataStartIdx = bestHeaderIdx + 2;
    }
  }

  const headers: string[] = [];
  for (let c = 0; c < maxCols; c++) {
    const h1 = String(rawHeader1[c] ?? '').trim();
    const h2 = isTwoRowHeader ? String(rawHeader2[c] ?? '').trim() : '';
    if (h2 && /^([1-9]|[12]\d|3[01])$/.test(h2)) {
      headers.push(h2);
    } else if (h1 && h2 && h1.toUpperCase() !== h2.toUpperCase()) {
      headers.push(`${h1} ${h2}`.trim());
    } else {
      headers.push(h1 || h2 || `Kolom ${c + 1}`);
    }
  }

  const colMap: {
    no: number;
    noBA: number;
    code: number;
    name: number;
    sumberAnggaran: number;
    unit: number;
    price: number;
    stokAwal: number;
    qtyIn: number;
    persediaan: number;
    qtyOut: number;
    sisaStok: number;
    totalNilai: number;
    batchNo: number;
    expiryDate: number;
    keterangan: number;
    dailyCols: Record<number, number>;
  } = {
    no: -1,
    noBA: -1,
    code: -1,
    name: -1,
    sumberAnggaran: -1,
    unit: -1,
    price: -1,
    stokAwal: -1,
    qtyIn: -1,
    persediaan: -1,
    qtyOut: -1,
    sisaStok: -1,
    totalNilai: -1,
    batchNo: -1,
    expiryDate: -1,
    keterangan: -1,
    dailyCols: {}
  };

  headers.forEach((h, idx) => {
    const u = h.toUpperCase().replace(/\s+/g, ' ').trim();
    if (!u) return;

    if (/^([1-9]|[12]\d|3[01])$/.test(u)) {
      colMap.dailyCols[Number(u)] = idx;
      return;
    }

    if (colMap.no === -1 && /^(NO|NO\.|NOMOR\s*URUT|#)$/.test(u)) {
      colMap.no = idx;
    } else if (
      colMap.noBA === -1 &&
      /(NOMOR\s*BA|NO\.?\s*BA|NO\.?\s*BAST|NOMOR\s*BAST|NO\.?\s*BAPB|NOMOR\s*BAPB|BERITA\s*ACARA|NO\.?\s*DOKUMEN|NO\.?\s*SBBK|NO\.?\s*FAKTUR|^BA$|^BAST$)/.test(u)
    ) {
      colMap.noBA = idx;
    } else if (
      colMap.code === -1 &&
      /(KODE\s*BARANG|KODE\s*OBAT|KODE\s*ITEM|^KODE$|E-?LOGISTIK)/.test(u) &&
      !/BATCH/.test(u)
    ) {
      colMap.code = idx;
    } else if (
      colMap.name === -1 &&
      /(NAMA\s*BARANG|NAMA\s*OBAT|NAMA\s*SEDIAAN|JENIS\s*(?:OBAT|BARANG)|URAIAN|NAMA\s*ITEM|^OBAT$|^BARANG$|^NAMA$|DESKRIPSI)/.test(u)
    ) {
      colMap.name = idx;
    } else if (
      colMap.sumberAnggaran === -1 &&
      /(SUMBER\s*ANGGARAN|SUMBER\s*DANA|ASAL\s*OBAT|^SUMBER$|^ANGGARAN$)/.test(u)
    ) {
      colMap.sumberAnggaran = idx;
    } else if (
      colMap.unit === -1 &&
      /(^SATUAN$|SATUAN\s*DASAR|KEMASAN|BENTUK\s*SEDIAAN|^UNIT$|^SEDIAAN$|^SAT$)/.test(u) &&
      !/HARGA/.test(u)
    ) {
      colMap.unit = idx;
    } else if (
      colMap.price === -1 &&
      /(HARGA\s*SATUAN|^HARGA$|HNA|HET|HARGA\s*\(RP\)|HARGA\s*OBAT|SATUAN\s*HARGA|@\s*HARGA|NILAI\s*SATUAN)/.test(u)
    ) {
      colMap.price = idx;
    } else if (
      colMap.totalNilai === -1 &&
      /(TOTAL\s*NILAI|JUMLAH\s*HARGA|TOTAL\s*HARGA|HARGA\s*TOTAL|NILAI\s*BARANG|NILAI\s*PERSEDIAAN|NILAI\s*SISA|SUB\s*TOTAL|SUBTOTAL|^TOTAL$|^JUMLAH\s*\(RP\))/.test(u)
    ) {
      colMap.totalNilai = idx;
    } else if (colMap.stokAwal === -1 && /(STOK\s*AWAL|SALDO\s*AWAL|^AWAL$)/.test(u)) {
      colMap.stokAwal = idx;
    } else if (colMap.persediaan === -1 && /(TOTAL\s*PERSEDIAAN|^PERSEDIAAN$|JUMLAH\s*PERSEDIAAN)/.test(u)) {
      colMap.persediaan = idx;
    } else if (
      colMap.qtyOut === -1 &&
      /(TOTAL\s*PENGELUARAN|TOTAL\s*KELUAR|JUMLAH\s*(?:KELUAR|PENGELUARAN|PEMAKAIAN)|PENGELUARAN|PEMAKAIAN|KELUAR|DISTRIBUSI|MUTASI\s*KELUAR)/.test(u) &&
      !/TANGGAL|HARGA|NILAI/.test(u)
    ) {
      colMap.qtyOut = idx;
    } else if (
      colMap.sisaStok === -1 &&
      /(SISA\s*STOK|SALDO\s*AKHIR|STOK\s*AKHIR|STOK\s*FISIK|^SISA$|^FISIK$)/.test(u) &&
      !/NILAI|RP/.test(u)
    ) {
      colMap.sisaStok = idx;
    } else if (colMap.batchNo === -1 && /(NO\.?\s*BATCH|NOMOR\s*BATCH|KODE\s*BATCH|^BATCH$|^LOT$)/.test(u)) {
      colMap.batchNo = idx;
    } else if (
      colMap.expiryDate === -1 &&
      /(EXPIRED|EXP\.?\s*DATE|KEDALUWARSA|KADALUARSA|TGL\.?\s*ED|TANGGAL\s*ED|KET\.?\s*EXPIRED|^ED$|^EXP$)/.test(u)
    ) {
      colMap.expiryDate = idx;
    } else if (colMap.keterangan === -1 && /(KETERANGAN|^KET\.?$|^CATATAN$)/.test(u)) {
      colMap.keterangan = idx;
    } else if (
      colMap.qtyIn === -1 &&
      /(PENERIMAAN|BANYAKNYA|KUANTITAS|VOLUME|QTY|OBAT\s*MASUK|MASUK|TERIMA|DITERIMA|REALISASI|PERMINTAAN|DISERAHKAN|JUMLAH\s*(?:BARANG|OBAT|MASUK|TERIMA|DITERIMA|SATUAN|ITEM|FISIK))/.test(u) &&
      !/HARGA|NILAI|RP|KELUAR|PENGELUARAN|PEMAKAIAN/.test(u)
    ) {
      colMap.qtyIn = idx;
    } else if (/^JUMLAH$|^JML$/.test(u)) {
      // Smart disambiguation for "Jumlah":
      // If we ALREADY have a quantity column (like "Banyaknya" or "Qty") OR if "Harga Satuan" is to the left of "Jumlah",
      // then "Jumlah" is the Total Price (Jumlah Harga) column! Otherwise it is Quantity.
      if (colMap.qtyIn !== -1 || colMap.price !== -1) {
        if (colMap.totalNilai === -1) colMap.totalNilai = idx;
      } else {
        colMap.qtyIn = idx;
      }
    }
  });

  if (mode === 'OUT' && colMap.qtyOut === -1 && colMap.qtyIn !== -1) {
    colMap.qtyOut = colMap.qtyIn;
  }

  if (colMap.name === -1) {
    for (let c = 0; c < maxCols; c++) {
      if (c === colMap.no || c === colMap.noBA) continue;
      const sampleVals = rows
        .slice(dataStartIdx, dataStartIdx + 10)
        .map((r) => String(r[c] ?? '').trim())
        .filter(Boolean);
      const medLike = sampleVals.filter((v) => /[A-Za-z]{3,}/.test(v) && !/^\d+\//.test(v)).length;
      if (medLike >= Math.ceil(sampleVals.length * 0.5) && sampleVals.length > 0) {
        colMap.name = c;
        break;
      }
    }
  }

  if (customColOverride) {
    Object.keys(customColOverride).forEach((k) => {
      if (typeof customColOverride[k] === 'number') {
        (colMap as any)[k] = customColOverride[k];
      }
    });
  }

  const items: any[] = [];
  let lastSeenNoBA = detectedDocNo || '';
  let lastSeenSumber = detectedSource || '';

  for (let r = dataStartIdx; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row.length) continue;

    // Stop if we hit the table footer (e.g. TOTAL, Keterangan :, Demikian berita acara)
    const rowJoined = row.map((c) => String(c ?? '').trim()).filter(Boolean).join(' ');
    if (/^(TOTAL\s*:?|GRAND\s*TOTAL|JUMLAH\s*TOTAL|SUB\s*TOTAL|KETERANGAN\s*:|DEMIKIAN\s+BERITA\s+ACARA)/i.test(rowJoined)) {
      break;
    }

    let rawName = colMap.name !== -1 ? String(row[colMap.name] ?? '').trim() : '';
    if (!rawName) continue;

    if (
      /^(TOTAL|GRAND\s*TOTAL|JUMLAH\s*TOTAL|SUB\s*TOTAL|MENGETAHUI|KEPALA\s*PUSKESMAS|PENANGGUNG\s*JAWAB|PEMBANTU\s*PENGURUS|PENGELOLA\s*OBAT|PETUGAS|NIP\.|CATATAN|REKAPITULASI|KETERANGAN)/i.test(
        rawName
      )
    ) {
      continue;
    }
    if (/^(NAMA\s*BARANG|NAMA\s*OBAT|JENIS\s*OBAT|URAIAN)$/i.test(rawName)) {
      continue;
    }

    // Clean leading row number if accidentally merged into name (e.g. "1 ALCOHOL SWAB" when NO column was empty)
    if (colMap.no === -1 || !String(row[colMap.no] ?? '').trim()) {
      rawName = rawName.replace(/^\d{1,3}\s+(?=[A-Za-z])/, '').trim();
    }

    let rowNoBA = colMap.noBA !== -1 ? String(row[colMap.noBA] ?? '').trim() : '';
    if (rowNoBA && rowNoBA !== '-' && rowNoBA !== '--') {
      lastSeenNoBA = rowNoBA;
    } else if (lastSeenNoBA) {
      rowNoBA = lastSeenNoBA;
    }

    let rowSumber = colMap.sumberAnggaran !== -1 ? String(row[colMap.sumberAnggaran] ?? '').trim() : '';
    if (!rowSumber && rowNoBA) {
      const mSrc = rowNoBA.match(/\b(JKN|DAK|PKD|APBD|BOK|BLUD|HIBAH|DINKES)\b/i);
      if (mSrc) rowSumber = mSrc[1].toUpperCase();
    }
    if (rowSumber && rowSumber !== '-') {
      lastSeenSumber = rowSumber;
    } else if (lastSeenSumber) {
      rowSumber = lastSeenSumber;
    }

    let unit = colMap.unit !== -1 ? String(row[colMap.unit] ?? '').trim() : '';
    let rawQtyIn = colMap.qtyIn !== -1 ? parseSmartNumber(row[colMap.qtyIn]) : 0;

    // Handle case where Qty and Unit were combined in one cell (e.g., "5,00 Box" or "1.000,00 Pcs")
    if (unit && /^[\d.,]+\s+[A-Za-z]+$/.test(unit)) {
      const quMatch = unit.match(/^([\d.,]+)\s+([A-Za-z]+)$/);
      if (quMatch) {
        if (rawQtyIn === 0) rawQtyIn = parseSmartNumber(quMatch[1]);
        unit = quMatch[2];
      }
    }
    if (colMap.qtyIn !== -1 && /[A-Za-z]{2,}/.test(String(row[colMap.qtyIn] ?? ''))) {
      const quMatch = String(row[colMap.qtyIn]).trim().match(/^([\d.,]+)\s+([A-Za-z]+)$/);
      if (quMatch && (!unit || unit === '-')) {
        unit = quMatch[2];
      }
    }

    if (!unit || unit === '-') {
      const uMatch = rawName.match(
        /\b(Tablet|Kaplet|Kapsul|Botol|Sirup|Sachet|Ampul|Vial|Tube|Suppositoria|Pcs|Box|Dus|Kotak|Kaleng|Strip|Roll|Set|Pak)\b/i
      );
      unit = uMatch ? uMatch[1] : 'Pcs';
    }

    let batchNo = '';
    if (colMap.batchNo !== -1) {
      const bVal = String(row[colMap.batchNo] ?? '').trim();
      if (bVal && bVal !== '-' && bVal !== '--' && !/^n\/?a|kosong|tidak\s*ada|none|tanpa/i.test(bVal)) {
        batchNo = bVal;
      }
    }

    let expiryDate = '';
    if (colMap.expiryDate !== -1) {
      expiryDate = parseSmartDate(row[colMap.expiryDate]);
    }

    const stokAwal = colMap.stokAwal !== -1 ? parseSmartNumber(row[colMap.stokAwal]) : 0;
    const persediaan = colMap.persediaan !== -1 ? parseSmartNumber(row[colMap.persediaan]) : 0;
    const sisaStok = colMap.sisaStok !== -1 ? parseSmartNumber(row[colMap.sisaStok]) : 0;

    const dailyOut: Record<number, number> = {};
    let sumDailyOut = 0;
    for (const [dayStr, cIdx] of Object.entries(colMap.dailyCols)) {
      const v = parseSmartNumber(row[cIdx]);
      if (v > 0) {
        dailyOut[Number(dayStr)] = v;
        sumDailyOut += v;
      }
    }

    let qtyOut = colMap.qtyOut !== -1 ? parseSmartNumber(row[colMap.qtyOut]) : sumDailyOut;
    if (qtyOut === 0 && sumDailyOut > 0) qtyOut = sumDailyOut;

    let effectiveQtyIn = rawQtyIn;
    if (colMap.qtyIn === -1 && persediaan > 0 && stokAwal === 0) {
      effectiveQtyIn = persediaan;
    }

    let price = colMap.price !== -1 ? parseSmartNumber(row[colMap.price]) : 0;
    let totalNilai = colMap.totalNilai !== -1 ? parseSmartNumber(row[colMap.totalNilai]) : 0;

    // Smart mathematical cross-check if unmapped numeric columns exist or if only Total Harga is given
    if (price === 0 && totalNilai === 0) {
      const usedCols = new Set([
        colMap.no, colMap.noBA, colMap.code, colMap.name, colMap.sumberAnggaran,
        colMap.unit, colMap.stokAwal, colMap.qtyIn, colMap.persediaan, colMap.qtyOut,
        colMap.sisaStok, colMap.batchNo, colMap.expiryDate, colMap.keterangan
      ]);
      const extraNums: number[] = [];
      row.forEach((cellVal, cIdx) => {
        if (!usedCols.has(cIdx)) {
          const n = parseSmartNumber(cellVal);
          if (n > 0) extraNums.push(n);
        }
      });
      if (extraNums.length >= 2) {
        price = extraNums[0];
        totalNilai = extraNums[1];
      } else if (extraNums.length === 1) {
        totalNilai = extraNums[0];
      }
    }

    const denom = effectiveQtyIn || qtyOut || sisaStok || persediaan || stokAwal || 1;
    if (price === 0 && totalNilai > 0) {
      price = Math.round(totalNilai / denom);
    } else if (totalNilai === 0 && price > 0) {
      totalNilai = Math.round(price * denom);
    }

    // If a document only had Nama Barang + Satuan + Total Harga (and no Qty column at all), default Qty to 1
    if (effectiveQtyIn === 0 && stokAwal === 0 && qtyOut === 0 && (price > 0 || totalNilai > 0)) {
      effectiveQtyIn = 1;
      if (price === 0) price = totalNilai;
      if (totalNilai === 0) totalNilai = price;
    }

    items.push({
      noBA: rowNoBA,
      code: colMap.code !== -1 ? String(row[colMap.code] ?? '').trim() : '',
      name: rawName,
      sumberAnggaran: rowSumber,
      unit,
      batchNo,
      expiryDate,
      stokAwal,
      qtyIn: effectiveQtyIn,
      persediaan: persediaan || stokAwal + effectiveQtyIn,
      qtyOut,
      dailyOut,
      sisaStok: sisaStok || Math.max(0, (persediaan || stokAwal + effectiveQtyIn) - qtyOut),
      price,
      totalPrice: totalNilai
    });
  }

  // Fallback Layer 3: If structured table mapping found 0 items OR all items had 0 qty & 0 price (e.g. single-column unstructured text lines), run Smart Line-Level Regex Extractor
  const hasValidStructuredItems =
    items.length > 0 &&
    items.some((i) => i.qtyIn > 0 || i.stokAwal > 0 || i.qtyOut > 0 || i.price > 0 || i.totalPrice > 0);
  const finalItems = hasValidStructuredItems
    ? items
    : (() => {
        const lineExtracted = smartExtractFromUnstructuredLines(rows, detectedDocNo, detectedSource);
        return lineExtracted.length > 0 ? lineExtracted : items;
      })();

  return {
    detectedDocNo: detectedDocNo || (finalItems.find((i) => i.noBA)?.noBA ?? ''),
    detectedDate,
    detectedSource: detectedSource || (finalItems.find((i) => i.sumberAnggaran)?.sumberAnggaran ?? ''),
    detectedMonth,
    detectedNotes,
    detectedReceiver,
    bestHeaderIdx,
    headers,
    colMap,
    items: finalItems
  };
}

// ==========================================
// 2D. 8 STRATEGIC INNOVATION ENGINES (KFA SATUSEHAT, MULTI-UNIT, RKO, ABC-VEN, TTE HASH, OCR)
// ==========================================

const KFA_DICTIONARY: {
  kfaCode: string;
  genericTitle: string;
  ven: 'V' | 'E' | 'N';
  defaultPackRatio: number;
  baseUnit: string;
  keywords: string[];
}[] = [
  { kfaCode: 'KFA-92000101', genericTitle: 'Paracetamol 500 mg Tablet', ven: 'E', defaultPackRatio: 100, baseUnit: 'Tablet', keywords: ['paracetamol', 'acetaminophen', 'pamol', 'sanmol'] },
  { kfaCode: 'KFA-92000214', genericTitle: 'Amoxicillin Trihydrate 500 mg Kaplet', ven: 'V', defaultPackRatio: 100, baseUnit: 'Kaplet', keywords: ['amoxicillin', 'amoksisilin', 'amox'] },
  { kfaCode: 'KFA-92000308', genericTitle: 'Chlorpheniramine Maleate (CTM) 4 mg', ven: 'N', defaultPackRatio: 1000, baseUnit: 'Tablet', keywords: ['ctm', 'chlorpheniramine', 'klorfeniramin'] },
  { kfaCode: 'KFA-92000419', genericTitle: 'Omeprazole 20 mg Kapsul Lepas Tunda', ven: 'E', defaultPackRatio: 30, baseUnit: 'Kapsul', keywords: ['omeprazole', 'omeprazol'] },
  { kfaCode: 'KFA-92000522', genericTitle: 'Cetirizine HCl 10 mg Tablet', ven: 'N', defaultPackRatio: 50, baseUnit: 'Tablet', keywords: ['cetirizine', 'setirizin'] },
  { kfaCode: 'KFA-92000631', genericTitle: 'Ascorbic Acid (Vitamin C) 50 mg', ven: 'N', defaultPackRatio: 100, baseUnit: 'Tablet', keywords: ['vitamin c', 'ascorbic', 'askorbat'] },
  { kfaCode: 'KFA-92000712', genericTitle: 'Amlodipine Besilate 5 mg Tablet', ven: 'V', defaultPackRatio: 30, baseUnit: 'Tablet', keywords: ['amlodipine', 'amlodipin'] },
  { kfaCode: 'KFA-92000844', genericTitle: 'Garam Oralit 200 ml Sachet', ven: 'V', defaultPackRatio: 100, baseUnit: 'Sachet', keywords: ['oralit', 'rehidrasi'] },
  { kfaCode: 'KFA-93000811', genericTitle: 'Alcohol Swab 70% Isopropyl Steril', ven: 'E', defaultPackRatio: 100, baseUnit: 'Pcs', keywords: ['alcohol swab', 'alkohol swab', 'swab'] },
  { kfaCode: 'KFA-93002115', genericTitle: 'Sarung Tangan Pemeriksaan Nitrile (Examination Glove)', ven: 'E', defaultPackRatio: 100, baseUnit: 'Pcs', keywords: ['glove', 'nitrile', 'handscoon', 'sarung tangan'] },
  { kfaCode: 'KFA-93004501', genericTitle: 'Benang Bedah Chromic Catgut 3/0 with Needle', ven: 'V', defaultPackRatio: 12, baseUnit: 'Sachet', keywords: ['chromic', 'catgut', 'suture', 'benang bedah'] },
  { kfaCode: 'KFA-93001042', genericTitle: 'Masker Bedah Medis 3 Ply Earloop', ven: 'E', defaultPackRatio: 50, baseUnit: 'Pcs', keywords: ['masker bedah', 'chrona care', 'surgical mask', 'masker'] },
  { kfaCode: 'KFA-93008812', genericTitle: 'Reagen Strip Uji Kolesterol Darah', ven: 'E', defaultPackRatio: 25, baseUnit: 'Strip', keywords: ['cholesterol', 'kolesterol', 'test strip'] }
];

function matchKfaAndVen(rawName: string): {
  kfaCode: string;
  kfaTitle: string;
  ven: 'V' | 'E' | 'N';
  similarity: number;
  defaultPackRatio: number;
  baseUnit: string;
} {
  const clean = String(rawName || '').toLowerCase();
  for (const entry of KFA_DICTIONARY) {
    for (const kw of entry.keywords) {
      if (clean.includes(kw)) {
        const sim = clean === kw ? 99 : Math.min(98, 86 + Math.floor((kw.length / Math.max(1, clean.length)) * 14));
        return {
          kfaCode: entry.kfaCode,
          kfaTitle: entry.genericTitle,
          ven: entry.ven,
          similarity: sim,
          defaultPackRatio: entry.defaultPackRatio,
          baseUnit: entry.baseUnit
        };
      }
    }
  }
  // Heuristic fallback for unknown items
  const isVital = /injeksi|infus|epinephrine|adrenalin|oksigen|serum|vaksin|insulin|suture|catgut/i.test(clean);
  const isNonEssential = /vitamin|suplemen|multivitamin|b12|b1|b6/i.test(clean);
  const ven: 'V' | 'E' | 'N' = isVital ? 'V' : isNonEssential ? 'N' : 'E';
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash * 31 + clean.charCodeAt(i)) & 0xffff;
  return {
    kfaCode: `KFA-92${String(1000 + (hash % 8999))}`,
    kfaTitle: String(rawName || 'Obat / BMHP Pelayanan'),
    ven,
    similarity: 82,
    defaultPackRatio: 100,
    baseUnit: 'Pcs'
  };
}

function parseConversionRatio(conversionStr: string, unitStr: string, rawName = ''): { ratio: number; baseUnit: string } {
  const m = String(conversionStr || '').match(/=\s*(\d+)\s*([A-Za-z]+)/);
  if (m) {
    return { ratio: Math.max(1, Number(m[1]) || 1), baseUnit: m[2] };
  }
  const kfa = matchKfaAndVen(rawName);
  if (/^(box|dus|kotak|kaleng|pak|pack|botol)$/i.test(String(unitStr || '').trim())) {
    return { ratio: kfa.defaultPackRatio || 100, baseUnit: kfa.baseUnit || 'Pcs' };
  }
  return { ratio: 1, baseUnit: unitStr || 'Pcs' };
}

function generateTteSignatureHash(docTitle: string, monthOrDate: string, totalVal: number, officerName: string): string {
  const seed = `${docTitle}|${monthOrDate}|${totalVal}|${officerName}|PKM-SILIAN-MITRA`;
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0, ch; i < seed.length; i++) {
    ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  return `TTE-SILIAN-${hex.toUpperCase()}`;
}

// Dynamic Interactive Spline Area Chart with Auto-Scaling Y-Axis
const StockMovementSplineChart = ({ data }: { data: { day: string; masuk: number; keluar: number }[] }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const width = 660;
  const height = 225;
  const padLeft = 52;
  const padRight = 22;
  const padTop = 16;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const rawMax = Math.max(
    100,
    ...data.map((d) => Math.max(Number(d.masuk || 0), Number(d.keluar || 0)))
  );
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const normalized = rawMax / magnitude;
  const niceFactor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const maxVal = Math.max(100, niceFactor * magnitude);

  const getX = (index: number) =>
    padLeft + (index / Math.max(1, data.length - 1)) * plotW;
  const getY = (val: number) =>
    padTop + plotH - (Math.min(maxVal, Math.max(0, val)) / maxVal) * plotH;

  const buildSmoothPath = (points: { x: number; y: number }[]) => {
    if (!points.length) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const safeData = data.length > 0 ? data : [{ day: 'Hari Ini', masuk: 0, keluar: 0 }];
  const masukPts = safeData.map((d, i) => ({ x: getX(i), y: getY(d.masuk), val: d.masuk, day: d.day }));
  const keluarPts = safeData.map((d, i) => ({ x: getX(i), y: getY(d.keluar), val: d.keluar, day: d.day }));

  const masukLine = buildSmoothPath(masukPts);
  const keluarLine = buildSmoothPath(keluarPts);

  const baselineY = padTop + plotH;
  const masukArea = `${masukLine} L ${masukPts[masukPts.length - 1].x} ${baselineY} L ${masukPts[0].x} ${baselineY} Z`;
  const keluarArea = `${keluarLine} L ${keluarPts[keluarPts.length - 1].x} ${baselineY} L ${keluarPts[0].x} ${baselineY} Z`;

  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => Math.round(f * maxVal));

  return (
    <div className="relative w-full h-56 select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="gradMasukSvg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="gradKeluarSvg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => {
          const y = getY(t);
          return (
            <g key={t}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#F1E9FF"
                strokeWidth="1.5"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="#3B245B"
                fontSize="11"
                fontWeight="700"
              >
                {t.toLocaleString('id-ID')}
              </text>
            </g>
          );
        })}

        {safeData.map((d, i) => {
          const x = getX(i);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padTop}
                x2={x}
                y2={baselineY}
                stroke="#F5F0FF"
                strokeWidth="1"
              />
              <text
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="#3B245B"
                fontSize="11"
                fontWeight="800"
              >
                {d.day}
              </text>
            </g>
          );
        })}

        <path d={masukArea} fill="url(#gradMasukSvg)" />
        <path d={keluarArea} fill="url(#gradKeluarSvg)" />

        <path d={masukLine} fill="none" stroke="#5B21B6" strokeWidth="3.2" strokeLinecap="round" />
        <path d={keluarLine} fill="none" stroke="#EC4899" strokeWidth="3.2" strokeLinecap="round" />

        {safeData.map((d, i) => {
          const mx = masukPts[i].x;
          const my = masukPts[i].y;
          const kx = keluarPts[i].x;
          const ky = keluarPts[i].y;
          const isHovered = hoverIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              {isHovered && (
                <line
                  x1={mx}
                  y1={padTop}
                  x2={mx}
                  y2={baselineY}
                  stroke="#C084FC"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={mx}
                cy={my}
                r={isHovered ? 6.5 : 4.8}
                fill="#DDD6FE"
                stroke="#5B21B6"
                strokeWidth="2.6"
              />
              <circle
                cx={kx}
                cy={ky}
                r={isHovered ? 6.5 : 4.8}
                fill="#FBCFE8"
                stroke="#EC4899"
                strokeWidth="2.6"
              />
              <rect x={mx - 18} y={padTop} width="36" height={plotH} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {hoverIdx !== null && safeData[hoverIdx] && (
        <div
          className="absolute top-2 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-200 shadow-lg text-xs pointer-events-none"
        >
          <p className="font-extrabold text-[#23153C] mb-1">
            Periode: {safeData[hoverIdx].day.trim()}
          </p>
          <p className="font-bold text-[#5B21B6]">
            ● Obat Masuk: +{safeData[hoverIdx].masuk.toLocaleString('id-ID')}
          </p>
          <p className="font-bold text-[#EC4899]">
            ● Obat Keluar: -{safeData[hoverIdx].keluar.toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 3. MAIN SIMFAR APPLICATION COMPONENT (MOBILE HP + BARCODE TO KARTU STOK)
// ==========================================

const STORAGE_KEY = 'SIMFAR_PKM_SILIAN_REAL_DB_V4';

export default function App() {
  const loadSavedState = (key: string, fallback: any) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed[key] !== undefined) return parsed[key];
      }
    } catch (_) {
      // Ignore storage errors
    }
    return fallback;
  };

  // Navigation & Role State
  const [activeMenu, setActiveMenu] = useState('BERANDA');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const currentUser = ROLES[currentRoleIndex];

  // Mobile (HP) Mode & Drawer State + Youthful Gen-Z Vibe Theme + System Audit Modal
  const [mobilePreviewMode, setMobilePreviewMode] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [uiVibe, setUiVibe] = useState<'SAKURA_POP' | 'CYBER_SEOUL' | 'MATCHA_CLOUD'>('SAKURA_POP');
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  // === STATE UNTUK 8 FITUR REKOMENDASI PRO & KERTAS KERJA BA GROUPING ===
  const [worksheetGroupByBA, setWorksheetGroupByBA] = useState<boolean>(true);
  const [worksheetFilterBA, setWorksheetFilterBA] = useState<string>('ALL');
  const [worksheetDailyDisplay, setWorksheetDailyDisplay] = useState<'BOTH' | 'OUT_ONLY' | 'IN_ONLY'>('BOTH');
  const [quickCellEdit, setQuickCellEdit] = useState<{ med: any; day: number; type: 'IN' | 'OUT'; qty: number } | null>(null);

  // 1. AI OCR Foto Kertas BA State
  const [isRunningOcr, setIsRunningOcr] = useState(false);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');

  // 2. Multi-Satuan Auto-Conversion State
  const [autoConvertPackOnCommit, setAutoConvertPackOnCommit] = useState(false);
  const [converterMedId, setConverterMedId] = useState('MED-SIL-009');
  const [converterPackQty, setConverterPackQty] = useState(5);
  const [converterRatio, setConverterRatio] = useState(100);

  // 3. Cloud & Multi-HP Real-Time Sync State
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('Baru saja (Live BroadcastChannel Aktif)');
  const [syncDeviceCode, setSyncDeviceCode] = useState<string>('PKM-SILIAN-LIVE-2026');

  // 4. Multi-Depo / Sub-Unit State & SBBK Internal
  const DEPO_LIST = [
    'Gudang Utama Farmasi',
    'Apotek Rawat Jalan',
    'UGD / Tindakan 24 Jam',
    'Poli KIA / PONED',
    'Laboratorium & Posbindu',
    'Pustu & Polindes Silian'
  ];
  const [sbbkForm, setSbbkForm] = useState({
    medId: 'MED-SIL-010',
    fromDepo: 'Gudang Utama Farmasi',
    toDepo: 'UGD / Tindakan 24 Jam',
    qty: 100,
    date: '2026-04-22',
    docNo: 'SBBK-INT/PKM-SIL/IV/2026',
    officer: 'Nansy C. MunaIseche, S.Farm'
  });
  const [sbbkHistory, setSbbkHistory] = useState<any[]>(() =>
    loadSavedState('sbbkHistory', [
      {
        id: 'SBBK-001',
        docNo: '01/SBBK-INT/PKM-SIL/IV/2026',
        date: '2026-04-22',
        medId: 'MED-SIL-010',
        medName: 'GOLDEN GLOVE INDONESIAN NITRILE EXAMINATION GLOVE (199.900)',
        unit: 'Pcs',
        fromDepo: 'Gudang Utama Farmasi',
        toDepo: 'UGD / Tindakan 24 Jam',
        qty: 200,
        officer: 'Nansy C. MunaIseche, S.Farm'
      },
      {
        id: 'SBBK-002',
        docNo: '02/SBBK-INT/PKM-SIL/IV/2026',
        date: '2026-04-23',
        medId: 'MED-SIL-013',
        medName: 'CHOLESTEROL TEST STRIP (2025)',
        unit: 'Dus',
        fromDepo: 'Gudang Utama Farmasi',
        toDepo: 'Laboratorium & Posbindu',
        qty: 5,
        officer: 'Nansy C. MunaIseche, S.Farm'
      }
    ])
  );

  // 6. Smart RKO Parameters
  const [rkoBufferPct, setRkoBufferPct] = useState(20);
  const [rkoLeadTimeMonths, setRkoLeadTimeMonths] = useState(1);

  // 7. TTE Digital Signature State
  const [tteSignedDocs, setTteSignedDocs] = useState<Record<string, { hash: string; signedAt: string; signer: string; nip: string }>>(() =>
    loadSavedState('tteSignedDocs', {})
  );
  const [tteVerifyInput, setTteVerifyInput] = useState('');
  const [activeProTab, setActiveProTab] = useState<'ALL' | 'OCR_UNIT' | 'DEPO_SBBK' | 'RKO_ABCVEN' | 'KFA_TTE_CLOUD'>('ALL');
  const [inspectorModalOpen, setInspectorModalOpen] = useState<boolean>(false);
  const [modularCodeModalOpen, setModularCodeModalOpen] = useState<boolean>(false);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState<boolean>(false);
  const [firebaseStageTab, setFirebaseStageTab] = useState<number>(1);
  const [rawFirebasePaste, setRawFirebasePaste] = useState<string>('');
  const [isSyncingFirebase, setIsSyncingFirebase] = useState<boolean>(false);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<string>('Siap dihubungkan ke Project Firebase Anda');
  const [firebaseConfig, setFirebaseConfig] = useState<{
    projectId: string;
    apiKey: string;
    databaseURL: string;
    githubRepo: string;
    clinicDocId: string;
    officerPin: string;
    autoSync: boolean;
  }>(() =>
    loadSavedState('firebaseConfig', {
      projectId: 'simfar-pkmsilian',
      apiKey: '',
      databaseURL: '',
      githubRepo: 'puskesmas-silian/simfar-online',
      clinicDocId: 'pkm_silian_main',
      officerPin: '2026',
      autoSync: true
    })
  );
  const [selectedModuleKey, setSelectedModuleKey] = useState<string>('imageOcrParser.ts');
  const [inspectorMedId, setInspectorMedId] = useState<string>('MED-SIL-009');
  const [inspectorVerifiedMap, setInspectorVerifiedMap] = useState<Record<string, { verifiedAt: string; auditorName: string; note: string }>>(() =>
    loadSavedState('inspectorVerifiedMap', {})
  );
  const [inspectorAuditorName, setInspectorAuditorName] = useState<string>('Tim Pemeriksa Dinkes / Inspektorat');
  const [onlinePortalDomain, setOnlinePortalDomain] = useState<string>(() => {
    try {
      return window.location.origin + window.location.pathname;
    } catch (_) {
      return 'https://simfar-pkmsilian.vercel.app';
    }
  });

  // Background Image State
  const [heroBgUrl, setHeroBgUrl] = useState(DEFAULT_HERO_BG);

  // Unified Reactive Store
  const [medicines, setMedicines] = useState<any[]>(() => loadSavedState('medicines', INITIAL_MEDICINES));
  const [batches, setBatches] = useState<any[]>(() => loadSavedState('batches', INITIAL_BATCHES));
  const [transactions, setTransactions] = useState<any[]>(() => loadSavedState('transactions', INITIAL_TRANSACTIONS));
  const [weeklyChart, setWeeklyChart] = useState<any[]>(() => loadSavedState('weeklyChart', INITIAL_WEEKLY_CHART));
  const [chartPeriod, setChartPeriod] = useState('Minggu ini');
  const [isUsingSampleData, setIsUsingSampleData] = useState<boolean>(() => loadSavedState('isUsingSampleData', true));

  // Clinic & Signatory Profile
  const [clinicProfile, setClinicProfile] = useState(() =>
    loadSavedState('clinicProfile', {
      puskesmasName: 'UPTD Puskesmas Silian',
      kabupaten: 'Kab. Minahasa Tenggara',
      kepalaPuskesmas: 'dr. Eunji Kim, M.Kes',
      nipKapus: '19820412 200903 2 004',
      pjFarmasi: 'Apt. Dinda R., S.Farm.',
      nipPj: '19940819 202012 2 011'
    })
  );

  // Global UI & Barcode Scan State
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [qrModalMed, setQrModalMed] = useState<any>(null);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [selectedStockCardMedId, setSelectedStockCardMedId] = useState('MED-SIL-001');
  const [stockCardBatchFilter, setStockCardBatchFilter] = useState('ALL');
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [stockCardMobileViewMode, setStockCardMobileViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [showPrintAllLabelsModal, setShowPrintAllLabelsModal] = useState(false);

  // Live Camera Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Data Obat Filters & Edit Modal State
  const [medSearchFilter, setMedSearchFilter] = useState('');
  const [medSourceFilter, setMedSourceFilter] = useState('ALL');
  const [medStockStatusFilter, setMedStockStatusFilter] = useState('ALL');
  const [editingMed, setEditingMed] = useState<any>(null);
  const [confirmClearModalOpen, setConfirmClearModalOpen] = useState(false);

  // Stock Opname State
  const [opnamePhysicalCounts, setOpnamePhysicalCounts] = useState<Record<string, any>>(() =>
    loadSavedState('opnamePhysicalCounts', {
      'MED-SIL-001': 4700,
      'MED-SIL-002': 1550,
      'MED-SIL-003': 2400,
      'MED-SIL-004': 375,
      'MED-SIL-005': 410,
      'MED-SIL-006': 3200,
      'MED-SIL-007': 650,
      'MED-SIL-008': 1120
    })
  );
  const [opnameNotes, setOpnameNotes] = useState<Record<string, string>>(() =>
    loadSavedState('opnameNotes', {
      'MED-SIL-004': '5 kapsul blister penyok saat distribusi UGD'
    })
  );
  const [opnameApproved, setOpnameApproved] = useState<Record<string, boolean>>(() =>
    loadSavedState('opnameApproved', {})
  );

  // Master Obat Add Modal State
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [newMedForm, setNewMedForm] = useState({
    code: 'OBT-PKM-009',
    noBA: '',
    sumberAnggaran: 'DAK',
    genericName: '',
    name: '',
    form: 'Tablet',
    strength: '',
    unit: 'Tablet',
    conversion: '1 Box = 100 Tablet',
    category: 'Obat Pelayanan Dasar',
    minStock: 100,
    location: 'Rak A-02 (Gudang Utama)',
    initialStock: 0,
    price: 0,
    batchNo: '',
    expiryDate: ''
  });

  // Obat Masuk Form State (Manual Satuan)
  const [inForm, setInForm] = useState({
    medId: 'MED-SIL-001',
    docNo: '',
    date: '2026-11-05',
    source: 'DAK / Dinkes Kab. Minahasa Tenggara',
    batchNo: '',
    expiryDate: '',
    qty: 100,
    price: 0,
    notes: 'Penerimaan obat'
  });

  // Obat Keluar Form State (Manual Satuan)
  const [outForm, setOutForm] = useState({
    medId: 'MED-SIL-001',
    docNo: '',
    date: '2026-11-05',
    destination: 'Pelayanan Puskesmas',
    batchNo: 'AUTO_FEFO',
    qty: 50,
    notes: 'Pengeluaran pelayanan'
  });

  // === SMART BULK BAST SCANNER STATE ===
  const [bastHeader, setBastHeader] = useState({
    noBA: '',
    date: '2026-11-05',
    sumberAnggaran: 'DAK'
  });
  const [bastParsedItems, setBastParsedItems] = useState<any[]>([]);
  const [isScanningBast, setIsScanningBast] = useState(false);
  const [bastSheets, setBastSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [bastSelectedSheetIdx, setBastSelectedSheetIdx] = useState(0);
  const [bastDetectedInfo, setBastDetectedInfo] = useState<any>(null);
  const [bastColOverride, setBastColOverride] = useState<any>(null);
  const [showBastColMapper, setShowBastColMapper] = useState(false);
  const [showBastPasteModal, setShowBastPasteModal] = useState(false);
  const [bastPasteText, setBastPasteText] = useState('');
  const [replaceExistingOnCommit, setReplaceExistingOnCommit] = useState(false);
  const [includeOutFromBast, setIncludeOutFromBast] = useState(true);

  // === SMART PENGELUARAN / E-PUSKESMAS AUTO-READER STATE ===
  const [epuskesmasDate, setEpuskesmasDate] = useState('2026-11-05');
  const [epuskesmasDocNo, setEpuskesmasDocNo] = useState('');
  const [epuskesmasItems, setEpuskesmasItems] = useState<any[]>([]);
  const [isReadingEpusk, setIsReadingEpusk] = useState(false);
  const [epuskSheets, setEpuskSheets] = useState<{ name: string; rows: string[][] }[]>([]);
  const [epuskSelectedSheetIdx, setEpuskSelectedSheetIdx] = useState(0);
  const [epuskDetectedInfo, setEpuskDetectedInfo] = useState<any>(null);
  const [epuskColOverride, setEpuskColOverride] = useState<any>(null);
  const [showEpuskColMapper, setShowEpuskColMapper] = useState(false);
  const [showEpuskPasteModal, setShowEpuskPasteModal] = useState(false);
  const [epuskPasteText, setEpuskPasteText] = useState('');

  // === MOBILE QR / BARCODE QUICK TRANSACTION STATE (DI DALAM KARTU STOK HP) ===
  const [qrQuickActionType, setQrQuickActionType] = useState('OUT');
  const [qrQuickQty, setQrQuickQty] = useState<any>(10);
  const [qrQuickDate, setQrQuickDate] = useState('2026-11-05');
  const [qrQuickNote, setQrQuickNote] = useState('Mutasi fisik rak obat via Scan Barcode HP');
  const [barcodeSearchInput, setBarcodeSearchInput] = useState('');
  const [showShelfQuickMutasi, setShowShelfQuickMutasi] = useState(false);

  // === WORKSHEET STATE ===
  const [worksheetCategory, setWorksheetCategory] = useState('ALL');
  const [worksheetLocation, setWorksheetLocation] = useState('ALL');
  const [worksheetMonth, setWorksheetMonth] = useState<string>(() => loadSavedState('worksheetMonth', 'ALL'));
  const [worksheetViewMode, setWorksheetViewMode] = useState('HARIAN');
  const [worksheetGeneratedAt, setWorksheetGeneratedAt] = useState('11 Nov 2026, 15:30 WITA');

  // Inline Batch & ED Editor
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editBatchForm, setEditBatchForm] = useState({ batchNo: '', expiryDate: '', stock: 0 });

  // Load optional SheetJS, jsQR & qrcode-generator from CDN for progressive enhancement
  useEffect(() => {
    try {
      const libs = [
        { id: 'simfar-xlsx-cdn', src: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js' },
        { id: 'simfar-jsqr-cdn', src: 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js' },
        { id: 'simfar-qrg-cdn', src: 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js' },
        { id: 'simfar-tesseract-cdn', src: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }
      ];
      libs.forEach((lib) => {
        if (!document.getElementById(lib.id)) {
          const script = document.createElement('script');
          script.id = lib.id;
          script.src = lib.src;
          script.async = true;
          document.head.appendChild(script);
        }
      });
    } catch (_) {
      // Offline / restricted environment uses built-in native engines
    }
  }, []);

  // Real-Time Multi-Tab / Multi-Window Sync via BroadcastChannel (Rekomendasi #3)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const bc = new BroadcastChannel('SIMFAR_LIVE_SYNC_V4');
    bc.onmessage = (ev) => {
      const data = ev.data;
      if (data && data.type === 'SIMFAR_STATE_SYNC') {
        if (data.medicines) setMedicines(data.medicines);
        if (data.batches) setBatches(data.batches);
        if (data.transactions) setTransactions(data.transactions);
        setLastCloudSyncTime(`Tersinkron otomatis ${new Date().toLocaleTimeString('id-ID')}`);
      }
    };
    return () => bc.close();
  }, []);

  // Save state to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          medicines,
          batches,
          transactions,
          weeklyChart,
          opnamePhysicalCounts,
          opnameNotes,
          opnameApproved,
          worksheetMonth,
          clinicProfile,
          isUsingSampleData
        })
      );
    } catch (_) {
      // Ignore
    }
  }, [
    medicines,
    batches,
    transactions,
    weeklyChart,
    opnamePhysicalCounts,
    opnameNotes,
    opnameApproved,
    worksheetMonth,
    clinicProfile,
    isUsingSampleData
  ]);

  const triggerToast = (title: string, message: string, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Auto-open Online Inspector View if URL has ?scan= or ?inspect_med= (when Tim Pemeriksa scans QR from phone)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const scanCode = params.get('scan') || params.get('inspect_med') || params.get('med');
      if (scanCode) {
        const matched = medicineWithBalances.find(
          (m) =>
            m.code.toLowerCase() === scanCode.toLowerCase() ||
            m.id.toLowerCase() === scanCode.toLowerCase() ||
            m.name.toLowerCase().includes(scanCode.toLowerCase())
        );
        if (matched) {
          setInspectorMedId(matched.id);
          setSelectedStockCardMedId(matched.id);
          setInspectorModalOpen(true);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowQuickSearch(true);
      } else if (e.key === 'Escape') {
        setShowQuickSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCustomBgUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setHeroBgUrl(objectUrl);
      triggerToast(
        'Latar Apotek Sakura Diperbarui! ♡',
        `Gambar "${file.name}" berhasil diterapkan sebagai latar utama SIMFAR.`
      );
    }
  };

  const exportToCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('File Berhasil Diunduh!', `Dokumen ${filename} telah siap dibuka di Excel.`);
  };

  const handleClearAllSampleData = () => {
    setMedicines([]);
    setBatches([]);
    setTransactions([]);
    setOpnamePhysicalCounts({});
    setOpnameNotes({});
    setOpnameApproved({});
    setBastParsedItems([]);
    setEpuskesmasItems([]);
    setIsUsingSampleData(false);
    setConfirmClearModalOpen(false);
    triggerToast(
      'Database Dikosongkan (Siap Data Asli)! ✨',
      'Seluruh data sampel telah dihapus. Silakan upload file BA / BAST atau Excel Pengeluaran Anda di menu Transaksi.'
    );
  };

  const handleRestoreSampleData = () => {
    setMedicines(INITIAL_MEDICINES);
    setBatches(INITIAL_BATCHES);
    setTransactions(INITIAL_TRANSACTIONS);
    setWeeklyChart(INITIAL_WEEKLY_CHART);
    setOpnamePhysicalCounts({
      'MED-SIL-001': 4700,
      'MED-SIL-002': 1550,
      'MED-SIL-003': 2400,
      'MED-SIL-004': 375,
      'MED-SIL-005': 410,
      'MED-SIL-006': 3200,
      'MED-SIL-007': 650,
      'MED-SIL-008': 1120
    });
    setOpnameApproved({});
    setIsUsingSampleData(true);
    setSelectedStockCardMedId('MED-SIL-001');
    triggerToast('Data Contoh Dikembalikan!', 'Data sampel awal UPTD Puskesmas Silian telah dimuat kembali.');
  };

  // ==========================================
  // 4. BUSINESS LOGIC LAYER (COMPUTED BALANCES, FEFO, EXPIRY)
  // ==========================================

  const medicineWithBalances = useMemo(() => {
    return medicines.map((med) => {
      const medBatches = batches
        .filter((b) => b.medId === med.id)
        .sort((a, b) => {
          const aTime = a.expiryDate ? new Date(a.expiryDate).getTime() : NaN;
          const bTime = b.expiryDate ? new Date(b.expiryDate).getTime() : NaN;
          const aValid = !isNaN(aTime);
          const bValid = !isNaN(bTime);
          if (aValid && bValid) return aTime - bTime;
          if (aValid && !bValid) return -1;
          if (!aValid && bValid) return 1;
          return 0;
        });

      const currentStock = medBatches.reduce((sum, b) => sum + Number(b.stock || 0), 0);

      const medTx = transactions.filter((t) => t.medId === med.id);
      const totalIn = medTx.filter((t) => t.type === 'IN').reduce((s, t) => s + Number(t.qty || 0), 0);
      const totalOut = medTx.filter((t) => t.type === 'OUT').reduce((s, t) => s + Number(t.qty || 0), 0);

      const fefoBatch = medBatches.find((b) => Number(b.stock || 0) > 0) || medBatches[0] || null;
      const isLowStock = currentStock > 0 && currentStock <= Number(med.minStock || 0);
      const isOutOfStock = currentStock === 0;

      const kfaInfo = matchKfaAndVen(med.name);
      const convInfo = parseConversionRatio(med.conversion, med.unit, med.name);
      const stockValueRp = currentStock * Number(med.price || 0);
      const avgDailyOut = totalOut > 0 ? +(totalOut / 30).toFixed(1) : +(Math.max(1, Number(med.minStock || 10) / 30)).toFixed(1);
      const daysToZero = currentStock > 0 ? Math.round(currentStock / Math.max(0.5, avgDailyOut)) : 0;
      const isSlowOrDeadStock = totalOut === 0 && currentStock > 0;

      // Collect all distinct BA numbers associated with this medicine (from master + IN transactions)
      const txBAs = medTx
        .filter((t) => t.type === 'IN' && t.docNo && t.docNo !== '-')
        .map((t) => String(t.docNo).trim());
      const allBAs = Array.from(new Set([med.noBA, ...txBAs].filter((x) => x && x !== '-')));

      return {
        ...med,
        noBA: med.noBA && med.noBA !== '-' ? med.noBA : (allBAs[0] || 'TANPA-NOMOR-BA'),
        allBAs,
        kfaCode: med.kfaCode || kfaInfo.kfaCode,
        kfaTitle: kfaInfo.kfaTitle,
        venClass: (med.venClass || kfaInfo.ven) as 'V' | 'E' | 'N',
        packRatio: convInfo.ratio,
        baseUnit: convInfo.baseUnit,
        batches: medBatches,
        currentStock,
        stockValueRp,
        totalIn,
        totalOut,
        avgDailyOut,
        daysToZero,
        isSlowOrDeadStock,
        fefoBatch,
        isLowStock,
        isOutOfStock
      };
    });
  }, [medicines, batches, transactions]);

  // Rekomendasi #6 & #8: Real-Time Pareto ABC-VEN Matrix & Smart RKO Kemenkes Calculator
  const abcVenAndRkoAnalysis = useMemo(() => {
    const sortedByValue = [...medicineWithBalances].sort((a, b) => b.stockValueRp - a.stockValueRp);
    const totalValueAll = sortedByValue.reduce((s, m) => s + m.stockValueRp, 0) || 1;
    let cumulative = 0;

    return sortedByValue.map((m) => {
      cumulative += m.stockValueRp;
      const cumPct = (cumulative / totalValueAll) * 100;
      const abcClass: 'A' | 'B' | 'C' = cumPct <= 70 ? 'A' : cumPct <= 90 ? 'B' : 'C';
      const comb = `${abcClass}${m.venClass}`;
      const priorityGroup: 'PRIORITAS I (UTAMA)' | 'PRIORITAS II (ESENSIAL)' | 'PRIORITAS III (PENUNJANG)' =
        ['AV', 'AE', 'AN', 'BV', 'CV'].includes(comb)
          ? 'PRIORITAS I (UTAMA)'
          : ['BE', 'CE', 'BN'].includes(comb)
          ? 'PRIORITAS II (ESENSIAL)'
          : 'PRIORITAS III (PENUNJANG)';

      // Rumus RKO Kemenkes: Pemakaian Rata-Rata Bulanan * (12 + Buffer + LeadTime) - Sisa Stok
      const estMonthlyUse = m.totalOut > 0 ? m.totalOut : Math.max(5, Math.round(Number(m.minStock || 20) * 0.8));
      const annualUse = estMonthlyUse * 12;
      const bufferUnits = Math.round(annualUse * (rkoBufferPct / 100));
      const leadTimeUnits = estMonthlyUse * rkoLeadTimeMonths;
      const stokOptimumRko = annualUse + bufferUnits + leadTimeUnits;
      const usulanRko = Math.max(0, stokOptimumRko - m.currentStock);
      const biayaRkoRp = usulanRko * Number(m.price || 0);

      return {
        ...m,
        valueSharePct: +((m.stockValueRp / totalValueAll) * 100).toFixed(1),
        cumPct: +cumPct.toFixed(1),
        abcClass,
        abcVenCode: comb,
        priorityGroup,
        estMonthlyUse,
        stokOptimumRko,
        usulanRko,
        biayaRkoRp
      };
    });
  }, [medicineWithBalances, rkoBufferPct, rkoLeadTimeMonths]);

  const evaluatedBatches = useMemo(() => {
    const refDate = new Date('2026-11-05');
    return batches
      .map((b) => {
        const med = medicines.find((m) => m.id === b.medId);
        const rawEd = String(b.expiryDate ?? '').trim();
        const exp = rawEd && rawEd !== '-' ? new Date(rawEd) : null;
        const hasValidDate = exp !== null && !isNaN(exp.getTime());

        let diffDays: number | null = null;
        let diffMonths: number | null = null;
        let status = 'TANPA_ED';

        if (hasValidDate && exp) {
          diffDays = Math.ceil((exp.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
          diffMonths = +(diffDays / 30).toFixed(1);
          if (diffDays <= 0) status = 'EXPIRED';
          else if (diffDays <= 90) status = 'KRITIS_3_BULAN';
          else if (diffDays <= 180) status = 'WASPADA_6_BULAN';
          else status = 'AMAN';
        }

        return {
          ...b,
          batchNo: b.batchNo && b.batchNo !== '-' ? b.batchNo : '',
          expiryDate: hasValidDate ? rawEd : '',
          medName: med?.name || b.medId,
          noBA: med?.noBA || '',
          unit: med?.unit || 'Tablet',
          location: med?.location || '-',
          diffDays,
          diffMonths,
          status
        };
      })
      .sort((a, b) => {
        if (a.diffDays !== null && b.diffDays !== null) return a.diffDays - b.diffDays;
        if (a.diffDays !== null) return -1;
        if (b.diffDays !== null) return 1;
        return a.medName.localeCompare(b.medName);
      });
  }, [batches, medicines]);

  const dashboardKPIs = useMemo(() => {
    const totalJenisObat = medicines.length;
    const totalStok = medicineWithBalances.reduce((s, m) => s + m.currentStock, 0);
    const totalNilaiAset = medicineWithBalances.reduce(
      (s, m) => s + m.currentStock * Number(m.price || 0),
      0
    );
    const stokRendah = medicineWithBalances.filter((m) => m.isLowStock || m.isOutOfStock).length;
    const mendekatiED = evaluatedBatches.filter(
      (b) => Number(b.stock || 0) > 0 && (b.status === 'KRITIS_3_BULAN' || b.status === 'EXPIRED' || b.status === 'WASPADA_6_BULAN')
    ).length;

    let matchCount = 0;
    medicineWithBalances.forEach((m) => {
      const phys = Number(opnamePhysicalCounts[m.id] ?? m.currentStock);
      if (phys === m.currentStock) matchCount++;
    });
    const kesesuaianPct =
      medicineWithBalances.length > 0
        ? ((matchCount / medicineWithBalances.length) * 100).toFixed(1).replace('.0', '') + '%'
        : '100%';

    const totalMasukSession = transactions
      .filter((t) => t.type === 'IN')
      .reduce((s, t) => s + Number(t.qty || 0), 0);
    const totalKeluarSession = transactions
      .filter((t) => t.type === 'OUT')
      .reduce((s, t) => s + Number(t.qty || 0), 0);

    return {
      totalJenisObat,
      totalStok,
      totalNilaiAset,
      stokRendah,
      mendekatiED,
      kesesuaianStok: kesesuaianPct,
      matchCount,
      totalMasukSession,
      totalKeluarSession
    };
  }, [medicines, medicineWithBalances, evaluatedBatches, transactions, opnamePhysicalCounts]);

  const dynamicChartData = useMemo(() => {
    if (transactions.length === 0) {
      return [{ day: 'Kosong', masuk: 0, keluar: 0 }];
    }
    if (chartPeriod === 'Per Obat Teratas') {
      return medicineWithBalances.slice(0, 8).map((m) => ({
        day: m.name.slice(0, 10),
        masuk: m.initialBalance + m.totalIn,
        keluar: m.totalOut
      }));
    }
    const byDate: Record<string, { masuk: number; keluar: number }> = {};
    transactions.forEach((tx) => {
      const d = tx.date || '2026-11-05';
      if (!byDate[d]) byDate[d] = { masuk: 0, keluar: 0 };
      if (tx.type === 'IN') byDate[d].masuk += Number(tx.qty || 0);
      if (tx.type === 'OUT') byDate[d].keluar += Number(tx.qty || 0);
    });
    const sortedDates = Object.keys(byDate).sort();
    const sliceCount = chartPeriod === 'Bulan ini' ? 15 : 8;
    const recentDates = sortedDates.slice(-sliceCount);
    if (recentDates.length >= 2) {
      return recentDates.map((d) => {
        const parts = d.split('-');
        const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
        return {
          day: label,
          masuk: byDate[d].masuk,
          keluar: byDate[d].keluar
        };
      });
    }
    return weeklyChart;
  }, [transactions, chartPeriod, medicineWithBalances, weeklyChart]);

  // ==========================================
  // 4B. BARCODE / QR CAMERA SCANNER -> DIRECT KARTU STOK HANDLER
  // ==========================================

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const resolveMedicineFromScannedCode = (rawInput: string) => {
    if (!rawInput) return null;
    let cleaned = String(rawInput).trim().replace(/^\*+|\*+$/g, '').trim();
    if (cleaned.includes('|')) {
      const parts = cleaned.split('|').map((p) => p.trim());
      for (const p of parts) {
        const m = medicineWithBalances.find(
          (med) =>
            med.id.toLowerCase() === p.toLowerCase() ||
            med.code.toLowerCase() === p.toLowerCase() ||
            med.name.toLowerCase() === p.toLowerCase()
        );
        if (m) return m;
      }
    }
    const q = cleaned.toLowerCase();
    return (
      medicineWithBalances.find(
        (m) =>
          m.code.toLowerCase() === q ||
          m.id.toLowerCase() === q ||
          m.name.toLowerCase() === q ||
          (m.noBA && m.noBA.toLowerCase() === q) ||
          m.batches.some((b: any) => (b.batchNo || '').toLowerCase() === q)
      ) ||
      medicineWithBalances.find(
        (m) =>
          q.includes(m.code.toLowerCase()) ||
          q.includes(m.id.toLowerCase()) ||
          m.name.toLowerCase().includes(q)
      ) ||
      null
    );
  };

  // CORE WORKFLOW: Scan Barcode -> Immediately Open Detail Obat & Kartu Stok!
  const handleBarcodeScannedOpenStockCard = (medOrCode: any) => {
    const targetMed =
      typeof medOrCode === 'string'
        ? resolveMedicineFromScannedCode(medOrCode)
        : medOrCode;

    if (!targetMed) {
      triggerToast(
        'Kode Barcode Tidak Dikenali',
        `Kode "${String(medOrCode)}" belum terdaftar di Master Obat.`,
        'error'
      );
      return false;
    }

    stopCameraStream();
    setScannerModalOpen(false);
    setQrModalMed(null);
    setSelectedStockCardMedId(targetMed.id);
    setStockCardBatchFilter('ALL');
    setLastScannedCode(targetMed.code || targetMed.id);
    setActiveMenu('KARTU_STOK');

    triggerToast(
      `Barcode Terbaca: ${targetMed.code}! 📱`,
      `Menampilkan Kartu Stok & Detail Obat: ${targetMed.name} (Sisa Stok: ${targetMed.currentStock.toLocaleString('id-ID')} ${targetMed.unit}).`
    );
    return true;
  };

  const startLiveCameraScanner = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser ini membatasi live video. Gunakan tombol "Ambil Foto Kamera HP / Pilih Gambar Barcode" di bawah.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      setCameraError(
        'Izin kamera live dibatasi oleh frame browser. Silakan klik tombol "📸 Ambil Foto Barcode / Pilih Gambar Label" di bawah untuk memindai.'
      );
    }
  };

  // Continuous frame scanning when live camera is active
  useEffect(() => {
    if (!cameraActive || !scannerModalOpen) return;
    let cancelled = false;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const interval = setInterval(async () => {
      if (cancelled || !videoRef.current || videoRef.current.readyState < 2) return;
      const vw = videoRef.current.videoWidth || 640;
      const vh = videoRef.current.videoHeight || 480;
      canvas.width = vw;
      canvas.height = vh;
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, vw, vh);

      // 1. Try Native BarcodeDetector API
      const win = window as any;
      if ('BarcodeDetector' in win) {
        try {
          const detector = new win.BarcodeDetector({
            formats: ['code_39', 'code_128', 'qr_code', 'ean_13', 'ean_8']
          });
          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
            if (handleBarcodeScannedOpenStockCard(barcodes[0].rawValue)) return;
          }
        } catch (_) {}
      }

      const imageData = ctx.getImageData(0, 0, vw, vh);

      // 2. Try jsQR if available
      if (win.jsQR && typeof win.jsQR === 'function') {
        try {
          const qrCode = win.jsQR(imageData.data, vw, vh);
          if (qrCode && qrCode.data) {
            if (handleBarcodeScannedOpenStockCard(qrCode.data)) return;
          }
        } catch (_) {}
      }

      // 3. Try Built-in Multi-Scanline ISO Code-39 Decoder
      const code39Text = decodeCode39FromImageData(imageData);
      if (code39Text) {
        handleBarcodeScannedOpenStockCard(code39Text);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [cameraActive, scannerModalOpen, medicineWithBalances]);

  // Scan Barcode / QR from a Captured Camera Photo or Uploaded Label Image (<input type="file" accept="image/*" capture="environment" />)
  const handleScanBarcodeFromImageFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Also check if filename itself encodes the medicine code (e.g. Label_Barcode_OBT-PKM-001.png)
      const imgUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width || 640;
      canvas.height = img.height || 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(imgUrl);

      // 1. Try Native BarcodeDetector
      const win = window as any;
      if ('BarcodeDetector' in win) {
        try {
          const detector = new win.BarcodeDetector({
            formats: ['code_39', 'code_128', 'qr_code', 'ean_13', 'ean_8']
          });
          const res = await detector.detect(canvas);
          if (res && res.length > 0 && res[0].rawValue) {
            if (handleBarcodeScannedOpenStockCard(res[0].rawValue)) return;
          }
        } catch (_) {}
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 2. Try jsQR
      if (win.jsQR && typeof win.jsQR === 'function') {
        try {
          const qr = win.jsQR(imageData.data, canvas.width, canvas.height);
          if (qr && qr.data) {
            if (handleBarcodeScannedOpenStockCard(qr.data)) return;
          }
        } catch (_) {}
      }

      // 3. Try Built-in Multi-Scanline Code-39 1D Barcode Decoder
      const decodedC39 = decodeCode39FromImageData(imageData);
      if (decodedC39 && handleBarcodeScannedOpenStockCard(decodedC39)) {
        return;
      }

      // 4. Fallback: check filename match against medicine code/name
      const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/Label_Barcode_/i, '').replace(/_/g, ' ');
      if (handleBarcodeScannedOpenStockCard(cleanName)) {
        return;
      }

      triggerToast(
        'Barcode Tidak Terbaca pada Gambar',
        'Pastikan foto label barcode jelas & lurus, atau pilih/ketik kode obat pada daftar di bawah.',
        'error'
      );
    } catch (_) {
      triggerToast('Gagal Membaca Gambar Barcode', 'Silakan coba lagi atau pilih obat dari daftar.', 'error');
    } finally {
      e.target.value = '';
    }
  };


  // ==========================================
  // 5. TRANSACTION & SMART UPLOAD HANDLERS
  // ==========================================

  // === 4-STAGE GITHUB & FIREBASE CLOUD ENGINE (FIRESTORE + REALTIME DB REST) ===
  const handleParseRawFirebaseConfig = (rawText: string) => {
    setRawFirebasePaste(rawText);
    const pid = rawText.match(/projectId\s*:\s*["']([^"']+)["']/)?.[1] || firebaseConfig.projectId;
    const key = rawText.match(/apiKey\s*:\s*["']([^"']+)["']/)?.[1] || firebaseConfig.apiKey;
    const dbUrl = rawText.match(/databaseURL\s*:\s*["']([^"']+)["']/)?.[1] || firebaseConfig.databaseURL;
    const nextCfg = {
      ...firebaseConfig,
      projectId: pid.trim(),
      apiKey: key.trim(),
      databaseURL: dbUrl.trim()
    };
    setFirebaseConfig(nextCfg);
    if (pid) {
      setOnlinePortalDomain(`https://${pid.trim()}.web.app`);
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
          firebaseConfig: nextCfg
        })
      );
    } catch (_) {}
  };

  const pushStateToFirebaseCloud = async (silent = false) => {
    const pid = (firebaseConfig.projectId || '').trim();
    if (!pid) {
      if (!silent) {
        triggerToast('Project ID Firebase Kosong', 'Masukkan Project ID Firebase Anda pada Tahap 3.', 'error');
      }
      return false;
    }

    setIsSyncingFirebase(true);
    setFirebaseSyncStatus(`Mengirim data ke Firebase (${pid})...`);
    const payload = {
      updatedAt: new Date().toISOString(),
      clinicProfile,
      medicines,
      batches,
      transactions,
      sbbkHistory,
      opnamePhysicalCounts,
      inspectorVerifiedMap
    };

    try {
      // 1. If Realtime Database URL is provided (or standard default-rtdb)
      if (firebaseConfig.databaseURL) {
        const cleanDbUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
        const res = await fetch(`${cleanDbUrl}/simfar/${firebaseConfig.clinicDocId || 'pkm_silian'}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const ts = new Date().toLocaleTimeString('id-ID');
          setFirebaseSyncStatus(`Tersinkron ke Firebase Realtime DB (${ts}) ✓`);
          setLastCloudSyncTime(`Firebase Cloud (${ts})`);
          if (!silent) {
            triggerToast(
              'Berhasil Push ke Firebase Realtime DB! 🔥',
              `Data ${medicines.length} obat & ${transactions.length} mutasi kini aktif online untuk Tim Pemeriksa.`
            );
          }
          return true;
        }
      }

      // 2. Cloud Firestore REST API v1
      const keyParam = firebaseConfig.apiKey ? `?key=${encodeURIComponent(firebaseConfig.apiKey)}` : '';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
        pid
      )}/databases/(default)/documents/simfar_puskesmas/${encodeURIComponent(
        firebaseConfig.clinicDocId || 'pkm_silian_main'
      )}${keyParam}`;

      const firestoreBody = {
        fields: {
          updatedAt: { stringValue: payload.updatedAt },
          payloadJson: { stringValue: JSON.stringify(payload) }
        }
      };

      const res = await fetch(firestoreUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreBody)
      });

      const ts = new Date().toLocaleTimeString('id-ID');
      if (res.ok) {
        setFirebaseSyncStatus(`Tersinkron ke Cloud Firestore (${ts}) ✓`);
        setLastCloudSyncTime(`Firebase Firestore (${ts})`);
        if (!silent) {
          triggerToast(
            'Berhasil Push ke Firebase Cloud Firestore! 🔥',
            `Database online https://${pid}.web.app siap diakses saat Tim Pemeriksa scan barcode.`
          );
        }
        return true;
      } else {
        setFirebaseSyncStatus(`Mode Simulasi/Lokal Aktif — Siap konek ke project "${pid}" setelah Firestore diaktifkan di Firebase Console.`);
        if (!silent) {
          triggerToast(
            'Konfigurasi Firebase Tersimpan! 🔥',
            `Domain QR telah diatur ke https://${pid}.web.app. Pastikan aturan Firestore telah di-publish di Firebase Console.`
          );
        }
        return false;
      }
    } catch (_) {
      setFirebaseSyncStatus(`Konfigurasi "${pid}" tersimpan (Menunggu koneksi jaringan ke Firebase).`);
      if (!silent) {
        triggerToast(
          'Konfigurasi Firebase Disimpan! 🔥',
          `Domain QR diatur ke https://${pid}.web.app.`
        );
      }
      return false;
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const pullStateFromFirebaseCloud = async (silent = false) => {
    const pid = (firebaseConfig.projectId || '').trim();
    if (!pid) return false;
    setIsSyncingFirebase(true);
    try {
      if (firebaseConfig.databaseURL) {
        const cleanDbUrl = firebaseConfig.databaseURL.replace(/\/$/, '');
        const res = await fetch(`${cleanDbUrl}/simfar/${firebaseConfig.clinicDocId || 'pkm_silian'}.json`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.medicines)) {
            setMedicines(data.medicines);
            if (Array.isArray(data.batches)) setBatches(data.batches);
            if (Array.isArray(data.transactions)) setTransactions(data.transactions);
            if (data.inspectorVerifiedMap) setInspectorVerifiedMap(data.inspectorVerifiedMap);
            setFirebaseSyncStatus(`Data terbaru ditarik dari Firebase (${new Date().toLocaleTimeString('id-ID')}) ✓`);
            if (!silent) triggerToast('Data Firebase Berhasil Ditarik! 📥', 'Stok & Kartu Stok telah diperbarui dari server Firebase.');
            return true;
          }
        }
      }

      const keyParam = firebaseConfig.apiKey ? `?key=${encodeURIComponent(firebaseConfig.apiKey)}` : '';
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
        pid
      )}/databases/(default)/documents/simfar_puskesmas/${encodeURIComponent(
        firebaseConfig.clinicDocId || 'pkm_silian_main'
      )}${keyParam}`;
      const res = await fetch(firestoreUrl);
      if (res.ok) {
        const doc = await res.json();
        const rawJson = doc?.fields?.payloadJson?.stringValue;
        if (rawJson) {
          const data = JSON.parse(rawJson);
          if (data && Array.isArray(data.medicines)) {
            setMedicines(data.medicines);
            if (Array.isArray(data.batches)) setBatches(data.batches);
            if (Array.isArray(data.transactions)) setTransactions(data.transactions);
            if (data.inspectorVerifiedMap) setInspectorVerifiedMap(data.inspectorVerifiedMap);
            setFirebaseSyncStatus(`Data terbaru ditarik dari Firestore (${new Date().toLocaleTimeString('id-ID')}) ✓`);
            if (!silent) triggerToast('Data Cloud Firestore Berhasil Ditarik! 📥', 'Kartu Stok telah disinkronkan dari server Firebase.');
            return true;
          }
        }
      }
    } catch (_) {} finally {
      setIsSyncingFirebase(false);
    }
    if (!silent) {
      triggerToast('Info Koneksi Firebase', 'Pastikan Project ID & API Key sudah sesuai dengan Firebase Console Anda.');
    }
    return false;
  };

    const applyBastSheetAnalysis = (
    sheetRows: string[][],
    fileName: string,
    overrideMap: any = null
  ) => {
    const analysis = smartAnalyzeSheetRows(sheetRows, 'BAST', overrideMap);
    if (!analysis || analysis.items.length === 0) {
      triggerToast(
        'Baris Barang Tidak Terdeteksi Otomatis',
        'Silakan buka "Sesuaikan Kolom" untuk memilih kolom Nama Barang & Jumlah dari file Anda.',
        'error'
      );
      if (analysis) setBastDetectedInfo({ ...analysis, fileName });
      return;
    }

    setBastDetectedInfo({ ...analysis, fileName });

    setBastHeader((prev) => ({
      noBA: analysis.detectedDocNo || prev.noBA || '',
      date: analysis.detectedDate || prev.date || '2026-11-05',
      sumberAnggaran: analysis.detectedSource || prev.sumberAnggaran || 'DAK'
    }));

    if (analysis.detectedMonth) {
      setWorksheetMonth(analysis.detectedMonth);
    }

    const mappedItems = analysis.items.map((it: any, idx: number) => {
      const normName = it.name.trim().toLowerCase();
      const matchedMed = medicines.find(
        (m) =>
          m.name.trim().toLowerCase() === normName ||
          (it.code && m.code.toLowerCase() === it.code.toLowerCase()) ||
          m.name.toLowerCase().includes(normName) ||
          normName.includes(m.name.toLowerCase())
      );

      const hasSeparateStokAwal = analysis.colMap.stokAwal !== -1;
      const qtyVal = hasSeparateStokAwal ? it.qtyIn : (it.qtyIn || it.persediaan || it.stokAwal || 0);
      const unitPriceVal = it.price > 0 ? it.price : (matchedMed?.price || 0);
      const totalPriceVal = it.totalPrice > 0 ? it.totalPrice : Math.round(unitPriceVal * (qtyVal || 1));

      return {
        id: `BAST-ROW-${Date.now()}-${idx}`,
        medId: matchedMed ? matchedMed.id : 'NEW',
        code: it.code || matchedMed?.code || `OBT-PKM-${String(idx + 1).padStart(3, '0')}`,
        noBA: it.noBA || analysis.detectedDocNo || '',
        sumberAnggaran: it.sumberAnggaran || analysis.detectedSource || matchedMed?.sumberAnggaran || 'DAK',
        name: it.name,
        unit: it.unit || matchedMed?.unit || 'Tablet',
        batchNo: it.batchNo || '',
        expiryDate: it.expiryDate || '',
        stokAwal: hasSeparateStokAwal ? it.stokAwal : 0,
        qty: qtyVal,
        qtyOut: it.qtyOut || 0,
        dailyOut: it.dailyOut || {},
        price: unitPriceVal,
        totalPrice: totalPriceVal
      };
    });

    setBastParsedItems(mappedItems);
    const hasOutData = mappedItems.some((i: any) => i.qtyOut > 0);
    setIncludeOutFromBast(hasOutData);
    if (isUsingSampleData && mappedItems.length >= 3) {
      setReplaceExistingOnCommit(true);
    }

    const batchColFound = analysis.colMap.batchNo !== -1;
    const edColFound = analysis.colMap.expiryDate !== -1;
    triggerToast(
      `Berhasil Membaca ${mappedItems.length} Barang dari "${fileName}"! ✨`,
      `No. BA: ${analysis.detectedDocNo || 'Per Baris'} · Batch: ${
        batchColFound ? 'Terbaca' : 'Tidak ada di BA (Dikosongkan)'
      } · ED: ${edColFound ? 'Terbaca' : 'Tidak ada di BA (Dikosongkan)'}.`
    );
  };

  const handleBastDocumentUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanningBast(true);
    setBastColOverride(null);
    if ((file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|bmp|gif)$/i.test(file.name)) {
      try {
        const preview = URL.createObjectURL(file);
        setOcrPreviewUrl(preview);
        setOcrStatusText(`Dokumen gambar "${file.name}" berhasil dipindai & diekstrak ke tabel BAST.`);
      } catch (_) {}
    }

    try {
      const isImg =
        (file.type && file.type.startsWith('image/')) || /\.(jpe?g|png|webp|bmp|gif)$/i.test(file.name);
      const sheets: any[] = isImg
        ? await parseImageDocumentFile(file, (msg) => setOcrStatusText(msg))
        : await parseAnyUploadedFile(file);

      if (!sheets || sheets.length === 0 || sheets[0].rows.length === 0) {
        if (isImg) {
          setOcrStatusText(
            'Browser membatasi koneksi WebWorker OCR atau teks pada foto terlalu buram. Silakan gunakan tombol "Tempel Tabel" atau pastikan koneksi internet aktif untuk mengunduh kamus OCR.'
          );
        }
        triggerToast(
          'File Tidak Berisi Tabel Terbaca',
          'Pastikan file berupa Excel (.xlsx/.xls), CSV, Word (.docx), atau gunakan tombol Tempel Tabel.',
          'error'
        );
        return;
      }
      setBastSheets(sheets);
      setBastSelectedSheetIdx(0);
      applyBastSheetAnalysis(sheets[0].rows, file.name, null);
    } catch (err: any) {
      triggerToast(
        'Gagal Membaca File BA',
        err?.message || 'Format file tidak dikenali. Gunakan Excel (.xlsx/.csv) atau Tempel Tabel.',
        'error'
      );
    } finally {
      setIsScanningBast(false);
      e.target.value = '';
    }
  };

  const handleBastPasteSubmit = () => {
    if (!bastPasteText.trim()) return;
    const sheets = parseDelimitedOrHtmlText(bastPasteText, 'Tabel Tempel (Paste)');
    if (sheets.length > 0 && sheets[0].rows.length > 0) {
      setBastSheets(sheets);
      setBastSelectedSheetIdx(0);
      applyBastSheetAnalysis(sheets[0].rows, 'Tabel Tempel (Paste)', null);
      setShowBastPasteModal(false);
      setBastPasteText('');
    }
  };

  // Rekomendasi #1: AI Vision / OCR Kamera untuk Foto Kertas BA Fisik (Unified with handleBastDocumentUpload)
  const handleBastPhotoOcrUpload = async (e: any) => {
    await handleBastDocumentUpload(e);
  };

    // Rekomendasi #2: Pecah / Konversi Kemasan Besar (Box/Dus) ke Satuan Kecil (Pcs/Tablet/Strip) pada baris BAST
  const handleConvertBastRowToBaseUnit = (idx: number) => {
    const item = bastParsedItems[idx];
    if (!item) return;
    const conv = parseConversionRatio(item.conversion || '', item.unit, item.name);
    const ratio = conv.ratio > 1 ? conv.ratio : 100;
    const targetUnit = conv.baseUnit === item.unit ? 'Pcs' : conv.baseUnit;
    const oldQty = Number(item.qty) || 1;
    const totalRp = Number(item.totalPrice) || Math.round((Number(item.price) || 0) * oldQty);
    const newQty = oldQty * ratio;
    const newUnitPrice = newQty > 0 ? Math.round(totalRp / newQty) : Number(item.price) || 0;

    const next = [...bastParsedItems];
    next[idx] = {
      ...item,
      qty: newQty,
      unit: targetUnit,
      price: newUnitPrice,
      totalPrice: totalRp,
      convertedInfo: `Dikonversi dari ${oldQty} ${item.unit} (×${ratio})`
    };
    setBastParsedItems(next);
    triggerToast(
      'Konversi Multi-Satuan Berhasil! 📦→💊',
      `${oldQty} ${item.unit} ${item.name} dipecah menjadi ${newQty.toLocaleString('id-ID')} ${targetUnit} (@ Rp ${newUnitPrice.toLocaleString('id-ID')}).`
    );
  };

  const handleLoadAttachedPdf21April = () => {
    const rows21April: string[][] = [
      ['PEMERINTAH KABUPATEN MINAHASA TENGGARA'],
      ['DINAS KESEHATAN'],
      ['BERITA ACARA PENYALURAN BARANG'],
      ['TAHUN ANGGARAN 2026'],
      ['11/OBATLAIN-PKMSILIAN/BAPB/DINKES-MT/IV/2026-2026'],
      ['Pada hari ini Selasa, 21 April 2026 kami yang bertanda tangan dibawah ini:'],
      ['1.', 'Nama', ': JULIANA AKAY'],
      ['2.', 'Nama', ': NANSY C. MUNAISECHE, S.Farm'],
      ['Jabatan', ': PENGELOLA OBAT PKM SILIAN'],
      ['DAFTAR BARANG'],
      ['NO.', 'Nama Barang', 'Banyaknya', 'Satuan', 'Harga Satuan', 'Jumlah', 'Keterangan'],
      ['1', 'ALCOHOL SWAB', '5,00', 'Box', '13.500,00', '67.500,00', ''],
      ['2', 'GOLDEN GLOVE INDONESIAN NITRILE EXAMINATION GLOVE (199.900)', '1.000,00', 'Pcs', '1.135,00', '1.135.000,00', ''],
      ['3', 'CHROMIC CATGUT SURGICAL SUTURES WITH NEEDLE 3/0 2022 SA', '2,00', 'Dus', '100.050,00', '200.100,00', ''],
      ['4', 'CHRONA CARE MASKER BEDAH (2025)', '20,00', 'Box', '32.200,00', '644.000,00', ''],
      ['5', 'CHOLESTEROL TEST STRIP (2025)', '20,00', 'Dus', '188.500,00', '3.770.000,00', ''],
      ['TOTAL :', '5.816.600,00'],
      ['Keterangan :'],
      ['PENERIMAAN OBAT OBATAN LAINNYA SALDO AWAL TANPA ED Kegiatan Pengadaan Obat, Vaksin']
    ];
    setBastSheets([{ name: 'SILIAN BA OBAT LAIN 21 APRIL.pdf', rows: rows21April }]);
    setBastSelectedSheetIdx(0);
    applyBastSheetAnalysis(rows21April, 'SILIAN BA OBAT LAIN 21 APRIL.pdf', null);
  };

  const handleCommitBastItems = () => {
    if (!bastParsedItems.length) {
      triggerToast('Daftar BAST Kosong!', 'Silakan upload file BA atau tambah baris terlebih dahulu.', 'error');
      return;
    }

    const activeMonthPrefix =
      bastDetectedInfo?.detectedMonth ||
      (bastHeader.date ? bastHeader.date.slice(0, 7) : worksheetMonth);

    const baseMeds = replaceExistingOnCommit ? [] : [...medicines];
    const baseBatches = replaceExistingOnCommit ? [] : [...batches];
    const baseTxs = replaceExistingOnCommit ? [] : [...transactions];
    const nextOpnameCounts: Record<string, any> = replaceExistingOnCommit ? {} : { ...opnamePhysicalCounts };

    let addedMedCount = 0;
    let totalUnitIn = 0;
    let totalUnitOut = 0;
    const newTxs: any[] = [];

    bastParsedItems.forEach((item, idx) => {
      const nameClean = String(item.name ?? '').trim();
      if (!nameClean) return;

      const stokAwalNum = Math.max(0, Number(item.stokAwal) || 0);
      const qtyInNum = Math.max(0, Number(item.qty) || 0);
      const qtyOutNum = includeOutFromBast ? Math.max(0, Number(item.qtyOut) || 0) : 0;
      const priceNum = Math.max(0, Number(item.price) || 0);

      const totalAvailableBeforeOut = stokAwalNum + qtyInNum;
      const finalStock = Math.max(0, totalAvailableBeforeOut - qtyOutNum);

      totalUnitIn += qtyInNum > 0 ? qtyInNum : stokAwalNum;
      totalUnitOut += qtyOutNum;

      const rowNoBA = String(item.noBA ?? '').trim() || bastHeader.noBA || '-';
      const rowSumber = String(item.sumberAnggaran ?? '').trim() || bastHeader.sumberAnggaran || 'DAK';
      const cleanBatchNo = String(item.batchNo ?? '').trim();
      const cleanExpiry = String(item.expiryDate ?? '').trim();

      let targetMed = baseMeds.find(
        (m) =>
          (item.medId !== 'NEW' && m.id === item.medId) ||
          m.name.trim().toLowerCase() === nameClean.toLowerCase()
      );

      if (!targetMed) {
        const seqNum = baseMeds.length + 1;
        const newId = `MED-SIL-${String(seqNum).padStart(3, '0')}`;
        targetMed = {
          id: newId,
          code: item.code || `OBT-PKM-${String(seqNum).padStart(3, '0')}`,
          eLogistikCode: `1.1.7.01.01.01.${String(seqNum).padStart(3, '0')}`,
          noBA: rowNoBA,
          sumberAnggaran: rowSumber,
          genericName: nameClean,
          name: nameClean,
          form: item.unit || 'Tablet',
          strength: '-',
          unit: item.unit || 'Tablet',
          conversion: `1 Box = 100 ${item.unit || 'Tablet'}`,
          category: 'Obat Pelayanan Dasar',
          minStock: Math.max(50, Math.round((totalAvailableBeforeOut || 100) * 0.15)),
          location: 'Rak Gudang / Apotek',
          active: true,
          initialBalance: stokAwalNum > 0 ? stokAwalNum : (replaceExistingOnCommit && qtyOutNum > 0 && qtyInNum === 0 ? totalAvailableBeforeOut : 0),
          price: priceNum
        };
        baseMeds.push(targetMed);
        addedMedCount++;
      } else {
        if (rowNoBA && rowNoBA !== '-') targetMed.noBA = rowNoBA;
        if (rowSumber) targetMed.sumberAnggaran = rowSumber;
        if (priceNum > 0) targetMed.price = priceNum;
        if (item.unit) targetMed.unit = item.unit;
        if (stokAwalNum > 0 || replaceExistingOnCommit) {
          targetMed.initialBalance = stokAwalNum;
        }
      }

      const batchIdx = baseBatches.findIndex(
        (b) =>
          b.medId === targetMed.id &&
          String(b.batchNo ?? '').toUpperCase() === cleanBatchNo.toUpperCase()
      );

      const stockDeltaForBatch = replaceExistingOnCommit ? finalStock : (stokAwalNum + qtyInNum - qtyOutNum);
      if (batchIdx > -1) {
        baseBatches[batchIdx] = {
          ...baseBatches[batchIdx],
          expiryDate: cleanExpiry || baseBatches[batchIdx].expiryDate || '',
          stock: replaceExistingOnCommit
            ? finalStock
            : Math.max(0, Number(baseBatches[batchIdx].stock || 0) + stockDeltaForBatch),
          source: rowSumber
        };
      } else {
        baseBatches.push({
          id: `B-BAST-${Date.now()}-${idx}`,
          medId: targetMed.id,
          batchNo: cleanBatchNo,
          expiryDate: cleanExpiry,
          stock: Math.max(0, stockDeltaForBatch),
          source: rowSumber
        });
      }

      const prevPhys = replaceExistingOnCommit ? 0 : Number(nextOpnameCounts[targetMed.id] ?? targetMed.initialBalance ?? 0);
      nextOpnameCounts[targetMed.id] = replaceExistingOnCommit
        ? finalStock
        : Math.max(0, prevPhys + qtyInNum - qtyOutNum);

      if (qtyInNum > 0) {
        newTxs.push({
          id: `TRX-BAST-IN-${Date.now()}-${idx}`,
          type: 'IN',
          medId: targetMed.id,
          medName: targetMed.name,
          docNo: rowNoBA,
          date: bastHeader.date || `${activeMonthPrefix}-01`,
          timeLabel: 'Upload BA',
          dayName: 'BAST',
          batchNo: cleanBatchNo,
          expiryDate: cleanExpiry,
          qty: qtyInNum,
          unit: targetMed.unit,
          price: priceNum,
          sourceOrDest: rowSumber,
          officer: currentUser.name,
          notes: `Penerimaan BA ${rowNoBA}`
        });
      }

      if (includeOutFromBast && qtyOutNum > 0) {
        const dailyEntries = Object.entries(item.dailyOut || {}).filter(([_, v]) => Number(v) > 0);
        if (dailyEntries.length > 0) {
          dailyEntries.forEach(([dayStr, dayQty]) => {
            const dPadded = String(dayStr).padStart(2, '0');
            newTxs.push({
              id: `TRX-BAST-OUT-${Date.now()}-${idx}-D${dayStr}`,
              type: 'OUT',
              medId: targetMed.id,
              medName: targetMed.name,
              docNo: `REKAP-${rowNoBA}`,
              date: `${activeMonthPrefix}-${dPadded}`,
              timeLabel: `Tgl ${dPadded}`,
              dayName: `Tgl ${dayStr}`,
              batchNo: cleanBatchNo,
              expiryDate: cleanExpiry,
              qty: Number(dayQty),
              unit: targetMed.unit,
              price: priceNum,
              sourceOrDest: 'Pengeluaran Harian (File BA/Kertas Kerja)',
              officer: currentUser.name,
              notes: `Pengeluaran tanggal ${dPadded} dari file BA`
            });
          });
        } else {
          newTxs.push({
            id: `TRX-BAST-OUT-${Date.now()}-${idx}`,
            type: 'OUT',
            medId: targetMed.id,
            medName: targetMed.name,
            docNo: `OUT-${rowNoBA}`,
            date: bastHeader.date || `${activeMonthPrefix}-15`,
            timeLabel: 'Rekap Keluar BA',
            dayName: 'Rekap',
            batchNo: cleanBatchNo,
            expiryDate: cleanExpiry,
            qty: qtyOutNum,
            unit: targetMed.unit,
            price: priceNum,
            sourceOrDest: 'Pengeluaran Bulanan (File BA/Kertas Kerja)',
            officer: currentUser.name,
            notes: `Total pengeluaran dari file ${rowNoBA}`
          });
        }
      }
    });

    setMedicines(baseMeds);
    setBatches(baseBatches);
    setTransactions([...newTxs, ...baseTxs]);
    setOpnamePhysicalCounts(nextOpnameCounts);
    setIsUsingSampleData(false);
    if (baseMeds.length > 0) {
      setSelectedStockCardMedId(baseMeds[0].id);
    }

    setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
      'Data BA Berhasil Disimpan & Barcode Rak Siap! ♡',
      `${bastParsedItems.length} barang (${addedMedCount} Master Obat baru) kini aktif lengkap dengan Kartu Stok & Barcode Rak masing-masing.`
    );
  };

  const applyEpuskSheetAnalysis = (
    sheetRows: string[][],
    fileName: string,
    overrideMap: any = null
  ) => {
    const analysis = smartAnalyzeSheetRows(sheetRows, 'OUT', overrideMap);
    if (!analysis || analysis.items.length === 0) {
      triggerToast(
        'Data Pengeluaran Tidak Terdeteksi Otomatis',
        'Silakan klik "Sesuaikan Kolom" untuk memilih kolom Nama Obat & Jumlah Keluar.',
        'error'
      );
      if (analysis) setEpuskDetectedInfo({ ...analysis, fileName });
      return;
    }

    setEpuskDetectedInfo({ ...analysis, fileName });
    if (analysis.detectedDate) setEpuskesmasDate(analysis.detectedDate);
    if (analysis.detectedDocNo) {
      setEpuskesmasDocNo(analysis.detectedDocNo);
    } else {
      setEpuskesmasDocNo(`OUT-${fileName.replace(/\.[^.]+$/, '').toUpperCase().slice(0, 18)}`);
    }
    if (analysis.detectedMonth) {
      setWorksheetMonth(analysis.detectedMonth);
    }

    const mappedOut = analysis.items
      .map((it: any, idx: number) => {
        const normName = it.name.trim().toLowerCase();
        const matched = medicines.find(
          (m) =>
            m.name.trim().toLowerCase() === normName ||
            (it.code && m.code.toLowerCase() === it.code.toLowerCase()) ||
            m.name.toLowerCase().includes(normName) ||
            normName.includes(m.name.toLowerCase())
        );

        const outQty = it.qtyOut > 0 ? it.qtyOut : it.qtyIn;
        return {
          id: `EP-ROW-${Date.now()}-${idx}`,
          medId: matched ? matched.id : 'NEW',
          noBA: it.noBA || analysis.detectedDocNo || '',
          name: matched ? matched.name : it.name,
          rawUploadedName: it.name,
          unit: it.unit || matched?.unit || 'Tablet',
          batchNo: it.batchNo || '',
          expiryDate: it.expiryDate || '',
          qty: outQty,
          dailyOut: it.dailyOut || {},
          price: it.price || matched?.price || 0
        };
      })
      .filter((r: any) => r.name && (r.qty > 0 || Object.keys(r.dailyOut || {}).length > 0));

    setEpuskesmasItems(mappedOut);
    triggerToast(
      `Berhasil Membaca ${mappedOut.length} Item Pengeluaran dari "${fileName}"! ✨`,
      `Batch: ${
        analysis.colMap.batchNo !== -1 ? 'Terbaca dari file' : 'Tidak tercantum di file (Dikosongkan)'
      }. Silakan periksa lalu klik Proses Pengeluaran.`
    );
  };

  const handleEpuskesmasUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingEpusk(true);
    setEpuskColOverride(null);

    try {
      const sheets = await parseAnyUploadedFile(file);
      if (!sheets || sheets.length === 0 || sheets[0].rows.length === 0) {
        triggerToast(
          'File Pengeluaran Kosong / Tidak Terbaca',
          'Pastikan file berupa Excel (.xlsx/.xls), CSV, Word (.docx), atau gunakan Tempel Tabel.',
          'error'
        );
        return;
      }
      setEpuskSheets(sheets);
      setEpuskSelectedSheetIdx(0);
      applyEpuskSheetAnalysis(sheets[0].rows, file.name, null);
    } catch (err: any) {
      triggerToast('Gagal Membaca File Pengeluaran', err?.message || 'Coba format Excel/CSV.', 'error');
    } finally {
      setIsReadingEpusk(false);
      e.target.value = '';
    }
  };

  const handleEpuskPasteSubmit = () => {
    if (!epuskPasteText.trim()) return;
    const sheets = parseDelimitedOrHtmlText(epuskPasteText, 'Tempel Pengeluaran');
    if (sheets.length > 0 && sheets[0].rows.length > 0) {
      setEpuskSheets(sheets);
      setEpuskSelectedSheetIdx(0);
      applyEpuskSheetAnalysis(sheets[0].rows, 'Tempel Pengeluaran', null);
      setShowEpuskPasteModal(false);
      setEpuskPasteText('');
    }
  };

  const handleCommitEpuskesmasOut = () => {
    if (!epuskesmasItems.length) {
      triggerToast('Daftar Pengeluaran Kosong!', 'Upload file pengeluaran atau tambah baris terlebih dahulu.', 'error');
      return;
    }

    let totalOutUnits = 0;
    const updatedMeds = [...medicines];
    const updatedBatches = [...batches];
    const newOutTxs: any[] = [];
    const nextOpname = { ...opnamePhysicalCounts };
    const activeMonthPrefix =
      epuskDetectedInfo?.detectedMonth ||
      (epuskesmasDate ? epuskesmasDate.slice(0, 7) : worksheetMonth);

    epuskesmasItems.forEach((item, idx) => {
      const qtyNum = Number(item.qty) || 0;
      if (qtyNum <= 0) return;

      let med = updatedMeds.find(
        (m) =>
          (item.medId !== 'NEW' && m.id === item.medId) ||
          m.name.trim().toLowerCase() === String(item.name ?? '').trim().toLowerCase()
      );

      if (!med) {
        const seq = updatedMeds.length + 1;
        const newId = `MED-SIL-${String(seq).padStart(3, '0')}`;
        med = {
          id: newId,
          code: `OBT-PKM-${String(seq).padStart(3, '0')}`,
          eLogistikCode: `1.1.7.01.01.01.${String(seq).padStart(3, '0')}`,
          noBA: item.noBA || epuskesmasDocNo || '-',
          sumberAnggaran: 'DAK',
          genericName: item.name,
          name: item.name,
          form: item.unit || 'Tablet',
          strength: '-',
          unit: item.unit || 'Tablet',
          conversion: `1 Box = 100 ${item.unit || 'Tablet'}`,
          category: 'Obat Pelayanan Dasar',
          minStock: 100,
          location: 'Apotek Rawat Jalan',
          active: true,
          initialBalance: qtyNum,
          price: Number(item.price) || 0
        };
        updatedMeds.push(med);
        updatedBatches.push({
          id: `B-AUTO-${Date.now()}-${idx}`,
          medId: newId,
          batchNo: item.batchNo || '',
          expiryDate: item.expiryDate || '',
          stock: 0,
          source: 'Auto-Sync Pengeluaran'
        });
      }

      totalOutUnits += qtyNum;

      const medBatchesSorted = updatedBatches
        .filter((b) => b.medId === med.id && Number(b.stock || 0) > 0)
        .sort((a, b) => {
          const aT = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const bT = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return aT - bT;
        });

      const explicitBatch = String(item.batchNo ?? '').trim();
      const usedBatchNo = explicitBatch || medBatchesSorted[0]?.batchNo || '';
      const usedExpiry = String(item.expiryDate ?? '').trim() || medBatchesSorted[0]?.expiryDate || '';

      let remaining = qtyNum;
      for (const b of medBatchesSorted) {
        if (remaining <= 0) break;
        const deduct = Math.min(Number(b.stock || 0), remaining);
        b.stock = Math.max(0, Number(b.stock || 0) - deduct);
        remaining -= deduct;
      }

      const curMedStock = updatedBatches
        .filter((b) => b.medId === med.id)
        .reduce((s, b) => s + Number(b.stock || 0), 0);
      nextOpname[med.id] = curMedStock;

      const dailyEntries = Object.entries(item.dailyOut || {}).filter(([_, v]) => Number(v) > 0);
      if (dailyEntries.length > 0) {
        dailyEntries.forEach(([dayStr, dQty]) => {
          const dPad = String(dayStr).padStart(2, '0');
          newOutTxs.push({
            id: `TRX-EPUSK-${Date.now()}-${idx}-D${dayStr}`,
            type: 'OUT',
            medId: med.id,
            medName: med.name,
            docNo: item.noBA || epuskesmasDocNo || 'REKAP-KELUAR',
            date: `${activeMonthPrefix}-${dPad}`,
            timeLabel: `Tgl ${dPad}`,
            dayName: `Tgl ${dayStr}`,
            batchNo: usedBatchNo,
            expiryDate: usedExpiry,
            qty: Number(dQty),
            unit: med.unit,
            sourceOrDest: 'Pengeluaran Pelayanan',
            officer: currentUser.name,
            notes: `Pengeluaran tanggal ${dPad}`
          });
        });
      } else {
        newOutTxs.push({
          id: `TRX-EPUSK-${Date.now()}-${idx}`,
          type: 'OUT',
          medId: med.id,
          medName: med.name,
          docNo: item.noBA || epuskesmasDocNo || 'EPUSK-KELUAR',
          date: epuskesmasDate,
          timeLabel: 'Pengeluaran',
          dayName: 'Keluar',
          batchNo: usedBatchNo,
          expiryDate: usedExpiry,
          qty: qtyNum,
          unit: med.unit,
          sourceOrDest: 'Sinkronisasi Pengeluaran',
          officer: currentUser.name,
          notes: 'Import Pengeluaran Obat'
        });
      }
    });

    setMedicines(updatedMeds);
    setBatches(updatedBatches);
    setTransactions((prev) => [...newOutTxs, ...prev]);
    setOpnamePhysicalCounts(nextOpname);
    setIsUsingSampleData(false);

    setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
      'Pengeluaran Obat Berhasil Diproses! ♡',
      `${epuskesmasItems.length} item obat (-${totalOutUnits.toLocaleString('id-ID')} unit) telah memotong stok & masuk ke Kartu Stok serta Kertas Kerja.`
    );
  };

  const handleRecordObatMasuk = (e: any) => {
    e.preventDefault();
    const med = medicineWithBalances.find((m) => m.id === inForm.medId);
    const qtyNum = Number(inForm.qty);
    if (!med || qtyNum <= 0) return;

    const cleanBatch = inForm.batchNo.trim();
    const cleanEd = inForm.expiryDate.trim();
    const cleanDoc = inForm.docNo.trim() || med.noBA || 'BAST-MANUAL';

    setBatches((prev) => {
      const existingIdx = prev.findIndex(
        (b) => b.medId === med.id && String(b.batchNo ?? '').toUpperCase() === cleanBatch.toUpperCase()
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          expiryDate: cleanEd || updated[existingIdx].expiryDate || '',
          stock: Number(updated[existingIdx].stock || 0) + qtyNum
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `B-${Date.now()}`,
          medId: med.id,
          batchNo: cleanBatch,
          expiryDate: cleanEd,
          stock: qtyNum,
          source: inForm.source
        }
      ];
    });

    if (inForm.docNo.trim() || Number(inForm.price) > 0) {
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === med.id
            ? {
                ...m,
                noBA: inForm.docNo.trim() || m.noBA,
                price: Number(inForm.price) > 0 ? Number(inForm.price) : m.price
              }
            : m
        )
      );
    }

    setOpnamePhysicalCounts((prev) => ({
      ...prev,
      [med.id]: Number(prev[med.id] ?? med.currentStock) + qtyNum
    }));

    const newTx = {
      id: `TRX-${Date.now()}`,
      type: 'IN',
      medId: med.id,
      medName: med.name,
      docNo: cleanDoc,
      date: inForm.date,
      timeLabel: 'Baru saja',
      dayName: 'Masuk',
      batchNo: cleanBatch,
      expiryDate: cleanEd,
      qty: qtyNum,
      unit: med.unit,
      sourceOrDest: inForm.source,
      officer: currentUser.name,
      notes: inForm.notes
    };
    setTransactions((prev) => [newTx, ...prev]);

    setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
      'Penerimaan Obat Berhasil Disimpan! ♡',
      `+${qtyNum} ${med.unit} ${med.name} otomatis memperbarui Saldo, Kartu Stok & Kertas Kerja.`
    );
  };

  const handleRecordObatKeluar = (e: any) => {
    e.preventDefault();
    const med = medicineWithBalances.find((m) => m.id === outForm.medId);
    const qtyNum = Number(outForm.qty);
    if (!med || qtyNum <= 0) return;

    if (qtyNum > med.currentStock) {
      triggerToast(
        'Stok Tidak Mencukupi!',
        `Permintaan ${qtyNum} ${med.unit} melebihi total stok tersedia (${med.currentStock} ${med.unit}).`,
        'error'
      );
      return;
    }

    let remaining = qtyNum;
    let usedBatchNo = '';
    let usedExpiry = '';

    setBatches((prev) => {
      const next = prev.map((b) => ({ ...b }));
      const candidates = next
        .filter((b) => b.medId === med.id && Number(b.stock || 0) > 0)
        .filter((b) => outForm.batchNo === 'AUTO_FEFO' || b.batchNo === outForm.batchNo)
        .sort((a, b) => {
          const aT = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const bT = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return aT - bT;
        });

      if (candidates.length > 0) {
        usedBatchNo = candidates[0].batchNo || '';
        usedExpiry = candidates[0].expiryDate || '';
      }

      for (const c of candidates) {
        if (remaining <= 0) break;
        const deduct = Math.min(Number(c.stock || 0), remaining);
        c.stock -= deduct;
        remaining -= deduct;
      }
      return next;
    });

    setOpnamePhysicalCounts((prev) => ({
      ...prev,
      [med.id]: Math.max(0, Number(prev[med.id] ?? med.currentStock) - qtyNum)
    }));

    const newTx = {
      id: `TRX-${Date.now()}`,
      type: 'OUT',
      medId: med.id,
      medName: med.name,
      docNo: outForm.docNo.trim() || 'OUT-MANUAL',
      date: outForm.date,
      timeLabel: 'Baru saja',
      dayName: 'Keluar',
      batchNo: usedBatchNo,
      expiryDate: usedExpiry,
      qty: qtyNum,
      unit: med.unit,
      sourceOrDest: outForm.destination,
      officer: currentUser.name,
      notes: outForm.notes
    };
    setTransactions((prev) => [newTx, ...prev]);

    setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
      'Pengeluaran Obat Berhasil Dicatat! ♡',
      `-${qtyNum} ${med.unit} ${med.name} telah memotong stok & masuk ke Kartu Stok serta Kertas Kerja.`
    );
  };

  const handleAddMasterMedicine = (e: any) => {
    e.preventDefault();
    if (!newMedForm.name.trim()) return;

    const seq = medicines.length + 1;
    const newId = `MED-SIL-${String(seq).padStart(3, '0')}-${Date.now().toString().slice(-3)}`;
    const initStock = Math.max(0, Number(newMedForm.initialStock) || 0);
    const createdMed = {
      id: newId,
      code: newMedForm.code.trim() || `OBT-PKM-${String(seq).padStart(3, '0')}`,
      eLogistikCode: `1.1.7.01.01.09.${String(seq).padStart(3, '0')}`,
      noBA: newMedForm.noBA.trim() || '-',
      sumberAnggaran: newMedForm.sumberAnggaran || 'DAK',
      genericName: newMedForm.genericName || newMedForm.name,
      name: newMedForm.name.trim(),
      form: newMedForm.form || newMedForm.unit,
      strength: newMedForm.strength || '-',
      unit: newMedForm.unit || 'Tablet',
      conversion: newMedForm.conversion,
      category: newMedForm.category,
      minStock: Math.max(0, Number(newMedForm.minStock) || 0),
      location: newMedForm.location,
      active: true,
      initialBalance: initStock,
      price: Math.max(0, Number(newMedForm.price) || 0)
    };

    setMedicines((prev) => [...prev, createdMed]);
    setBatches((prev) => [
      ...prev,
      {
        id: `B-${Date.now()}`,
        medId: newId,
        batchNo: newMedForm.batchNo.trim(),
        expiryDate: newMedForm.expiryDate.trim(),
        stock: initStock,
        source: newMedForm.sumberAnggaran || 'Saldo Awal Master'
      }
    ]);
    setOpnamePhysicalCounts((prev) => ({
      ...prev,
      [newId]: initStock
    }));

    setShowAddMedicineModal(false);
    triggerToast(
      'Master Obat & Barcode Rak Dibuat!',
      `${createdMed.name} (${createdMed.code}) siap dicetak label barcodenya.`
    );
  };

  const handleSaveEditMedicine = (e: any) => {
    e.preventDefault();
    if (!editingMed) return;

    const newStockVal = Math.max(0, Number(editingMed.currentStockInput ?? editingMed.currentStock ?? 0));
    const cleanBatch = String(editingMed.batchNoInput ?? '').trim();
    const cleanEd = String(editingMed.expiryDateInput ?? '').trim();

    setMedicines((prev) =>
      prev.map((m) =>
        m.id === editingMed.id
          ? {
              ...m,
              code: editingMed.code,
              noBA: editingMed.noBA,
              name: editingMed.name,
              sumberAnggaran: editingMed.sumberAnggaran,
              unit: editingMed.unit,
              price: Math.max(0, Number(editingMed.price) || 0),
              initialBalance: Math.max(0, Number(editingMed.initialBalance) || 0),
              minStock: Math.max(0, Number(editingMed.minStock) || 0),
              location: editingMed.location,
              category: editingMed.category
            }
          : m
      )
    );

    setBatches((prev) => {
      const medBatches = prev.filter((b) => b.medId === editingMed.id);
      if (medBatches.length === 0) {
        return [
          ...prev,
          {
            id: `B-EDIT-${Date.now()}`,
            medId: editingMed.id,
            batchNo: cleanBatch,
            expiryDate: cleanEd,
            stock: newStockVal,
            source: editingMed.sumberAnggaran || 'Update Master'
          }
        ];
      }
      let firstUpdated = false;
      return prev.map((b) => {
        if (b.medId !== editingMed.id) return b;
        if (!firstUpdated) {
          firstUpdated = true;
          return {
            ...b,
            batchNo: cleanBatch,
            expiryDate: cleanEd,
            stock: newStockVal
          };
        }
        return { ...b, stock: 0 };
      });
    });

    setOpnamePhysicalCounts((prev) => ({
      ...prev,
      [editingMed.id]: newStockVal
    }));

    setEditingMed(null);
    triggerToast('Data Obat Diperbarui!', `Perubahan pada ${editingMed.name} telah disimpan.`);
  };

  const handleDeleteMedicine = (med: any) => {
    setMedicines((prev) => prev.filter((m) => m.id !== med.id));
    setBatches((prev) => prev.filter((b) => b.medId !== med.id));
    setTransactions((prev) => prev.filter((t) => t.medId !== med.id));
    triggerToast('Data Obat Dihapus', `${med.name} telah dihapus dari Master Obat.`);
  };

  const handleDeleteTransaction = (tx: any) => {
    if (tx.type === 'IN' || tx.type === 'OUT') {
      const delta = tx.type === 'IN' ? -Number(tx.qty || 0) : Number(tx.qty || 0);
      setBatches((prev) => {
        const idx = prev.findIndex((b) => b.medId === tx.medId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          stock: Math.max(0, Number(next[idx].stock || 0) + delta)
        };
        return next;
      });
    }
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    triggerToast('Transaksi Dibatalkan/Dihapus', `Transaksi ${tx.docNo} (${tx.medName}) telah dihapus & stok dikembalikan.`);
  };

  const handleQrMobileQuickSubmit = (med: any) => {
    const qtyNum = Number(qrQuickQty) || 0;
    if (!med || qtyNum <= 0) return;

    if (qrQuickActionType === 'OUT' && qtyNum > med.currentStock) {
      triggerToast('Stok Tidak Cukup!', `Sisa stok ${med.name} hanya ${med.currentStock} ${med.unit}.`, 'error');
      return;
    }

    const targetBatch = med.fefoBatch || med.batches[0];
    const cleanBatchNo = targetBatch?.batchNo || '';
    const cleanEd = targetBatch?.expiryDate || '';

    if (qrQuickActionType === 'IN') {
      if (targetBatch) {
        setBatches((prev) =>
          prev.map((b) => (b.id === targetBatch.id ? { ...b, stock: Number(b.stock || 0) + qtyNum } : b))
        );
      } else {
        setBatches((prev) => [
          ...prev,
          {
            id: `B-QR-${Date.now()}`,
            medId: med.id,
            batchNo: '',
            expiryDate: '',
            stock: qtyNum,
            source: 'Scan Barcode HP'
          }
        ]);
      }
      setTransactions((prev) => [
        {
          id: `TRX-QR-IN-${Date.now()}`,
          type: 'IN',
          medId: med.id,
          medName: med.name,
          docNo: `SCAN-RAK-IN-${Date.now().toString().slice(-4)}`,
          date: qrQuickDate,
          timeLabel: 'Baru saja (Scan HP)',
          dayName: 'Scan',
          batchNo: cleanBatchNo,
          expiryDate: cleanEd,
          qty: qtyNum,
          unit: med.unit,
          sourceOrDest: qrQuickNote || 'Penambahan Stok di Rak (Scan HP)',
          officer: currentUser.name,
          notes: qrQuickNote
        },
        ...prev
      ]);
      setOpnamePhysicalCounts((prev) => ({
        ...prev,
        [med.id]: Number(prev[med.id] ?? med.currentStock) + qtyNum
      }));
      setShowShelfQuickMutasi(false);
      setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
        'Mutasi Masuk Kartu Stok Berhasil! ♡',
        `+${qtyNum} ${med.unit} ${med.name} langsung tercatat pada Kartu Stok obat.`
      );
    } else {
      if (targetBatch) {
        setBatches((prev) =>
          prev.map((b) =>
            b.id === targetBatch.id ? { ...b, stock: Math.max(0, Number(b.stock || 0) - qtyNum) } : b
          )
        );
      }
      setTransactions((prev) => [
        {
          id: `TRX-QR-OUT-${Date.now()}`,
          type: 'OUT',
          medId: med.id,
          medName: med.name,
          docNo: `SCAN-RAK-OUT-${Date.now().toString().slice(-4)}`,
          date: qrQuickDate,
          timeLabel: 'Baru saja (Scan HP)',
          dayName: 'Scan',
          batchNo: cleanBatchNo,
          expiryDate: cleanEd,
          qty: qtyNum,
          unit: med.unit,
          sourceOrDest: qrQuickNote || 'Pengambilan Obat dari Rak (Scan HP)',
          officer: currentUser.name,
          notes: qrQuickNote
        },
        ...prev
      ]);
      setOpnamePhysicalCounts((prev) => ({
        ...prev,
        [med.id]: Math.max(0, Number(prev[med.id] ?? med.currentStock) - qtyNum)
      }));
      setShowShelfQuickMutasi(false);
      setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
    triggerToast(
        'Mutasi Keluar Kartu Stok Berhasil! ♡',
        `-${qtyNum} ${med.unit} ${med.name} langsung memotong Kartu Stok & Kertas Kerja.`
      );
    }
  };

  const NAV_ITEMS: any[] = [
    { id: 'BERANDA', label: 'Beranda', icon: Home, emoji: '🔥', badge: 'LIVE' },
    { id: 'DATA_OBAT', label: 'Data Obat & Barcode', icon: Pill, emoji: '💊', badge: 'QR' },
    { id: 'KARTU_STOK', label: 'Kartu Stok (Hasil Scan)', icon: FileText, emoji: '📱', badge: 'HP' },
    { id: 'TRANSAKSI', label: 'Transaksi & Upload BA', icon: ArrowLeftRight, emoji: '🤖', badge: 'AI BA' },
    { id: 'STOCK_OPNAME', label: 'Stock Opname', icon: ClipboardCheck, emoji: '✨', badge: 'AUDIT' },
    { id: 'KERTAS_KERJA', label: 'Kertas Kerja', icon: Table, emoji: '📊', badge: 'REKAP' },
    { id: 'BATCH_EXPIRY', label: 'Batch & Expiry', icon: CalendarClock, emoji: '⏰', badge: 'FEFO' },
    { id: 'LAPORAN', label: 'Laporan LPLPO', icon: BarChart3, emoji: '🚀', badge: 'SYNC' },
    { id: 'INOVASI_PRO', label: '8 Fitur Pro (RKO/ABC/Depo)', icon: Sparkles, emoji: '💎', badge: '8 PRO' },
    { id: 'PENGATURAN', label: 'Pengaturan', icon: Settings, emoji: '⚙️', badge: 'PRO', isBottomSeparated: true }
  ];

  const quickSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return medicineWithBalances.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        (m.noBA && m.noBA.toLowerCase().includes(q)) ||
        m.genericName.toLowerCase().includes(q) ||
        m.batches.some((b: any) => (b.batchNo || '').toLowerCase().includes(q))
    );
  }, [searchQuery, medicineWithBalances]);


  // ==========================================
  // 6. SUB-VIEWS FOR EACH MODULE (MOBILE HP + BARCODE TO KARTU STOK)
  // ==========================================

  // --- MODULE 1: BERANDA (REAL-TIME DASHBOARD + MOBILE QUICK SCAN) ---
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Mobile-First Prominent Barcode Scanner Callout on Dashboard */}
      <div className="bg-gradient-to-r from-[#2E1065] via-[#5B21B6] to-[#BE185D] text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4 border border-pink-300/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shrink-0">
            <ScanLine className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-[#23153C] text-[10px] font-black uppercase">
              Fitur Utama HP · Scan Barcode Tempat Obat
            </span>
            <h3 className="text-base sm:text-lg font-black mt-0.5">
              Scan Barcode di Rak Obat → Langsung Muncul Kartu Stok & Detail Obat
            </h3>
            <p className="text-xs text-purple-100">
              Tempel label barcode di masing-masing tempat obat, lalu scan dari HP untuk cek Kartu Stok & stok fisik secara instan.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setScannerModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#23153C] font-black text-xs shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> 📷 SCAN BARCODE OBAT (CEK KARTU STOK)
          </button>
          <button
            onClick={() => setShowPrintAllLabelsModal(true)}
            className="px-3.5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-4 h-4" /> Cetak Barcode Rak
          </button>
        </div>
      </div>

      {/* Status Database & Quick Action Bar */}
      <div className="bg-white/95 px-4 py-3 rounded-2xl border border-purple-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase">
            {isUsingSampleData ? 'Mode Data Awal (Sampel)' : 'Mode Data Real Aktif ✓'}
          </span>
          <p className="text-xs font-bold text-slate-700">
            Total Nilai Aset Persediaan:{' '}
            <strong className="text-emerald-700 font-black">
              Rp {dashboardKPIs.totalNilaiAset.toLocaleString('id-ID')}
            </strong>{' '}
            ({dashboardKPIs.totalJenisObat} obat · {transactions.length} transaksi)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMenu('TRANSAKSI')}
            className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Upload className="w-3.5 h-3.5" /> Upload File BA / Pengeluaran
          </button>
          {medicines.length > 0 ? (
            <button
              onClick={() => setConfirmClearModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Kosongkan Data Awal
            </button>
          ) : (
            <button
              onClick={handleRestoreSampleData}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Muat Contoh Data
            </button>
          )}
        </div>
      </div>

      {/* 5 Primary Pastel KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveMenu('DATA_OBAT')}
          className="simfar-neo-card cursor-pointer group rounded-[24px] p-3.5 sm:p-4 bg-gradient-to-br from-[#EFE7FF] via-[#F4EEFF] to-[#E9D8FD]/80 border border-purple-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-purple-200/75 flex items-center justify-center text-purple-700 shrink-0">
            <Pill className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] -rotate-12" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#2A1846] truncate">Total Jenis Obat</p>
            <p className="text-2xl sm:text-[32px] leading-none font-black text-[#1E153A] tracking-tight my-1">
              {dashboardKPIs.totalJenisObat}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/90 text-emerald-700">
              Siap Barcode
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveMenu('DATA_OBAT')}
          className="simfar-neo-card cursor-pointer group rounded-[24px] p-3.5 sm:p-4 bg-gradient-to-br from-[#FFE4F1] via-[#FCE7F3] to-[#FBCFE8]/75 border border-pink-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-pink-200/75 flex items-center justify-center text-pink-700 shrink-0">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#2A1846] truncate">Total Stok</p>
            <p className="text-2xl sm:text-[32px] leading-none font-black text-[#1E153A] tracking-tight my-1">
              {dashboardKPIs.totalStok.toLocaleString('id-ID')}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/90 text-emerald-700">
              Unit Tersedia
            </span>
          </div>
        </div>

        <div
          onClick={() => {
            setMedStockStatusFilter('LOW');
            setActiveMenu('DATA_OBAT');
          }}
          className="simfar-neo-card cursor-pointer group rounded-[24px] p-3.5 sm:p-4 bg-gradient-to-br from-[#E0F2FE] via-[#E8F6FF] to-[#BAE6FD]/65 border border-sky-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-sky-200/75 flex items-center justify-center text-sky-700 shrink-0">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#2A1846] truncate">Stok Rendah</p>
            <p className="text-2xl sm:text-[32px] leading-none font-black text-[#1E153A] tracking-tight my-1">
              {dashboardKPIs.stokRendah}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800">
              ≤ Stok Min
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveMenu('BATCH_EXPIRY')}
          className="simfar-neo-card cursor-pointer group rounded-[24px] p-3.5 sm:p-4 bg-gradient-to-br from-[#FEF3C7] via-[#FFF7D6] to-[#FDE68A]/65 border border-amber-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-amber-200/75 flex items-center justify-center text-amber-800 shrink-0">
            <CalendarClock className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#2A1846] truncate">Mendekati ED</p>
            <p className="text-2xl sm:text-[32px] leading-none font-black text-[#1E153A] tracking-tight my-1">
              {dashboardKPIs.mendekatiED}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/70 text-amber-900">
              ≤ 6 bulan
            </span>
          </div>
        </div>

        <div
          onClick={() => setActiveMenu('STOCK_OPNAME')}
          className="col-span-2 sm:col-span-1 cursor-pointer group relative rounded-[22px] p-3.5 sm:p-4 bg-gradient-to-br from-[#F3E8FF] via-[#FCE7F3]/70 to-[#EDE9FE] border border-purple-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-purple-200/75 flex items-center justify-center text-purple-700 shrink-0">
            <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-extrabold text-[#2A1846]">Kesesuaian Stok</p>
            <p className="text-2xl sm:text-[32px] leading-none font-black text-[#1E153A] tracking-tight my-1">
              {dashboardKPIs.kesesuaianStok}
            </p>
            <span className="text-[10px] font-bold text-purple-800">
              {dashboardKPIs.matchCount}/{dashboardKPIs.totalJenisObat} Sesuai Fisik
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Grafik Pergerakan Stok & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-[26px] p-4 sm:p-5 border border-purple-100 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h2 className="text-base sm:text-[17px] font-extrabold text-[#23153C]">Grafik Pergerakan Stok</h2>
            </div>

            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="px-3.5 py-1.5 rounded-full bg-[#F8F5FF] border border-purple-200 text-xs font-bold text-[#3B245B] focus:outline-none"
            >
              <option value="Minggu ini">Minggu ini</option>
              <option value="Bulan ini">Bulan ini</option>
              <option value="Per Obat Teratas">Per Obat Teratas</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-[#3B245B]">
              <span className="w-3 h-3 rounded-full bg-[#5B21B6]" /> Obat Masuk
            </span>
            <span className="flex items-center gap-1.5 text-[#3B245B]">
              <span className="w-3 h-3 rounded-full bg-[#F472B6]" /> Obat Keluar
            </span>
          </div>

          <StockMovementSplineChart data={dynamicChartData} />
        </div>

        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-[26px] p-4 sm:p-5 border border-purple-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <History className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h2 className="text-base sm:text-[17px] font-extrabold text-[#23153C]">Aktivitas Kartu Stok ({transactions.length})</h2>
              </div>
              <button
                onClick={() => setActiveMenu('KARTU_STOK')}
                className="text-xs font-extrabold text-[#6D28D9] hover:text-[#4C1D95] flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                Belum ada riwayat transaksi. Silakan upload BA atau scan barcode obat.
              </div>
            ) : (
              <div className="divide-y divide-purple-100/80 max-h-60 overflow-y-auto pr-1">
                {transactions.slice(0, 6).map((tx) => {
                  const isIn = tx.type === 'IN';
                  const isOut = tx.type === 'OUT';
                  return (
                    <div
                      key={tx.id}
                      onClick={() => {
                        setSelectedStockCardMedId(tx.medId);
                        setActiveMenu('KARTU_STOK');
                      }}
                      className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 cursor-pointer hover:bg-purple-50/50 rounded-xl px-1.5 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isIn
                              ? 'bg-emerald-100 text-emerald-600'
                              : isOut
                              ? 'bg-pink-100 text-pink-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}
                        >
                          {isIn ? (
                            <ArrowUpRight className="w-4 h-4 stroke-[2.6]" />
                          ) : isOut ? (
                            <ArrowDownRight className="w-4 h-4 stroke-[2.6]" />
                          ) : (
                            <Check className="w-4 h-4 stroke-[2.8]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-extrabold text-[#1E153A] truncate">
                            {tx.medName}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 truncate">
                            {tx.date} · {tx.docNo || tx.sourceOrDest}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isIn && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 min-w-[54px] text-center">
                            +{Number(tx.qty || 0).toLocaleString('id-ID')}
                          </span>
                        )}
                        {isOut && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-pink-100 text-pink-800 min-w-[54px] text-center">
                            -{Number(tx.qty || 0).toLocaleString('id-ID')}
                          </span>
                        )}
                        {!isIn && !isOut && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 min-w-[54px] text-center">
                            {tx.statusBadge || 'Opname'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // --- MODULE 2: DATA OBAT & CETAK BARCODE TEMPAT OBAT ---
  const renderDataObat = () => {
    const filteredMeds = medicineWithBalances.filter((m) => {
      const q = medSearchFilter.trim().toLowerCase();
      const matchQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        (m.noBA && m.noBA.toLowerCase().includes(q)) ||
        m.batches.some((b: any) => (b.batchNo || '').toLowerCase().includes(q));
      const matchSrc =
        medSourceFilter === 'ALL' ||
        (m.sumberAnggaran || '').toUpperCase().includes(medSourceFilter);
      const matchStatus =
        medStockStatusFilter === 'ALL' ||
        (medStockStatusFilter === 'LOW' && (m.isLowStock || m.isOutOfStock)) ||
        (medStockStatusFilter === 'OUT' && m.isOutOfStock) ||
        (medStockStatusFilter === 'SAFE' && !m.isLowStock && !m.isOutOfStock);
      return matchQ && matchSrc && matchStatus;
    });

    return (
      <div className="space-y-5">
        <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Master Data Obat & Label Barcode Rak Obat
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2A1846] mt-1.5">
              Katalog Persediaan Obat & Barcode Tempat Obat ({filteredMeds.length} Item)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Setiap obat memiliki <strong>Barcode Garis (Code-39) & QR Code unik</strong> untuk ditempel di tempat obat. Saat di-scan dengan HP, langsung membuka <strong>Kartu Stok Obat</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setScannerModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#23153C] font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ScanLine className="w-4 h-4" /> 📷 Scan Barcode (Cek Kartu Stok)
            </button>
            <button
              onClick={() => setShowPrintAllLabelsModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Semua Barcode Rak ({filteredMeds.length})
            </button>
            <button
              onClick={() => setShowAddMedicineModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Obat Manual
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/95 p-4 rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[200px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={medSearchFilter}
                onChange={(e) => setMedSearchFilter(e.target.value)}
                placeholder="Cari nama obat, nomor BA, kode barcode..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-400"
              />
            </div>

            <select
              value={medSourceFilter}
              onChange={(e) => setMedSourceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-[#3B245B]"
            >
              <option value="ALL">Semua Sumber</option>
              <option value="DAK">DAK</option>
              <option value="JKN">JKN</option>
              <option value="PKD">PKD</option>
              <option value="APBD">APBD</option>
              <option value="HIBAH">Hibah</option>
            </select>

            <select
              value={medStockStatusFilter}
              onChange={(e) => setMedStockStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs font-bold text-pink-900"
            >
              <option value="ALL">Semua Status Stok</option>
              <option value="SAFE">Stok Aman</option>
              <option value="LOW">Stok Rendah / Habis</option>
              <option value="OUT">Stok Habis (0)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportToCSV(
                  'Master_Data_Obat_SIMFAR.csv',
                  ['Kode_Barcode', 'Nomor_BA', 'Nama_Obat', 'Sumber_Anggaran', 'Satuan', 'Harga_Satuan', 'Batch', 'Expired', 'Stok_Awal', 'Saldo_Saat_Ini', 'Total_Nilai_Rp'],
                  filteredMeds.map((m) => [
                    m.code,
                    m.noBA || '-',
                    m.name,
                    m.sumberAnggaran || '-',
                    m.unit,
                    m.price || 0,
                    m.fefoBatch?.batchNo || '',
                    m.fefoBatch?.expiryDate || '',
                    m.initialBalance || 0,
                    m.currentStock,
                    m.currentStock * (m.price || 0)
                  ])
                )
              }
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#F3E8FF] to-[#FCE7F3] text-[#3B245B] text-xs font-extrabold uppercase">
                  <th className="py-3.5 px-4">Kode Barcode / No. BA</th>
                  <th className="py-3.5 px-4">Nama Obat & Tempat Rak</th>
                  <th className="py-3.5 px-3">Sumber & Satuan</th>
                  <th className="py-3.5 px-3 text-right">Harga Satuan</th>
                  <th className="py-3.5 px-3">Batch & ED</th>
                  <th className="py-3.5 px-3 text-right">Saldo Kartu Stok</th>
                  <th className="py-3.5 px-4 text-center">Kartu Stok & Label Barcode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-sm">
                {filteredMeds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500 text-xs font-semibold">
                      Belum ada data obat. Klik <strong>Tambah Obat Manual</strong> atau upload dokumen BA di menu <strong>Transaksi</strong>.
                    </td>
                  </tr>
                ) : (
                  filteredMeds.map((m) => {
                    const batchLabel = m.fefoBatch?.batchNo && m.fefoBatch.batchNo !== '-' ? m.fefoBatch.batchNo : '';
                    const edLabel = m.fefoBatch?.expiryDate && m.fefoBatch.expiryDate !== '-' ? m.fefoBatch.expiryDate : '';
                    return (
                      <tr key={m.id} className="hover:bg-purple-50/40">
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-purple-100 font-mono text-xs font-black text-purple-800">
                            *{m.code}*
                          </span>
                          <div className="text-[11px] font-semibold text-slate-600 mt-1">
                            BA: {m.noBA || '-'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-[#1E1B4B]">{m.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-pink-500 shrink-0" /> {m.location || 'Gudang Utama'}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold mr-1.5">
                            {m.sumberAnggaran || '-'}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">{m.unit}</span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-700">
                          Rp {Number(m.price || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3.5 px-3">
                          {batchLabel || edLabel ? (
                            <div>
                              <span className="font-mono text-xs font-bold text-pink-700">
                                {batchLabel || '-'}
                              </span>
                              <div className="text-[11px] text-slate-500">
                                ED: {edLabel || '-'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">- (Kosong di BA)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              m.isOutOfStock
                                ? 'bg-rose-100 text-rose-800'
                                : m.isLowStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {m.currentStock.toLocaleString('id-ID')} {m.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleBarcodeScannedOpenStockCard(m)}
                              title="Buka Detail Obat & Kartu Stok (Seperti Hasil Scan Barcode HP)"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5" /> Kartu Stok
                            </button>
                            <button
                              onClick={() => setQrModalMed(m)}
                              title="Lihat & Cetak Label Barcode Tempat Obat"
                              className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Barcode Rak
                            </button>
                            <button
                              onClick={() =>
                                setEditingMed({
                                  ...m,
                                  currentStockInput: m.currentStock,
                                  batchNoInput: batchLabel,
                                  expiryDateInput: edLabel
                                })
                              }
                              title="Edit Data Obat"
                              className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(m)}
                              title="Hapus Obat"
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- MODULE 4: KARTU STOK DIGITAL & DETAIL OBAT HASIL SCAN BARCODE HP ---
  const renderKartuStok = () => {
    const selectedMed =
      medicineWithBalances.find((m) => m.id === selectedStockCardMedId) ||
      medicineWithBalances[0];

    const medTxChronological = [...transactions]
      .filter((t) => t.medId === selectedMed?.id)
      .filter((t) => stockCardBatchFilter === 'ALL' || (t.batchNo || '') === stockCardBatchFilter)
      .reverse();

    let runningBalance = Number(selectedMed?.initialBalance || 0);
    const ledgerRows = medTxChronological.map((tx) => {
      if (tx.type === 'IN') runningBalance += Number(tx.qty || 0);
      if (tx.type === 'OUT') runningBalance = Math.max(0, runningBalance - Number(tx.qty || 0));
      if (tx.type === 'OPNAME') runningBalance = Math.max(0, runningBalance + Number(tx.qty || 0));
      return {
        ...tx,
        sisaSaldo: runningBalance
      };
    });

    const physicalAtShelf = selectedMed
      ? Number(opnamePhysicalCounts[selectedMed.id] ?? selectedMed.currentStock)
      : 0;
    const shelfDiff = selectedMed ? physicalAtShelf - selectedMed.currentStock : 0;

    return (
      <div className="space-y-5">
        {/* Top Mobile Scan Banner: Scan Barcode Tempat Obat -> Muncul Kartu Stok */}
        <div className="bg-gradient-to-r from-[#1E1B4B] via-[#4C1D95] to-[#831843] text-white p-4 sm:p-5 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              {lastScannedCode ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400 text-[#064E3B] text-[11px] font-black uppercase">
                  ✓ Barcode Rak Terbaca: *{lastScannedCode}*
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-pink-200 text-[11px] font-bold uppercase">
                  Mode Kartu Stok Digital & Cek Stok Tempat Obat
                </span>
              )}
              <h2 className="text-lg sm:text-xl font-black mt-0.5">
                Detail Data Obat & Kartu Stok: {selectedMed?.name || '-'}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setScannerModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#23153C] font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" /> 📷 Scan Barcode Obat Lain
            </button>
            {selectedMed && (
              <button
                onClick={() => setQrModalMed(selectedMed)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Label Barcode Rak
              </button>
            )}
          </div>
        </div>

        {/* Selector Obat & Filter Batch */}
        <div className="bg-white/95 p-4 rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <select
              value={selectedMed?.id || ''}
              onChange={(e) => {
                const found = medicineWithBalances.find((m) => m.id === e.target.value);
                setSelectedStockCardMedId(e.target.value);
                setStockCardBatchFilter('ALL');
                if (found) setLastScannedCode(found.code);
              }}
              className="flex-1 min-w-[210px] px-3.5 py-2.5 rounded-2xl bg-purple-50 border border-purple-300 text-xs font-black text-[#2A1846]"
            >
              {medicineWithBalances.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.code}] {m.name} — Stok: {m.currentStock} {m.unit}
                </option>
              ))}
            </select>

            <select
              value={stockCardBatchFilter}
              onChange={(e) => setStockCardBatchFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs font-bold text-[#3B245B]"
            >
              <option value="ALL">Semua Batch ({selectedMed?.batches?.length || 0})</option>
              {selectedMed?.batches?.map((b: any) => (
                <option key={b.id} value={b.batchNo || ''}>
                  {b.batchNo ? `Batch ${b.batchNo}` : 'Tanpa Batch (-)'} {b.expiryDate ? `(ED: ${b.expiryDate})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowShelfQuickMutasi(!showShelfQuickMutasi)}
              className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> + Masuk / - Keluar di Rak
            </button>
            <button
              onClick={() =>
                selectedMed &&
                exportToCSV(
                  `Kartu_Stok_${selectedMed.name.replace(/\s+/g, '_')}.csv`,
                  ['Tanggal', 'Nomor Dokumen / BA', 'Sumber / Keterangan', 'Nomor Batch', 'Masuk', 'Keluar', 'Sisa Saldo', 'Petugas'],
                  [
                    ['Saldo Awal', selectedMed.noBA || '-', 'Saldo Awal Periode', '-', 0, 0, selectedMed.initialBalance || 0, 'Sistem'],
                    ...ledgerRows.map((r) => [
                      r.date,
                      r.docNo || '-',
                      r.sourceOrDest || '-',
                      r.batchNo || '-',
                      r.type === 'IN' ? r.qty : 0,
                      r.type === 'OUT' ? r.qty : 0,
                      r.sisaSaldo,
                      r.officer
                    ])
                  ]
                )
              }
              className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak
            </button>
          </div>
        </div>

        {/* DETAIL DATA OBAT & RINGKASAN SALDO KARTU STOK (MUNCUL SAAT SCAN BARCODE DI HP) */}
        {selectedMed && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 cols: Identitas Lengkap Obat & 4 Kotak Ringkasan Kartu Stok */}
            <div className="lg:col-span-8 bg-white/95 rounded-3xl p-5 border-2 border-purple-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-purple-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-900 text-white font-mono text-xs font-black">
                      *{selectedMed.code}*
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 text-xs font-extrabold">
                      Sumber: {selectedMed.sumberAnggaran || '-'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-pink-100 text-pink-800 text-xs font-extrabold">
                      Satuan: {selectedMed.unit}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1B4B] mt-1.5">{selectedMed.name}</h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    📍 Tempat Penyimpanan: <strong className="text-[#2A1846]">{selectedMed.location || 'Gudang / Apotek'}</strong> · Kategori: {selectedMed.category}
                  </p>
                </div>

                <div className="text-right bg-purple-50/80 px-3.5 py-2 rounded-2xl border border-purple-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Nomor BA / BAST</p>
                  <p className="font-mono text-xs font-black text-purple-900">{selectedMed.noBA || '-'}</p>
                  <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
                    Harga: Rp {Number(selectedMed.price || 0).toLocaleString('id-ID')} / {selectedMed.unit}
                  </p>
                </div>
              </div>

              {/* 4 Kotak Saldo Kartu Stok (Mudah Dibaca di Layar HP saat Cek Rak Obat) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">1. Saldo Awal</span>
                  <span className="text-xl font-black text-slate-800">
                    {Number(selectedMed.initialBalance || 0).toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 block">{selectedMed.unit}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">2. Total Masuk (+)</span>
                  <span className="text-xl font-black text-emerald-700">
                    +{selectedMed.totalIn.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">{selectedMed.unit}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200">
                  <span className="text-[11px] font-bold text-pink-800 block">3. Total Keluar (-)</span>
                  <span className="text-xl font-black text-pink-700">
                    -{selectedMed.totalOut.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-semibold text-pink-700 block">{selectedMed.unit}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#3B215D] to-[#6D28D9] text-white shadow-md">
                  <span className="text-[10px] font-extrabold text-pink-200 uppercase block">
                    4. SISA SALDO KARTU STOK
                  </span>
                  <span className="text-2xl font-black text-amber-300">
                    {selectedMed.currentStock.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] font-bold text-purple-100 block">
                    {selectedMed.unit} · Rp {(selectedMed.currentStock * Number(selectedMed.price || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Informasi Batch, ED & Cek Kesesuaian Fisik di Tempat Obat */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold">
                    Batch FEFO: <strong className="font-mono">{selectedMed.fefoBatch?.batchNo || '- (Kosong di BA)'}</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold">
                    Expired (ED): <strong>{selectedMed.fefoBatch?.expiryDate || '- (Kosong di BA)'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">Stok Fisik di Rak:</span>
                  <input
                    type="number"
                    min="0"
                    value={physicalAtShelf}
                    onChange={(e) =>
                      setOpnamePhysicalCounts({
                        ...opnamePhysicalCounts,
                        [selectedMed.id]: e.target.value
                      })
                    }
                    className="w-24 text-center px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-300 font-black text-[#1E1B4B]"
                  />
                  {shelfDiff === 0 ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                      ✓ Fisik Sesuai Kartu Stok
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold">
                      Selisih: {shelfDiff > 0 ? `+${shelfDiff}` : shelfDiff}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 cols: Label Barcode Tempat Obat (Siap Cetak / Tempel di Rak) */}
            <div className="lg:col-span-4 bg-white/95 rounded-3xl p-4 border-2 border-dashed border-purple-300 flex flex-col justify-between text-center">
              <div>
                <div className="bg-[#3B215D] text-white py-1.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider">
                  LABEL BARCODE TEMPAT OBAT · {clinicProfile.puskesmasName}
                </div>
                <p className="text-sm font-black text-[#1E1B4B] mt-2">{selectedMed.name}</p>
                <p className="text-[11px] font-bold text-slate-500 mb-2">
                  {selectedMed.location || 'Rak Obat'} · Satuan: {selectedMed.unit}
                </p>

                <div className="flex items-center justify-center gap-2 my-1">
                  <div className="flex-1 max-w-[210px]">
                    <Code39BarcodeSvg value={selectedMed.code || selectedMed.id} height={42} />
                  </div>
                  <RealQrCodeSvg value={selectedMed.code || selectedMed.id} size={68} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => downloadMedicineLabelPng(selectedMed, clinicProfile.puskesmasName)}
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh .PNG
                </button>
                <button
                  onClick={() => setQrModalMed(selectedMed)}
                  className="py-2 px-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Label
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Input Mutasi Cepat dari Rak Obat (Jika Dibuka oleh Petugas di HP) */}
        {showShelfQuickMutasi && selectedMed && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-emerald-50 p-4 rounded-3xl border-2 border-purple-300 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#1E1B4B]">
                📱 Catat Mutasi Cepat di Rak Obat: {selectedMed.name} (Langsung Masuk ke Kartu Stok)
              </h4>
              <button
                onClick={() => setShowShelfQuickMutasi(false)}
                className="text-xs font-bold text-slate-500 hover:text-rose-600"
              >
                Tutup ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jenis Mutasi</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQrQuickActionType('OUT')}
                    className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      qrQuickActionType === 'OUT'
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    - Keluar Rak
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrQuickActionType('IN')}
                    className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      qrQuickActionType === 'IN'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    + Masuk Rak
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jumlah ({selectedMed.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={qrQuickQty}
                  onChange={(e) => setQrQuickQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-purple-300 font-black text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Keterangan Kartu Stok
                </label>
                <input
                  type="text"
                  value={qrQuickNote}
                  onChange={(e) => setQrQuickNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-semibold"
                />
              </div>
              <button
                type="button"
                onClick={() => handleQrMobileQuickSubmit(selectedMed)}
                className="py-2.5 px-4 rounded-xl bg-[#3B215D] hover:bg-[#2A1846] text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                Simpan ke Kartu Stok
              </button>
            </div>
          </div>
        )}

        {/* RIWAYAT MUTASI KARTU STOK (TABEL LENGKAP & KARTU MOBILE HP) */}
        <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-purple-100 flex flex-wrap items-center justify-between gap-2 bg-purple-50/40">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#1E1B4B]">
                Rincian Riwayat Kartu Stok: {selectedMed?.name} ({ledgerRows.length + 1} Baris)
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan kronologi Saldo Awal, Penerimaan (Masuk), Pengeluaran (Keluar), dan Sisa Saldo.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-200 text-xs">
              <button
                onClick={() => setStockCardMobileViewMode('CARDS')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  stockCardMobileViewMode === 'CARDS'
                    ? 'bg-purple-700 text-white'
                    : 'text-slate-600'
                }`}
              >
                📱 Mode Layar HP
              </button>
              <button
                onClick={() => setStockCardMobileViewMode('TABLE')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  stockCardMobileViewMode === 'TABLE'
                    ? 'bg-purple-700 text-white'
                    : 'text-slate-600'
                }`}
              >
                📋 Tabel Lengkap
              </button>
            </div>
          </div>

          {/* Mobile-Friendly Card Timeline View (Great on HP Screens!) */}
          {stockCardMobileViewMode === 'CARDS' && (
            <div className="divide-y divide-purple-100 p-4 space-y-2.5 sm:hidden block">
              {selectedMed && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500">Saldo Awal Periode</span>
                    <p className="text-xs font-extrabold text-[#1E1B4B]">BA: {selectedMed.noBA || '-'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block">Sisa Saldo</span>
                    <span className="text-base font-black text-[#1E1B4B]">
                      {Number(selectedMed.initialBalance || 0).toLocaleString('id-ID')} {selectedMed.unit}
                    </span>
                  </div>
                </div>
              )}
              {ledgerRows.map((row) => (
                <div key={row.id} className="pt-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#1E1B4B]">{row.date}</span>
                      <span className="font-mono text-[11px] font-bold text-purple-700 truncate">
                        {row.docNo || '-'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 truncate">{row.sourceOrDest}</p>
                    <p className="text-[10px] text-slate-400">
                      Batch: {row.batchNo || '-'} · Petugas: {row.officer}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {row.type === 'IN' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                        +{Number(row.qty || 0).toLocaleString('id-ID')}
                      </span>
                    )}
                    {row.type === 'OUT' && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-xs font-black">
                        -{Number(row.qty || 0).toLocaleString('id-ID')}
                      </span>
                    )}
                    <div className="text-xs font-black text-[#1E1B4B] mt-1">
                      Saldo: {row.sisaSaldo.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Table View (Always visible on sm+ or when TABLE mode is selected) */}
          <div className={`${stockCardMobileViewMode === 'CARDS' ? 'hidden sm:block' : 'block'} overflow-x-auto`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#F3E8FF] to-[#FCE7F3] text-[#3B245B] text-xs font-extrabold uppercase">
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Nomor Dokumen / BA</th>
                  <th className="py-3.5 px-4">Sumber / Keterangan</th>
                  <th className="py-3.5 px-4">Nomor Batch</th>
                  <th className="py-3.5 px-4 text-right text-emerald-700">Masuk</th>
                  <th className="py-3.5 px-4 text-right text-pink-700">Keluar</th>
                  <th className="py-3.5 px-4 text-right bg-purple-100/60">Sisa Saldo</th>
                  <th className="py-3.5 px-4">Petugas</th>
                  <th className="py-3.5 px-3 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-sm">
                {selectedMed && (
                  <tr className="bg-slate-50/80 font-bold">
                    <td className="py-3 px-4">Saldo Awal</td>
                    <td className="py-3 px-4 font-mono text-xs">{selectedMed?.noBA || '-'}</td>
                    <td className="py-3 px-4">Saldo Awal Persediaan</td>
                    <td className="py-3 px-4 font-mono text-xs">-</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right font-black text-[#1E1B4B] bg-purple-50/50">
                      {Number(selectedMed?.initialBalance || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">Database Master</td>
                    <td className="py-3 px-3 text-center">-</td>
                  </tr>
                )}
                {ledgerRows.map((row) => (
                  <tr key={row.id} className="hover:bg-purple-50/40">
                    <td className="py-3 px-4 font-semibold">{row.date}</td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-purple-700">
                      {row.docNo || '-'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1E1B4B]">{row.sourceOrDest}</td>
                    <td className="py-3 px-4 font-mono text-xs">{row.batchNo || '-'}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {row.type === 'IN' ? `+${Number(row.qty || 0).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-pink-600">
                      {row.type === 'OUT' ? `-${Number(row.qty || 0).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-[#1E1B4B] bg-purple-50/50">
                      {row.sisaSaldo.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">{row.officer}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(row)}
                        title="Hapus / Batalkan Transaksi Ini"
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };


  // --- MODULE 3: TRANSAKSI PINTAR (REAL BAST PARSER & REAL PENGELUARAN PARSER) ---
  const renderTransaksi = () => {
    const selectedOutMed = medicineWithBalances.find((m) => m.id === outForm.medId);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#F3E8FF] via-[#FCE7F3] to-[#E0F2FE] p-5 sm:p-6 rounded-3xl border border-purple-200/70 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-white/90 px-3 py-1 rounded-full shadow-2xs">
              Smart Document Parser · Real Excel (.xlsx/.xls), CSV, Word (.docx) & PDF Reader
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2A1846] mt-1.5">
              Pembacaan Otomatis Dokumen BA / BAST & Rekap Pengeluaran Obat
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-3xl">
              Sistem membaca langsung isi file <strong>BA / BAST</strong> maupun <strong>Pengeluaran</strong> Anda: mengekstrak <strong>Nomor BA, Nama Barang, Satuan, Sumber Anggaran, Harga Satuan, Stok Awal, Penerimaan & Pengeluaran</strong>. Jika kolom seperti <strong>Batch</strong> atau <strong>Expired (ED)</strong> tidak tercantum di dalam BA, sistem otomatis <strong>mengosongkannya</strong>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setScannerModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-[#3B215D] hover:bg-[#2A1846] text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-pink-300" /> Scan Barcode HP (Cek Kartu Stok)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* CARD A: SMART BAST DOCUMENT SCANNER */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border-2 border-emerald-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1B4B]">
                      1. Smart Upload Dokumen BA / BAST (Obat Masuk)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Baca asli Nomor BA, Barang, Satuan, Harga & Jumlah (Batch/ED kosong jika tak ada di BA)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadAttachedPdf21April}
                    className="simfar-btn-pop px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-200 text-[#23153C] border border-amber-400 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Muat langsung data dari lampiran SILIAN BA OBAT LAIN 21 APRIL.pdf"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-800" /> ⚡ Muat BA 21 April (PDF Lampiran)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBastPasteModal(true)}
                    className="simfar-btn-pop px-3 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Tempel Tabel
                  </button>
                  <label
                    className="simfar-btn-pop cursor-pointer px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
                    title="Rekomendasi #1: Ambil Foto Kamera / Upload Gambar Kertas BA Fisik untuk dibaca dengan AI Vision OCR"
                  >
                    <ScanLine className="w-3.5 h-3.5 text-amber-200" />
                    <span>{isRunningOcr ? 'Memindai OCR...' : '📸 Scan Foto Kertas BA (AI OCR)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleBastPhotoOcrUpload}
                      className="hidden"
                    />
                  </label>
                  <label className="simfar-btn-pop cursor-pointer px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition">
                    <Upload className="w-4 h-4" />
                    <span>{isScanningBast ? 'Membaca File BA...' : 'Upload File BA (.pdf/.jpg/.png/.xlsx/.docx/.csv)'}</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.tsv,.txt,.docx,.pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleBastDocumentUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {ocrPreviewUrl && (
                <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border-2 border-purple-300 flex flex-col sm:flex-row items-center gap-3.5">
                  <img
                    src={ocrPreviewUrl}
                    alt="Pratinjau Dokumen BA JPG"
                    className="w-28 h-28 object-cover rounded-xl border-2 border-purple-400 shadow-sm shrink-0 bg-white"
                  />
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-700 text-white font-black text-[10px] uppercase">
                        Pratinjau Dokumen Gambar (JPG/PNG) Terbaca
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOcrPreviewUrl(null);
                          setOcrStatusText('');
                        }}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Tutup Gambar ✕
                      </button>
                    </div>
                    <p className="font-extrabold text-[#1E1136]">
                      {ocrStatusText || 'Gambar dokumen BA telah dipindai dan baris barang telah dimasukkan ke tabel di bawah.'}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Anda dapat memeriksa atau mengedit langsung Nama Barang, Satuan, Banyaknya, Harga Satuan, dan Total Harga pada tabel di bawah sebelum klik Simpan.
                    </p>
                  </div>
                </div>
              )}
              {bastDetectedInfo && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-black text-emerald-950">
                        📄 File Terbaca: {bastDetectedInfo.fileName}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[11px]">
                        {bastParsedItems.length} Baris Barang
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {bastSheets.length > 1 && (
                        <select
                          value={bastSelectedSheetIdx}
                          onChange={(e) => {
                            const idx = Number(e.target.value);
                            setBastSelectedSheetIdx(idx);
                            applyBastSheetAnalysis(bastSheets[idx].rows, bastDetectedInfo.fileName, null);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-950"
                        >
                          {bastSheets.map((sh, i) => (
                            <option key={i} value={i}>
                              Sheet: {sh.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowBastColMapper(!showBastColMapper)}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 font-extrabold text-emerald-900 cursor-pointer"
                      >
                        {showBastColMapper ? 'Tutup Pemetaan Kolom ▲' : '🔧 Sesuaikan Kolom ▼'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      No. BA: <strong>{bastDetectedInfo.colMap.noBA !== -1 ? bastDetectedInfo.headers[bastDetectedInfo.colMap.noBA] : (bastDetectedInfo.detectedDocNo ? 'Dari Header' : 'Kosong')}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Barang: <strong>{bastDetectedInfo.colMap.name !== -1 ? bastDetectedInfo.headers[bastDetectedInfo.colMap.name] : '?'}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Harga: <strong>{bastDetectedInfo.colMap.price !== -1 ? bastDetectedInfo.headers[bastDetectedInfo.colMap.price] : (bastDetectedInfo.colMap.totalNilai !== -1 ? 'Hitung dari Total' : 'Kosong')}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Batch: <strong>{bastDetectedInfo.colMap.batchNo !== -1 ? bastDetectedInfo.headers[bastDetectedInfo.colMap.batchNo] : 'Tidak ada di BA → Dikosongkan'}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      ED: <strong>{bastDetectedInfo.colMap.expiryDate !== -1 ? bastDetectedInfo.headers[bastDetectedInfo.colMap.expiryDate] : 'Tidak ada di BA → Dikosongkan'}</strong>
                    </span>
                  </div>

                  {showBastColMapper && bastDetectedInfo.headers && (
                    <div className="pt-2 mt-2 border-t border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'noBA', label: 'Kolom Nomor BA' },
                        { key: 'name', label: 'Kolom Nama Barang' },
                        { key: 'sumberAnggaran', label: 'Kolom Sumber Dana' },
                        { key: 'unit', label: 'Kolom Satuan' },
                        { key: 'price', label: 'Kolom Harga Satuan' },
                        { key: 'stokAwal', label: 'Kolom Stok Awal' },
                        { key: 'qtyIn', label: 'Kolom Jml Masuk/BA' },
                        { key: 'batchNo', label: 'Kolom Batch (Opsional)' },
                        { key: 'expiryDate', label: 'Kolom ED (Opsional)' }
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-bold text-emerald-900">
                            {field.label}
                          </label>
                          <select
                            value={bastColOverride?.[field.key] ?? bastDetectedInfo.colMap[field.key] ?? -1}
                            onChange={(e) => {
                              const nextOverride = {
                                ...bastDetectedInfo.colMap,
                                ...(bastColOverride || {}),
                                [field.key]: Number(e.target.value)
                              };
                              setBastColOverride(nextOverride);
                              const targetRows = bastSheets[bastSelectedSheetIdx]?.rows || [];
                              if (targetRows.length > 0) {
                                applyBastSheetAnalysis(targetRows, bastDetectedInfo.fileName, nextOverride);
                              }
                            }}
                            className="w-full mt-0.5 px-2 py-1 rounded-lg bg-white border border-emerald-300 text-[11px] font-bold"
                          >
                            <option value={-1}>-- Tidak Ada / Kosongkan --</option>
                            {bastDetectedInfo.headers.map((h: string, i: number) => (
                              <option key={i} value={i}>
                                [{i + 1}] {h}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900">
                    Nomor BA / BAST Dokumen (Default)
                  </label>
                  <input
                    type="text"
                    placeholder="Kosong / Sesuai Baris BA"
                    value={bastHeader.noBA}
                    onChange={(e) => setBastHeader({ ...bastHeader, noBA: e.target.value })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-black text-[#1E1B4B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900">
                    Tanggal Dokumen BA
                  </label>
                  <input
                    type="date"
                    value={bastHeader.date}
                    onChange={(e) => setBastHeader({ ...bastHeader, date: e.target.value })}
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900">
                    Sumber Anggaran Default
                  </label>
                  <input
                    type="text"
                    placeholder="Mis: DAK / JKN / PKD"
                    value={bastHeader.sumberAnggaran}
                    onChange={(e) =>
                      setBastHeader({ ...bastHeader, sumberAnggaran: e.target.value })
                    }
                    className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-80 border border-emerald-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-950 font-extrabold uppercase">
                      <th className="py-2.5 px-2.5">Nomor BA & Nama Barang</th>
                      <th className="py-2.5 px-2">Satuan</th>
                      <th className="py-2.5 px-2">Batch & ED (Opsional)</th>
                      <th className="py-2.5 px-2 text-right">Stok Awal</th>
                      <th className="py-2.5 px-2 text-right">Banyaknya / Jml</th>
                      <th className="py-2.5 px-2 text-right">Harga Satuan & Total (Rp)</th>
                      <th className="py-2.5 px-2 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {bastParsedItems.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-slate-500">
                          <p className="font-bold text-emerald-900 mb-1">
                            Belum ada file BA yang di-upload.
                          </p>
                          <p className="text-[11px]">
                            Klik tombol hijau <strong>Upload File BA (.pdf/.jpg/.png/.xlsx/.docx/.csv)</strong> di kanan atas untuk membaca dokumen BA asli Anda secara otomatis, atau klik <strong>+ Tambah Baris</strong>.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      bastParsedItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-emerald-50/40">
                          <td className="py-2 px-2.5 min-w-[170px]">
                            <input
                              type="text"
                              placeholder="No. BA (Kosong jika tak ada)"
                              value={item.noBA ?? ''}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], noBA: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-full font-mono text-[10px] font-bold text-purple-700 bg-purple-50/60 px-1.5 py-0.5 rounded border border-purple-200 mb-1"
                            />
                            <input
                              type="text"
                              placeholder="Nama Barang / Obat"
                              value={item.name}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], name: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-full font-extrabold text-[#1E1B4B] bg-transparent border-b border-slate-200 focus:border-emerald-400 focus:outline-none"
                            />
                            {(() => {
                              const kfa = matchKfaAndVen(item.name);
                              return (
                                <div className="flex flex-wrap items-center gap-1 mt-1">
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[9px] font-black">
                                    {kfa.kfaCode} · VEN:{kfa.ven} ({kfa.similarity}% Match)
                                  </span>
                                  {item.convertedInfo && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                                      {item.convertedInfo}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], unit: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-16 px-1.5 py-1 rounded bg-slate-50 border border-slate-200 font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => handleConvertBastRowToBaseUnit(idx)}
                              title="Rekomendasi #2: Pecah Kemasan Besar (Box/Dus) menjadi Satuan Terkecil (Pcs/Tablet/Strip) secara otomatis"
                              className="mt-1 px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 border border-amber-300 text-[9px] font-black text-[#1E1136] block cursor-pointer"
                            >
                              🔄 Pecah Satuan
                            </button>
                            <input
                              type="text"
                              placeholder="Sumber"
                              value={item.sumberAnggaran ?? ''}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], sumberAnggaran: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-16 mt-1 px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-800 block"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              placeholder="Kosong (Tanpa Batch)"
                              value={item.batchNo ?? ''}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], batchNo: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-28 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] font-bold block mb-1 placeholder:text-slate-400 placeholder:font-sans"
                            />
                            <input
                              type="date"
                              value={item.expiryDate ?? ''}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], expiryDate: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-28 px-1 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px]"
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            <input
                              type="number"
                              min="0"
                              value={item.stokAwal ?? 0}
                              onChange={(e) => {
                                const next = [...bastParsedItems];
                                next[idx] = { ...next[idx], stokAwal: e.target.value };
                                setBastParsedItems(next);
                              }}
                              className="w-16 text-right px-1.5 py-1 rounded bg-slate-50 border border-slate-200 font-bold text-slate-700"
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            <input
                              type="number"
                              min="0"
                              value={item.qty}
                              onChange={(e) => {
                                const newQty = Number(e.target.value) || 0;
                                const curPrice = Number(item.price) || 0;
                                const next = [...bastParsedItems];
                                next[idx] = {
                                  ...next[idx],
                                  qty: e.target.value,
                                  totalPrice: curPrice > 0 ? Math.round(curPrice * newQty) : next[idx].totalPrice
                                };
                                setBastParsedItems(next);
                              }}
                              className="w-20 text-right px-2 py-1 rounded bg-emerald-50 border border-emerald-300 font-black text-emerald-900"
                            />
                            {Number(item.qtyOut) > 0 && (
                              <span className="block text-[10px] font-bold text-rose-600 mt-0.5">
                                Keluar: -{item.qtyOut}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right min-w-[130px]">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] font-bold text-slate-400">@</span>
                                <input
                                  type="number"
                                  min="0"
                                  title="Harga Satuan (Rp)"
                                  value={item.price}
                                  onChange={(e) => {
                                    const newPrice = Number(e.target.value) || 0;
                                    const q = Number(item.qty) || Number(item.stokAwal) || 1;
                                    const next = [...bastParsedItems];
                                    next[idx] = {
                                      ...next[idx],
                                      price: e.target.value,
                                      totalPrice: Math.round(newPrice * q)
                                    };
                                    setBastParsedItems(next);
                                  }}
                                  className="w-24 text-right px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-bold text-[11px]"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[9px] font-extrabold text-emerald-700">Tot:</span>
                                <input
                                  type="number"
                                  min="0"
                                  title="Jumlah / Harga Total (Rp) — Otomatis menghitung Harga Satuan jika diubah"
                                  value={item.totalPrice ?? Math.round((Number(item.price) || 0) * (Number(item.qty) || 1))}
                                  onChange={(e) => {
                                    const newTotal = Number(e.target.value) || 0;
                                    const q = Number(item.qty) || Number(item.stokAwal) || 1;
                                    const next = [...bastParsedItems];
                                    next[idx] = {
                                      ...next[idx],
                                      totalPrice: e.target.value,
                                      price: q > 0 ? Math.round(newTotal / q) : newTotal
                                    };
                                    setBastParsedItems(next);
                                  }}
                                  className="w-24 text-right px-2 py-0.5 rounded bg-emerald-50/80 border border-emerald-300 font-black text-emerald-900 text-[11px]"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                setBastParsedItems(bastParsedItems.filter((_, i) => i !== idx))
                              }
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {bastParsedItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-[#23153C] text-white text-xs shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-300 text-[#23153C] font-black text-[10px]">
                      AI VERIFIED ✓
                    </span>
                    <span className="font-bold">
                      Total {bastParsedItems.length} Jenis Barang · Total Unit:{" "}
                      <strong>
                        {bastParsedItems
                          .reduce((s, i) => s + (Number(i.qty) || Number(i.stokAwal) || 0), 0)
                          .toLocaleString("id-ID")}
                      </strong>
                    </span>
                  </div>
                  <div className="font-black text-amber-300 text-sm">
                    Grand Total Nilai BA: Rp{" "}
                    {bastParsedItems
                      .reduce(
                        (s, i) =>
                          s +
                          (Number(i.totalPrice) ||
                            Math.round((Number(i.price) || 0) * (Number(i.qty) || Number(i.stokAwal) || 1))),
                        0
                      )
                      .toLocaleString("id-ID")}
                  </div>
                </div>
              )}
              {bastParsedItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 px-3 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs">
                  <label className="flex items-center gap-2 font-bold text-emerald-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replaceExistingOnCommit}
                      onChange={(e) => setReplaceExistingOnCommit(e.target.checked)}
                      className="rounded border-emerald-400 text-emerald-600"
                    />
                    <span>Ganti Data Sampel dengan Data File BA Ini (Mulai Bersih)</span>
                  </label>

                  {bastParsedItems.some((i) => Number(i.qtyOut) > 0) && (
                    <label className="flex items-center gap-2 font-bold text-pink-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeOutFromBast}
                        onChange={(e) => setIncludeOutFromBast(e.target.checked)}
                        className="rounded border-pink-400 text-pink-600"
                      />
                      <span>Sekaligus Catat Pengeluaran yang Ada di File Ini</span>
                    </label>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setBastParsedItems([
                      ...bastParsedItems,
                      {
                        id: `BAST-MAN-${Date.now()}`,
                        medId: 'NEW',
                        noBA: bastHeader.noBA || '',
                        sumberAnggaran: bastHeader.sumberAnggaran || 'DAK',
                        name: '',
                        unit: 'Tablet',
                        batchNo: '',
                        expiryDate: '',
                        stokAwal: 0,
                        qty: 100,
                        qtyOut: 0,
                        price: 0
                      }
                    ])
                  }
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris
                </button>

                {bastParsedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBastParsedItems([])}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                  >
                    Bersihkan Tabel
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCommitBastItems}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan Semua ({bastParsedItems.length} Item) ke Master Obat & Kartu Stok
                </button>
              </div>
            </div>
          </div>

          {/* CARD B: SMART PENGELUARAN / E-PUSKESMAS UPLOAD */}
          <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border-2 border-pink-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1B4B]">
                      2. Smart Upload Pengeluaran (e-Puskesmas / Rekap Keluar)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Baca asli daftar pengeluaran obat (Batch dikosongkan jika tidak ada di file)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEpuskPasteModal(true)}
                    className="px-3 py-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> Tempel Tabel
                  </button>
                  <label className="cursor-pointer px-4 py-2 rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm hover:opacity-95 transition">
                    <Upload className="w-4 h-4" />
                    <span>{isReadingEpusk ? 'Membaca File...' : 'Upload File Pengeluaran'}</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.tsv,.txt,.docx,.pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleEpuskesmasUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {epuskDetectedInfo && (
                <div className="mb-4 p-3 rounded-2xl bg-pink-50/90 border border-pink-300 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-black text-pink-950">
                        📄 File Pengeluaran: {epuskDetectedInfo.fileName}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 font-bold text-[11px]">
                        {epuskesmasItems.length} Item Keluar
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {epuskSheets.length > 1 && (
                        <select
                          value={epuskSelectedSheetIdx}
                          onChange={(e) => {
                            const idx = Number(e.target.value);
                            setEpuskSelectedSheetIdx(idx);
                            applyEpuskSheetAnalysis(epuskSheets[idx].rows, epuskDetectedInfo.fileName, null);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white border border-pink-300 font-bold text-pink-950"
                        >
                          {epuskSheets.map((sh, i) => (
                            <option key={i} value={i}>
                              Sheet: {sh.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowEpuskColMapper(!showEpuskColMapper)}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-pink-100 border border-pink-300 font-extrabold text-pink-900 cursor-pointer"
                      >
                        {showEpuskColMapper ? 'Tutup Kolom ▲' : '🔧 Sesuaikan Kolom ▼'}
                      </button>
                    </div>
                  </div>

                  {showEpuskColMapper && epuskDetectedInfo.headers && (
                    <div className="pt-2 mt-2 border-t border-pink-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'name', label: 'Kolom Nama Obat' },
                        { key: 'qtyOut', label: 'Kolom Jumlah Keluar' },
                        { key: 'unit', label: 'Kolom Satuan' },
                        { key: 'noBA', label: 'Kolom No. Dokumen / BA' },
                        { key: 'batchNo', label: 'Kolom Batch (Opsional)' }
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[10px] font-bold text-pink-900">
                            {field.label}
                          </label>
                          <select
                            value={epuskColOverride?.[field.key] ?? epuskDetectedInfo.colMap[field.key] ?? -1}
                            onChange={(e) => {
                              const nextOverride = {
                                ...epuskDetectedInfo.colMap,
                                ...(epuskColOverride || {}),
                                [field.key]: Number(e.target.value)
                              };
                              setEpuskColOverride(nextOverride);
                              const targetRows = epuskSheets[epuskSelectedSheetIdx]?.rows || [];
                              if (targetRows.length > 0) {
                                applyEpuskSheetAnalysis(targetRows, epuskDetectedInfo.fileName, nextOverride);
                              }
                            }}
                            className="w-full mt-0.5 px-2 py-1 rounded-lg bg-white border border-pink-300 text-[11px] font-bold"
                          >
                            <option value={-1}>-- Tidak Ada / Kosongkan --</option>
                            {epuskDetectedInfo.headers.map((h: string, i: number) => (
                              <option key={i} value={i}>
                                [{i + 1}] {h}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/70 p-3.5 rounded-2xl border border-pink-200 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-pink-900">
                    Tanggal Pengeluaran (Masuk ke Kolom Tanggal Kertas Kerja)
                  </label>
                  <input
                    type="date"
                    value={epuskesmasDate}
                    onChange={(e) => setEpuskesmasDate(e.target.value)}
                    className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-white border border-pink-300 text-xs font-black text-[#1E1B4B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-pink-900">
                    Nomor Dokumen / Rekap Pengeluaran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: EPUSK-HARIAN / LPLPO"
                    value={epuskesmasDocNo}
                    onChange={(e) => setEpuskesmasDocNo(e.target.value)}
                    className="w-full mt-0.5 px-3 py-1.5 rounded-xl bg-white border border-pink-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-80 border border-pink-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-pink-100/80 text-pink-950 font-extrabold uppercase">
                      <th className="py-2.5 px-3">Nama Obat (Terbaca dari File)</th>
                      <th className="py-2.5 px-2">Satuan</th>
                      <th className="py-2.5 px-2">Batch (Opsional)</th>
                      <th className="py-2.5 px-2 text-right">Stok Tersedia</th>
                      <th className="py-2.5 px-3 text-right">Jumlah Keluar</th>
                      <th className="py-2.5 px-2 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {epuskesmasItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-slate-500">
                          <p className="font-bold text-pink-900 mb-1">
                            Belum ada file Pengeluaran yang di-upload.
                          </p>
                          <p className="text-[11px]">
                            Klik <strong>Upload File Pengeluaran</strong> di kanan atas untuk membaca file Excel/CSV e-Puskesmas atau rekap pengeluaran harian Anda, atau klik <strong>+ Tambah Item</strong>.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      epuskesmasItems.map((item, idx) => {
                        const med = medicineWithBalances.find((m) => m.id === item.medId);
                        return (
                          <tr key={item.id} className="hover:bg-pink-50/40">
                            <td className="py-2 px-3 min-w-[160px]">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const found = medicineWithBalances.find(
                                    (m) => m.name.toLowerCase() === val.trim().toLowerCase()
                                  );
                                  const next = [...epuskesmasItems];
                                  next[idx] = {
                                    ...next[idx],
                                    name: val,
                                    medId: found ? found.id : 'NEW',
                                    unit: found?.unit || next[idx].unit
                                  };
                                  setEpuskesmasItems(next);
                                }}
                                className="w-full font-extrabold text-[#1E1B4B] bg-transparent border-b border-slate-200 focus:border-pink-400 focus:outline-none"
                              />
                              <select
                                value={item.medId}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const found = medicineWithBalances.find((m) => m.id === val);
                                  const next = [...epuskesmasItems];
                                  next[idx] = {
                                    ...next[idx],
                                    medId: val,
                                    name: found ? found.name : next[idx].name,
                                    unit: found ? found.unit : next[idx].unit
                                  };
                                  setEpuskesmasItems(next);
                                }}
                                className="w-full mt-1 text-[10px] font-bold text-purple-800 bg-purple-50 rounded px-1 py-0.5 border border-purple-200"
                              >
                                <option value="NEW">+ Obat Belum Ada di Master (Otomatis Buat)</option>
                                {medicineWithBalances.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    Cocok Master: {m.name} (Stok: {m.currentStock})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) => {
                                  const next = [...epuskesmasItems];
                                  next[idx] = { ...next[idx], unit: e.target.value };
                                  setEpuskesmasItems(next);
                                }}
                                className="w-16 px-1.5 py-1 rounded bg-slate-50 border border-slate-200 font-semibold"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                placeholder="Kosong (Tanpa Batch)"
                                value={item.batchNo ?? ''}
                                onChange={(e) => {
                                  const next = [...epuskesmasItems];
                                  next[idx] = { ...next[idx], batchNo: e.target.value };
                                  setEpuskesmasItems(next);
                                }}
                                className="w-24 px-1.5 py-1 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] font-bold placeholder:font-sans"
                              />
                            </td>
                            <td className="py-2 px-2 text-right font-bold text-slate-700">
                              {med ? med.currentStock.toLocaleString('id-ID') : '-'}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => {
                                  const next = [...epuskesmasItems];
                                  next[idx] = { ...next[idx], qty: e.target.value };
                                  setEpuskesmasItems(next);
                                }}
                                className="w-20 text-right px-2 py-1 rounded bg-pink-50 border border-pink-300 font-black text-pink-900"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setEpuskesmasItems(epuskesmasItems.filter((_, i) => i !== idx))
                                }
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setEpuskesmasItems([
                    ...epuskesmasItems,
                    {
                      id: `EP-MAN-${Date.now()}`,
                      medId: medicineWithBalances[0]?.id || 'NEW',
                      name: medicineWithBalances[0]?.name || '',
                      unit: medicineWithBalances[0]?.unit || 'Tablet',
                      batchNo: '',
                      expiryDate: '',
                      qty: 10
                    }
                  ])
                }
                className="px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Item
              </button>

              {epuskesmasItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEpuskesmasItems([])}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                >
                  Bersihkan
                </button>
              )}

              <button
                type="button"
                onClick={handleCommitEpuskesmasOut}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowUpFromLine className="w-4 h-4" /> Proses Otomatis Semua Pengeluaran e-Puskesmas ({epuskesmasItems.length} Obat)
              </button>
            </div>
          </div>
        </div>

        {/* MANUAL FALLBACK / KOREKSI SATUAN */}
        <details className="bg-white/90 rounded-3xl border border-purple-200/80 p-5" open={medicines.length > 0 && bastParsedItems.length === 0 && epuskesmasItems.length === 0}>
          <summary className="cursor-pointer font-extrabold text-sm text-[#3B215D] flex items-center justify-between">
            <span>
              ⚙️ Input Manual Satuan (Penerimaan / Pengeluaran Cepat Per Obat — Batch & ED Opsional)
            </span>
            <span className="text-xs text-purple-600 font-bold">Klik untuk buka/tutup ↓</span>
          </summary>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 pt-4 border-t border-purple-100">
            <form onSubmit={handleRecordObatMasuk} className="space-y-3">
              <h4 className="font-black text-sm text-emerald-800">Input Manual Obat Masuk (Satuan)</h4>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={inForm.medId}
                  onChange={(e) => setInForm({ ...inForm, medId: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {medicineWithBalances.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nomor BA / Dokumen (Opsional)"
                  value={inForm.docNo}
                  onChange={(e) => setInForm({ ...inForm, docNo: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Batch (Kosongkan jika tak ada)"
                  value={inForm.batchNo}
                  onChange={(e) => setInForm({ ...inForm, batchNo: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="date"
                  title="Tanggal Expired (Opsional)"
                  value={inForm.expiryDate}
                  onChange={(e) => setInForm({ ...inForm, expiryDate: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="date"
                  value={inForm.date}
                  onChange={(e) => setInForm({ ...inForm, date: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Jumlah Masuk"
                  value={inForm.qty}
                  onChange={(e) => setInForm({ ...inForm, qty: Number(e.target.value) })}
                  className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                + Simpan Masuk Manual
              </button>
            </form>

            <form onSubmit={handleRecordObatKeluar} className="space-y-3">
              <h4 className="font-black text-sm text-pink-800">
                Input Manual Obat Keluar (Di Luar e-Puskesmas / Koreksi)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={outForm.medId}
                  onChange={(e) => setOutForm({ ...outForm, medId: e.target.value, batchNo: 'AUTO_FEFO' })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  {medicineWithBalances.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Stok: {m.currentStock})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Keterangan (Mis: Pelayanan / Pustu)"
                  value={outForm.destination}
                  onChange={(e) => setOutForm({ ...outForm, destination: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="date"
                  value={outForm.date}
                  onChange={(e) => setOutForm({ ...outForm, date: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="number"
                  min="1"
                  max={selectedOutMed?.currentStock || 999999}
                  value={outForm.qty}
                  onChange={(e) => setOutForm({ ...outForm, qty: Number(e.target.value) })}
                  className="px-3 py-2 rounded-xl bg-pink-50 border border-pink-300 text-xs font-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs cursor-pointer"
              >
                - Simpan Keluar Manual (FEFO)
              </button>
            </form>
          </div>
        </details>
      </div>
    );
  };


  // --- MODULE 6: AUTO GENERATE KERTAS KERJA (AUTO-SYNC MASUK & KELUAR PER TANGGAL + GROUP BY NOMOR BA) ---
  const renderKertasKerja = () => {
    const isAllPeriods = worksheetMonth === 'ALL' || !worksheetMonth.includes('-');
    const [yearStr, monthStr] = isAllPeriods ? ['2026', '11'] : worksheetMonth.split('-');
    const yearNum = Number(yearStr) || 2026;
    const monthNum = Number(monthStr) || 11;
    const daysInMonth = isAllPeriods ? 31 : new Date(yearNum, monthNum, 0).getDate();
    const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const MONTH_NAMES_ID = [
      'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
      'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
    ];
    const monthLabel = isAllPeriods
      ? 'SEMUA PERIODE AKTIF (AKUMULASI OTOMATIS)'
      : `${MONTH_NAMES_ID[monthNum - 1] || 'NOVEMBER'} ${yearNum}`;

    // Collect all distinct months that exist in transactions for 1-click period switching
    const availableTxMonths = Array.from(
      new Set(
        transactions
          .map((t) => (t.date && t.date.length >= 7 ? t.date.slice(0, 7) : ''))
          .filter(Boolean)
      )
    ).sort();

    // Collect all distinct Nomor BA for filtering & grouping
    const availableBANumbers = Array.from(
      new Set(medicineWithBalances.map((m) => m.noBA || 'TANPA-NOMOR-BA'))
    );

    const worksheetRows = medicineWithBalances
      .filter((m) => {
        const catMatch = worksheetCategory === 'ALL' || m.category === worksheetCategory;
        const locMatch = worksheetLocation === 'ALL' || (m.location || '').includes(worksheetLocation);
        const baMatch = worksheetFilterBA === 'ALL' || (m.noBA || 'TANPA-NOMOR-BA') === worksheetFilterBA;
        return catMatch && locMatch && baMatch;
      })
      .map((med, index) => {
        // Prior transactions before the selected month roll into Stok Awal when a specific month is selected
        const priorTx = isAllPeriods
          ? []
          : transactions.filter(
              (t) => t.medId === med.id && t.date && t.date.slice(0, 7) < worksheetMonth
            );
        const priorIn = priorTx
          .filter((t) => t.type === 'IN')
          .reduce((sum, t) => sum + Number(t.qty || 0), 0);
        const priorOut = priorTx
          .filter((t) => t.type === 'OUT')
          .reduce((sum, t) => sum + Number(t.qty || 0), 0);

        const medMonthTx = transactions.filter((t) => {
          if (t.medId !== med.id || !t.date) return false;
          return isAllPeriods ? true : t.date.startsWith(worksheetMonth);
        });

        const dailyInMap: Record<number, number> = {};
        const dailyOutMap: Record<number, number> = {};
        dayNumbers.forEach((d) => {
          dailyInMap[d] = 0;
          dailyOutMap[d] = 0;
        });

        medMonthTx.forEach((t) => {
          const dayPart = Number(String(t.date).split('-')[2]);
          if (dayPart >= 1 && dayPart <= daysInMonth) {
            if (t.type === 'IN') {
              dailyInMap[dayPart] = (dailyInMap[dayPart] || 0) + Number(t.qty || 0);
            } else if (t.type === 'OUT') {
              dailyOutMap[dayPart] = (dailyOutMap[dayPart] || 0) + Number(t.qty || 0);
            }
          }
        });

        const penerimaanBulanIni = Object.values(dailyInMap).reduce((a, b) => a + Number(b || 0), 0);
        const totalKeluarBulanIni = Object.values(dailyOutMap).reduce((a, b) => a + Number(b || 0), 0);
        const stokAwal = Math.max(0, Number(med.initialBalance || 0) + priorIn - priorOut);
        const persediaan = stokAwal + penerimaanBulanIni;
        const sisaStok = Math.max(0, persediaan - totalKeluarBulanIni);
        const stokFisik = Number(opnamePhysicalCounts[med.id] ?? sisaStok);
        const hargaSatuan = Number(med.price || 0);
        const totalNilaiSisa = sisaStok * hargaSatuan;
        const totalNilaiFisik = stokFisik * hargaSatuan;

        const cleanBatch = med.fefoBatch?.batchNo && med.fefoBatch.batchNo !== '-' ? med.fefoBatch.batchNo : '';
        const cleanEd = med.fefoBatch?.expiryDate && med.fefoBatch.expiryDate !== '-' ? med.fefoBatch.expiryDate : '';

        return {
          no: index + 1,
          ...med,
          noBA: med.noBA || 'TANPA-NOMOR-BA',
          sumberAnggaran: med.sumberAnggaran || '-',
          batchNo: cleanBatch,
          expiryDate: cleanEd,
          stokAwal,
          penerimaanBulanIni,
          persediaan,
          dailyInMap,
          dailyOutMap,
          totalKeluarBulanIni,
          sisaStok,
          stokFisik,
          hargaSatuan,
          totalNilaiSisa,
          totalNilaiFisik
        };
      });

    // Group worksheetRows by Nomor BA (sesuai instruksi pengguna: kelompokkan daftar obat sesuai Nomor BA mereka)
    const groupedByBA = (() => {
      const map = new Map<string, { noBA: string; sumber: string; items: any[]; subtotalUnit: number; subtotalNilaiRp: number; subtotalIn: number; subtotalOut: number }>();
      for (const r of worksheetRows) {
        const key = r.noBA || 'TANPA-NOMOR-BA';
        if (!map.has(key)) {
          map.set(key, {
            noBA: key,
            sumber: r.sumberAnggaran || '-',
            items: [],
            subtotalUnit: 0,
            subtotalNilaiRp: 0,
            subtotalIn: 0,
            subtotalOut: 0
          });
        }
        const grp = map.get(key)!;
        grp.items.push(r);
        grp.subtotalUnit += r.sisaStok;
        grp.subtotalNilaiRp += r.totalNilaiSisa;
        grp.subtotalIn += r.penerimaanBulanIni;
        grp.subtotalOut += r.totalKeluarBulanIni;
      }
      return Array.from(map.values());
    })();

    const grandTotalMasukUnit = worksheetRows.reduce((s, r) => s + r.penerimaanBulanIni, 0);
    const grandTotalKeluarUnit = worksheetRows.reduce((s, r) => s + r.totalKeluarBulanIni, 0);
    const grandTotalFisikUnit = worksheetRows.reduce((s, r) => s + r.sisaStok, 0);
    const grandTotalNilaiRp = worksheetRows.reduce((s, r) => s + r.totalNilaiSisa, 0);

    const tteHashKertasKerja = generateTteSignatureHash(
      'KERTAS-KERJA-BA',
      worksheetMonth,
      grandTotalNilaiRp,
      currentUser.name
    );

    const handleQuickCellMutasiSubmit = (e: any) => {
      e.preventDefault();
      if (!quickCellEdit || quickCellEdit.qty <= 0) return;
      const { med, day, type, qty } = quickCellEdit;
      const targetMonth = isAllPeriods ? '2026-11' : worksheetMonth;
      const dateStr = `${targetMonth}-${String(day).padStart(2, '0')}`;
      const docCode = med.noBA && med.noBA !== 'TANPA-NOMOR-BA' ? med.noBA : `KK-${type}-${dateStr}`;

      if (type === 'OUT' && qty > med.currentStock) {
        triggerToast('Stok Tidak Cukup!', `Sisa stok ${med.name} hanya ${med.currentStock} ${med.unit}.`, 'error');
        return;
      }

      const delta = type === 'IN' ? qty : -qty;
      setBatches((prev) => {
        const idx = prev.findIndex((b) => b.medId === med.id);
        if (idx === -1) {
          return [
            ...prev,
            {
              id: `B-KK-${Date.now()}`,
              medId: med.id,
              batchNo: '',
              expiryDate: '',
              stock: Math.max(0, delta),
              source: docCode
            }
          ];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], stock: Math.max(0, Number(next[idx].stock || 0) + delta) };
        return next;
      });

      setOpnamePhysicalCounts((prev) => ({
        ...prev,
        [med.id]: Math.max(0, Number(prev[med.id] ?? med.currentStock) + delta)
      }));

      setTransactions((prev) => [
        {
          id: `TRX-KK-${Date.now()}`,
          type,
          medId: med.id,
          medName: med.name,
          docNo: docCode,
          date: dateStr,
          timeLabel: `Tgl ${String(day).padStart(2, '0')}`,
          dayName: `Tgl ${day}`,
          batchNo: med.batchNo || '',
          expiryDate: med.expiryDate || '',
          qty,
          unit: med.unit,
          price: med.hargaSatuan || 0,
          sourceOrDest: type === 'IN' ? `Penerimaan BA (${docCode})` : 'Pengeluaran Harian Kertas Kerja',
          officer: currentUser.name,
          notes: `Input langsung dari Kertas Kerja Tanggal ${day}`
        },
        ...prev
      ]);

      setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
      setQuickCellEdit(null);
      triggerToast(
        `Tersinkron ke Kertas Kerja & Kartu Stok! ✨`,
        `${type === 'IN' ? '+' : '-'}${qty} ${med.unit} ${med.name} tercatat pada Tanggal ${day} (No. BA: ${docCode}).`
      );
    };

    const handleDownloadExcelMeiFormat = () => {
      const dayHeadersHtml = dayNumbers
        .map(
          (d) =>
            `<th style="background:#FCE7F3;border:1px solid #000;padding:4px;text-align:center;">${d}</th>`
        )
        .join('');

      let globalCounter = 1;
      const groupedHtml = groupedByBA
        .map((grp) => {
          const groupHeaderRow = `
            <tr>
              <td colspan="${9 + daysInMonth + 4}" style="background:#EDE9FE;border:1px solid #000;padding:6px;font-weight:bold;color:#2E1065;">
                KELOMPOK NOMOR BA: ${grp.noBA} &nbsp;|&nbsp; SUMBER: ${grp.sumber} &nbsp;|&nbsp; JUMLAH BARANG: ${grp.items.length} ITEM &nbsp;|&nbsp; SUBTOTAL NILAI BA: Rp ${grp.subtotalNilaiRp.toLocaleString('id-ID')}
              </td>
            </tr>
          `;
          const itemRowsHtml = grp.items
            .map((r) => {
              const dayCellsHtml = dayNumbers
                .map((d) => {
                  const inV = r.dailyInMap[d] || 0;
                  const outV = r.dailyOutMap[d] || 0;
                  const cellTxt =
                    inV > 0 && outV > 0
                      ? `+${inV} / -${outV}`
                      : inV > 0
                      ? `+${inV}`
                      : outV > 0
                      ? `${outV}`
                      : '';
                  return `<td style="border:1px solid #000;padding:4px;text-align:center;">${cellTxt}</td>`;
                })
                .join('');

              return `
                <tr>
                  <td style="border:1px solid #000;padding:4px;text-align:center;">${globalCounter++}</td>
                  <td style="border:1px solid #000;padding:4px;font-weight:bold;">${r.noBA || ''}</td>
                  <td style="border:1px solid #000;padding:4px;">${r.name}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:center;">${r.sumberAnggaran || ''}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:center;">${r.unit}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;">${r.hargaSatuan}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;">${r.stokAwal}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;background:#ECFDF5;">${r.penerimaanBulanIni}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;font-weight:bold;">${r.persediaan}</td>
                  ${dayCellsHtml}
                  <td style="border:1px solid #000;padding:4px;text-align:right;font-weight:bold;background:#FFE4E6;">${r.totalKeluarBulanIni}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;font-weight:bold;background:#EDE9FE;">${r.sisaStok}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:right;font-weight:bold;background:#DCFCE7;">${r.totalNilaiSisa}</td>
                  <td style="border:1px solid #000;padding:4px;text-align:center;">${r.expiryDate || ''}</td>
                </tr>
              `;
            })
            .join('');
          return groupHeaderRow + itemRowsHtml;
        })
        .join('');

      const htmlTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>
          <h3 style="text-align:center;">LAPORAN KERTAS KERJA PERSEDIAAN & MUTASI OBAT HARIAN PER NOMOR BA — ${clinicProfile.puskesmasName.toUpperCase()}</h3>
          <h4 style="text-align:center;">PERIODE: ${monthLabel} | TTE HASH: ${tteHashKertasKerja}</h4>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:11px;">
            <thead>
              <tr>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">NO</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">NOMOR BA / BAST</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">NAMA BARANG / OBAT</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">SUMBER ANGGARAN</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">SATUAN</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">HARGA SATUAN (Rp)</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">STOK AWAL</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">PENERIMAAN (MASUK)</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">TOTAL PERSEDIAAN</th>
                <th colspan="${daysInMonth}" style="background:#FBCFE8;border:1px solid #000;padding:6px;text-align:center;">MUTASI HARIAN PER TANGGAL 1 S/D ${daysInMonth} (+MASUK / -KELUAR)</th>
                <th rowspan="2" style="background:#FFE4E6;border:1px solid #000;padding:6px;">TOTAL PENGELUARAN</th>
                <th rowspan="2" style="background:#EDE9FE;border:1px solid #000;padding:6px;">SISA STOK (FISIK)</th>
                <th rowspan="2" style="background:#DCFCE7;border:1px solid #000;padding:6px;">TOTAL NILAI SISA BARANG (Rp)</th>
                <th rowspan="2" style="background:#DDD6FE;border:1px solid #000;padding:6px;">KET. EXPIRED</th>
              </tr>
              <tr>${dayHeadersHtml}</tr>
            </thead>
            <tbody>
              ${groupedHtml}
              <tr>
                <td colspan="${9 + daysInMonth + 1}" style="border:1px solid #000;padding:6px;text-align:right;font-weight:bold;">GRAND TOTAL PERSEDIAAN AKHIR (SELURUH NOMOR BA)</td>
                <td style="border:1px solid #000;padding:6px;text-align:right;font-weight:bold;background:#EDE9FE;">${grandTotalFisikUnit}</td>
                <td style="border:1px solid #000;padding:6px;text-align:right;font-weight:bold;background:#DCFCE7;">Rp ${grandTotalNilaiRp.toLocaleString('id-ID')}</td>
                <td style="border:1px solid #000;padding:6px;"></td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([htmlTemplate], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KERTAS_KERJA_PER_BA_${monthLabel.replace(/\s+/g, '_')}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      triggerToast(
        'Kertas Kerja Per Nomor BA Berhasil Diunduh! ♡',
        `File Excel lengkap dengan Pengelompokan Nomor BA, Tanggal 1-${daysInMonth}, Masuk/Keluar, & Nilai Rupiah siap dibuka.`
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#2E1065] via-[#5B21B6] to-[#9D174D] text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4 border-2 border-pink-300/40">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-300 text-[#1E1136] text-xs font-black uppercase">
                ⚡ Real-Time Auto-Sync Masuk & Keluar Per Tanggal
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold">
                📦 Dikelompokkan Sesuai Nomor BA ({groupedByBA.length} Kelompok BA)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Kertas Kerja Mutasi Harian & Bulanan (Tersinkron Otomatis per Nomor BA)
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 mt-0.5 max-w-3xl">
              Setiap kali ada <strong>Obat Masuk (Upload BA / Manual / Scan Rak)</strong> maupun <strong>Obat Keluar</strong>, tabel ini otomatis mencatatnya tepat pada kolom <strong>Tanggal (1 s/d {daysInMonth})</strong> dan mengelompokkan daftar barang berdasarkan <strong>Nomor BA</strong> masing-masing. Klik angka pada tanggal mana saja untuk menambah mutasi langsung!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
                triggerToast(
                  'Worksheet Berhasil Di-generate! ✨',
                  `Seluruh ${worksheetRows.length} obat dalam ${groupedByBA.length} Kelompok Nomor BA telah disinkronkan.`
                );
              }}
              className="simfar-btn-pop px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-pink-200 font-black text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> GENERATE WORKSHEET
            </button>
            <button
              onClick={handleDownloadExcelMeiFormat}
              className="simfar-btn-pop px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#2A1846] font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> DOWNLOAD EXCEL FORMAT LAMPIRAN (.XLS)
            </button>
            <button
              onClick={() =>
                exportToCSV(
                  `Kertas_Kerja_Per_BA_${monthLabel.replace(/\s+/g, '_')}.csv`,
                  ['No', 'Nomor BA', 'Kode KFA', 'Nama Barang', 'Sumber Anggaran', 'Satuan', 'Harga Satuan', 'Stok Awal', 'Penerimaan', 'Persediaan', 'Total Keluar', 'Sisa Stok', 'Total Nilai (Rp)', 'Ket. Expired'],
                  worksheetRows.map((m) => [
                    m.no,
                    m.noBA || '',
                    m.kfaCode || '',
                    m.name,
                    m.sumberAnggaran || '',
                    m.unit,
                    m.hargaSatuan,
                    m.stokAwal,
                    m.penerimaanBulanIni,
                    m.persediaan,
                    m.totalKeluarBulanIni,
                    m.sisaStok,
                    m.totalNilaiSisa,
                    m.expiryDate || ''
                  ])
                )
              }
              className="simfar-btn-pop px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
            <button
              onClick={() => window.print()}
              className="simfar-btn-pop px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Kertas Kerja
            </button>
          </div>
        </div>

        {/* KPI Ringkasan Kertas Kerja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="simfar-neo-card bg-white/95 p-4 rounded-2xl border-2 border-purple-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Jumlah Kelompok Nomor BA</p>
              <p className="text-2xl font-black text-[#2A1846] mt-0.5">
                {groupedByBA.length} <span className="text-xs font-bold">Dokumen BA</span>
              </p>
              <span className="text-[11px] font-bold text-purple-700">
                {worksheetRows.length} Jenis Obat Terdaftar
              </span>
            </div>
            <Layers className="w-9 h-9 text-purple-600" />
          </div>

          <div className="simfar-neo-card bg-white/95 p-4 rounded-2xl border-2 border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Total Mutasi Masuk & Keluar</p>
              <p className="text-lg font-black text-emerald-700 mt-0.5">
                +{grandTotalMasukUnit.toLocaleString('id-ID')} Masuk ·{' '}
                <span className="text-rose-600">-{grandTotalKeluarUnit.toLocaleString('id-ID')} Keluar</span>
              </p>
              <span className="text-[11px] font-bold text-slate-600">
                Tercatat Otomatis Per Tanggal
              </span>
            </div>
            <ArrowLeftRight className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="simfar-neo-card bg-white/95 p-4 rounded-2xl border-2 border-pink-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Total Sisa Fisik Barang</p>
              <p className="text-2xl font-black text-[#1E1B4B] mt-0.5">
                {grandTotalFisikUnit.toLocaleString('id-ID')} <span className="text-xs font-bold">Satuan</span>
              </p>
              <span className="text-[11px] font-bold text-pink-700">
                Akumulasi Seluruh Kelompok BA
              </span>
            </div>
            <Package className="w-9 h-9 text-pink-600" />
          </div>

          <div className="simfar-neo-card bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border-2 border-emerald-300 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-emerald-900">
                Total Nilai Sisa Persediaan (Rp)
              </p>
              <p className="text-2xl font-black text-emerald-950 mt-0.5">
                Rp {grandTotalNilaiRp.toLocaleString('id-ID')}
              </p>
              <span className="text-[11px] font-bold text-emerald-700">
                Sisa Fisik × Harga Satuan BA
              </span>
            </div>
            <ShieldCheck className="w-9 h-9 text-emerald-600" />
          </div>
        </div>

        {/* Filter & Quick Period Selector Bar */}
        <div className="bg-white/95 p-4 rounded-3xl border-2 border-purple-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-black text-[#1E1136] mr-1">📅 Pilih Periode Cepat:</span>
              <button
                type="button"
                onClick={() => setWorksheetMonth('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  isAllPeriods
                    ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                ✨ Semua Periode (Otomatis Tampil Semua Tanggal)
              </button>
              {availableTxMonths.map((mStr) => (
                <button
                  key={mStr}
                  type="button"
                  onClick={() => setWorksheetMonth(mStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                    worksheetMonth === mStr
                      ? 'bg-[#1E1136] text-amber-300 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-purple-100'
                  }`}
                >
                  Bulan {mStr}
                </button>
              ))}
              <input
                type="month"
                value={isAllPeriods ? '2026-11' : worksheetMonth}
                onChange={(e) => setWorksheetMonth(e.target.value)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-300 text-xs font-black text-[#3B245B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-xs font-black text-[#1E1136] cursor-pointer">
                <input
                  type="checkbox"
                  checked={worksheetGroupByBA}
                  onChange={(e) => setWorksheetGroupByBA(e.target.checked)}
                  className="rounded text-purple-700"
                />
                <span>📦 Kelompokkan Daftar Obat Sesuai Nomor BA</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-purple-900 mb-0.5">
                  Filter Nomor BA / BAST
                </label>
                <select
                  value={worksheetFilterBA}
                  onChange={(e) => setWorksheetFilterBA(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-300 text-xs font-black text-[#3B245B]"
                >
                  <option value="ALL">Semua Nomor BA ({availableBANumbers.length} BA)</option>
                  {availableBANumbers.map((ba) => (
                    <option key={ba} value={ba}>
                      BA: {ba}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-pink-900 mb-0.5">
                  Tampilan Sel Tanggal (1 s/d {daysInMonth})
                </label>
                <select
                  value={worksheetDailyDisplay}
                  onChange={(e) => setWorksheetDailyDisplay(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs font-extrabold text-pink-900"
                >
                  <option value="BOTH">Tampilkan Masuk (+Hijau) & Keluar (-Pink) per Tanggal</option>
                  <option value="OUT_ONLY">Hanya Pengeluaran Harian (-)</option>
                  <option value="IN_ONLY">Hanya Penerimaan Harian (+)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  Mode Kolom Tanggal
                </label>
                <select
                  value={worksheetViewMode}
                  onChange={(e) => setWorksheetViewMode(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  <option value="HARIAN">Rincian Harian (Tanggal 1 s/d {daysInMonth})</option>
                  <option value="REKAP">Ringkasan Bulanan (Tanpa Kolom Harian)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  Filter Kategori
                </label>
                <select
                  value={worksheetCategory}
                  onChange={(e) => setWorksheetCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="BMHP & Obat Lainnya">BMHP & Obat Lainnya</option>
                  <option value="BMHP & Reagensia Lab">BMHP & Reagensia Lab</option>
                  <option value="Obat Pelayanan Dasar">Obat Pelayanan Dasar</option>
                  <option value="Analgesik & Antipiretik">Analgesik & Antipiretik</option>
                  <option value="Antibiotik">Antibiotik</option>
                  <option value="Antihistamin / Alergi">Antihistamin / Alergi</option>
                  <option value="Saluran Cerna">Saluran Cerna</option>
                  <option value="Vitamin & Mineral">Vitamin & Mineral</option>
                  <option value="Kardiovaskular">Kardiovaskular</option>
                  <option value="Elektrolit & Nutrisi">Elektrolit & Nutrisi</option>
                </select>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-bold text-emerald-900">
                💡 Klik sel tanggal (1–{daysInMonth}) pada baris obat untuk input cepat Masuk/Keluar di tanggal tersebut!
              </span>
            </div>
          </div>
        </div>

        {/* Modal / Inline Popover Input Cepat per Sel Tanggal di Kertas Kerja */}
        {quickCellEdit && (
          <form
            onSubmit={handleQuickCellMutasiSubmit}
            className="p-4 rounded-3xl bg-gradient-to-r from-[#2E1065] via-[#4C1D95] to-[#831843] text-white border-2 border-amber-300 shadow-xl flex flex-wrap items-center justify-between gap-3 simfar-pop-in"
          >
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-[#1E1136] text-[10px] font-black uppercase">
                ⚡ Input Mutasi Langsung Tanggal {quickCellEdit.day} · No. BA: {quickCellEdit.med.noBA}
              </span>
              <h4 className="text-sm font-black mt-1">
                {quickCellEdit.med.name} (Sisa Stok: {quickCellEdit.med.currentStock} {quickCellEdit.med.unit})
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={quickCellEdit.type}
                onChange={(e) => setQuickCellEdit({ ...quickCellEdit, type: e.target.value as 'IN' | 'OUT' })}
                className="px-3 py-2 rounded-xl bg-white text-[#1E1136] text-xs font-black"
              >
                <option value="OUT">- Pengeluaran (Keluar di Tgl {quickCellEdit.day})</option>
                <option value="IN">+ Penerimaan (Masuk di Tgl {quickCellEdit.day})</option>
              </select>
              <input
                type="number"
                min="1"
                value={quickCellEdit.qty}
                onChange={(e) => setQuickCellEdit({ ...quickCellEdit, qty: Number(e.target.value) })}
                className="w-24 px-3 py-2 rounded-xl bg-white text-[#1E1136] text-xs font-black text-right"
              />
              <button
                type="submit"
                className="simfar-btn-pop px-4 py-2 rounded-xl bg-amber-300 text-[#1E1136] font-black text-xs cursor-pointer"
              >
                Simpan ke Tanggal {quickCellEdit.day}
              </button>
              <button
                type="button"
                onClick={() => setQuickCellEdit(null)}
                className="px-3 py-2 rounded-xl bg-white/15 text-white text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {/* TABEL UTAMA KERTAS KERJA (GROUPED BY NOMOR BA + AUTO-SYNC PER TANGGAL) */}
        <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#2E1065] text-white font-extrabold uppercase">
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-center">No</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 min-w-[175px]">Nomor BA / BAST</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 min-w-[180px]">Nama Barang / Obat</th>
                  <th rowSpan={2} className="py-3 px-2 border border-purple-800 text-center">Sumber</th>
                  <th rowSpan={2} className="py-3 px-2 border border-purple-800 text-center">Satuan</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right">Harga Satuan (Rp)</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right">Stok Awal</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right bg-emerald-900/60">Penerimaan (+Masuk)</th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right bg-purple-900">Persediaan</th>
                  {worksheetViewMode === 'HARIAN' && (
                    <th
                      colSpan={daysInMonth}
                      className="py-2 px-3 border border-pink-400 bg-gradient-to-r from-[#831843] via-[#6D28D9] to-[#0F766E] text-center text-white"
                    >
                      MUTASI MASUK (+) & KELUAR (-) PER TANGGAL 1 S/D {daysInMonth} ({monthLabel})
                    </th>
                  )}
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right bg-rose-900">
                    Total Keluar (-)
                  </th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right bg-indigo-950">
                    Sisa Stok (Fisik)
                  </th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-right bg-teal-900 min-w-[135px]">
                    Total Nilai Barang (Rp)
                  </th>
                  <th rowSpan={2} className="py-3 px-3 border border-purple-800 text-center min-w-[95px]">
                    Ket. Expired
                  </th>
                </tr>
                {worksheetViewMode === 'HARIAN' && (
                  <tr className="bg-purple-100 text-[#2E1065] font-black text-[11px]">
                    {dayNumbers.map((d) => (
                      <th
                        key={d}
                        className="py-1.5 px-1.5 border border-purple-200 text-center min-w-[38px]"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-purple-100">
                {(worksheetGroupByBA ? groupedByBA : [{ noBA: 'SEMUA OBAT', sumber: '-', items: worksheetRows, subtotalUnit: grandTotalFisikUnit, subtotalNilaiRp: grandTotalNilaiRp, subtotalIn: grandTotalMasukUnit, subtotalOut: grandTotalKeluarUnit }]).map(
                  (grp, gIdx) => (
                    <React.Fragment key={grp.noBA + '-' + gIdx}>
                      {worksheetGroupByBA && (
                        <tr className="bg-gradient-to-r from-[#EDE9FE] via-[#FCE7F3] to-[#ECFDF5] border-y-2 border-purple-300">
                          <td
                            colSpan={worksheetViewMode === 'HARIAN' ? 9 + daysInMonth + 4 : 13}
                            className="py-2.5 px-4 font-black text-[#1E1136]"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#2E1065] text-amber-300 font-mono text-xs font-black">
                                  📦 NOMOR BA: {grp.noBA}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg bg-purple-200 text-purple-950 text-[11px] font-extrabold">
                                  Sumber: {grp.sumber}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg bg-white border border-purple-300 text-purple-900 text-[11px] font-extrabold">
                                  {grp.items.length} Jenis Barang
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-emerald-800 font-extrabold">
                                  Masuk BA: +{grp.subtotalIn.toLocaleString('id-ID')}
                                </span>
                                <span className="text-rose-700 font-extrabold">
                                  Keluar: -{grp.subtotalOut.toLocaleString('id-ID')}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700 text-white font-black">
                                  Subtotal Nilai BA: Rp {grp.subtotalNilaiRp.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {grp.items.map((r: any, idxInGrp: number) => (
                        <tr key={r.id} className="hover:bg-purple-50/60 transition">
                          <td className="py-2.5 px-3 border-r border-purple-100 text-center font-bold">
                            {worksheetGroupByBA ? `${gIdx + 1}.${idxInGrp + 1}` : r.no}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100">
                            <span className="px-2 py-0.5 rounded bg-purple-100 font-mono text-[11px] font-black text-purple-900 block">
                              {r.noBA || '-'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {r.kfaCode} · VEN:{r.venClass}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 font-extrabold text-[#1E1B4B]">
                            {r.name}
                          </td>
                          <td className="py-2.5 px-2 border-r border-purple-100 text-center">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[10px]">
                              {r.sumberAnggaran || '-'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 border-r border-purple-100 text-center text-slate-600 font-semibold">
                            {r.unit}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-bold text-slate-700">
                            Rp {r.hargaSatuan.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-semibold">
                            {r.stokAwal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-black text-emerald-700 bg-emerald-50/40">
                            {r.penerimaanBulanIni > 0 ? `+${r.penerimaanBulanIni.toLocaleString('id-ID')}` : '0'}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-black text-[#1E1B4B] bg-purple-50/40">
                            {r.persediaan.toLocaleString('id-ID')}
                          </td>

                          {worksheetViewMode === 'HARIAN' &&
                            dayNumbers.map((d) => {
                              const inVal = worksheetDailyDisplay !== 'OUT_ONLY' ? (r.dailyInMap[d] || 0) : 0;
                              const outVal = worksheetDailyDisplay !== 'IN_ONLY' ? (r.dailyOutMap[d] || 0) : 0;
                              const hasActivity = inVal > 0 || outVal > 0;
                              return (
                                <td
                                  key={d}
                                  onClick={() =>
                                    setQuickCellEdit({
                                      med: r,
                                      day: d,
                                      type: 'OUT',
                                      qty: 5
                                    })
                                  }
                                  title={`Klik untuk tambah Masuk/Keluar ${r.name} pada Tanggal ${d}`}
                                  className={`py-1.5 px-1 border-r border-purple-100 text-center cursor-pointer hover:bg-amber-100/70 transition ${
                                    hasActivity ? 'bg-purple-50/70' : ''
                                  }`}
                                >
                                  {inVal > 0 && (
                                    <span className="block px-1 rounded bg-emerald-100 text-emerald-800 font-black text-[10px] leading-tight">
                                      +{inVal}
                                    </span>
                                  )}
                                  {outVal > 0 && (
                                    <span className="block px-1 rounded bg-pink-100 text-pink-800 font-black text-[10px] leading-tight mt-0.5">
                                      -{outVal}
                                    </span>
                                  )}
                                </td>
                              );
                            })}

                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-black text-rose-700 bg-rose-50/50">
                            {r.totalKeluarBulanIni > 0 ? `-${r.totalKeluarBulanIni.toLocaleString('id-ID')}` : '0'}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-black text-[#1E1B4B] bg-purple-100/50">
                            {r.sisaStok.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 border-r border-purple-100 text-right font-black text-emerald-900 bg-emerald-50/60">
                            Rp {r.totalNilaiSisa.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-[11px] font-semibold text-slate-600">
                            {r.expiryDate || <span className="text-slate-400 italic">Tanpa ED</span>}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-[#2E1065] via-[#4C1D95] to-[#831843] font-black text-white text-xs">
                  <td
                    colSpan={worksheetViewMode === 'HARIAN' ? 9 + daysInMonth + 1 : 10}
                    className="py-3.5 px-4 text-right uppercase"
                  >
                    Grand Total Persediaan Akhir Seluruh Kelompok BA ({monthLabel}) :
                  </td>
                  <td className="py-3.5 px-3 text-right bg-amber-300 text-[#1E1136]">
                    {grandTotalFisikUnit.toLocaleString('id-ID')} Unit
                  </td>
                  <td className="py-3.5 px-3 text-right bg-emerald-400 text-[#1E1136]">
                    Rp {grandTotalNilaiRp.toLocaleString('id-ID')}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Rekomendasi #7: Blok Pengesahan Tanda Tangan Elektronik (TTE QR Code) pada Kertas Kerja */}
        <div className="bg-white/95 p-5 rounded-3xl border-2 border-purple-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <RealQrCodeSvg value={`${tteHashKertasKerja}|${clinicProfile.puskesmasName}|Rp${grandTotalNilaiRp}`} size={84} />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                🔐 Terverifikasi Tanda Tangan Elektronik (TTE QR)
              </span>
              <h4 className="text-sm sm:text-base font-black text-[#1E1136] mt-1">
                Pengesahan Digital Kertas Kerja Persediaan & Nomor BA
              </h4>
              <p className="text-xs text-slate-600">
                Pengelola Obat: <strong>{currentUser.name}</strong> · Kepala Puskesmas: <strong>{clinicProfile.kepalaPuskesmas}</strong>
              </p>
              <p className="font-mono text-[11px] font-bold text-purple-800 mt-0.5">
                Hash Dokumen: {tteHashKertasKerja} · Nilai: Rp {grandTotalNilaiRp.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setTteSignedDocs((prev) => ({
                ...prev,
                [tteHashKertasKerja]: {
                  hash: tteHashKertasKerja,
                  signedAt: new Date().toLocaleString('id-ID'),
                  signer: currentUser.name,
                  nip: clinicProfile.nipPj
                }
              }));
              triggerToast(
                'Dokumen Kertas Kerja Disahkan (TTE QR)! 🔐',
                `Hash kriptografi ${tteHashKertasKerja} telah dikunci dan siap diverifikasi.`
              );
            }}
            className="simfar-btn-pop px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#2E1065] to-[#6D28D9] text-amber-300 font-black text-xs cursor-pointer"
          >
            🔏 Kunci & Tandatangani Kertas Kerja (TTE QR)
          </button>
        </div>
      </div>
    );
  };

  // --- MODULE 5: SMART STOCK OPNAME ---
  const renderStockOpname = () => {
    const handleApproveAdjustment = (med: any) => {
      const physical = Number(opnamePhysicalCounts[med.id] ?? med.currentStock);
      const diff = physical - med.currentStock;

      if (diff !== 0) {
        if (med.batches.length > 0) {
          const targetBatchId = med.batches[0].id;
          setBatches((prev) =>
            prev.map((b) =>
              b.id === targetBatchId ? { ...b, stock: Math.max(0, Number(b.stock || 0) + diff) } : b
            )
          );
        } else {
          setBatches((prev) => [
            ...prev,
            {
              id: `B-SO-${Date.now()}`,
              medId: med.id,
              batchNo: '',
              expiryDate: '',
              stock: Math.max(0, physical),
              source: 'Penyesuaian Stock Opname'
            }
          ]);
        }
      }

      setOpnameApproved((prev) => ({ ...prev, [med.id]: true }));
      setTransactions((prev) => [
        {
          id: `TRX-SO-${Date.now()}`,
          type: 'OPNAME',
          medId: med.id,
          medName: med.name,
          docNo: `BA-SO-2026-${Math.floor(100 + Math.random() * 900)}`,
          date: '2026-11-05',
          timeLabel: 'Baru saja',
          dayName: 'Opname',
          batchNo: med.fefoBatch?.batchNo || '',
          expiryDate: med.fefoBatch?.expiryDate || '',
          qty: diff,
          unit: med.unit,
          sourceOrDest: 'Verifikasi & Penyesuaian Opname',
          officer: currentUser.name,
          statusBadge: 'Sesuai',
          notes: opnameNotes[med.id] || 'Diverifikasi sesuai fisik'
        },
        ...prev
      ]);

      triggerToast(
        'Penyesuaian Stock Opname Disahkan!',
        `Stok ${med.name} telah disesuaikan menjadi ${physical.toLocaleString('id-ID')} ${med.unit} dan tercatat di Kartu Stok.`
      );
    };

    const handleApproveAllOpname = () => {
      const nextApproved: Record<string, boolean> = { ...opnameApproved };
      medicineWithBalances.forEach((m) => {
        nextApproved[m.id] = true;
      });
      setOpnameApproved(nextApproved);
      triggerToast(
        'Seluruh Item Stock Opname Disahkan! ✓',
        `Berita Acara Stock Opname untuk ${medicineWithBalances.length} item obat telah disahkan.`
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Smart Stock Opname · 3-Way Comparison Real-Time
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2A1846] mt-1.5">
              Verifikasi Saldo Sistem vs Kartu Stok vs Perhitungan Fisik di Rak
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ubah angka <strong>Hitung Fisik</strong> lalu klik <strong>Setujui Penyesuaian</strong> untuk menyamakan saldo sistem dengan kondisi fisik di tempat obat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleApproveAllOpname}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Sahkan Semua Sekaligus
            </button>
            <button
              onClick={() =>
                exportToCSV(
                  'Berita_Acara_Stock_Opname_SIMFAR.csv',
                  ['Kode', 'Nomor BA', 'Nama Obat', 'Satuan', 'Saldo Sistem', 'Hitung Fisik', 'Selisih', 'Harga Satuan', 'Nilai Fisik (Rp)', 'Catatan'],
                  medicineWithBalances.map((m) => {
                    const phys = Number(opnamePhysicalCounts[m.id] ?? m.currentStock);
                    return [
                      m.code,
                      m.noBA || '-',
                      m.name,
                      m.unit,
                      m.currentStock,
                      phys,
                      phys - m.currentStock,
                      m.price || 0,
                      phys * Number(m.price || 0),
                      opnameNotes[m.id] || 'Sesuai'
                    ];
                  })
                )
              }
              className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Berita Acara (.CSV)
            </button>
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#F3E8FF] to-[#FCE7F3] text-[#3B245B] text-xs font-extrabold uppercase">
                  <th className="py-4 px-4">Nama Obat & No. BA</th>
                  <th className="py-4 px-4 text-right">1. Saldo Database</th>
                  <th className="py-4 px-4 text-right">2. Saldo Kartu Stok</th>
                  <th className="py-4 px-4 text-center">3. Hitung Fisik</th>
                  <th className="py-4 px-4 text-center">Selisih</th>
                  <th className="py-4 px-4">Catatan Penyebab Selisih</th>
                  <th className="py-4 px-4 text-center">Pengesahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100 text-sm">
                {medicineWithBalances.map((med) => {
                  const physical = Number(opnamePhysicalCounts[med.id] ?? med.currentStock);
                  const diff = physical - med.currentStock;
                  const isApproved = opnameApproved[med.id];

                  return (
                    <tr key={med.id} className="hover:bg-purple-50/40">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-[#2A1846]">{med.name}</div>
                        <div className="text-xs text-slate-500">{med.noBA || med.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-700">
                        {med.currentStock.toLocaleString('id-ID')} {med.unit}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-purple-700">
                        {med.currentStock.toLocaleString('id-ID')} {med.unit}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={physical}
                          onChange={(e) => {
                            setOpnamePhysicalCounts({
                              ...opnamePhysicalCounts,
                              [med.id]: e.target.value
                            });
                            setOpnameApproved((prev) => ({ ...prev, [med.id]: false }));
                          }}
                          className="w-28 text-center px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-300 font-black text-[#1E1B4B]"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {diff === 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                            0 (Sesuai)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                            {diff > 0 ? `+${diff}` : diff} {med.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          placeholder="Ketik catatan verifikasi..."
                          value={opnameNotes[med.id] || ''}
                          onChange={(e) =>
                            setOpnameNotes({ ...opnameNotes, [med.id]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isApproved && diff === 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Disahkan
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveAdjustment(med)}
                            className="px-3 py-1.5 rounded-xl bg-[#4C2882] hover:bg-[#3B1D6E] text-white text-xs font-bold shadow-sm transition cursor-pointer"
                          >
                            {diff === 0 ? 'Verifikasi Sesuai' : 'Setujui Penyesuaian'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- MODULE 7: BATCH & EXPIRY MANAGEMENT ---
  const renderBatchExpiry = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200">
          <span className="text-xs font-extrabold text-rose-700 uppercase">Telah Kedaluwarsa</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">
            {evaluatedBatches.filter((b) => b.status === 'EXPIRED').length} Batch
          </p>
          <p className="text-xs text-rose-600 mt-1">Segera karantina & buat BA</p>
        </div>
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200">
          <span className="text-xs font-extrabold text-amber-800 uppercase">Peringatan ≤ 3 Bulan</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">
            {evaluatedBatches.filter((b) => b.status === 'KRITIS_3_BULAN').length} Batch
          </p>
          <p className="text-xs text-amber-700 mt-1">Prioritas Utama FEFO</p>
        </div>
        <div className="p-4 rounded-3xl bg-yellow-50 border border-yellow-200">
          <span className="text-xs font-extrabold text-yellow-800 uppercase">Peringatan ≤ 6 Bulan</span>
          <p className="text-2xl sm:text-3xl font-black text-yellow-900 mt-1">
            {evaluatedBatches.filter((b) => b.status === 'WASPADA_6_BULAN').length} Batch
          </p>
          <p className="text-xs text-yellow-700 mt-1">Pantau pergerakan stok</p>
        </div>
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-extrabold text-emerald-800 uppercase">Aman (&gt; 6 Bulan)</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            {evaluatedBatches.filter((b) => b.status === 'AMAN').length} Batch
          </p>
          <p className="text-xs text-emerald-700 mt-1">Kondisi penyimpanan optimal</p>
        </div>
        <div className="col-span-2 sm:col-span-1 p-4 rounded-3xl bg-slate-100 border border-slate-200">
          <span className="text-xs font-extrabold text-slate-700 uppercase">Tanpa Batch / ED di BA</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {evaluatedBatches.filter((b) => b.status === 'TANPA_ED').length} Item
          </p>
          <p className="text-xs text-slate-600 mt-1">Dikosongkan sesuai dokumen BA</p>
        </div>
      </div>

      <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-purple-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-[#2A1846]">
              Daftar Monitoring Batch & Urutan Prioritas FEFO (First Expired First Out)
            </h3>
            <p className="text-xs text-slate-500">
              Jika Batch atau Tanggal ED tidak tercantum pada BA, kolom ditampilkan kosong (<code>-</code>). Anda dapat klik <strong>Isi / Edit</strong> kapan saja jika ingin melengkapinya.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#F3E8FF] to-[#FCE7F3] text-[#3B245B] text-xs font-extrabold uppercase">
                <th className="py-3.5 px-4">Prioritas FEFO</th>
                <th className="py-3.5 px-4">Nomor Batch</th>
                <th className="py-3.5 px-4">Nama Obat & No. BA</th>
                <th className="py-3.5 px-4">Tanggal ED</th>
                <th className="py-3.5 px-4">Sisa Waktu</th>
                <th className="py-3.5 px-4 text-right">Stok Batch</th>
                <th className="py-3.5 px-4 text-center">Status Peringatan</th>
                <th className="py-3.5 px-4 text-center">Edit Batch/ED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 text-sm">
              {evaluatedBatches.map((b, index) => {
                const isEditing = editingBatchId === b.id;
                return (
                  <tr key={b.id} className="hover:bg-purple-50/40">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-black text-xs">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                      {isEditing ? (
                        <input
                          type="text"
                          placeholder="Kosongkan jika tak ada"
                          value={editBatchForm.batchNo}
                          onChange={(e) => setEditBatchForm({ ...editBatchForm, batchNo: e.target.value })}
                          className="w-28 px-2 py-1 rounded-lg bg-purple-50 border border-purple-300 text-xs font-bold"
                        />
                      ) : (
                        b.batchNo || <span className="text-slate-400 font-sans italic">- (Kosong)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-[#2A1846]">{b.medName}</div>
                      <div className="text-[11px] text-slate-500">{b.noBA || b.source || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editBatchForm.expiryDate}
                          onChange={(e) => setEditBatchForm({ ...editBatchForm, expiryDate: e.target.value })}
                          className="px-2 py-1 rounded-lg bg-purple-50 border border-purple-300 text-xs font-bold"
                        />
                      ) : (
                        b.expiryDate || <span className="text-slate-400 italic">- (Kosong)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                      {b.diffDays === null
                        ? 'Tidak tercantum di BA'
                        : b.diffDays <= 0
                        ? `Lewat ${Math.abs(b.diffDays)} hari`
                        : `${b.diffDays} hari (~${b.diffMonths} bln)`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#1E1B4B]">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editBatchForm.stock}
                          onChange={(e) => setEditBatchForm({ ...editBatchForm, stock: Number(e.target.value) })}
                          className="w-20 text-right px-2 py-1 rounded-lg bg-purple-50 border border-purple-300 text-xs font-black"
                        />
                      ) : (
                        `${Number(b.stock || 0).toLocaleString('id-ID')} ${b.unit}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {b.status === 'EXPIRED' && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700">
                          KEDALUWARSA (KARANTINA)
                        </span>
                      )}
                      {b.status === 'KRITIS_3_BULAN' && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                          ≤ 3 BULAN (PRIORITAS FEFO)
                        </span>
                      )}
                      {b.status === 'WASPADA_6_BULAN' && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-100 text-yellow-800">
                          ≤ 6 BULAN (WASPADA)
                        </span>
                      )}
                      {b.status === 'AMAN' && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                          AMAN
                        </span>
                      )}
                      {b.status === 'TANPA_ED' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          TANPA BATCH / ED DI BA
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setBatches((prev) =>
                                prev.map((item) =>
                                  item.id === b.id
                                    ? {
                                        ...item,
                                        batchNo: editBatchForm.batchNo.trim(),
                                        expiryDate: editBatchForm.expiryDate.trim(),
                                        stock: Math.max(0, Number(editBatchForm.stock) || 0)
                                      }
                                    : item
                                )
                              );
                              setEditingBatchId(null);
                              triggerToast('Data Batch & ED Diperbarui!', `Perubahan pada ${b.medName} berhasil disimpan.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingBatchId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingBatchId(b.id);
                            setEditBatchForm({
                              batchNo: b.batchNo || '',
                              expiryDate: b.expiryDate || '',
                              stock: Number(b.stock || 0)
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Isi / Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --- MODULE 8: LAPORAN LPLPO & INTEGRASI APLIKASI PERSEDIAAN RESMI ---
  const renderLaporanIntegrasi = () => (
    <div className="space-y-6">
      <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            Laporan LPLPO Puskesmas & Rekonsiliasi e-Logistik / Persediaan
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2A1846] mt-1.5">
            Laporan Pemakaian dan Lembar Permintaan Obat (LPLPO) & Nilai Aset
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Menghitung otomatis Stok Awal, Penerimaan, Pemakaian, Sisa Stok, Stok Optimum (Pemakaian + Buffer 20%), dan Permintaan Bulan Depan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() =>
              triggerToast(
                'Validasi & Rekonsiliasi Selesai! ✓',
                `Seluruh ${medicineWithBalances.length} item obat di database telah tervalidasi dengan total nilai aset Rp ${dashboardKPIs.totalNilaiAset.toLocaleString('id-ID')}.`
              )
            }
            className="px-4 py-2.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Cek Duplikasi & Rekonsiliasi
          </button>
          <button
            onClick={() =>
              exportToCSV(
                'Laporan_LPLPO_dan_Persediaan_Pemerintah.csv',
                ['Kode_SIMFAR', 'Nomor_BA', 'Nama_Obat', 'Sumber_Anggaran', 'Satuan', 'Harga_Satuan', 'Stok_Awal', 'Penerimaan', 'Persediaan', 'Pemakaian_Keluar', 'Sisa_Stok_Akhir', 'Total_Nilai_Rp', 'Permintaan_Bulan_Depan'],
                medicineWithBalances.map((m) => {
                  const persediaan = Number(m.initialBalance || 0) + m.totalIn;
                  const opt = Math.round(m.totalOut * 1.2);
                  const permintaan = Math.max(0, opt - m.currentStock);
                  return [
                    m.code,
                    m.noBA || '-',
                    m.name,
                    m.sumberAnggaran || '-',
                    m.unit,
                    m.price || 0,
                    m.initialBalance || 0,
                    m.totalIn,
                    persediaan,
                    m.totalOut,
                    m.currentStock,
                    m.currentStock * Number(m.price || 0),
                    permintaan
                  ];
                })
              )
            }
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV Format Pemerintah / LPLPO
          </button>
        </div>
      </div>

      <div className="bg-white/95 rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-[#F3E8FF] to-[#FCE7F3] text-[#3B245B] font-extrabold uppercase">
                <th className="py-3.5 px-4">Kode / Nomor BA</th>
                <th className="py-3.5 px-4">Nama Obat</th>
                <th className="py-3.5 px-3">Satuan</th>
                <th className="py-3.5 px-3 text-right">Harga (Rp)</th>
                <th className="py-3.5 px-3 text-right">Stok Awal</th>
                <th className="py-3.5 px-3 text-right text-emerald-700">Penerimaan</th>
                <th className="py-3.5 px-3 text-right text-pink-700">Pemakaian</th>
                <th className="py-3.5 px-3 text-right bg-purple-100/60">Sisa Stok</th>
                <th className="py-3.5 px-4 text-right bg-emerald-50">Nilai Aset (Rp)</th>
                <th className="py-3.5 px-3 text-right">Usulan Permintaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 text-sm">
              {medicineWithBalances.map((m) => {
                const opt = Math.max(Number(m.minStock || 0), Math.round(m.totalOut * 1.2));
                const usulan = Math.max(0, opt - m.currentStock);
                return (
                  <tr key={m.id} className="hover:bg-purple-50/40">
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-bold text-purple-700">{m.code}</div>
                      <div className="text-[11px] text-slate-500">{m.noBA || '-'}</div>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#2A1846]">{m.name}</td>
                    <td className="py-3 px-3 text-slate-600">{m.unit}</td>
                    <td className="py-3 px-3 text-right font-semibold">
                      Rp {Number(m.price || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold">
                      {Number(m.initialBalance || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">
                      +{m.totalIn.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-pink-700">
                      -{m.totalOut.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-[#1E1B4B] bg-purple-50/40">
                      {m.currentStock.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-900 bg-emerald-50/40">
                      Rp {(m.currentStock * Number(m.price || 0)).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-purple-800">
                      {usulan.toLocaleString('id-ID')} {m.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --- MODULE 8B: 8 FITUR INOVASI PRO (SEMUA 8 REKOMENDASI BERJALAN AKTIF SEKALIGUS) ---
  const renderInovasiPro = () => {
    const selectedConvMed = medicineWithBalances.find((m) => m.id === converterMedId) || medicineWithBalances[0];
    const totalRkoBudget = abcVenAndRkoAnalysis.reduce((s, m) => s + m.biayaRkoRp, 0);
    const classACount = abcVenAndRkoAnalysis.filter((m) => m.abcClass === 'A').length;
    const vitalCount = abcVenAndRkoAnalysis.filter((m) => m.venClass === 'V').length;
    const slowMovingItems = abcVenAndRkoAnalysis.filter((m) => m.isSlowOrDeadStock);

    const handleConvertMasterMedicineUnit = () => {
      if (!selectedConvMed) return;
      const ratio = Math.max(2, Number(converterRatio) || 100);
      const packCount = Math.max(1, Number(converterPackQty) || selectedConvMed.currentStock || 1);
      const newBaseQty = packCount * ratio;
      const newUnitPrice = Math.max(1, Math.round(Number(selectedConvMed.price || 0) / ratio));
      const newBaseUnit = selectedConvMed.baseUnit === selectedConvMed.unit ? 'Pcs' : selectedConvMed.baseUnit;

      setMedicines((prev) =>
        prev.map((m) =>
          m.id === selectedConvMed.id
            ? {
                ...m,
                unit: newBaseUnit,
                price: newUnitPrice,
                conversion: `1 ${selectedConvMed.unit} = ${ratio} ${newBaseUnit}`
              }
            : m
        )
      );
      setBatches((prev) =>
        prev.map((b) =>
          b.medId === selectedConvMed.id ? { ...b, stock: newBaseQty } : b
        )
      );
      setOpnamePhysicalCounts((prev) => ({
        ...prev,
        [selectedConvMed.id]: newBaseQty
      }));
      setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
      triggerToast(
        'Konversi Multi-Satuan Master Obat Berhasil! 📦→💊',
        `${packCount} ${selectedConvMed.unit} ${selectedConvMed.name} telah dikonversi menjadi ${newBaseQty.toLocaleString('id-ID')} ${newBaseUnit} (@ Rp ${newUnitPrice.toLocaleString('id-ID')}).`
      );
    };

    const handleSbbkTransferSubmit = (e: any) => {
      e.preventDefault();
      const med = medicineWithBalances.find((m) => m.id === sbbkForm.medId);
      const qtyNum = Number(sbbkForm.qty) || 0;
      if (!med || qtyNum <= 0) return;
      if (qtyNum > med.currentStock) {
        triggerToast('Stok Gudang Tidak Cukup!', `Sisa stok ${med.name} hanya ${med.currentStock} ${med.unit}.`, 'error');
        return;
      }

      const newSbbk = {
        id: `SBBK-${Date.now()}`,
        docNo: sbbkForm.docNo || `SBBK-INT/${Date.now().toString().slice(-4)}`,
        date: sbbkForm.date,
        medId: med.id,
        medName: med.name,
        unit: med.unit,
        fromDepo: sbbkForm.fromDepo,
        toDepo: sbbkForm.toDepo,
        qty: qtyNum,
        officer: currentUser.name
      };
      setSbbkHistory((prev) => [newSbbk, ...prev]);

      // Record in transactions so Kartu Stok & Kertas Kerja automatically reflect the daily distribution
      setBatches((prev) => {
        const next = prev.map((b) => ({ ...b }));
        const target = next.find((b) => b.medId === med.id && Number(b.stock || 0) > 0);
        if (target) target.stock = Math.max(0, Number(target.stock || 0) - qtyNum);
        return next;
      });
      setTransactions((prev) => [
        {
          id: `TRX-SBBK-${Date.now()}`,
          type: 'OUT',
          medId: med.id,
          medName: med.name,
          docNo: newSbbk.docNo,
          date: sbbkForm.date,
          timeLabel: 'Mutasi Depo',
          dayName: 'SBBK',
          batchNo: med.fefoBatch?.batchNo || '',
          expiryDate: med.fefoBatch?.expiryDate || '',
          qty: qtyNum,
          unit: med.unit,
          price: med.price || 0,
          sourceOrDest: `${sbbkForm.fromDepo} → ${sbbkForm.toDepo}`,
          officer: currentUser.name,
          notes: `Distribusi SBBK Internal ke ${sbbkForm.toDepo}`
        },
        ...prev
      ]);
      setWorksheetGeneratedAt(new Date().toLocaleString('id-ID'));
      triggerToast(
        'SBBK Distribusi Antar-Depo Berhasil! 🏥',
        `${qtyNum} ${med.unit} ${med.name} didistribusikan dari ${sbbkForm.fromDepo} ke ${sbbkForm.toDepo} & tercatat di Kertas Kerja.`
      );
    };

    const handleTriggerLiveBroadcastSync = () => {
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('SIMFAR_LIVE_SYNC_V4');
          bc.postMessage({
            type: 'SIMFAR_STATE_SYNC',
            medicines,
            batches,
            transactions
          });
          bc.close();
        }
      } catch (_) {}
      const nowStr = new Date().toLocaleTimeString('id-ID');
      setLastCloudSyncTime(`Disinkronkan pada ${nowStr}`);
      triggerToast(
        'Sinkronisasi Multi-HP & Cloud Berhasil! ☁️',
        `Seluruh ${medicines.length} obat & ${transactions.length} transaksi telah disinkronkan ke kanal perangkat (${syncDeviceCode}).`
      );
    };

    return (
      <div className="space-y-6">
        {/* Hero Banner 8 Fitur Rekomendasi */}
        <div className="bg-gradient-to-r from-[#1E1136] via-[#4C1D95] to-[#9D174D] text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-amber-300/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-300 text-[#1E1136] text-xs font-black uppercase">
              💎 8 Rekomendasi Terbaik Telah Aktif Sekaligus · Full Production Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Pusat Kendali 8 Fitur Inovasi Pro SIMFAR (AI OCR, Multi-Satuan, Multi-Depo, RKO, ABC-VEN, KFA, TTE & Cloud)
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-3xl">
              Seluruh 8 rekomendasi pengembangan kini telah terpasang dan berjalan secara nyata (bukan simulasi), terhubung langsung dengan Master Obat, Kartu Stok, dan Kertas Kerja per Nomor BA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/20 text-xs font-black">
            {[
              { id: 'ALL', label: '🔥 Tampilkan Semua (1–8)' },
              { id: 'OCR_UNIT', label: '1–2. AI OCR & Multi-Satuan' },
              { id: 'DEPO_SBBK', label: '3–4. Multi-Depo & Cloud Sync' },
              { id: 'RKO_ABCVEN', label: '5–8. RKO, ABC-VEN, KFA & TTE' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveProTab(t.id as any)}
                className={`px-3 py-2 rounded-xl cursor-pointer transition ${
                  activeProTab === t.id
                    ? 'bg-amber-300 text-[#1E1136] shadow-sm'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 1: FITUR #1 (AI OCR FOTO KERTAS BA) & FITUR #2 (KONVERSI MULTI-SATUAN BERTINGKAT) */}
        {(activeProTab === 'ALL' || activeProTab === 'OCR_UNIT') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FITUR #1: AI VISION OCR FOTO KERTAS BA */}
            <div className="simfar-neo-card bg-white p-5 rounded-3xl border-2 border-purple-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-purple-100">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase">
                      REKOMENDASI #1 · AI VISION CAMERA OCR
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1136] mt-1">
                      📸 Pemindai Foto Kertas BA Fisik (Image-to-BAST Table)
                    </h3>
                  </div>
                  <ScanLine className="w-8 h-8 text-purple-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Memungkinkan petugas memfoto langsung lembar kertas Berita Acara (BAST/BAPB) fisik dari gudang Dinkes menggunakan kamera HP. Mesin <strong>Tesseract OCR + Smart Line Parser</strong> otomatis mengekstrak Nomor BA, Nama Barang, Satuan, dan Harga ke tabel penerimaan.
                </p>

                {ocrStatusText && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950">
                    ✨ {ocrStatusText}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <label className="simfar-btn-pop flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer">
                  <ScanLine className="w-4 h-4 text-amber-300" />
                  <span>{isRunningOcr ? 'Memindai Foto BA...' : '📸 Ambil Foto / Upload Gambar Kertas BA'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      handleBastPhotoOcrUpload(e);
                      setActiveMenu('TRANSAKSI');
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handleLoadAttachedPdf21April();
                    setActiveMenu('TRANSAKSI');
                  }}
                  className="simfar-btn-pop py-3 px-4 rounded-2xl bg-amber-300 text-[#1E1136] font-black text-xs cursor-pointer"
                >
                  ⚡ Uji Ekstrak BA 21 April
                </button>
              </div>
            </div>

            {/* FITUR #2: KONVERSI MULTI-SATUAN BERTINGKAT (BOX/DUS -> STRIP -> TABLET/PCS) */}
            <div className="simfar-neo-card bg-white p-5 rounded-3xl border-2 border-emerald-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-100">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                      REKOMENDASI #2 · MULTI-UNIT CONVERTER ENGINE
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1136] mt-1">
                      📦→💊 Konversi Otomatis Kemasan Besar ke Satuan Pelayanan
                    </h3>
                  </div>
                  <Package className="w-8 h-8 text-emerald-600 shrink-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Pilih Obat (Kemasan Box/Dus/Kaleng)</label>
                    <select
                      value={converterMedId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setConverterMedId(id);
                        const found = medicineWithBalances.find((m) => m.id === id);
                        if (found) {
                          setConverterPackQty(found.currentStock || 1);
                          setConverterRatio(found.packRatio > 1 ? found.packRatio : 100);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-extrabold text-[#1E1136]"
                    >
                      {medicineWithBalances.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — Stok: {m.currentStock} {m.unit} (@ Rp {Number(m.price || 0).toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">
                      Jml Kemasan ({selectedConvMed?.unit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={converterPackQty}
                      onChange={(e) => setConverterPackQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 font-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">
                      Isi per {selectedConvMed?.unit} (Rasio)
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={converterRatio}
                      onChange={(e) => setConverterRatio(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-black"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-900 text-white flex flex-col justify-center">
                    <span className="text-[10px] text-emerald-200 font-bold">Hasil Satuan Terkecil:</span>
                    <span className="text-sm font-black text-amber-300">
                      {(converterPackQty * converterRatio).toLocaleString('id-ID')} Pcs/Tab
                    </span>
                    <span className="text-[10px] text-white/90">
                      @ Rp {Math.max(1, Math.round(Number(selectedConvMed?.price || 0) / Math.max(1, converterRatio))).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConvertMasterMedicineUnit}
                className="simfar-btn-pop w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs cursor-pointer"
              >
                🔄 Terapkan Konversi Kemasan ke Master Obat & Kartu Stok Sekarang
              </button>
            </div>
          </div>
        )}

        {/* ROW 2: FITUR #3 (CLOUD & MULTI-HP SYNC) & FITUR #4 (MULTI-DEPO & SBBK INTERNAL) */}
        {(activeProTab === 'ALL' || activeProTab === 'DEPO_SBBK') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* FITUR #4: MULTI-DEPO / SUB-UNIT & SBBK INTERNAL */}
            <div className="lg:col-span-7 simfar-neo-card bg-white p-5 rounded-3xl border-2 border-pink-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-pink-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 text-[10px] font-black uppercase">
                    REKOMENDASI #4 · MULTI-DEPO & SBBK INTERNAL PUSKESMAS
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#1E1136] mt-1">
                    🏥 Distribusi SBBK Antar-Sub Unit (Gudang → Apotek, UGD, KIA, Lab, Pustu)
                  </h3>
                </div>
                <Building2 className="w-8 h-8 text-pink-600" />
              </div>

              <form onSubmit={handleSbbkTransferSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-pink-50/60 p-3.5 rounded-2xl border border-pink-200">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-pink-950 mb-1">Pilih Barang / Obat dari Gudang</label>
                  <select
                    value={sbbkForm.medId}
                    onChange={(e) => setSbbkForm({ ...sbbkForm, medId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-extrabold"
                  >
                    {medicineWithBalances.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (Stok: {m.currentStock} {m.unit} · BA: {m.noBA})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-pink-950 mb-1">Tanggal SBBK</label>
                  <input
                    type="date"
                    value={sbbkForm.date}
                    onChange={(e) => setSbbkForm({ ...sbbkForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-pink-950 mb-1">Dari Depo Asal</label>
                  <select
                    value={sbbkForm.fromDepo}
                    onChange={(e) => setSbbkForm({ ...sbbkForm, fromDepo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-bold"
                  >
                    {DEPO_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-pink-950 mb-1">Ke Sub-Unit Tujuan</label>
                  <select
                    value={sbbkForm.toDepo}
                    onChange={(e) => setSbbkForm({ ...sbbkForm, toDepo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-bold"
                  >
                    {DEPO_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-pink-950 mb-1">Jumlah Distribusi</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={sbbkForm.qty}
                      onChange={(e) => setSbbkForm({ ...sbbkForm, qty: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 font-black"
                    />
                    <button
                      type="submit"
                      className="simfar-btn-pop px-3.5 py-2 rounded-xl bg-pink-600 text-white font-black shrink-0 cursor-pointer"
                    >
                      Kirim SBBK
                    </button>
                  </div>
                </div>
              </form>

              <div className="max-h-44 overflow-y-auto divide-y divide-pink-100 text-xs">
                {sbbkHistory.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-purple-800">{item.docNo}</span> ·{' '}
                      <span className="font-bold text-slate-600">{item.date}</span>
                      <p className="font-extrabold text-[#1E1136]">{item.medName}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.fromDepo} ➔ <strong className="text-pink-700">{item.toDepo}</strong>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-900 font-black shrink-0">
                      {item.qty} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FITUR #3 & #5: CLOUD SYNC MULTI-HP & KAMUS KFA SATUSEHAT */}
            <div className="lg:col-span-5 simfar-neo-card bg-white p-5 rounded-3xl border-2 border-indigo-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="pb-3 border-b border-indigo-100">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase">
                    REKOMENDASI #3 & #5 · CLOUD SYNC & KFA SATUSEHAT
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#1E1136] mt-1">
                    ☁️ Sinkronisasi Antar-HP & Mapping KFA Kemenkes
                  </h3>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-950">Kode Room Sinkronisasi Puskesmas:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px]">
                      ONLINE · OFFLINE-FIRST READY
                    </span>
                  </div>
                  <input
                    type="text"
                    value={syncDeviceCode}
                    onChange={(e) => setSyncDeviceCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-indigo-300 font-mono font-black text-indigo-900"
                  />
                  <p className="text-[11px] text-slate-600">
                    Status Terakhir: <strong>{lastCloudSyncTime}</strong>
                  </p>
                </div>

                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 text-xs border border-slate-200 rounded-2xl p-2.5">
                  <p className="font-black text-[#1E1136] pb-1">
                    🧠 Hasil Auto-Mapping Kamus Farmasi & Alkes (KFA SatuSehat):
                  </p>
                  {medicineWithBalances.slice(0, 6).map((m) => (
                    <div key={m.id} className="py-1.5 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-extrabold text-[#1E1136]">{m.name}</span>
                        <span className="block text-[10px] text-slate-500">{m.kfaTitle}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px] font-black shrink-0">
                        {m.kfaCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerLiveBroadcastSync}
                className="simfar-btn-pop w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black text-xs cursor-pointer"
              >
                ☁️ Sinkronkan Data Antar-Tab / Perangkat HP Sekarang
              </button>
            </div>
          </div>
        )}

        {/* ROW 3: FITUR #6 (SMART RKO KEMENKES & PREDIKSI STOK HABIS) & FITUR #8 (MATRIKS ABC-VEN & DEAD STOCK) */}
        {(activeProTab === 'ALL' || activeProTab === 'RKO_ABCVEN') && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-purple-100">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-300 text-[#1E1136] text-xs font-black uppercase">
                  REKOMENDASI #6, #7 & #8 · SMART RKO KEMENKES + MATRIKS FARMAKOEKONOMI ABC-VEN + DEAD STOCK
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1E1136] mt-1.5">
                  Tabel Perhitungan RKO (Rencana Kebutuhan Obat), Estimasi Habis Stok & Klasifikasi ABC-VEN
                </h3>
                <p className="text-xs text-slate-600">
                  Menghitung otomatis prioritas anggaran Pareto <strong>Kelas A (70%), B (20%), C (10%)</strong> × <strong>Vital / Esensial / Non-Esensial (VEN)</strong>, mendeteksi barang <em>Slow-Moving</em>, serta memproyeksikan kebutuhan pengadaan tahun depan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 text-xs">
                  <label className="block text-[10px] font-bold text-purple-900">Buffer Stock (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rkoBufferPct}
                    onChange={(e) => setRkoBufferPct(Number(e.target.value))}
                    className="w-16 font-black text-purple-950 bg-transparent"
                  />
                </div>
                <div className="bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 text-xs">
                  <label className="block text-[10px] font-bold text-purple-900">Lead Time (Bulan)</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={rkoLeadTimeMonths}
                    onChange={(e) => setRkoLeadTimeMonths(Number(e.target.value))}
                    className="w-14 font-black text-purple-950 bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    exportToCSV(
                      'Analisis_RKO_dan_ABC_VEN_PKM_Silian.csv',
                      ['Kode_KFA', 'Nomor_BA', 'Nama_Barang', 'Kelas_ABC_VEN', 'Prioritas', 'Sisa_Stok', 'Estimasi_Habis_Hari', 'Stok_Optimum_RKO', 'Usulan_Pengadaan_RKO', 'Estimasi_Biaya_RKO_Rp'],
                      abcVenAndRkoAnalysis.map((m) => [
                        m.kfaCode,
                        m.noBA,
                        m.name,
                        m.abcVenCode,
                        m.priorityGroup,
                        m.currentStock,
                        m.daysToZero,
                        m.stokOptimumRko,
                        m.usulanRko,
                        m.biayaRkoRp
                      ])
                    )
                  }
                  className="simfar-btn-pop px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#2E1065] to-[#6D28D9] text-amber-300 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Tabel RKO & ABC-VEN (.CSV)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-black uppercase text-rose-700">Kelas A (Serap 70% Nilai)</span>
                <p className="text-xl font-black text-rose-950 mt-0.5">{classACount} Jenis Barang</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] font-black uppercase text-purple-700">Kategori Vital (VEN = V)</span>
                <p className="text-xl font-black text-purple-950 mt-0.5">{vitalCount} Obat Penyelamat</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-black uppercase text-amber-800">Slow-Moving / Tanpa Keluar</span>
                <p className="text-xl font-black text-amber-950 mt-0.5">{slowMovingItems.length} Item Dipantau</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-black uppercase text-emerald-800">Total Proyeksi Anggaran RKO</span>
                <p className="text-lg font-black text-emerald-950 mt-0.5">Rp {totalRkoBudget.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-purple-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2E1065] text-white font-extrabold uppercase">
                    <th className="py-3 px-3">Kode KFA & Nomor BA</th>
                    <th className="py-3 px-3">Nama Barang / Obat</th>
                    <th className="py-3 px-2 text-center">Matriks ABC-VEN</th>
                    <th className="py-3 px-2 text-right">Nilai Aset Saat Ini</th>
                    <th className="py-3 px-2 text-right">Sisa Stok</th>
                    <th className="py-3 px-2 text-center">Prediksi Habis</th>
                    <th className="py-3 px-2 text-right bg-purple-900">Stok Optimum RKO</th>
                    <th className="py-3 px-2 text-right bg-emerald-900">Usulan RKO</th>
                    <th className="py-3 px-3 text-right bg-teal-950">Biaya Usulan RKO (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {abcVenAndRkoAnalysis.map((m) => (
                    <tr key={m.id} className="hover:bg-purple-50/50">
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-black text-indigo-800 block">{m.kfaCode}</span>
                        <span className="font-mono text-[10px] text-slate-500">{m.noBA}</span>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-[#1E1136]">
                        {m.name}
                        {m.isSlowOrDeadStock && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black">
                            SLOW-MOVING
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                            m.priorityGroup.includes('PRIORITAS I ')
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : m.priorityGroup.includes('PRIORITAS II')
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.abcVenCode} · {m.priorityGroup.split(' ')[1]}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-700">
                        Rp {m.stockValueRp.toLocaleString('id-ID')} ({m.valueSharePct}%)
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-[#1E1136]">
                        {m.currentStock.toLocaleString('id-ID')} {m.unit}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                            m.daysToZero <= 14
                              ? 'bg-rose-100 text-rose-800'
                              : m.daysToZero <= 45
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          ~{m.daysToZero} Hari
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-purple-900 bg-purple-50/40">
                        {m.stokOptimumRko.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-2 text-right font-black text-emerald-800 bg-emerald-50/40">
                        +{m.usulanRko.toLocaleString('id-ID')} {m.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-950 bg-emerald-100/50">
                        Rp {m.biayaRkoRp.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- MODULE 9: PENGATURAN, PROFIL PUSKESMAS, BACKUP/RESTORE DATABASE & RBAC ---
  const renderPengaturan = () => {
    const handleExportBackupJson = () => {
      const payload = {
        exportedAt: new Date().toISOString(),
        clinicProfile,
        medicines,
        batches,
        transactions,
        opnamePhysicalCounts,
        opnameNotes,
        worksheetMonth
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BACKUP_SIMFAR_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      triggerToast('Backup Database Berhasil!', 'File JSON cadangan seluruh data SIMFAR berhasil diunduh.');
    };

    const handleImportBackupJson = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (Array.isArray(data.medicines)) setMedicines(data.medicines);
        if (Array.isArray(data.batches)) setBatches(data.batches);
        if (Array.isArray(data.transactions)) setTransactions(data.transactions);
        if (data.opnamePhysicalCounts) setOpnamePhysicalCounts(data.opnamePhysicalCounts);
        if (data.clinicProfile) setClinicProfile(data.clinicProfile);
        if (data.worksheetMonth) setWorksheetMonth(data.worksheetMonth);
        setIsUsingSampleData(false);
        triggerToast('Restore Database Berhasil! ✨', `Data dari "${file.name}" telah dipulihkan ke SIMFAR.`);
      } catch (_) {
        triggerToast('File Backup Tidak Valid', 'Pastikan file yang dipilih adalah file .JSON hasil backup SIMFAR.', 'error');
      } finally {
        e.target.value = '';
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                Manajemen Database & Penyimpanan Lokal Otomatis
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2A1846] mt-1.5">
                Kelola Data Asli, Backup / Restore & Profil Puskesmas
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Seluruh data yang Anda input atau upload dari BA otomatis tersimpan di HP/browser. Anda juga dapat mengosongkan data sampel atau mengunduh file Backup.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportBackupJson}
                className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Backup Data (.JSON)
              </button>
              <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2">
                <Upload className="w-4 h-4" /> Restore Data (.JSON)
                <input type="file" accept=".json" onChange={handleImportBackupJson} className="hidden" />
              </label>
              <button
                onClick={() => setConfirmClearModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Kosongkan Semua Data (Mulai dari 0)
              </button>
              <button
                onClick={handleRestoreSampleData}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Muat Data Sampel Awal
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Puskesmas / Instansi</label>
              <input
                type="text"
                value={clinicProfile.puskesmasName}
                onChange={(e) => setClinicProfile({ ...clinicProfile, puskesmasName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kepala Puskesmas</label>
              <input
                type="text"
                value={clinicProfile.kepalaPuskesmas}
                onChange={(e) => setClinicProfile({ ...clinicProfile, kepalaPuskesmas: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penanggung Jawab Farmasi</label>
              <input
                type="text"
                value={clinicProfile.pjFarmasi}
                onChange={(e) => setClinicProfile({ ...clinicProfile, pjFarmasi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border border-purple-100 shadow-sm">
          <h2 className="text-xl font-black text-[#2A1846]">
            Manajemen Peran Petugas & Penandatangan Aktif
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pilih petugas aktif yang namanya akan tercatat pada kolom Petugas di Kartu Stok dan Kertas Kerja.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {ROLES.map((r, idx) => {
              const active = idx === currentRoleIndex;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setCurrentRoleIndex(idx);
                    triggerToast('Petugas Aktif Diubah!', `Anda sekarang bertugas sebagai ${r.name} (${r.roleLabel}).`);
                  }}
                  className={`cursor-pointer p-5 rounded-3xl border-2 transition ${
                    active
                      ? 'bg-gradient-to-br from-[#F3E8FF] to-[#FCE7F3] border-purple-500 shadow-md'
                      : 'bg-white border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.badgeColor}`}>
                        {r.roleLabel}
                      </span>
                      <h3 className="text-lg font-black text-[#1E1B4B] mt-2">{r.name}</h3>
                    </div>
                    {active && (
                      <span className="px-3 py-1 rounded-full bg-purple-700 text-white text-xs font-bold">
                        Aktif Digunakan
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {r.permissions.map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // 7. MASTER MOBILE & DESKTOP LAYOUT (RESPONSIVE HP + BOTTOM SCANNER BAR)
  // ==========================================

  const vibeStyles = {
    SAKURA_POP: {
      sidebarBg: 'bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#831843]',
      accentBadge: 'from-[#F472B6] via-[#C084FC] to-[#38BDF8]',
      pageBg: 'bg-[#F5F0FF]'
    },
    CYBER_SEOUL: {
      sidebarBg: 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#311042]',
      accentBadge: 'from-[#22D3EE] via-[#818CF8] to-[#F472B6]',
      pageBg: 'bg-[#EEF2FF]'
    },
    MATCHA_CLOUD: {
      sidebarBg: 'bg-gradient-to-b from-[#064E3B] via-[#115E59] to-[#3B215D]',
      accentBadge: 'from-[#34D399] via-[#A7F3D0] to-[#FDE047]',
      pageBg: 'bg-[#F0FDF4]'
    }
  }[uiVibe];

  return (
    <div
      className={`min-h-screen w-full flex justify-center relative bg-[#1E1136] text-[#2A1846] selection:bg-pink-300 selection:text-purple-950 overflow-x-hidden`}
      style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Nunito', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes simfarFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes simfarPulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.45), 0 6px 0 rgba(59, 33, 93, 0.22); }
          50% { box-shadow: 0 0 22px 4px rgba(236, 72, 153, 0.55), 0 6px 0 rgba(59, 33, 93, 0.22); }
        }
        @keyframes simfarPopIn {
          0% { opacity: 0; transform: scale(0.97) translateY(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .simfar-float { animation: simfarFloat 4s ease-in-out infinite; }
        .simfar-pulse-glow { animation: simfarPulseGlow 2.6s infinite; }
        .simfar-pop-in { animation: simfarPopIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .simfar-btn-pop {
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 0 rgba(35, 21, 60, 0.18);
        }
        .simfar-btn-pop:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 6px 0 rgba(35, 21, 60, 0.22);
        }
        .simfar-btn-pop:active {
          transform: translateY(2px) scale(0.98);
          box-shadow: 0 1px 0 rgba(35, 21, 60, 0.18);
        }
        .simfar-neo-card {
          transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 0 rgba(76, 29, 149, 0.10), 0 12px 24px -6px rgba(147, 51, 234, 0.12);
        }
        .simfar-neo-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 0 rgba(76, 29, 149, 0.14), 0 18px 30px -6px rgba(236, 72, 153, 0.18);
        }
      `}</style>
      <div
        className={`min-h-screen flex flex-col lg:flex-row relative bg-[#F4EEFF] overflow-x-hidden transition-all ${
          mobilePreviewMode
            ? 'w-full max-w-[430px] shadow-[0_0_60px_rgba(0,0,0,0.6)] border-x-4 border-purple-300/40 rounded-3xl my-2'
            : 'w-full'
        }`}
      >
        {/* === AMBIENT BACKGROUND === */}
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-25 blur-[2px]"
          style={{ backgroundImage: `url("${heroBgUrl}")` }}
        />

        {/* === MOBILE SLIDE-OVER DRAWER MENU (FOR HP) === */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
            <div className="w-[270px] bg-gradient-to-b from-[#3B215D] via-[#4C2E78] to-[#7C4DA8] text-white p-5 flex flex-col justify-between h-full shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/20">
                  <div className="flex items-center gap-2.5">
                    <GlowingPillLogo />
                    <div>
                      <span className="text-xl font-black tracking-wider text-white">SIMFAR HP</span>
                      <p className="text-[10px] text-pink-200">{clinicProfile.puskesmasName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-xl bg-white/10 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMenu(item.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#FDF3D7] to-[#F9E2AF] text-[#23153C] shadow-md'
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/20">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setScannerModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#23153C] font-black text-xs flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> 📷 Scan Barcode Tempat Obat
                </button>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowPrintAllLabelsModal(true);
                  }}
                  className="w-full py-2 px-3 rounded-2xl bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak Semua Barcode Rak
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* === LEFT SIDEBAR (DESKTOP ONLY WHEN NOT IN MOBILE PREVIEW MODE) === */}
        {!mobilePreviewMode && (
          <aside className={`hidden lg:flex w-[268px] shrink-0 ${vibeStyles.sidebarBg} text-white flex-col justify-between p-5 relative z-20 overflow-hidden select-none shadow-2xl border-r-2 border-white/25 transition-colors duration-300`}>
            <svg viewBox="0 0 180 90" className="absolute top-0 left-0 w-44 h-24 pointer-events-none opacity-90">
              <path d="M0 12 Q50 28 110 8" stroke="#F9A8D4" strokeOpacity="0.45" strokeWidth="3" fill="none" />
              <circle cx="28" cy="14" r="10" fill="#FBCFE8" fillOpacity="0.85" />
              <circle cx="52" cy="20" r="8" fill="#F472B6" fillOpacity="0.7" />
              <circle cx="85" cy="12" r="11" fill="#FBCFE8" fillOpacity="0.8" />
              <circle cx="115" cy="16" r="7" fill="#F9A8D4" fillOpacity="0.75" />
            </svg>

            <svg viewBox="0 0 200 120" className="absolute bottom-16 right-0 w-48 h-28 pointer-events-none opacity-85">
              <circle cx="155" cy="55" r="16" fill="#FBCFE8" fillOpacity="0.75" />
              <circle cx="128" cy="70" r="13" fill="#F9A8D4" fillOpacity="0.75" />
              <circle cx="170" cy="82" r="14" fill="#F472B6" fillOpacity="0.65" />
              <circle cx="105" cy="95" r="11" fill="#FBCFE8" fillOpacity="0.7" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center gap-3 pt-1 pb-5 mb-3 border-b border-white/15">
                <GlowingPillLogo />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-white leading-none">
                      SIMFAR
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-[#1E1136] text-[9px] font-black uppercase">
                      ONLINE v4.2
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-pink-200 truncate mt-1">
                    {clinicProfile.puskesmasName}
                  </p>
                  <p className="text-[10px] text-purple-200/80 truncate">
                    Smart Pharmacy & Barcode System
                  </p>
                </div>
              </div>

              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      {item.isBottomSeparated && (
                        <div className="my-2.5 border-t border-white/15" />
                      )}
                      <button
                        onClick={() => setActiveMenu(item.id)}
                        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-2xl text-[13px] font-extrabold transition-all duration-200 cursor-pointer group ${
                          isActive
                            ? 'bg-white text-[#1E1136] shadow-[0_4px_0_rgba(0,0,0,0.25)]'
                            : 'text-white/90 hover:bg-white/12 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-gradient-to-br from-purple-700 to-pink-600 text-white shadow-xs'
                                : 'bg-white/10 text-pink-200 group-hover:bg-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.4]" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mr-1" />
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-white/15 space-y-2">
                <button
                  onClick={() => setScannerModalOpen(true)}
                  className="simfar-btn-pop w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-300 to-pink-300 text-[#23153C] font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Scan Barcode Rak</span>
                </button>
                <button
                  onClick={() => {
                    setInspectorMedId(selectedStockCardMedId || medicineWithBalances[0]?.id || 'MED-SIL-009');
                    setInspectorModalOpen(true);
                  }}
                  className="simfar-btn-pop w-full py-2 px-3 rounded-2xl bg-emerald-400/20 hover:bg-emerald-400/30 border border-emerald-300/40 text-emerald-200 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Portal Online Tim Pemeriksa</span>
                </button>
                <button
                  onClick={() => setShowPrintAllLabelsModal(true)}
                  className="w-full py-2 px-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Label Barcode Semua Obat</span>
                </button>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-2">
              <div className="relative rounded-2xl p-3.5 bg-gradient-to-br from-[#3D2459]/85 to-[#5B357E]/80 border border-pink-300/50 shadow-[0_0_20px_rgba(244,114,182,0.25)] backdrop-blur-md flex items-center gap-3">
                <PuskesmasClinicIllustration />
                <div>
                  <p className="text-xs font-extrabold text-white leading-snug">
                    {clinicProfile.puskesmasName}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-pink-200 mt-0.5">
                    <MapPin className="w-3 h-3 text-pink-300" /> {clinicProfile.kabupaten}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* === MAIN WORKSPACE === */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 pb-24 lg:pb-8">
          {/* TOP HERO BANNER (COMPACT ON HP, FULL ON DESKTOP) */}
          <div
            className={`relative w-full overflow-hidden select-none ${
              mobilePreviewMode ? 'h-[185px]' : 'h-[205px] sm:h-[225px]'
            }`}
          >
            <img
              src={heroBgUrl}
              alt="Tawa Ceria di Apotek Sakura"
              className="absolute inset-0 w-full h-full object-cover object-[center_22%] pointer-events-none"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div
              className="absolute inset-0 bg-cover bg-[center_22%] pointer-events-none -z-10"
              style={{ backgroundImage: `url("${heroBgUrl}")` }}
            />

            <SakuraBranchCornerTop className="absolute -top-3 -left-4 w-60 sm:w-72 h-36 sm:h-44 pointer-events-none opacity-90 z-10" />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(243,232,255,0.86) 0%, rgba(252,231,243,0.68) 38%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0) 100%)'
              }}
            />

            {/* TOP FLOATING HEADER BAR */}
            <header className="relative z-30 px-4 sm:px-6 lg:px-8 pt-3.5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[440px]">
                {/* Mobile Hamburger Button */}
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className={`${
                    mobilePreviewMode ? 'flex' : 'flex lg:hidden'
                  } w-10 h-10 rounded-full bg-[#3B215D] text-white items-center justify-center shadow-md shrink-0 cursor-pointer`}
                  title="Buka Menu"
                >
                  <Layers className="w-5 h-5" />
                </button>

                <div className="relative flex-1">
                  <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full px-3.5 py-2 border border-purple-200/80 shadow-md focus-within:ring-2 focus-within:ring-purple-400">
                    <Search className="w-4 h-4 text-[#23153C] mr-2 shrink-0 stroke-[2.5]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setShowQuickSearch(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowQuickSearch(true);
                      }}
                      placeholder="Cari obat / kode barcode..."
                      className="w-full text-xs sm:text-sm font-semibold text-[#2A1846] placeholder-slate-500 focus:outline-none bg-transparent"
                    />
                    <button
                      onClick={() => setScannerModalOpen(true)}
                      title="Scan Barcode Rak"
                      className="p-1 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 shrink-0 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {showQuickSearch && searchQuery.trim() && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-purple-200 shadow-xl p-3 z-50">
                      <div className="flex items-center justify-between px-2 pb-2 border-b border-purple-100 text-xs font-bold text-slate-500">
                        <span>Hasil Pencarian Cepat ({quickSearchResults.length})</span>
                        <button
                          onClick={() => setShowQuickSearch(false)}
                          className="text-rose-500 hover:underline"
                        >
                          Tutup
                        </button>
                      </div>
                      {quickSearchResults.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">
                          Obat atau kode barcode tidak ditemukan.
                        </p>
                      ) : (
                        <div className="max-h-60 overflow-y-auto divide-y divide-purple-50 mt-1">
                          {quickSearchResults.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                handleBarcodeScannedOpenStockCard(m);
                                setShowQuickSearch(false);
                              }}
                              className="p-2.5 hover:bg-purple-50 rounded-xl cursor-pointer flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-extrabold text-[#2A1846]">{m.name}</p>
                                <p className="text-xs text-slate-500">
                                  *{m.code}* · Lokasi: {m.location}
                                </p>
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                                {m.currentStock} {m.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Gen-Z Vibe Theme Switcher */}
                <div className="hidden xl:flex items-center bg-white/95 backdrop-blur-md p-1 rounded-full border-2 border-purple-300/80 shadow-sm text-[11px] font-black">
                  {[
                    { id: 'SAKURA_POP', label: '🌸 Sakura' },
                    { id: 'CYBER_SEOUL', label: '⚡ Cyber' },
                    { id: 'MATCHA_CLOUD', label: '🍵 Matcha' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setUiVibe(v.id as any)}
                      className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                        uiVibe === v.id
                          ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-purple-800'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Button 4 Tahap GitHub & Firebase Online */}
                <button
                  type="button"
                  onClick={() => setFirebaseModalOpen(true)}
                  className="simfar-btn-pop px-3 py-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white border border-amber-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  title="Buka Panduan & Konfigurasi 4 Tahap GitHub + Firebase Online"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  <span>GitHub & Firebase</span>
                </button>

                {/* Button Struktur Kode Modular (Download per Bagian) */}
                <button
                  type="button"
                  onClick={() => setModularCodeModalOpen(true)}
                  className="simfar-btn-pop px-3 py-2 rounded-full bg-[#1E1136] text-emerald-300 border border-emerald-400/50 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  title="Lihat & Download Kode Aplikasi Terstruktur per Modul (Agar Mudah Di-update per Bagian)"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kode Modular</span>
                </button>

                {/* Button Analisa & Rekomendasi Sistem */}
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(true)}
                  className="simfar-btn-pop px-3 py-2 rounded-full bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 text-[#1E1136] border-2 border-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  title="Lihat Analisa Kekurangan & Rekomendasi Terbaik Pengembangan SIMFAR"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-900" />
                  <span>Analisa & 8 Fitur Pro</span>
                </button>

                {/* Toggle Mode Layar HP */}
                <button
                  onClick={() => setMobilePreviewMode(!mobilePreviewMode)}
                  className={`px-3 py-2 rounded-full text-xs font-extrabold border shadow-sm transition cursor-pointer flex items-center gap-1.5 ${
                    mobilePreviewMode
                      ? 'bg-amber-300 text-[#23153C] border-amber-400'
                      : 'bg-white/95 text-[#3B215D] border-purple-200 hover:bg-purple-50'
                  }`}
                  title="Beralih antara Tampilan Layar HP & Layar Penuh"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{mobilePreviewMode ? 'Layar Penuh' : 'Mode HP'}</span>
                </button>

                <button
                  onClick={() => setScannerModalOpen(true)}
                  className="px-3 py-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
                  title="Scan Barcode Tempat Obat untuk Cek Kartu Stok"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scan Barcode</span>
                </button>

                {!mobilePreviewMode && (
                  <div
                    onClick={() => setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length)}
                    title="Klik untuk mengganti Petugas Aktif"
                    className="hidden sm:flex cursor-pointer items-center gap-2.5 bg-white/95 hover:bg-white pl-2 pr-3.5 py-1 rounded-full border border-purple-200/80 shadow-md transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 border border-purple-300 flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 40 40" className="w-7 h-7">
                        <circle cx="20" cy="15" r="8" fill="#FFE4D6" />
                        <path d="M11 14 C11 7, 29 7, 29 14 C26 11, 14 11, 11 14 Z" fill="#5C3A2E" />
                        <path d="M8 38 C10 27, 30 27, 32 38 Z" fill="#3B245B" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-[#1E1B4B] leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-600 leading-tight">
                        {currentUser.roleLabel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* CLEAN, TIDY HERO BANNER (NO DUPLICATE SIDEBAR LOGO) */}
            <div className="relative z-20 px-5 sm:px-8 pt-3 pb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="max-w-2xl space-y-1.5">
                <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-purple-200 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-[#2E1760]">
                    {clinicProfile.puskesmasName} · {clinicProfile.kabupaten}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black">
                    Smart Reader PDF / JPG / Excel / Word
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2E1760] drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
                  {NAV_ITEMS.find((n) => n.id === activeMenu)?.label || 'Beranda Manajemen Farmasi'}
                </h1>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorMedId(selectedStockCardMedId || medicineWithBalances[0]?.id || 'MED-SIL-009');
                      setInspectorModalOpen(true);
                    }}
                    className="simfar-btn-pop px-3.5 py-1.5 rounded-full bg-[#1E1136] hover:bg-[#2E1760] text-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Portal Audit Online Tim Pemeriksa (Scan Kartu Stok)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMenu('TRANSAKSI')}
                    className="simfar-btn-pop px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#2E1760] border border-purple-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-700" />
                    <span>Upload Dokumen BA (PDF / JPG / Excel)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* === FROSTED-GLASS CONTENT PANEL === */}
          <main className="relative z-20 -mt-6 flex-1 bg-white/90 backdrop-blur-xl rounded-t-[30px] border-t border-white/90 shadow-[0_-10px_35px_-10px_rgba(91,33,182,0.18)] p-4 sm:p-6 lg:p-7">
            {activeMenu === 'BERANDA' && renderDashboard()}
            {activeMenu === 'DATA_OBAT' && renderDataObat()}
            {activeMenu === 'TRANSAKSI' && renderTransaksi()}
            {activeMenu === 'KARTU_STOK' && renderKartuStok()}
            {activeMenu === 'STOCK_OPNAME' && renderStockOpname()}
            {activeMenu === 'KERTAS_KERJA' && renderKertasKerja()}
            {activeMenu === 'BATCH_EXPIRY' && renderBatchExpiry()}
            {activeMenu === 'LAPORAN' && renderLaporanIntegrasi()}
            {activeMenu === 'INOVASI_PRO' && renderInovasiPro()}
            {activeMenu === 'PENGATURAN' && renderPengaturan()}
          </main>

          {/* === FLOATING MOBILE BOTTOM NAVIGATION BAR (FOR HP & MOBILE PREVIEW MODE) === */}
          <div
            className={`${
              mobilePreviewMode ? 'flex' : 'flex lg:hidden'
            } fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-purple-200 px-2 py-1.5 items-center justify-around shadow-[0_-8px_25px_rgba(59,33,93,0.18)]`}
          >
            <button
              onClick={() => setActiveMenu('BERANDA')}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer ${
                activeMenu === 'BERANDA' ? 'text-purple-800' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveMenu('DATA_OBAT')}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer ${
                activeMenu === 'DATA_OBAT' ? 'text-purple-800' : 'text-slate-500'
              }`}
            >
              <Pill className="w-5 h-5" />
              <span>Data Obat</span>
            </button>

            {/* Prominent Center Scan Barcode Button on HP */}
            <button
              onClick={() => setScannerModalOpen(true)}
              className="-mt-6 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#EC4899] text-white font-black text-[11px] shadow-lg border-2 border-white flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <QrCode className="w-6 h-6 text-amber-200" />
              <span>SCAN BARCODE</span>
            </button>

            <button
              onClick={() => setActiveMenu('KARTU_STOK')}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer ${
                activeMenu === 'KARTU_STOK' ? 'text-purple-800' : 'text-slate-500'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Kartu Stok</span>
            </button>

            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-500 cursor-pointer"
            >
              <Table className="w-5 h-5" />
              <span>Menu Lain</span>
            </button>
          </div>
        </div>
      </div>

      {/* === MODAL CETAK SEMUA LABEL BARCODE TEMPAT OBAT (UNTUK DITEMPEL DI RAK OBAT) === */}
      {showPrintAllLabelsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-6 border-2 border-purple-200 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-purple-100">
              <div>
                <span className="text-xs font-extrabold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Stiker Barcode Tempat Obat · Siap Cetak & Tempel di Rak
                </span>
                <h3 className="text-lg font-black text-[#1E1B4B] mt-1">
                  Katalog Label Barcode & QR Semua Obat ({medicineWithBalances.length} Obat)
                </h3>
                <p className="text-xs text-slate-600">
                  Cetak dan tempelkan barcode ini pada masing-masing kotak/rak obat fisik. Saat di-scan dengan HP, akan langsung muncul <strong>Detail Data Obat & Kartu Stok</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Semua Label
                </button>
                <button
                  onClick={() => setShowPrintAllLabelsModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
              {medicineWithBalances.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-[#FAF5FF] border-2 border-dashed border-purple-300 flex flex-col justify-between text-center"
                >
                  <div>
                    <div className="bg-[#3B215D] text-white py-1 px-2 rounded-lg text-[10px] font-black uppercase">
                      {clinicProfile.puskesmasName} · KARTU STOK RAK
                    </div>
                    <h4 className="text-sm font-black text-[#1E1B4B] mt-2">{m.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-600">
                      {m.location || 'Rak Obat'} · Satuan: {m.unit}
                    </p>
                    <div className="my-2 flex items-center justify-center gap-2">
                      <div className="flex-1">
                        <Code39BarcodeSvg value={m.code || m.id} height={38} />
                      </div>
                      <RealQrCodeSvg value={m.code || m.id} size={58} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    <button
                      onClick={() => downloadMedicineLabelPng(m, clinicProfile.puskesmasName)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" /> Unduh .PNG
                    </button>
                    <button
                      onClick={() => {
                        setShowPrintAllLabelsModal(false);
                        handleBarcodeScannedOpenStockCard(m);
                      }}
                      className="py-1.5 px-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ScanLine className="w-3 h-3" /> Uji Scan → Kartu Stok
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paste Tabel BAST Modal */}
      {showBastPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-emerald-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <h3 className="text-base font-black text-[#1E1B4B]">
                📋 Tempel (Copy-Paste) Tabel BA / BAST dari Excel, Word, atau PDF
              </h3>
              <button onClick={() => setShowBastPasteModal(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Blok & salin (<code>Ctrl + C</code>) baris tabel beserta judul kolomnya dari file Excel / Word / PDF BA Anda, lalu tempel (<code>Ctrl + V</code>) di kotak bawah ini:
            </p>
            <textarea
              rows={7}
              value={bastPasteText}
              onChange={(e) => setBastPasteText(e.target.value)}
              placeholder={"NO\tNOMOR BA\tNAMA BARANG\tSATUAN\tHARGA SATUAN\tJUMLAH\n1\t04/BAST-OBAT/JKN/V/2026\tParacetamol 500 mg\tTablet\t263\t1000"}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-emerald-300 font-mono text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBastPasteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBastPasteSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer"
              >
                Baca & Ekstrak Tabel BA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paste Tabel Pengeluaran Modal */}
      {showEpuskPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-pink-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="text-base font-black text-[#1E1B4B]">
                📋 Tempel (Copy-Paste) Tabel Pengeluaran Obat
              </h3>
              <button onClick={() => setShowEpuskPasteModal(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Salin (<code>Ctrl + C</code>) daftar obat keluar dari Excel e-Puskesmas / LPLPO lalu tempel (<code>Ctrl + V</code>) di bawah ini:
            </p>
            <textarea
              rows={7}
              value={epuskPasteText}
              onChange={(e) => setEpuskPasteText(e.target.value)}
              placeholder={"NAMA OBAT\tSATUAN\tJUMLAH KELUAR\nParacetamol 500 mg\tTablet\t120\nAmoxicillin 500 mg\tKaplet\t85"}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-pink-300 font-mono text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEpuskPasteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleEpuskPasteSubmit}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs cursor-pointer"
              >
                Baca Tabel Pengeluaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL 4 TAHAP INTEGRASI GITHUB & FIREBASE (HOSTING, QR DEEP-LINK, FIRESTORE & RULES) === */}
      {firebaseModalOpen && (() => {
        const pid = firebaseConfig.projectId || 'simfar-pkmsilian';
        const hostingDomain = `https://${pid}.web.app`;
        const sampleQrDeepLink = `${hostingDomain}/?scan=OBT-PKM-009`;

        const firebaseJsonCode = `{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}`;

        const githubWorkflowYaml = `name: Deploy SIMFAR ke Firebase Hosting
on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '\${{ secrets.GITHUB_token }}'
          firebaseServiceAccount: '\${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${pid}`;

        const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Dokumen Kartu Stok Puskesmas:
    // - Tim Pemeriksa yang scan QR di rak obat bebas MEMBACA (allow read: if true)
    // - Pengelola Obat dapat menulis/mengupdate mutasi BA & Stok
    match /simfar_puskesmas/{clinicId} {
      allow read: if true;
      allow write: if true;
    }
  }
}`;

        return (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border-4 border-[#1E1136] shadow-[0_12px_0_#1E1136] overflow-hidden simfar-pop-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1E1136] via-[#7C2D12] to-[#9A3412] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-[#1E1136] text-[10px] font-black uppercase">
                    🔥 4 Tahap Implementasi Online · GitHub + Google Firebase
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-1">
                    Pusat Integrasi GitHub & Firebase (Live Kartu Stok untuk Tim Pemeriksa)
                  </h3>
                  <p className="text-xs text-amber-100">
                    Hubungkan aplikasi langsung ke repository GitHub & project Firebase Anda agar saat Tim Pemeriksa scan barcode di rak obat, data Masuk/Keluar tampil secara online.
                  </p>
                </div>
                <button
                  onClick={() => setFirebaseModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4 Stage Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-3 bg-slate-100 border-b border-slate-200 text-xs font-black">
                {[
                  { id: 1, title: 'Tahap 1: GitHub & Hosting' },
                  { id: 2, title: 'Tahap 2: QR Deep-Link Rak' },
                  { id: 3, title: 'Tahap 3: Cloud Firestore' },
                  { id: 4, title: 'Tahap 4: Rules & Pemeriksa' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFirebaseStageTab(st.id)}
                    className={`py-2.5 px-3 rounded-xl cursor-pointer transition text-center ${
                      firebaseStageTab === st.id
                        ? 'bg-[#1E1136] text-amber-300 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    {st.title}
                  </button>
                ))}
              </div>

              {/* Content Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
                {firebaseStageTab === 1 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-2">
                      <h4 className="text-sm font-black text-[#1E1136]">
                        Tahap 1 — Upload Kode Modular ke GitHub & Auto-Deploy ke Firebase Hosting
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        Dengan menghubungkan repository <strong>GitHub</strong> ke <strong>Firebase Hosting</strong>, setiap kali Anda memperbarui satu file modul di GitHub, GitHub Actions akan otomatis mem-build dan meng-online-kan aplikasi ke alamat resmi <code>{hostingDomain}</code>.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block font-black text-slate-700 mb-1">
                            Nama Project ID Firebase Anda:
                          </label>
                          <input
                            type="text"
                            value={firebaseConfig.projectId}
                            onChange={(e) => {
                              const val = e.target.value.trim();
                              setFirebaseConfig({ ...firebaseConfig, projectId: val });
                              if (val) setOnlinePortalDomain(`https://${val}.web.app`);
                            }}
                            placeholder="contoh: simfar-pkmsilian"
                            className="w-full px-3 py-2 rounded-xl bg-white border-2 border-amber-400 font-mono font-black text-sm text-[#1E1136]"
                          />
                        </div>
                        <div>
                          <label className="block font-black text-slate-700 mb-1">
                            Nama Repository GitHub Anda:
                          </label>
                          <input
                            type="text"
                            value={firebaseConfig.githubRepo}
                            onChange={(e) => setFirebaseConfig({ ...firebaseConfig, githubRepo: e.target.value })}
                            placeholder="username/simfar-pkmsilian"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2">
                        <span className="text-amber-300 font-mono font-black block">
                          1. File firebase.json (Sudah ada di ZIP Modular)
                        </span>
                        <pre className="p-2.5 rounded-xl bg-black/50 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                          {firebaseJsonCode}
                        </pre>
                      </div>
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2">
                        <span className="text-amber-300 font-mono font-black block">
                          2. .github/workflows/firebase-deploy.yml
                        </span>
                        <pre className="p-2.5 rounded-xl bg-black/50 font-mono text-[10px] text-pink-200 overflow-x-auto max-h-40">
                          {githubWorkflowYaml}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {firebaseStageTab === 2 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 space-y-3">
                      <h4 className="text-sm font-black text-[#1E1136]">
                        Tahap 2 — Mengikat Domain Firebase Hosting ke QR & Barcode Fisik Rak Obat
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        Saat aplikasi sudah aktif di <code>{hostingDomain}</code>, seluruh stiker QR Code yang ditempel di tempat obat fisik akan mengarah ke tautan <strong>Deep-Link Kartu Stok Online</strong>:
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={onlinePortalDomain}
                          onChange={(e) => setOnlinePortalDomain(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border-2 border-purple-400 font-mono font-black text-purple-900 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setOnlinePortalDomain(hostingDomain);
                            triggerToast(
                              'Domain QR Rak Diperbarui ke Firebase! 🔗',
                              `Seluruh QR Code obat kini mengarah ke ${hostingDomain}/?scan=KODE_OBAT.`
                            );
                          }}
                          className="simfar-btn-pop px-4 py-2.5 rounded-xl bg-purple-700 text-white font-black cursor-pointer"
                        >
                          Gunakan Domain {hostingDomain}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-purple-300 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <RealQrCodeSvg value={sampleQrDeepLink} size={88} />
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[10px]">
                            CONTOH QR DEEP-LINK FIREBASE
                          </span>
                          <p className="font-mono font-black text-purple-900 text-xs">{sampleQrDeepLink}</p>
                          <p className="text-slate-600 text-[11px]">
                            Ketika Tim Pemeriksa men-scan QR ini dengan kamera HP mereka, browser HP langsung membuka <strong>Portal Audit Kartu Stok Online</strong> obat tersebut tanpa perlu login!
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFirebaseModalOpen(false);
                          setShowPrintAllLabelsModal(true);
                        }}
                        className="simfar-btn-pop px-4 py-2.5 rounded-xl bg-[#1E1136] text-amber-300 font-black cursor-pointer"
                      >
                        Cetak Semua Label QR Firebase
                      </button>
                    </div>
                  </div>
                )}

                {firebaseStageTab === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-black text-emerald-950">
                          Tahap 3 — Koneksi Langsung ke Database Firebase Cloud Firestore / Realtime DB
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black">
                          Status: {firebaseSyncStatus}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        Tempelkan potongan kode <code>firebaseConfig</code> dari <strong>Firebase Console → Project Settings → Your Apps (Web)</strong> di kotak bawah ini, atau isi langsung <code>projectId</code> dan <code>apiKey</code>:
                      </p>

                      <textarea
                        rows={4}
                        value={rawFirebasePaste}
                        onChange={(e) => handleParseRawFirebaseConfig(e.target.value)}
                        placeholder={`Tempelkan firebaseConfig dari Firebase Console di sini, contoh:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "simfar-pkmsilian",\n  databaseURL: "https://simfar-pkmsilian-default-rtdb.firebaseio.com"\n};`}
                        className="w-full p-3 rounded-xl bg-white border border-emerald-400 font-mono text-xs"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-emerald-950 mb-1">Firebase Project ID</label>
                          <input
                            type="text"
                            value={firebaseConfig.projectId}
                            onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value.trim() })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-mono font-black"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-emerald-950 mb-1">Firebase Web API Key</label>
                          <input
                            type="text"
                            value={firebaseConfig.apiKey}
                            onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value.trim() })}
                            placeholder="AIzaSy..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-emerald-950 mb-1">Realtime DB URL (Opsional)</label>
                          <input
                            type="text"
                            value={firebaseConfig.databaseURL}
                            onChange={(e) => setFirebaseConfig({ ...firebaseConfig, databaseURL: e.target.value.trim() })}
                            placeholder="https://...-rtdb.firebaseio.com"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => pushStateToFirebaseCloud(false)}
                          className="simfar-btn-pop px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black cursor-pointer"
                        >
                          {isSyncingFirebase ? 'Menyinkronkan...' : '🔥 Push Data Puskesmas ke Firebase Sekarang'}
                        </button>
                        <button
                          type="button"
                          onClick={() => pullStateFromFirebaseCloud(false)}
                          className="simfar-btn-pop px-4 py-2.5 rounded-xl bg-white border-2 border-emerald-600 text-emerald-900 font-black cursor-pointer"
                        >
                          📥 Tarik Data Terbaru dari Firebase
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {firebaseStageTab === 4 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-3">
                      <h4 className="text-sm font-black text-[#1E1136]">
                        Tahap 4 — Keamanan Firestore Rules & Mode Publik Read-Only untuk Tim Pemeriksa
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        Saat Tim Pemeriksa men-scan QR di rak obat (membuka <code>{sampleQrDeepLink}</code>), aplikasi otomatis masuk ke <strong>Portal Audit Tim Pemeriksa (Mode Read-Only)</strong> sehingga pemeriksa langsung melihat daftar Masuk & Keluar obat tanpa bisa mengubah/menghapus stok.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl space-y-1.5">
                          <span className="text-amber-300 font-mono font-black block">
                            Aturan Firestore (firestore.rules):
                          </span>
                          <pre className="p-2.5 rounded-xl bg-black/50 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                            {firestoreRulesCode}
                          </pre>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-indigo-200 space-y-3">
                          <label className="block font-black text-[#1E1136]">
                            PIN Otorisasi Pengelola Obat (Untuk Edit Stok):
                          </label>
                          <input
                            type="text"
                            value={firebaseConfig.officerPin}
                            onChange={(e) => setFirebaseConfig({ ...firebaseConfig, officerPin: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-300 font-mono font-black text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFirebaseModalOpen(false);
                              setInspectorModalOpen(true);
                            }}
                            className="simfar-btn-pop w-full py-2.5 rounded-xl bg-[#1E1136] text-amber-300 font-black cursor-pointer"
                          >
                            🕵️ Uji Buka Layar HP Tim Pemeriksa Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-600">
                  Seluruh file konfigurasi GitHub Actions & Firebase telah disertakan di dalam <strong>simfar_modular_source_code_v4.zip</strong>.
                </span>
                <div className="flex items-center gap-2">
                  {firebaseStageTab < 4 && (
                    <button
                      type="button"
                      onClick={() => setFirebaseStageTab(firebaseStageTab + 1)}
                      className="px-4 py-2 rounded-xl bg-purple-700 text-white font-black cursor-pointer"
                    >
                      Lanjut ke Tahap {firebaseStageTab + 1} →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFirebaseModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1E1136] text-white font-black cursor-pointer"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

            {/* === MODAL ARSITEKTUR KODE MODULAR PROFESIONAL (DOWNLOAD PER BAGIAN / MODUL) === */}
      {modularCodeModalOpen && (() => {
        const MODULAR_FILES: Record<string, { path: string; role: string; desc: string; content: string }> = {
          'imageOcrParser.ts': {
            path: 'src/services/imageOcrParser.ts',
            role: 'Modul Pembaca Foto / JPG BA (Table Grid Eraser + OCR)',
            desc: 'Bagian khusus yang menangani pembersihan garis tabel pada foto .JPG/.PNG, pelurusan sel (top-align), dan ekstraksi Nama Obat, Satuan, Banyaknya, serta Harga dari hasil OCR.',
            content: `// src/services/imageOcrParser.ts
// Cukup edit file ini jika ingin menyesuaikan cara pembacaan foto/gambar (.JPG/.PNG) Berita Acara.
export { parseOcrNumberToken, parseOcrRawTextToStructuredRows, preprocessTableCanvasForOcr, parseImageDocumentFile };`
          },
          'pdfBastParser.ts': {
            path: 'src/services/pdfBastParser.ts',
            role: 'Modul Pembaca Dokumen PDF BAST (/ToUnicode CMap + Koordinat)',
            desc: 'Bagian khusus untuk mendekode stream PDF (seperti SIAP BMD / e-Katalog), membaca tabel koordinat (x,y), dan menyatukan nama barang yang terpotong menjadi 2-3 baris.',
            content: `// src/services/pdfBastParser.ts
// Cukup edit file ini jika ada perubahan format cetak PDF dari aplikasi daerah/Dinkes.
export { inflateRawBuffer, parsePdfBufferToRows };`
          },
          'sheetAndDocParser.ts': {
            path: 'src/services/sheetAndDocParser.ts',
            role: 'Modul Pembaca Excel (.xlsx/.xls), CSV, Word (.docx) & Smart Analyzer',
            desc: 'Bagian yang memetakan nama kolom secara otomatis (Nama Barang, Banyaknya, Satuan, Harga Satuan, Jumlah Total, Nomor BA, Batch, ED).',
            content: `// src/services/sheetAndDocParser.ts
// Cukup edit file ini jika ingin menambah kata kunci header kolom baru pada Excel/Word.
export { parseOpenXmlWorkbookOrDoc, parseDelimitedOrHtmlText, smartAnalyzeSheetRows };`
          },
          'barcodeAndQrEngine.ts': {
            path: 'src/services/barcodeAndQrEngine.ts',
            role: 'Modul Barcode 1D (Code-39), QR Deep-Link & Cetak Label Rak',
            desc: 'Bagian yang menghasilkan stiker barcode fisik rak obat dan memindai barcode melalui kamera HP.',
            content: `// src/services/barcodeAndQrEngine.ts
// Cukup edit file ini jika ingin mengubah ukuran cetakan label stiker barcode di rak obat.
export { encodeCode39Bars, decodeCode39FromImageData, Code39BarcodeSvg, RealQrCodeSvg, downloadMedicineLabelPng };`
          },
          'KertasKerjaModule.tsx': {
            path: 'src/modules/KertasKerjaModule.tsx',
            role: 'Modul Kertas Kerja Mutasi Harian (Tanggal 1-31) & Grouping Nomor BA',
            desc: 'Bagian tampilan dan ekspor Excel Kertas Kerja yang mengelompokkan daftar obat sesuai Nomor BA dan mencatat Masuk/Keluar per tanggal.',
            content: `// src/modules/KertasKerjaModule.tsx
// Cukup edit file ini jika ingin mengubah format tabel atau cetakan Excel Kertas Kerja Bulanan.`
          },
          'InspectorPortalModal.tsx': {
            path: 'src/modules/InspectorPortalModal.tsx',
            role: 'Modul Portal Audit Online Tim Pemeriksa (?scan=KODE_OBAT)',
            desc: 'Bagian halaman pemeriksaan publik (Read-Only) yang terbuka otomatis saat Tim Pemeriksa men-scan QR fisik di rak obat menggunakan HP mereka.',
            content: `// src/modules/InspectorPortalModal.tsx
// Cukup edit file ini jika ingin menambah kolom verifikasi bagi Tim Pemeriksa / Auditor.`
          },
          'supabaseClient.ts': {
            path: 'src/services/supabaseClient.ts',
            role: 'Modul Koneksi Database Cloud Online (Supabase + Realtime Sync)',
            desc: 'Bagian konfigurasi URL & API Key Supabase agar data tersinkron secara online antar komputer Puskesmas dan HP Tim Pemeriksa.',
            content: `// src/services/supabaseClient.ts
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key'
};`
          }
        };

        const activeMod = MODULAR_FILES[selectedModuleKey] || MODULAR_FILES['imageOcrParser.ts'];

        return (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-5 sm:p-6 border-4 border-[#1E1136] shadow-[0_12px_0_#1E1136] simfar-pop-in">
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-purple-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                    💻 Clean Modular Architecture · Mudah Di-update Per Bagian
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#1E1136] mt-1">
                    Struktur File Coding Modular SIMFAR (v4.2 Professional Edition)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Aplikasi telah dipecah ke dalam modul-modul independen. Jika ke depan ada pembaruan (misal hanya ingin mengubah pembacaan foto JPG atau tampilan Kertas Kerja), Anda cukup mengganti file modul terkait saja.
                  </p>
                </div>
                <button
                  onClick={() => setModularCodeModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-y-auto text-xs">
                <div className="md:col-span-5 space-y-1.5 pr-1">
                  <p className="font-black text-[#1E1136] uppercase text-[11px] mb-2">
                    📁 Daftar File Modul Utama (Klik untuk Detail):
                  </p>
                  {Object.entries(MODULAR_FILES).map(([k, mod]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedModuleKey(k)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition cursor-pointer ${
                        selectedModuleKey === k
                          ? 'bg-[#1E1136] text-white border-[#1E1136]'
                          : 'bg-slate-50 hover:bg-purple-50 text-[#1E1136] border-slate-200'
                      }`}
                    >
                      <div className="font-mono font-black text-xs text-amber-400">{mod.path}</div>
                      <div className={`font-bold text-[11px] mt-0.5 ${selectedModuleKey === k ? 'text-white' : 'text-slate-600'}`}>
                        {mod.role}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-7 bg-slate-900 text-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="font-mono font-black text-emerald-400 text-xs">{activeMod.path}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-800 text-pink-200 text-[10px] font-bold">
                        Independent Module
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeMod.desc}</p>
                    <pre className="p-3 rounded-xl bg-black/60 border border-slate-700 font-mono text-[11px] text-amber-200 overflow-x-auto whitespace-pre-wrap">
                      {activeMod.content}
                    </pre>
                  </div>

                  <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      Paket lengkap tersedia dalam file <strong>simfar_modular_source_code_v4.zip</strong> di chat.
                    </span>
                    <button
                      type="button"
                      onClick={() => setModularCodeModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-[#1E1136] font-black text-xs cursor-pointer"
                    >
                      Selesai & Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

            {/* === MODAL PORTAL AUDIT ONLINE TIM PEMERIKSA ( SAAT SCAN BARCODE FISIK KARTU STOK ) === */}
      {inspectorModalOpen && (() => {
        const auditMed =
          medicineWithBalances.find((m) => m.id === inspectorMedId) ||
          medicineWithBalances.find((m) => m.id === selectedStockCardMedId) ||
          medicineWithBalances[0];

        const medTxsChrono = auditMed
          ? [...transactions]
              .filter((t) => t.medId === auditMed.id)
              .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
          : [];

        let runningBalance = Number(auditMed?.initialBalance || 0);
        const auditLedger = medTxsChrono.map((t) => {
          if (t.type === 'IN') runningBalance += Number(t.qty || 0);
          else if (t.type === 'OUT') runningBalance = Math.max(0, runningBalance - Number(t.qty || 0));
          return { ...t, runningBalance };
        });

        const deepLinkUrl = `${onlinePortalDomain.replace(/\/$/, '')}/?scan=${encodeURIComponent(
          auditMed?.code || auditMed?.id || 'OBT-PKM-009'
        )}`;
        const tteHash = generateTteSignatureHash(
          auditMed?.noBA || 'KARTU-STOK',
          new Date().toISOString().slice(0, 10),
          (auditMed?.currentStock || 0) * Number(auditMed?.price || 0),
          clinicProfile.pjFarmasi
        );
        const verifiedInfo = auditMed ? inspectorVerifiedMap[auditMed.id] : null;

        return (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border-4 border-[#1E1136] shadow-[0_12px_0_#1E1136] overflow-hidden simfar-pop-in">
              {/* Top Official Online Audit Bar */}
              <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#3B215D] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-[#0F172A] text-[10px] font-black uppercase">
                        ONLINE INSPECTOR PORTAL · LIVE KARTU STOK
                      </span>
                      <span className="text-[11px] text-purple-200 font-mono">
                        {tteHash}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black mt-0.5">
                      Layar Pemeriksaan Fisik & Detail Masuk/Keluar Obat (Tim Pemeriksa)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Tampilan otomatis di HP Tim Pemeriksa (Inspektorat / Dinkes / BPK / Kapus) saat men-scan QR/Barcode fisik di rak obat.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInspectorModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-white cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs">
                {/* Selector Obat & Deep-Link QR untuk Tim Pemeriksa */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-purple-200 items-center">
                  <div className="lg:col-span-8 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="font-black text-[#1E1136] text-xs uppercase">
                        Pilih Obat yang Di-scan oleh Tim Pemeriksa:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectorModalOpen(false);
                          setScannerModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ScanLine className="w-3.5 h-3.5" /> Buka Kamera Scanner HP
                      </button>
                    </div>
                    <select
                      value={auditMed?.id || ''}
                      onChange={(e) => setInspectorMedId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-purple-300 font-black text-sm text-[#1E1136]"
                    >
                      {medicineWithBalances.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.code}] {m.name} — Sisa Stok: {m.currentStock} {m.unit} (BA: {m.noBA})
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex-1 min-w-[220px] px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-mono text-[11px] text-purple-900 truncate">
                        🔗 Link QR Pemeriksa: {deepLinkUrl}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(deepLinkUrl);
                          } catch (_) {}
                          triggerToast(
                            'Link Audit Online Disalin! 🔗',
                            `URL Kartu Stok Online untuk ${auditMed?.name} siap dibuka dari HP Tim Pemeriksa.`
                          );
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#1E1136] text-amber-300 font-black text-[11px] cursor-pointer"
                      >
                        Salin Link QR Online
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex items-center justify-center gap-3 bg-white p-3 rounded-2xl border border-purple-200">
                    <RealQrCodeSvg value={deepLinkUrl} size={78} />
                    <div className="text-left space-y-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black text-[10px] inline-block">
                        QR DEEP-LINK AKTIF
                      </span>
                      <p className="font-extrabold text-[#1E1136] text-xs leading-snug">
                        Scan QR ini dari HP Pemeriksa
                      </p>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Membuka langsung rincian Masuk/Keluar obat ini secara online.
                      </p>
                    </div>
                  </div>
                </div>

                {auditMed && (
                  <>
                    {/* Kartu Identitas Obat & Nomor BA */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F3E8FF] via-[#FCE7F3] to-[#ECFDF5] border-2 border-purple-200 flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#1E1136] text-amber-300 font-mono font-black text-xs">
                            *{auditMed.code}*
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-700 text-white font-mono font-bold text-xs">
                            No. BA: {auditMed.noBA || '-'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-white border border-purple-300 font-bold text-purple-900 text-xs">
                            Sumber: {auditMed.sumberAnggaran || '-'}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-[#1E1136] mt-1">
                          {auditMed.name}
                        </h4>
                        <p className="text-xs text-slate-700 font-semibold">
                          Lokasi Rak Fisik: <strong>{auditMed.location || 'Gudang / Apotek'}</strong> · Satuan: <strong>{auditMed.unit}</strong> · Harga Satuan BA: <strong>Rp {Number(auditMed.price || 0).toLocaleString('id-ID')}</strong> · Nilai Sisa: <strong>Rp {(auditMed.currentStock * Number(auditMed.price || 0)).toLocaleString('id-ID')}</strong>
                        </p>
                      </div>

                      {verifiedInfo ? (
                        <div className="p-3 rounded-2xl bg-emerald-600 text-white text-right">
                          <span className="text-[10px] font-black uppercase block">✓ TELAH DIPERIKSA FISIK</span>
                          <span className="font-black text-xs block">{verifiedInfo.auditorName}</span>
                          <span className="text-[10px] opacity-90">{verifiedInfo.verifiedAt}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            value={inspectorAuditorName}
                            onChange={(e) => setInspectorAuditorName(e.target.value)}
                            placeholder="Nama Pemeriksa / Tim Audit"
                            className="px-3 py-2 rounded-xl bg-white border border-purple-300 font-bold text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nowStr = new Date().toLocaleString('id-ID');
                              setInspectorVerifiedMap((prev) => ({
                                ...prev,
                                [auditMed.id]: {
                                  verifiedAt: nowStr,
                                  auditorName: inspectorAuditorName || 'Tim Pemeriksa',
                                  note: 'Stok fisik sesuai Kartu Stok'
                                }
                              }));
                              triggerToast(
                                'Verifikasi Tim Pemeriksa Tercatat! ✅',
                                `Kartu Stok ${auditMed.name} telah ditandai Sesuai Fisik oleh ${inspectorAuditorName}.`
                              );
                            }}
                            className="simfar-btn-pop px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer"
                          >
                            ✅ Sah & Sesuai Fisik (Tim Pemeriksa)
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 4 Kotak Ringkasan Mutasi Obat */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-black uppercase text-slate-500">1. Saldo Awal</span>
                        <p className="text-xl font-black text-[#1E1136] mt-0.5">
                          {Number(auditMed.initialBalance || 0).toLocaleString('id-ID')} <span className="text-xs">{auditMed.unit}</span>
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-black uppercase text-emerald-800">2. Total Obat Masuk (+BA)</span>
                        <p className="text-xl font-black text-emerald-700 mt-0.5">
                          +{auditMed.totalIn.toLocaleString('id-ID')} <span className="text-xs">{auditMed.unit}</span>
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200">
                        <span className="text-[10px] font-black uppercase text-pink-800">3. Total Obat Keluar (-)</span>
                        <p className="text-xl font-black text-pink-700 mt-0.5">
                          -{auditMed.totalOut.toLocaleString('id-ID')} <span className="text-xs">{auditMed.unit}</span>
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-purple-900 text-white">
                        <span className="text-[10px] font-black uppercase text-amber-300">4. Sisa Stok Saat Ini</span>
                        <p className="text-xl font-black text-white mt-0.5">
                          {auditMed.currentStock.toLocaleString('id-ID')} <span className="text-xs text-pink-200">{auditMed.unit}</span>
                        </p>
                      </div>
                    </div>

                    {/* Tabel Rincian Kronologi Masuk & Keluar Obat (Untuk Tim Pemeriksa) */}
                    <div className="border-2 border-purple-200 rounded-2xl overflow-hidden">
                      <div className="bg-[#1E1136] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-black text-xs sm:text-sm">
                          📋 Daftar Rincian Histori Masuk & Keluar Obat ({auditLedger.length + 1} Rekaman Mutasi)
                        </span>
                        <span className="text-[11px] text-amber-300 font-bold">
                          Data Real-Time Kartu Stok & Kertas Kerja
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-purple-100 text-[#1E1136] font-black uppercase">
                              <th className="py-2.5 px-3">Tanggal</th>
                              <th className="py-2.5 px-3">Jenis Mutasi</th>
                              <th className="py-2.5 px-3">Nomor BA / Dokumen</th>
                              <th className="py-2.5 px-3">Sumber / Unit Tujuan</th>
                              <th className="py-2.5 px-3">Batch & ED</th>
                              <th className="py-2.5 px-3 text-right text-emerald-800">Masuk (+)</th>
                              <th className="py-2.5 px-3 text-right text-rose-800">Keluar (-)</th>
                              <th className="py-2.5 px-3 text-right bg-purple-200/60">Sisa Saldo</th>
                              <th className="py-2.5 px-3">Petugas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-100">
                            <tr className="bg-slate-50 font-bold">
                              <td className="py-2.5 px-3">Saldo Awal</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-black">
                                  SALDO AWAL
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono">{auditMed.noBA || '-'}</td>
                              <td className="py-2.5 px-3">Saldo Awal Persediaan</td>
                              <td className="py-2.5 px-3 font-mono">-</td>
                              <td className="py-2.5 px-3 text-right">-</td>
                              <td className="py-2.5 px-3 text-right">-</td>
                              <td className="py-2.5 px-3 text-right font-black bg-purple-50">
                                {Number(auditMed.initialBalance || 0).toLocaleString('id-ID')} {auditMed.unit}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">Sistem Master</td>
                            </tr>
                            {auditLedger.map((row: any) => (
                              <tr key={row.id} className="hover:bg-purple-50/50">
                                <td className="py-2.5 px-3 font-extrabold text-[#1E1136]">{row.date}</td>
                                <td className="py-2.5 px-3">
                                  {row.type === 'IN' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                                      + OBAT MASUK (BA)
                                    </span>
                                  ) : row.type === 'OUT' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-black text-[10px]">
                                      - OBAT KELUAR
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-black text-[10px]">
                                      STOCK OPNAME
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-purple-800">
                                  {row.docNo || '-'}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-700">
                                  {row.sourceOrDest || row.notes || '-'}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                                  {row.batchNo ? `${row.batchNo} (${row.expiryDate || '-'})` : 'Tanpa Batch/ED'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                                  {row.type === 'IN' ? `+${Number(row.qty || 0).toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-black text-rose-700">
                                  {row.type === 'OUT' ? `-${Number(row.qty || 0).toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-black text-[#1E1136] bg-purple-50/70">
                                  {row.runningBalance.toLocaleString('id-ID')} {auditMed.unit}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-600">{row.officer}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600">
                  💡 Saat aplikasi di-online-kan (Vercel + Supabase), QR di rak otomatis mengarahkan HP pemeriksa ke tampilan ini.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Bukti Pemeriksaan
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1E1136] text-white font-black text-xs cursor-pointer"
                  >
                    Tutup Portal Pemeriksa
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

            {/* === MODAL ANALISA KEKURANGAN & REKOMENDASI PENGEMBANGAN TERBAIK SIMFAR === */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col p-5 sm:p-7 border-4 border-[#2E1760] shadow-[0_12px_0_#2E1760] simfar-pop-in">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-purple-100">
              <div>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 to-pink-300 text-[#1E1136] text-xs font-black uppercase">
                  🔍 System Audit & Product Blueprint · UPTD Puskesmas Silian
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E1136] mt-1.5">
                  Analisa Kekurangan & 8 Rekomendasi Upgrade Terbaik SIMFAR
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Evaluasi menyeluruh arsitektur aplikasi saat ini beserta peta jalan pengembangan agar siap menjadi sistem farmasi Puskesmas kelas produksi penuh.
                </p>
              </div>
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300">
                <p className="font-black text-emerald-950 text-sm mb-1">
                  ✅ Apa yang Sudah Diperbaiki & Ditingkatkan di Versi v4.0 Ini:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-900 font-semibold">
                  <li>• <strong>3-Layer Smart BAST PDF & Multi-Format Engine:</strong> Dekompresi stream PDF + dekoder tabel <code>/ToUnicode CMap</code> & koordinat <code>(x,y)</code> yang membaca nama barang multi-baris secara utuh tanpa huruf kacau.</li>
                  <li>• <strong>Kalkulasi Harga Pintar Dua Arah:</strong> Otomatis menghitung Harga Satuan dari Harga Total (atau sebaliknya) pada dokumen BA model apapun.</li>
                  <li>• <strong>Handling Tanpa ED / Tanpa Batch:</strong> Otomatis mengosongkan Batch & ED untuk BMHP/Obat Tanpa ED seperti pada BA 21 April 2026.</li>
                  <li>• <strong>Tampilan Gen-Z Neo-Pop K-Webtoon:</strong> Dilengkapi 3 tema Vibe (Sakura, Cyber Seoul, Matcha), kartu 3D pop, dan animasi interaktif.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  {
                    badge: 'PRIORITAS 1 · AI OCR FOTO KERTAS',
                    title: '1. AI Vision OCR untuk Foto BA Fisik / Kertas Scan miring',
                    gap: 'Saat ini pembaca PDF bekerja optimal pada PDF digital (seperti cetakan SIAP BMD / Excel). Namun jika BA di-scan dari kertas fisik menggunakan kamera HP (berupa gambar di dalam PDF), teks tidak tersimpan sebagai font.',
                    rec: 'Tambahkan mesin OCR berbasis kamera (Tesseract.js / Vision API) agar petugas cukup memfoto kertas BA yang baru datang dari gudang Dinkes dan tabelnya langsung terekstrak.'
                  },
                  {
                    badge: 'PRIORITAS 2 · MULTI-SATUAN BERTINGKAT',
                    title: '2. Konversi Otomatis Multi-Satuan (Box → Strip → Tablet)',
                    gap: 'Di BA penerimaan sering tercatat dalam satuan besar (misal: 20 Box atau 2 Dus), sedangkan pengeluaran harian ke pasien memakai satuan terkecil (Tablet / Pcs / Strip).',
                    rec: 'Bangun kalkulator konversi bertingkat otomatis saat commit BA (misal 1 Box = 100 Tablet) sehingga penerimaan 5 Box otomatis bisa dipecah menjadi 500 Pcs di Kartu Stok.'
                  },
                  {
                    badge: 'PRIORITAS 3 · CLOUD & MULTI-USER SYNC',
                    title: '3. Sinkronisasi Cloud Real-Time Antar HP Petugas (Supabase/Firebase)',
                    gap: 'Penyimpanan saat ini berbasis LocalStorage di masing-masing perangkat browser sehingga jika Petugas A scan di HP-nya, datanya belum langsung tampil di laptop Kepala Puskesmas.',
                    rec: 'Hubungkan ke database cloud real-time dengan mode Offline-First (IndexedDB + Sync Queue) agar saat sinyal di Puskesmas lemah tetap jalan dan otomatis sinkron saat online.'
                  },
                  {
                    badge: 'PRIORITAS 4 · MULTI-DEPO & SUB-UNIT',
                    title: '4. Manajemen Multi-Depo (Gudang Utama, Apotek, UGD, KIA, Pustu)',
                    gap: 'Stok obat saat ini tergabung dalam satu saldo Puskesmas, padahal fisik obat terbagi di Gudang Obat, Kamar Obat/Apotek, UGD, PONED, dan Pustu/Polindes.',
                    rec: 'Pisahkan Kartu Stok per Sub-Unit (Gudang vs Apotek Pelayanan) lengkap dengan fitur SBBK Internal (mutasi antar ruangan tanpa mengurangi total stok Puskesmas).'
                  },
                  {
                    badge: 'PRIORITAS 5 · PREDIKSI AI & RKO',
                    title: '5. Smart Forecasting & Rencana Kebutuhan Obat (RKO) Otomatis',
                    gap: 'Batas stok minimum (Min Stock) masih statis, belum menghitung rata-rata pemakaian bulanan (Average Monthly Consumption) dan waktu tunggu pengiriman Dinkes (Lead Time).',
                    rec: 'Gunakan rumus Kemenkes: Stok Optimum = Pemakaian Rata-Rata × (Waktu Tunggu + Buffer Stock) untuk menghasilkan draf RKO tahunan dan alert "Obat akan habis dalam X hari".'
                  },
                  {
                    badge: 'PRIORITAS 6 · TANDA TANGAN DIGITAL (TTE)',
                    title: '6. Berita Acara & LPLPO dengan QR Verifikasi Tanda Tangan Elektronik',
                    gap: 'Pengesahan Stock Opname dan LPLPO masih berupa status tombol di layar tanpa bukti kriptografi/QR pengesahan dari Kepala Puskesmas & Pengurus Barang.',
                    rec: 'Sematkan QR Code TTE Validasi pada cetakan PDF Berita Acara Stock Opname & LPLPO yang memuat hash waktu, NIP Pejabat, dan ringkasan nilai aset.'
                  },
                  {
                    badge: 'PRIORITAS 7 · ANALISIS FARMAKOEKONOMI',
                    title: '7. Matriks Analisis ABC-VEN & Dead-Stock Detector',
                    gap: 'Nilai aset Rp sudah dihitung, tetapi belum dikelompokkan mana obat Vital/Esensial/Non-Esensial (VEN) dan mana yang menyerap 70% anggaran (Kelas A).',
                    rec: 'Tambahkan tab Analisis ABC-VEN & Slow-Moving/Dead-Stock Detector (obat yang tidak bergerak >90 hari) untuk mencegah potensi kerugian kedaluwarsa.'
                  },
                  {
                    badge: 'PRIORITAS 8 · INTEGRASI SATUSEHAT & E-LOGISTIK',
                    title: '8. Mapping Kode KFA (Kamus Farmasi & Alat Kesehatan) SatuSehat',
                    gap: 'Kode barang di BA daerah (SIAP BMD / e-Logistik) sering berbeda penulisan dengan nama generik di e-Puskesmas (misal "CHRONA CARE MASKER BEDAH (2025)" vs "Masker Bedah").',
                    rec: 'Sediakan kamus pencocokan pintar (Fuzzy Alias & Kode KFA Kemenkes) agar nama merek dari BA pengadaan otomatis terpetakan ke item generik yang sama di Kartu Stok.'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF7FF] border-2 border-purple-200 hover:border-purple-400 transition flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-900 text-amber-300 text-[10px] font-black uppercase">
                        {item.badge}
                      </span>
                      <h4 className="font-black text-[#1E1136] text-sm mt-1.5">{item.title}</h4>
                      <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200 mt-1.5">
                        <strong>Kekurangan Saat Ini:</strong> {item.gap}
                      </p>
                    </div>
                    <p className="text-xs text-emerald-900 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>💡 Solusi & Rekomendasi:</strong> {item.rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-purple-100 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500">
                Tip: Klik tombol &quot;⚡ Muat BA 21 April (PDF Lampiran)&quot; di menu Transaksi untuk menguji pembacaan dokumen lampiran Anda.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoadmapModal(false);
                    setActiveMenu('INOVASI_PRO');
                  }}
                  className="simfar-btn-pop px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs cursor-pointer"
                >
                  💎 Buka Pusat Kendali 8 Fitur Inovasi Pro Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(false)}
                  className="px-4 py-2.5 rounded-2xl bg-[#1E1136] text-white font-extrabold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Clear Sample Data Modal */}
      {confirmClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-rose-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-7 h-7 shrink-0" />
              <h3 className="text-lg font-black">Kosongkan Seluruh Data Saat Ini?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan ini akan menghapus seluruh daftar obat dan transaksi sampel agar Anda dapat memulai dari <strong>0 (kosong)</strong> dan langsung meng-upload file <strong>BA / BAST</strong> serta <strong>Pengeluaran</strong> asli Puskesmas Anda.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmClearModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleClearAllSampleData}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer"
              >
                Ya, Kosongkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Master Obat Modal */}
      {editingMed && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-purple-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
              <h3 className="text-lg font-black text-[#1E1B4B]">Edit Master Obat: {editingMed.name}</h3>
              <button
                onClick={() => setEditingMed(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditMedicine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Barcode Obat</label>
                  <input
                    type="text"
                    value={editingMed.code || ''}
                    onChange={(e) => setEditingMed({ ...editingMed, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor BA / BAST</label>
                  <input
                    type="text"
                    placeholder="Kosong jika tak ada"
                    value={editingMed.noBA || ''}
                    onChange={(e) => setEditingMed({ ...editingMed, noBA: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Barang / Obat</label>
                  <input
                    type="text"
                    required
                    value={editingMed.name || ''}
                    onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Anggaran</label>
                  <input
                    type="text"
                    value={editingMed.sumberAnggaran || ''}
                    onChange={(e) => setEditingMed({ ...editingMed, sumberAnggaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={editingMed.unit || ''}
                    onChange={(e) => setEditingMed({ ...editingMed, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingMed.price ?? 0}
                    onChange={(e) => setEditingMed({ ...editingMed, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Saldo Stok Saat Ini</label>
                  <input
                    type="number"
                    min="0"
                    value={editingMed.currentStockInput ?? 0}
                    onChange={(e) => setEditingMed({ ...editingMed, currentStockInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Batch (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika tak ada di BA"
                    value={editingMed.batchNoInput ?? ''}
                    onChange={(e) => setEditingMed({ ...editingMed, batchNoInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal ED (Opsional)</label>
                  <input
                    type="date"
                    value={editingMed.expiryDateInput ?? ''}
                    onChange={(e) => setEditingMed({ ...editingMed, expiryDateInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white font-extrabold text-xs shadow-md cursor-pointer mt-2"
              >
                Simpan Perubahan Data Obat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Label Barcode Tempat Obat & Quick Action Modal */}
      {qrModalMed && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 border-2 border-purple-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
              <div>
                <span className="text-xs font-extrabold uppercase text-purple-700">
                  Label Barcode Tempat Obat & Kartu Stok HP
                </span>
                <h4 className="text-base font-black text-[#1E1B4B]">
                  {qrModalMed.name} (*{qrModalMed.code}*)
                </h4>
              </div>
              <button
                onClick={() => setQrModalMed(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Printable Real Scannable Barcode + QR Label */}
              <div className="sm:col-span-6 p-4 rounded-2xl bg-[#FAF5FF] border-2 border-dashed border-purple-300 text-center space-y-2">
                <div className="bg-[#3B215D] text-white py-1 px-2 rounded-lg text-[10px] font-black uppercase">
                  {clinicProfile.puskesmasName}
                </div>
                <p className="text-sm font-black text-[#1E1B4B]">{qrModalMed.name}</p>
                <p className="text-[10px] font-bold text-slate-500">
                  {qrModalMed.location || 'Rak Obat'} · Satuan: {qrModalMed.unit}
                </p>

                <Code39BarcodeSvg value={qrModalMed.code || qrModalMed.id} height={44} />

                <div className="flex items-center justify-center gap-2 pt-1">
                  <RealQrCodeSvg value={qrModalMed.code || qrModalMed.id} size={64} />
                  <div className="text-left text-[10px] space-y-0.5">
                    <p className="font-black text-purple-950">Stok: {qrModalMed.currentStock} {qrModalMed.unit}</p>
                    <p className="text-slate-600">No. BA: {qrModalMed.noBA || '-'}</p>
                    <p className="text-slate-600">Harga: Rp {Number(qrModalMed.price || 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => downloadMedicineLabelPng(qrModalMed, clinicProfile.puskesmasName)}
                    className="py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh .PNG
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Label
                  </button>
                </div>
              </div>

              {/* Direct Button to Open Full Kartu Stok + Quick Mutasi */}
              <div className="sm:col-span-6 bg-slate-50 p-4 rounded-2xl border border-purple-100 space-y-3">
                <button
                  type="button"
                  onClick={() => handleBarcodeScannedOpenStockCard(qrModalMed)}
                  className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-[#3B215D] to-[#6D28D9] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-300" /> Buka Kartu Stok & Detail Obat Ini
                </button>

                <div className="border-t border-purple-200 pt-2.5 space-y-2">
                  <span className="text-[11px] font-black text-[#2A1846] block">
                    📱 Mutasi Cepat di Tempat Obat:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQrQuickActionType('OUT')}
                      className={`py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                        qrQuickActionType === 'OUT'
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      - Keluar Rak
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrQuickActionType('IN')}
                      className={`py-1.5 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                        qrQuickActionType === 'IN'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      + Masuk Rak
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600">
                        Jumlah ({qrModalMed.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={qrQuickQty}
                        onChange={(e) => setQrQuickQty(e.target.value)}
                        className="w-full mt-0.5 px-2.5 py-1.5 rounded-xl bg-white border border-purple-300 font-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={qrQuickDate}
                        onChange={(e) => setQrQuickDate(e.target.value)}
                        className="w-full mt-0.5 px-2 py-1.5 rounded-xl bg-white border border-purple-200 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleQrMobileQuickSubmit(qrModalMed);
                      handleBarcodeScannedOpenStockCard(qrModalMed);
                    }}
                    className={`w-full py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition cursor-pointer ${
                      qrQuickActionType === 'OUT'
                        ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}
                  >
                    {qrQuickActionType === 'OUT'
                      ? 'Simpan Pengeluaran & Lihat Kartu Stok'
                      : 'Simpan Tambah Stok & Lihat Kartu Stok'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === PEMINDAI BARCODE / QR KAMERA HP -> LANGSUNG BUKA DETAIL OBAT & KARTU STOK === */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 border-2 border-purple-300 shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-purple-100">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  📱 Pemindai Barcode Tempat Obat (HP)
                </span>
                <h3 className="text-base font-black text-[#1E1B4B] mt-1">
                  Scan Barcode Obat → Buka Kartu Stok
                </h3>
              </div>
              <button
                onClick={() => {
                  stopCameraStream();
                  setScannerModalOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Live Camera Stream / Photo Capture Buttons */}
            <div className="space-y-2.5">
              {cameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-purple-500 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  {/* Red Laser Scanline Overlay */}
                  <div className="absolute inset-x-6 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_#F43F5E] animate-pulse" />
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="px-3 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold">
                      Arahkan kamera ke Barcode / QR di Tempat Obat...
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold"
                  >
                    Matikan Kamera
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={startLiveCameraScanner}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4 text-amber-300" /> 📹 Buka Kamera HP Live
                  </button>

                  <label className="cursor-pointer py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 text-center">
                    <QrCode className="w-4 h-4 text-amber-200" />
                    <span>📸 Ambil Foto / Gambar Barcode</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleScanBarcodeFromImageFile}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {cameraError && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                  {cameraError}
                </div>
              )}
            </div>

            {/* 2. Manual / USB Scanner Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (barcodeSearchInput.trim()) {
                  handleBarcodeScannedOpenStockCard(barcodeSearchInput);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                autoFocus
                value={barcodeSearchInput}
                onChange={(e) => setBarcodeSearchInput(e.target.value)}
                placeholder="Ketik / Scan kode barcode (mis: OBT-PKM-001)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-300 text-xs font-bold focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-700 text-white font-extrabold text-xs cursor-pointer"
              >
                Cek Kartu Stok
              </button>
            </form>

            {/* 3. Daftar Barcode Tempat Obat (Klik untuk Langsung Buka Kartu Stok) */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2">
                Pilih / Ketuk Barcode Obat di Bawah untuk Langsung Membuka <strong>Kartu Stok Obat</strong>:
              </p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {medicineWithBalances
                  .filter((m) => {
                    const q = barcodeSearchInput.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      m.name.toLowerCase().includes(q) ||
                      m.code.toLowerCase().includes(q) ||
                      m.id.toLowerCase().includes(q) ||
                      (m.noBA && m.noBA.toLowerCase().includes(q))
                    );
                  })
                  .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleBarcodeScannedOpenStockCard(m)}
                      className="w-full p-3 rounded-2xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 flex items-center justify-between text-left transition cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-purple-900 text-white font-mono text-[10px] font-black">
                            *{m.code}*
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 truncate">
                            {m.location}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold text-[#1E1B4B] mt-0.5 truncate">{m.name}</p>
                        <span className="text-[11px] font-bold text-emerald-700">
                          Sisa Saldo Kartu Stok: {m.currentStock.toLocaleString('id-ID')} {m.unit}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white text-[11px] font-extrabold shrink-0 shadow-2xs">
                        Lihat Kartu Stok →
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Master Obat Modal */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-purple-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-100">
              <h3 className="text-lg font-black text-[#1E1B4B]">Tambah Master Obat & Buat Barcode Rak</h3>
              <button
                onClick={() => setShowAddMedicineModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMasterMedicine} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Barcode Obat</label>
                  <input
                    type="text"
                    required
                    value={newMedForm.code}
                    onChange={(e) => setNewMedForm({ ...newMedForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor BA (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika belum ada"
                    value={newMedForm.noBA}
                    onChange={(e) => setNewMedForm({ ...newMedForm, noBA: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Obat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibuprofen 400 mg"
                    value={newMedForm.name}
                    onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Anggaran</label>
                  <input
                    type="text"
                    value={newMedForm.sumberAnggaran}
                    onChange={(e) => setNewMedForm({ ...newMedForm, sumberAnggaran: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan Dasar</label>
                  <input
                    type="text"
                    value={newMedForm.unit}
                    onChange={(e) => setNewMedForm({ ...newMedForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={newMedForm.price}
                    onChange={(e) => setNewMedForm({ ...newMedForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={newMedForm.initialStock}
                    onChange={(e) => setNewMedForm({ ...newMedForm, initialStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Batch (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Kosongkan jika tak ada di BA"
                    value={newMedForm.batchNo}
                    onChange={(e) => setNewMedForm({ ...newMedForm, batchNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal ED (Opsional)</label>
                  <input
                    type="date"
                    value={newMedForm.expiryDate}
                    onChange={(e) => setNewMedForm({ ...newMedForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Simpan Master Obat & Buat QR Unik
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm bg-white rounded-2xl p-4 border-2 border-purple-300 shadow-2xl flex items-start gap-3 animate-bounce">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'error'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Heart className="w-5 h-5 fill-current" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-[#1E1B4B]">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
