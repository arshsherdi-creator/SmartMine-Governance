import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Shield, SearchCheck, AlertOctagon, FileCheck, Users, Pickaxe, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    mines,
    compliance,
    inspections,
    correctiveActions,
    incidents,
    contractors,
    setActiveTab,
    setSelectedMineId
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredMines = q
    ? mines.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.state.toLowerCase().includes(q))
    : [];

  const filteredCompliance = q
    ? compliance.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.regulatoryAuthority.toLowerCase().includes(q))
    : [];

  const filteredInspections = q
    ? inspections.filter(i => i.code.toLowerCase().includes(q) || i.title.toLowerCase().includes(q) || i.inspectorName.toLowerCase().includes(q))
    : [];

  const filteredCAPA = q
    ? correctiveActions.filter(ca => ca.code.toLowerCase().includes(q) || ca.title.toLowerCase().includes(q) || ca.responsiblePerson.toLowerCase().includes(q))
    : [];

  const filteredIncidents = q
    ? incidents.filter(inc => inc.code.toLowerCase().includes(q) || inc.type.toLowerCase().includes(q) || inc.description.toLowerCase().includes(q))
    : [];

  const totalResults =
    filteredMines.length +
    filteredCompliance.length +
    filteredInspections.length +
    filteredCAPA.length +
    filteredIncidents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search mines, statutory rules (CMR 153, 106), CAPA codes, incidents..."
            className="w-full text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p className="font-semibold text-slate-600 dark:text-slate-300">Quick Jump Navigation</p>
              <p className="mt-1">Type keywords such as "Methane", "Eastern Valley", "CAPA", "DGMS", or "Inspection"</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['Bharat Coal', 'Eastern Valley', 'CMR 153', 'Methane', 'Section 22', 'Slope Stability', 'Overdue'].map(chip => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Mines */}
              {filteredMines.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Mines</div>
                  <div className="space-y-1">
                    {filteredMines.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMineId(m.id);
                          setActiveTab('dashboard');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Pickaxe className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{m.name}</span>
                          <span className="text-[10px] text-slate-500">({m.type}, {m.state})</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          m.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-700' :
                          m.riskLevel === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          Risk {m.riskScore}/100 ({m.riskLevel})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance */}
              {filteredCompliance.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Statutory Compliance</div>
                  <div className="space-y-1">
                    {filteredCompliance.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('compliance');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{c.code}: {c.title}</div>
                            <div className="text-[10px] text-slate-500">{c.mineName} • Due: {c.dueDate}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrective Actions */}
              {filteredCAPA.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Corrective Actions (CAPA)</div>
                  <div className="space-y-1">
                    {filteredCAPA.map(ca => (
                      <div
                        key={ca.id}
                        onClick={() => {
                          setActiveTab('corrective-actions');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="w-4 h-4 text-amber-600" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{ca.code}: {ca.title}</div>
                            <div className="text-[10px] text-slate-500">{ca.mineName} • {ca.responsiblePerson}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          {ca.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspections */}
              {filteredInspections.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Inspections</div>
                  <div className="space-y-1">
                    {filteredInspections.map(i => (
                      <div
                        key={i.id}
                        onClick={() => {
                          setActiveTab('inspections');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <SearchCheck className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{i.code}: {i.title}</div>
                            <div className="text-[10px] text-slate-500">{i.mineName} • Inspector: {i.inspectorName}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                          {i.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
