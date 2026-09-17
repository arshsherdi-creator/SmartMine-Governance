import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIRiskAssessment } from '../types';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Info,
  Building2,
  Compass
} from 'lucide-react';

export const AiRiskCenterView: React.FC = () => {
  const { mines, showToast, setActiveTab } = useApp();
  const [assessments, setAssessments] = useState<AIRiskAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/risk-assessment');
      const data = await res.json();
      if (data.success) {
        setAssessments(data.data);
      }
    } catch (err) {
      showToast('error', 'AI Assessment Error', 'Failed to fetch model risk assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              INTELLIGENT STATUTORY RISK ENGINE
            </span>
            <span className="text-xs text-slate-500">Gemini 3.8 Flash Server-Side Reasoning</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            AI Risk Center & Explainable Governance Scoring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-factor statutory risk synthesis combining geotechnical telemetry, inspection notices, and environmental limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAssessments}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Evaluating Model...' : 'Run Real-Time AI Assessment'}</span>
          </button>
        </div>
      </div>

      {/* Explainable Scoring Methodology Box (Mandated) */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Explainable Risk Scoring Model Architecture</span>
          </div>
          <span className="text-[11px] text-slate-400">DGMS Risk Rating Framework</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The SmartMine risk engine rejects opaque "black-box" outputs in favor of a mathematically verifiable statutory equation:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Overdue Statutory Item</span>
            <span className="text-base font-extrabold text-rose-400">+18 Points each</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">CMR 2017 Reg 153/106 lapse</span>
          </div>
          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Violation Citation</span>
            <span className="text-base font-extrabold text-amber-400">+12 Points each</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">DGMS field audit finding</span>
          </div>
          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Open CAPA Action</span>
            <span className="text-base font-extrabold text-blue-400">+8 Points each</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Unresolved remediation item</span>
          </div>
          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Environmental Limit Exceeded</span>
            <span className="text-base font-extrabold text-purple-400">+15 Points</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">CPCB/SPCB sensor threshold</span>
          </div>
        </div>
      </div>

      {/* AI Risk Assessments Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map(item => {
          let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let barColor = 'bg-emerald-500';
          let ringColor = 'border-slate-200 dark:border-slate-700/80';

          if (item.riskLevel === 'Critical') {
            badgeClass = 'bg-rose-600 text-white border-rose-600';
            barColor = 'bg-rose-500';
            ringColor = 'border-rose-400 dark:border-rose-900 ring-1 ring-rose-300';
          } else if (item.riskLevel === 'High') {
            badgeClass = 'bg-amber-500 text-white border-amber-500';
            barColor = 'bg-amber-500';
            ringColor = 'border-amber-300 dark:border-amber-900';
          } else if (item.riskLevel === 'Medium') {
            badgeClass = 'bg-blue-600 text-white border-blue-600';
            barColor = 'bg-blue-500';
          }

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-800/80 rounded-lg border p-5 shadow-xs flex flex-col justify-between ${ringColor}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {item.mineName}
                    </h3>
                    <span className="text-xs text-slate-400">Assessed: {item.generatedAt}</span>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-0.5 rounded font-extrabold uppercase border ${badgeClass}`}>
                      {item.riskLevel} RISK ({item.riskScore}/100)
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">
                      AI Model Confidence: <span className="text-emerald-500 font-bold">{item.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Score progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${item.riskScore}%` }} />
                </div>

                {/* Statutory Factors Evaluated */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Statutory Contributing Factors:
                  </span>
                  <ul className="space-y-1 text-xs">
                    {item.factors.map((factor, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Explanation */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Model Synthesis & Legal Grounding:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <div className="text-rose-700 dark:text-rose-300 font-semibold mb-2">
                  <span className="font-bold">Recommended Enforcement:</span> {item.recommendedAction}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveTab('corrective-actions')}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                  >
                    Review CAPAs
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Inquire with AI Assistant</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
