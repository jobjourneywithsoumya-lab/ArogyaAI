import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { APP_NAME } from '../constants/brand';

const BRAND = APP_NAME;
const BRAND_COLOR = [13, 148, 136];

const buildQrPayload = (data) =>
  JSON.stringify({
    app: BRAND,
    patient: data.patientName,
    diagnosis: data.diagnosis,
    doctor: data.doctorRecommendation,
    date: new Date().toISOString(),
    verify: `https://arogyaai.app/verify/${Date.now()}`,
  });

export async function generateHealthReportPDF({
  patientName = 'Patient',
  symptoms = [],
  diagnosis = '',
  medicines = [],
  doctorRecommendation = '',
  precautions = [],
  severity = 'Moderate',
  reportId = null,
}) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const id = reportId || `AR-${Date.now().toString(36).toUpperCase()}`;

  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(BRAND, 14, 18);
  doc.setFontSize(10);
  doc.text('Official AI Health Report', 14, 26);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(`Date: ${date}`, 150, 18);
  doc.text(`Patient: ${patientName}`, 150, 26);
  doc.setFontSize(9);
  doc.text(`Report ID: ${id}`, 150, 32);

  let y = 48;
  const section = (title, body) => {
    doc.setFillColor(240, 253, 250);
    doc.rect(14, y - 4, 182, 8, 'F');
    doc.setFontSize(12);
    doc.setTextColor(...BRAND_COLOR);
    doc.text(title, 16, y + 2);
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(String(body || 'N/A'), 175);
    doc.text(lines, 16, y);
    y += lines.length * 5 + 8;
  };

  section('Symptoms', Array.isArray(symptoms) ? symptoms.join(', ') : symptoms);
  section('AI Diagnosis', diagnosis || 'Pending analysis');
  section('Severity Level', severity);
  section('Recommended Medicines', medicines.length ? medicines.join('\n') : 'Consult pharmacist');
  section('Doctor Recommendation', doctorRecommendation || 'General Physician');
  if (precautions.length) {
    section('Precautions & Recovery', precautions.join('\n'));
  }

  try {
    const qrDataUrl = await QRCode.toDataURL(
      buildQrPayload({ patientName, diagnosis, doctorRecommendation }),
      { width: 200, margin: 1, color: { dark: '#0d9488', light: '#ffffff' } }
    );
    const qrY = y + 4;
    doc.setDrawColor(...BRAND_COLOR);
    doc.rect(14, qrY, 44, 44);
    doc.addImage(qrDataUrl, 'PNG', 16, qrY + 2, 40, 40);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('Scan QR for digital record', 62, qrY + 18);
    doc.setFontSize(8);
    doc.text('Verified by ArogyaAI Secure Health Vault', 62, qrY + 26);
    y = qrY + 52;
  } catch (err) {
    console.error('QR generation failed:', err);
    doc.setFontSize(8);
    doc.text('QR unavailable — Report ID: ' + id, 14, y + 10);
    y += 20;
  }

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${BRAND} — Confidential Medical Document`, 14, 285);

  doc.save(`${BRAND}_Health_Report_${Date.now()}.pdf`);
  return doc;
}

export function printHealthReport(elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>${BRAND} Report</title></head><body>${el.innerHTML}</body></html>`);
  win.document.close();
  win.print();
}
