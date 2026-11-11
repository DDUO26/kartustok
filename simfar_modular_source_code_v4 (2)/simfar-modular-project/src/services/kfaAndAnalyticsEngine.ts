// Modul Kamus KFA SatuSehat, Multi-Satuan, Smart RKO & TTE Hash
// 2D. 8 STRATEGIC INNOVATION ENGINES (KFA SATUSEHAT, MULTI-UNIT, RKO, ABC-VEN, TTE HASH, OCR)
// ==========================================

export const KFA_DICTIONARY: {
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

export function matchKfaAndVen(rawName: string): {
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

export function parseConversionRatio(conversionStr: string, unitStr: string, rawName = ''): { ratio: number; baseUnit: string } {
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

export function generateTteSignatureHash(docTitle: string, monthOrDate: string, totalVal: number, officerName: string): string {
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

