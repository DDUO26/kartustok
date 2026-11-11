// src/types/inventory.ts
// Definisi Tipe Data Utama SIMFAR (Mudah Dikembangkan)

export interface Medicine {
  id: string;
  code: string;
  eLogistikCode: string;
  noBA: string;
  sumberAnggaran: string;
  genericName: string;
  name: string;
  form: string;
  strength: string;
  unit: string;
  conversion: string;
  category: string;
  minStock: number;
  location: string;
  active: boolean;
  initialBalance: number;
  price: number;
  kfaCode?: string;
  venClass?: 'V' | 'E' | 'N';
}

export interface BatchItem {
  id: string;
  medId: string;
  batchNo: string;
  expiryDate: string;
  stock: number;
  source: string;
}

export interface TransactionRecord {
  id: string;
  type: 'IN' | 'OUT' | 'OPNAME';
  medId: string;
  medName: string;
  docNo: string;
  date: string;
  timeLabel: string;
  dayName: string;
  batchNo: string;
  expiryDate: string;
  qty: number;
  unit: string;
  price?: number;
  totalPrice?: number;
  sourceOrDest: string;
  officer: string;
  notes?: string;
  statusBadge?: string;
}
