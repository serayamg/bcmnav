import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const NAVY: [number, number, number] = [11, 31, 58];
const CYAN: [number, number, number] = [0, 169, 206];

export interface PdfColumn {
  header: string;
  key: string;
  width?: number;
}

interface PdfReportOptions {
  title: string;
  subtitle?: string;
  columns: PdfColumn[];
  rows: Record<string, string | number>[];
  fileName: string;
  meta?: { label: string; value: string }[];
  orientation?: 'portrait' | 'landscape';
}

function drawHeader(doc: jsPDF, title: string, subtitle?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 26, 'F');
  doc.setFillColor(...CYAN);
  doc.rect(0, 26, pageWidth, 1.2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BCM Navigator', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(190, 230, 244);
  doc.text('Advisory & BIA Management System  |  ISO 22301:2019 & ISO 22317:2021', 14, 18);

  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title, 14, 38);
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 100, 115);
    doc.text(subtitle, 14, 44);
  }
}

function drawFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const stamp = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 226, 232);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 130, 145);
    doc.text(`Dokumen dihasilkan otomatis oleh BCM Navigator - ${stamp}`, 14, pageHeight - 7);
    doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
  }
}

/** Generate a branded, tabular PDF report and trigger download. */
export function exportTablePdf(options: PdfReportOptions): void {
  const { title, subtitle, columns, rows, fileName, meta, orientation = 'landscape' } = options;
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  drawHeader(doc, title, subtitle);

  let startY = subtitle ? 50 : 46;

  if (meta && meta.length > 0) {
    doc.setFontSize(8.5);
    meta.forEach((m, idx) => {
      const y = startY + idx * 5;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text(`${m.label}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 80, 95);
      doc.text(m.value, 45, y);
    });
    startY += meta.length * 5 + 3;
  }

  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => String(r[c.key] ?? '—'))),
    styles: { fontSize: 8, cellPadding: 2.2, overflow: 'linebreak', valign: 'top' },
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.2 },
    alternateRowStyles: { fillColor: [245, 249, 252] },
    columnStyles: columns.reduce((acc, c, i) => {
      if (c.width) acc[i] = { cellWidth: c.width };
      return acc;
    }, {} as Record<number, { cellWidth: number }>),
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(fileName);
}

/** Generate a single-record detail PDF (label/value layout) and trigger download. */
export function exportDetailPdf(
  title: string,
  subtitle: string,
  fields: { label: string; value: string }[],
  fileName: string
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  drawHeader(doc, title, subtitle);

  autoTable(doc, {
    startY: 52,
    head: [['Elemen', 'Isi']],
    body: fields.map((f) => [f.label, f.value || '—']),
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', valign: 'top' },
    headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 249, 252] },
    columnStyles: { 0: { cellWidth: 55, fontStyle: 'bold', textColor: NAVY }, 1: { cellWidth: 'auto' } },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(fileName);
}
