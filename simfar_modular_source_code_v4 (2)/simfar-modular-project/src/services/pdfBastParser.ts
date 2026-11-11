// Modul Khusus Pembaca Dokumen PDF BAST (/ToUnicode CMap + Koordinat Tabel)
// 2C. REAL MULTI-FORMAT FILE PARSER ENGINE (.XLSX, .XLS, .CSV, .TSV, .DOCX, .PDF, PASTE)
// ==========================================

export function inflateRawBuffer(data: Uint8Array): Uint8Array {
  let pos = 0, bitBuf = 0, bitCnt = 0;
  const out: number[] = [];

  export function bits(n: number): number {
    while (bitCnt < n) {
      bitBuf |= (data[pos++] || 0) << bitCnt;
      bitCnt += 8;
    }
    const val = bitBuf & ((1 << n) - 1);
    bitBuf >>>= n;
    bitCnt -= n;
    return val;
  }

  export function buildTree(lengths: ArrayLike<number>) {
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

  export function decodeSymbol(tree: { map: Map<number, number>; maxBits: number }): number {
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


export function parsePdfBufferToRows(arrayBuffer: ArrayBuffer): { name: string; rows: string[][] }[] {
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

