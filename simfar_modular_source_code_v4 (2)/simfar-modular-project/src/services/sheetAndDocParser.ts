// Modul Khusus Pembaca Excel (.xlsx/.xls), CSV, Word (.docx) & Smart Table Analyzer
import { inflateRawBuffer, parsePdfBufferToRows } from './pdfBastParser';
import { parseOcrRawTextToStructuredRows, parseImageDocumentFile } from './imageOcrParser';

export function decodeXmlEntities(str: string): string {
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

export function parseZipArchiveEntries(arrayBuffer: ArrayBuffer) {
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

  export function getText(targetName: string): string | null {
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

export function parseOpenXmlWorkbookOrDoc(arrayBuffer: ArrayBuffer): { name: string; rows: string[][] }[] {
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

  export function colLettersToIndex(letters: string): number {
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

export function parseDelimitedOrHtmlText(text: string, sheetName = 'Data'): { name: string; rows: string[][] }[] {
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

  export function splitCsvLine(line: string, delim: string): string[] {
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


export async function parseAnyUploadedFile(file: File): Promise<{ name: string; rows: string[][] }[]> {
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

export function parseSmartNumber(val: any): number {
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

export function parseSmartDate(val: any): string {
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

export function smartExtractFromUnstructuredLines(rows: string[][], defaultNoBA: string, defaultSumber: string) {
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

export function smartAnalyzeSheetRows(rows: string[][], mode: 'BAST' | 'OUT' = 'BAST', customColOverride: any = null) {
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
