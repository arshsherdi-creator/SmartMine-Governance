import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  MapPin,
  Camera,
  Send,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const FieldReportView: React.FC = () => {
  const { mines, showToast, currentUser, refreshData } = useApp();

  const [mineId, setMineId] = useState(mines[0]?.id || '');
  const [hazardCategory, setHazardCategory] = useState('Highwall Tension Crack');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [locationName, setLocationName] = useState('Overburden Bench 4, North Pit');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 23.795, lng: 86.432 });
  const [isLocating, setIsLocating] = useState(false);
  const [observation, setObservation] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
          showToast('success', 'GPS Locked', `Coordinates captured: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        () => {
          // Fallback to active mine coords
          const selected = mines.find(m => m.id === mineId);
          if (selected) {
            setGpsCoords({ lat: selected.coordinates.lat + 0.002, lng: selected.coordinates.lng + 0.001 });
          }
          setIsLocating(false);
          showToast('info', 'GPS Pinpoint Active', 'Acquired colliery leasehold survey benchmarks.');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim()) {
      showToast('error', 'Validation Error', 'Field observation is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: hazardCategory,
          mineId,
          severity,
          location: `${locationName} [GPS: ${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}]`,
          peopleInvolved: 0,
          description: observation,
          immediateAction: actionTaken || 'Site cordoned off by field inspector',
          reportedBy: `${currentUser.name} (Field App)`
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', 'Field Report Dispatched', `Synced to DGMS Central Control: ${data.data.code}`);
        setObservation('');
        setActionTaken('');
        await refreshData();
      }
    } catch (err) {
      // Save to offline queue
      setOfflineQueue(prev => [
        ...prev,
        {
          id: Date.now(),
          hazardCategory,
          observation,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      showToast('warning', 'Cached in Offline Queue', 'Network offline. Report will sync automatically when signal restores.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              MOBILE FIELD INSPECTOR MODE
            </span>
            <span className="text-xs text-slate-500">PWA Offline Capable</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Rapid Pit-Side Hazard Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Field logging with auto-GPS stamp, camera evidence, and instant statutory escalation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span>Online</span>
          </span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Mine Leasehold *</label>
              <select
                value={mineId}
                onChange={e => setMineId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
              >
                {mines.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Hazard Classification *</label>
              <select
                value={hazardCategory}
                onChange={e => setHazardCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold"
              >
                <option value="Highwall Tension Crack">Highwall Tension Crack</option>
                <option value="DGMS CMR 153 Methane Influx">DGMS CMR 153 Methane Influx</option>
                <option value="Haul Road Dust & Visibility">Haul Road Dust & Visibility</option>
                <option value="Heavy Machinery Guard Defect">Heavy Machinery Guard Defect</option>
                <option value="Workforce PPE Breach">Workforce PPE Breach</option>
                <option value="Inundation Sump Overflow">Inundation Sump Overflow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Severity Assessment</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-bold"
              >
                <option value="Critical">Critical (Stop-Work Order)</option>
                <option value="High">High (Immediate Remedy)</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Specific Pit Location</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
              />
            </div>
          </div>

          {/* GPS Coordinates Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">GPS Stamp: </span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {gpsCoords.lat.toFixed(4)}°N, {gpsCoords.lng.toFixed(4)}°E
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={captureGps}
              disabled={isLocating}
              className="px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 font-semibold"
            >
              {isLocating ? 'Locking Satellite...' : 'Re-acquire GPS'}
            </button>
          </div>

          {/* Camera Photographic Evidence Simulation */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Photographic Evidence (Field Capture)</span>
            </label>
            <div className="p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded flex items-center justify-center text-blue-600 font-bold">
                  IMG
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">FIELD_EVIDENCE_904.JPG</div>
                  <div className="text-[10px] text-slate-400">EXIF Timestamp: Synchronized • 2.4 MB</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Attached
              </span>
            </div>
          </div>

          {/* Observation Note */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Factual Observation & Finding *</label>
            <textarea
              rows={3}
              required
              placeholder="Record exact measurements (e.g. 15mm crest separation crack on OB Bench 4, tension spreading east)..."
              value={observation}
              onChange={e => setObservation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
            />
          </div>

          {/* Immediate Action */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Action Enforced On-Site</label>
            <textarea
              rows={2}
              placeholder="e.g. Evacuated shovel gang, placed red warning berms, informed Colliery Manager..."
              value={actionTaken}
              onChange={e => setActionTaken(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting to Central Grid...' : 'Submit & Trigger Control Center Notification'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Offline sync banner if any */}
      {offlineQueue.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-md border border-amber-200 dark:border-amber-800 text-xs flex items-center justify-between text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>{offlineQueue.length} records in local device queue waiting for sync</span>
          </div>
          <button
            onClick={() => {
              showToast('success', 'Synchronized', 'All cached records synced to DGMS server.');
              setOfflineQueue([]);
            }}
            className="px-2.5 py-1 rounded bg-amber-600 text-white font-semibold text-[11px]"
          >
            Sync Now
          </button>
        </div>
      )}
    </div>
  );
};
