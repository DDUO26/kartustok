// src/services/supabaseOnlineSync.ts
// Modul Koneksi Online untuk Portal Tim Pemeriksa & Multi-HP Sync

export interface CloudSyncConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  clinicCode: string;
}

export const DEFAULT_CLOUD_CONFIG: CloudSyncConfig = {
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || '',
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  clinicCode: 'PKM-SILIAN-MITRA'
};

export function buildInspectorDeepLinkUrl(baseDomain: string, medicineCode: string): string {
  const cleanBase = baseDomain.replace(/\/$/, '');
  return `${cleanBase}/?scan=${encodeURIComponent(medicineCode)}`;
}
