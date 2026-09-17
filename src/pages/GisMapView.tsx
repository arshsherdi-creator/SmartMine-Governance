import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mine } from '../types';
import {
  Map,
  MapPin,
  Layers,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Compass,
  Building,
  Pickaxe,
  X
} from 'lucide-react';

export const GisMapView: React.FC = () => {
  const { mines, setActiveTab, setSelectedMineId } = useApp();

  const [selectedMine, setSelectedMine] = useState<Mine | null>(mines[0] || null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterSubsidiary, setFilterSubsidiary] = useState<string>('all');
  const [mapLayer, setMapLayer] = useState<'geological' | 'statutory' | 'satellite'>('geological');

  const filteredMines = mines.filter(m => {
    if (filterRisk !== 'all' && m.riskLevel !== filterRisk) return false;
    if (filterSubsidiary !== 'all' && m.subsidiaryId !== filterSubsidiary) return false;
    return true;
  });

  // Calculate coordinates mapping to SVG box (200 - 800 x 100 - 700)
  // India approx: Lat 18 to 26, Lng 78 to 88
  const getCoordinatesPosition = (coords: { lat: number; lng: number }) => {
    const minLng = 78.5;
    const maxLng = 88.0;
    const minLat = 19.5;
    const maxLat = 25.5;

    const x = 120 + ((coords.lng - minLng) / (maxLng - minLng)) * 560;
    const y = 520 - ((coords.lat - minLat) / (maxLat - minLat)) * 420;
    return { x, y };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              GIS GEOSPATIAL INTELLIGENCE
            </span>
            <span className="text-xs text-slate-500">Survey of India & DGMS Spatial Grid</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            GIS Mine Risk & Basin Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Geospatial statutory risk clustering across Damodar Valley, Mahanadi, and Korba coalfields
          </p>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-semibold">
          <button
            onClick={() => setMapLayer('geological')}
            className={`px-3 py-1.5 rounded transition-colors ${
              mapLayer === 'geological' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Coal Basin Grid
          </button>
          <button
            onClick={() => setMapLayer('statutory')}
            className={`px-3 py-1.5 rounded transition-colors ${
              mapLayer === 'statutory' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Statutory Risk Heatmap
          </button>
          <button
            onClick={() => setMapLayer('satellite')}
            className={`px-3 py-1.5 rounded transition-colors ${
              mapLayer === 'satellite' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Topographical
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5" />
          <span>Spatial Filters:</span>
        </div>

        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Risk Categories</option>
          <option value="Critical">Critical Risk (Eastern Valley)</option>
          <option value="High">High Risk (Alpha)</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        <select
          value={filterSubsidiary}
          onChange={e => setFilterSubsidiary(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
        >
          <option value="all">All Subsidiaries (CIL)</option>
          <option value="sub_bccl">Bharat Coking Coal Limited (BCCL)</option>
          <option value="sub_ecl">Eastern Coalfields Limited (ECL)</option>
          <option value="sub_ccl">Central Coalfields Limited (CCL)</option>
          <option value="sub_mcl">Mahanadi Coalfields Limited (MCL)</option>
          <option value="sub_secl">South Eastern Coalfields (SECL)</option>
          <option value="sub_wcl">Western Coalfields Limited (WCL)</option>
        </select>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-400">Critical (&gt;80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">High (65-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">Medium (35-64)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Low (&lt;35)</span>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[540px]">
        {/* SVG GIS Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-lg border border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between p-4">
          {/* Map Title Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-xs border border-slate-800 p-2.5 rounded text-xs text-white">
            <div className="font-bold flex items-center gap-1.5 text-blue-400">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Eastern & Central India Coal Basins</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Active Monitored Mines: {filteredMines.length} Leases
            </div>
          </div>

          {/* Interactive SVG Coal Map */}
          <div className="w-full h-full min-h-[460px] flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-full max-h-[520px]">
              <defs>
                <radialGradient id="basinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                </radialGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid background */}
              <rect width="800" height="600" fill="url(#grid)" />

              {/* State boundaries schematic */}
              <path
                d="M 150 120 Q 300 100 450 130 T 700 200 L 720 380 Q 600 450 480 500 T 220 480 L 150 320 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Major Coal Basins */}
              {/* Damodar Valley Basin */}
              <ellipse cx="560" cy="240" rx="90" ry="50" fill="url(#basinGlow)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
              <text x="560" y="235" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                Damodar Valley Basin (Jharia / Raniganj)
              </text>

              {/* Mahanadi Basin */}
              <ellipse cx="500" cy="380" rx="80" ry="45" fill="url(#basinGlow)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
              <text x="500" y="375" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                Mahanadi Basin (Talcher / Ib)
              </text>

              {/* Korba Basin */}
              <ellipse cx="380" cy="320" rx="70" ry="40" fill="url(#basinGlow)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
              <text x="380" y="315" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                Korba Basin (SECL)
              </text>

              {/* Wardha Valley Basin */}
              <ellipse cx="250" cy="400" rx="60" ry="35" fill="url(#basinGlow)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
              <text x="250" y="395" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">
                Wardha Valley (WCL)
              </text>

              {/* Mine Pins */}
              {filteredMines.map(mine => {
                const pos = getCoordinatesPosition(mine.coordinates);
                const isSelected = selectedMine?.id === mine.id;

                let pinColor = '#10b981'; // green
                if (mine.riskLevel === 'Critical') pinColor = '#ef4444'; // red
                else if (mine.riskLevel === 'High') pinColor = '#f59e0b'; // amber
                else if (mine.riskLevel === 'Medium') pinColor = '#3b82f6'; // blue

                return (
                  <g
                    key={mine.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedMine(mine)}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    {/* Pulsing ring for critical/high */}
                    {(mine.riskLevel === 'Critical' || mine.riskLevel === 'High') && (
                      <circle
                        r="18"
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="2"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      r={isSelected ? '14' : '10'}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="shadow-lg"
                    />

                    {/* Center symbol */}
                    <circle r="3" fill="#ffffff" />

                    {/* Label */}
                    <text
                      y="-16"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="select-none filter drop-shadow"
                    >
                      {mine.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Coordinate status readout */}
          <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800 p-2 rounded text-[10px] text-slate-400 flex items-center justify-between">
            <span>Projection: EPSG:4326 WGS84 • Spatial Resolution: 10m Ground Grid</span>
            <span className="text-emerald-400 font-mono">GPS TELEMETRY ACTIVE</span>
          </div>
        </div>

        {/* Selected Mine Detailed Intelligence Drawer */}
        <div className="bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
          {selectedMine ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                    selectedMine.riskLevel === 'Critical' ? 'bg-rose-600 text-white' :
                    selectedMine.riskLevel === 'High' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {selectedMine.riskLevel} RISK ({selectedMine.riskScore}/100)
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedMine.coordinates.lat.toFixed(3)}°N, {selectedMine.coordinates.lng.toFixed(3)}°E
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1.5">
                  {selectedMine.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedMine.subsidiaryName} • {selectedMine.type} Operation
                </p>
              </div>

              {/* Compliance & Violations stats */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Statutory Compliance</div>
                  <div className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                    {selectedMine.complianceRate}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Active Violations</div>
                  <div className="text-base font-extrabold text-rose-600 mt-0.5">
                    {selectedMine.activeViolations} Citations
                  </div>
                </div>
              </div>

              {/* Monthly Production */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between mb-1 text-[11px]">
                  <span className="text-slate-500">Monthly Extraction</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedMine.monthlyProductionActual.toLocaleString()} / {selectedMine.monthlyProductionTarget.toLocaleString()} MT
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(selectedMine.monthlyProductionActual / selectedMine.monthlyProductionTarget) * 100}%` }}
                  />
                </div>
              </div>

              {/* Geotechnical & Safety Factors */}
              <div className="text-xs space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Leasehold Geotechnical Parameters:
                </span>
                <div className="p-2.5 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Degree of Gassiness:</span>
                    <span className="font-semibold">{selectedMine.type === 'Underground' ? 'Degree III (High Methane)' : 'N/A (Open Cast)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highwall Slope Stability:</span>
                    <span className="font-semibold">{selectedMine.riskLevel === 'Critical' ? 'Unstable (18mm Creep)' : 'Stable (&lt;2mm)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statutory Section 22 Order:</span>
                    <span className={`font-semibold ${selectedMine.riskLevel === 'Critical' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedMine.riskLevel === 'Critical' ? 'ACTIVE on OB Bench 4' : 'None in effect'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setSelectedMineId(selectedMine.id);
                    setActiveTab('compliance');
                  }}
                  className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold text-xs transition-colors shadow-xs"
                >
                  View Mine Statutory Compliance Register →
                </button>
                <button
                  onClick={() => {
                    setSelectedMineId(selectedMine.id);
                    setActiveTab('inspections');
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded font-semibold text-xs transition-colors"
                >
                  Inspect DGMS Audit Logs
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Click any mine pin on the GIS map to load leasehold intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
