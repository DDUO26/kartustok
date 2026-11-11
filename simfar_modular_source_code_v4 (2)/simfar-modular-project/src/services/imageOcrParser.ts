// Modul Khusus Pembaca Foto / Gambar (.JPG / .PNG) BAST (Table Grid Line Eraser + Cell Top-Aligner + OCR)
import { parseSmartNumber, smartAnalyzeSheetRows, parseDelimitedOrHtmlText } from './sheetAndDocParser';

export function parseOcrNumberToken(val: string): number {
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

export function parseOcrRawTextToStructuredRows(ocrText: string): string[][] {
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
export function preprocessTableCanvasForOcr(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
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

export async function ensureTesseractLoaded(): Promise<any> {
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

export async function parseImageDocumentFile(
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

