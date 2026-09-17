import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Moon,
  Sun,
  Search,
  Bell,
  Check,
  ShieldCheck,
  User,
  LogOut,
  HelpCircle,
  Menu,
  ChevronDown,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    currentUser,
    setCurrentRole,
    setIsSearchOpen,
    setIsGuideOpen,
    notifications,
    setActiveTab,
    logout
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ROLES: { id: UserRole; title: string; desc: string }[] = [
    { id: 'admin', title: 'System Administrator', desc: 'Full IT governance & system settings' },
    { id: 'mine_official', title: 'Mine Official', desc: 'General Manager operational oversight' },
    { id: 'inspector', title: 'Field Officer / Inspector', desc: 'DGMS safety audits & inspections' },
    { id: 'corporate', title: 'Corporate Management', desc: 'Coal India executive analytics' },
    { id: 'regulatory', title: 'Regulatory Authority', desc: 'DGMS / CPCB statutory audit' },
    { id: 'contractor', title: 'Contractor', desc: 'Heavy machinery & haulage compliance' }
  ];

  return (
    <header className="shrink-0 sticky top-0 z-30 h-16 bg-slate-900 border-b border-slate-800 text-white shadow-md flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger + Emblem / Wordmark */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Emblem Crest */}
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow border border-blue-400/30 group-hover:border-blue-300 transition-all">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-white">SMARTMINE</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-800/80 text-blue-200 border border-blue-700/50 uppercase tracking-wide font-semibold">
                GOVERNANCE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight truncate max-w-[200px] sm:max-w-xs">
              AI-Powered Governance & Compliance Monitoring System
            </p>
          </div>
        </div>

        {/* Demo environment pill */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className="hidden md:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-300 text-[11px] font-semibold transition-colors"
          title="Click to view 11-step Hackathon Judge Walkthrough"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>DEMO ENVIRONMENT (PS ID: 26024)</span>
        </button>
      </div>

      {/* Center: Global Search trigger */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search operational records"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search mines, statutory clauses, inspections, CAPA...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Notifications, Role indicator, Judge guide, Crescent Moon/Sun Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="lg:hidden p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Open search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View system alerts and notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-900 dark:text-slate-100">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Statutory Alerts & Notices
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setActiveTab(notif.linkTarget);
                      setIsNotifOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{notif.timestamp.slice(11)}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActiveTab('alerts');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View Centralized Escalation Inbox →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher for Judges */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Switch User Role Perspective"
            title="Switch User Role Perspective"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-xs hidden sm:inline">{currentUser.roleTitle.split(' ')[0]}</span>
            <span className="text-[10px] text-slate-400 hidden md:inline">({currentUser.role.toUpperCase()})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-slate-900 dark:text-slate-100">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                Select Active Role (RBAC)
              </div>
              {ROLES.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setIsRoleOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    currentUser.role === r.id ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">{r.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.desc}</div>
                  </div>
                  {currentUser.role === r.id && <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Judge Guide Walkthrough Button */}
        <button
          onClick={() => setIsGuideOpen(true)}
          className="p-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open 11-step Judge Walkthrough Guide"
          title="11-Step Evaluation Flow"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* VERY IMPORTANT MANDATED THEME TOGGLE (TOP-RIGHT CORNER WITH CRESCENT MOON) */}
        {/* ========================================================================= */}
        <button
          id="theme-toggle-button"
          onClick={toggleDarkMode}
          className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 flex items-center justify-center shadow-sm"
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDarkMode ? 'Active: Dark Mode (Click for Light Mode)' : 'Active: Light Mode (Click for Dark Mode)'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-blue-200" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded hover:bg-slate-800 focus:outline-none"
            aria-label="User profile and session options"
          >
            <div className="w-7 h-7 rounded-full bg-blue-700 border border-blue-400/40 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-900 dark:text-slate-100">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                  {currentUser.roleTitle}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('users-roles');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Role Permissions & Access Matrix</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('system-settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Demo Controls & Reset Data</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
