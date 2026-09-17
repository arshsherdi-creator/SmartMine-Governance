import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatutoryDocument } from '../types';
import {
  FileText,
  Upload,
  Sparkles,
  FileCheck,
  Calendar,
  Building,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Download,
  Search
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, mines, showToast, refreshData } = useApp();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<StatutoryDocument | null>(null);

  // Upload Form states
  const [docTitle, setDocTitle] = useState('DGMS Formal Prohibitive Order under Section 22(1) - Highwall Bench 4');
  const [selectedMineId, setSelectedMineId] = useState(mines[0]?.id || '');
  const [rawText, setRawText] = useState(
    `GOVERNMENT OF INDIA\nMINISTRY OF LABOUR & EMPLOYMENT\nDIRECTORATE GENERAL OF MINES SAFETY (DGMS)\nEASTERN ZONE, DHANBAD\n\nRef No: DGMS/EZ/SZ/2026/S22-094\nDated: 12th February 2026\n\nTo:\nThe Agent & Colliery Manager\nEastern Valley Open Cast Coal Mine\nEastern Coalfields Limited\n\nSUBJECT: PROHIBITIVE ORDER UNDER SECTION 22(1) OF THE MINES ACT, 1952 REGARDING INSTABILITY OF OVERBURDEN BENCH 4\n\nWhereas during geotechnical audit on 10/02/2026, severe tension cracks exceeding 18mm with ground displacement rate of 4.2mm/day were recorded by Slope Stability Radar on the North-Eastern sector of Overburden Bench 4.\n\nAND WHEREAS this condition poses imminent danger to the safety of heavy earth moving machinery (HEMM) and workmen deployed in the active pit;\n\nNOW THEREFORE, I, Deputy Director of Mines Safety, Eastern Zone, in exercise of powers conferred under Section 22(1) of the Mines Act, 1952, do hereby PROHIBIT extraction, coal hauling, or deployment of any men or machinery on Overburden Bench 4 with immediate effect until:\n1. Complete geotechnical de-stressing and buttressing is certified by CMPDI/CIMFR.\n2. Continuous radar slope stability telemetry is re-benchmarked and verified.\n\nSigned,\nEr. R. K. Mahapatra\nDeputy Director of Mines Safety (Mining)`
  );
  const [isExtracting, setIsExtracting] = useState(false);

  const SAMPLE_DOCS = [
    {
      title: 'DGMS Section 22(1) Prohibitive Notice',
      text: `GOVERNMENT OF INDIA\nDIRECTORATE GENERAL OF MINES SAFETY (DGMS)\nEASTERN ZONE, DHANBAD\n\nRef No: DGMS/EZ/SZ/2026/S22-094\nDated: 12th February 2026\n\nORDER UNDER SECTION 22(1) OF THE MINES ACT, 1952\nTo: The Agent, Eastern Valley Open Cast Mine.\n\nDue to observed 18mm tension crack separation on Overburden Bench 4, all mining extraction and shovel operations on Bench 4 are hereby PROHIBITED with immediate effect until geotechnical stability is certified by CIMFR.`
    },
    {
      title: 'MoEFCC Environmental Clearance Extension',
      text: `MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE (MoEFCC)\nIMPACT ASSESSMENT DIVISION, NEW DELHI\n\nF. No. J-11015/42/2024-IA.II(M)\nDated: 08 January 2026\n\nSubject: Environmental Clearance (EC) for expansion of Bharat Coal Mine Alpha from 4.0 MTPA to 5.5 MTPA.\n\nEnvironmental Clearance is granted subject to strict installation of Continuous Ambient Air Quality Monitoring Systems (CAAQMS) for PM10 and PM2.5, green belt tree plantation along leasehold perimeter, and Zero Liquid Discharge (ZLD) effluent compliance.`
    },
    {
      title: 'DGMS Tele-monitoring Calibration Approval',
      text: `GOVERNMENT OF INDIA\nDIRECTORATE GENERAL OF MINES SAFETY\nCENTRAL ZONE\n\nRef: DGMS/TECH/CIRCULAR/CMR153-2026\nDated: 02 February 2026\n\nCertification of Compliance under Coal Mines Regulations 2017 Regulation 153:\nThis certifies that the methane continuous tele-monitoring sensors installed at Godavari Seam meet statutory intrinsically safe standards (DGMS Approved Type Ex-ia). Mandatory bi-weekly sensor recalibration records must be uploaded to the DGMS portal.`
    }
  ];

  const handleExtractAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      showToast('error', 'Validation Error', 'Document content cannot be empty.');
      return;
    }

    setIsExtracting(true);
    try {
      const res = await fetch('/api/ai/extract-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: rawText,
          title: docTitle,
          mineId: selectedMineId
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Statutory Extraction Complete', `AI successfully extracted metadata: ${data.data.referenceNumber || data.data.title}`);
        setIsUploadOpen(false);
        await refreshData();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast('error', 'Extraction Failed', 'Failed to extract statutory clauses.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              INTELLIGENT STATUTORY OCR & EXTRACTION
            </span>
            <span className="text-xs text-slate-500">Gemini 3.8 Flash Parser</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Statutory Documents & Regulatory Filings Repository
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated legal parsing of DGMS Section 22 orders, MoEFCC clearances, and inspection certificates
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload & Parse Statutory Document</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc: any) => {
          const refNumber = doc.referenceNumber || doc.extractedMetadata?.refNo || doc.id.toUpperCase();
          const issuingAuth = doc.issuingAuthority || doc.extractedMetadata?.issuingAuth || 'Ministry / DGMS';
          const effectiveDate = doc.effectiveDate || doc.extractedMetadata?.issueDate || doc.uploadDate;
          const risk = doc.riskLevel || (doc.status === 'Expired' || doc.status === 'Expiring Soon' ? 'High' : 'Standard');
          const clauses = (doc.extractedClauses && doc.extractedClauses.length > 0)
            ? doc.extractedClauses
            : [doc.extractedMetadata?.keyClause, doc.extractedMetadata?.summary].filter(Boolean);

          let badge = 'bg-blue-100 text-blue-800';
          if (risk === 'Critical') badge = 'bg-rose-600 text-white font-bold';
          else if (risk === 'High') badge = 'bg-amber-500 text-white font-bold';

          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-[11px] text-blue-700 dark:text-blue-400 font-mono">
                    {refNumber}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${badge}`}>
                    {risk}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {doc.title}
                </h3>

                <div className="text-xs text-slate-500 mt-1">
                  {issuingAuth} • {doc.mineName}
                </div>

                {/* AI Extracted statutory clauses */}
                {clauses && clauses.length > 0 && (
                  <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      Extracted Statutory Directives:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                      {clauses.map((clause: string, cIdx: number) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{clause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <span>Effective: {effectiveDate}</span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 transition-colors"
                >
                  View Full Text →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload & Parse Modal (Step 11 in Demo Flow) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Statutory Document Parser (OCR & Rule Extraction)
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Select a statutory sample or paste regulatory text for instant metadata indexing
                </p>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExtractAndSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Quick Sample Selector */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Load Pre-Drafted Regulatory Sample:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_DOCS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDocTitle(s.title);
                        setRawText(s.text);
                      }}
                      className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Document Title *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Mine Leasehold *</label>
                <select
                  value={selectedMineId}
                  onChange={e => setSelectedMineId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
                >
                  {mines.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Document Text / Transcribed OCR Body *
                </label>
                <textarea
                  rows={8}
                  required
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExtracting}
                  className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isExtracting ? 'Extracting with Gemini 3.8 Flash...' : 'Parse & Save into Repository'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedDoc.referenceNumber}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Authority</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoc.issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Mine</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoc.mineName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Effective Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoc.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Risk Classification</span>
                  <span className="font-bold text-rose-600">{selectedDoc.riskLevel}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Statutory Body:
                </span>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono text-[11px] leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
                  {selectedDoc.fileUrl || 'Original document stored in DGMS central archives.'}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
