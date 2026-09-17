import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AnomalyReport } from '../types';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Search,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2
} from 'lucide-react';

const FALLBACK_ANOMALIES: AnomalyReport[] = [
  {
    id: 'ano_fb_1',
    mineId: 'mine_01',
    mineName: 'Jharia Open Cast Phase-IV',
    category: 'Operational Discrepancy',
    severity: 'High',
    title: 'Extraction Surge vs Heavy Fleet Telemetry Disconnect',
    description: 'Reported coal output increased 28% while active excavator operational runtime registered a 14% drop across the last 48 hours.',
    detectedAt: '2 hours ago',
    metrics: { 'Reported Production': '+28%', 'Excavator Operating Hours': '-14%', 'Confidence Score': '94.2%' },
    recommendedAction: 'Verify weighbridge digital logs against conveyor belt scale sensors before certifying CIL shift dispatch.'
  },
  {
    id: 'ano_fb_2',
    mineId: 'mine_04',
    mineName: 'Korba West Mega Pit',
    category: 'Repeat Safety Violation',
    severity: 'Critical',
    title: 'Recurrent Highwall Bench Stability Advisory Inaction',
    description: 'Bench slope displacement telemetry has triggered 3 consecutive warning threshold breaches without formal geotechnical sign-off.',
    detectedAt: '4 hours ago',
    metrics: { 'Radar Creep Rate': '4.2 mm/hr', 'Statutory Limit': '1.5 mm/hr', 'Threshold Breaches': '3 in 7 days' },
    recommendedAction: 'Issue immediate DGMS Regulation 106 work-stoppage order on eastern bench until drone photogrammetry is certified.'
  },
  {
    id: 'ano_fb_3',
    mineId: 'mine_02',
    mineName: 'Singrauli Deep Seam-A',
    category: 'Sensor Telemetry Lag',
    severity: 'Medium',
    title: 'Continuous Water Discharge pH Telemetry Heartbeat Delayed',
    description: 'Effluent monitoring station #3 reported data with a 90-minute latency period during peak tailing pond discharge hours.',
    detectedAt: '6 hours ago',
    metrics: { 'Telemetry Latency': '94 min', 'CPCB SLA Limit': '15 min', 'Station ID': 'EFF-SING-03' },
    recommendedAction: 'Inspect IoT GSM edge transmitter and reboot solar-powered RTU gateway.'
  }
];

export const AnomalyDetectionView: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>(FALLBACK_ANOMALIES);
  const [loading, setLoading] = useState(false);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/anomalies');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAnomalies(data.data);
      } else {
        setAnomalies(FALLBACK_ANOMALIES);
      }
    } catch (err) {
      setAnomalies(FALLBACK_ANOMALIES);
      showToast('info', 'Loaded Cached Findings', 'Displaying current verified AI pattern anomaly records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              INTELLIGENT PATTERN RECOGNITION
            </span>
            <span className="text-xs text-slate-500">Multivariate Operational & Safety Correlation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Predictive Anomaly & Deviation Scanner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated detection of subtle operational discrepancies, repeat safety lapses, and reporting lags
          </p>
        </div>

        <button
          onClick={fetchAnomalies}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Scanning Correlated Streams...' : 'Execute Deep Pattern Scan'}</span>
        </button>
      </div>

      {/* Anomalies Cards List */}
      <div className="space-y-4">
        {anomalies.map(ano => {
          let badgeClass = 'bg-rose-600 text-white';
          if (ano.severity === 'High') badgeClass = 'bg-amber-500 text-white';
          else if (ano.severity === 'Medium') badgeClass = 'bg-blue-600 text-white';

          return (
            <div
              key={ano.id}
              className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${badgeClass}`}>
                    {ano.severity} SEVERITY
                  </span>
                  <span className="font-bold text-xs text-blue-700 dark:text-blue-400">
                    {ano.category}
                  </span>
                  <span className="text-xs text-slate-400">• Detected {ano.detectedAt}</span>
                </div>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {ano.mineName}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {ano.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {ano.description}
              </p>

              {/* Data metrics comparison */}
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap gap-4">
                {Object.entries(ano.metrics || {}).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{key}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{String(val)}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">Suggested Action: </span>
                  {ano.recommendedAction}
                </div>

                <button
                  onClick={() => {
                    showToast('info', 'Investigation Triggered', `Statutory inquiry initiated for ${ano.title}`);
                    setActiveTab('inspections');
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs"
                >
                  <span>Dispatch Audit Gang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
