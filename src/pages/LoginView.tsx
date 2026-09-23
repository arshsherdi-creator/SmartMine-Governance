import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_ACCOUNTS, UserRole } from '../types';
import {
  Pickaxe,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Sun,
  Moon,
  CheckCircle2,
  Building2,
  FileCheck,
  Activity,
  HardHat
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, isDarkMode, toggleDarkMode, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your User ID or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Find matching demo account by demoEmail or email or username
      const matched = DEMO_ACCOUNTS.find(
        u =>
          u.demoEmail.toLowerCase() === trimmedEmail.toLowerCase() ||
          u.email.toLowerCase() === trimmedEmail.toLowerCase() ||
          u.role.toLowerCase() === trimmedEmail.toLowerCase()
      );

      // Call backend API if available, or fallback to direct client demo login
      let authSuccessful = false;
      let authenticatedUser = matched;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          authSuccessful = true;
          authenticatedUser = data.user;
        } else if (!res.ok) {
          setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
          setLoading(false);
          return;
        }
      } catch (networkErr) {
        // Backend fallback for demo mode
        if (matched) {
          authSuccessful = true;
        }
      }

      if (authSuccessful && authenticatedUser) {
        await login(authenticatedUser.email, authenticatedUser.role);
        showToast(
          'success',
          'Authentication Successful',
          `Welcome, ${authenticatedUser.name} (${authenticatedUser.roleTitle})`
        );
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrorMessage(
          'Invalid User ID or Password. For demonstration, select one of the 6 seeded demo accounts below.'
        );
      }
    } catch (err: any) {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoAccount = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedDemoRole(account.role);
    setEmail(account.demoEmail);
    setPassword('demo123');
    setErrorMessage(null);

    setLoading(true);
    // Simulate brief authentication network handshake
    setTimeout(async () => {
      try {
        await login(account.demoEmail, account.role);
        showToast(
          'success',
          'Demo Session Authenticated',
          `Logged in as ${account.name} • Role: ${account.roleTitle}`
        );
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'mine_official':
        return HardHat;
      case 'inspector':
        return FileCheck;
      case 'corporate':
        return Building2;
      case 'regulatory':
        return Activity;
      case 'contractor':
        return Pickaxe;
      default:
        return Shield;
    }
  };

  return (
    <div className="min-h-screen min-h-full w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      {/* Top Header Bar with Theme Toggle */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 px-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <Pickaxe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              SMARTMINE GOVERNANCE
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Hackathon Prototype — Problem Statement 26024
            </div>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="login-theme-toggle"
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2 text-xs font-medium"
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dual-Column Content */}
      <div className="max-w-7xl w-full mx-auto my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT / MAIN AREA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Statutory Production & Safety Oversight
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                SMARTMINE GOVERNANCE
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-blue-400">
                AI-Powered Governance & Compliance Monitoring System
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Centralized governance, compliance monitoring and risk intelligence for coal mining operations.
              </p>
            </div>

            {/* Core Capability Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DGMS CMR 2017 & Section 22</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Automated tracking of mandatory safety regulations, statutory orders and court prohibitions.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Role-Based Access Control</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Strict segregation of duties across Ministry, DGMS, Mine GMs, CPCB, and Contractors.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Trust RBAC Enforcement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Immutable Audit Logging</span>
              </div>
            </div>
          </div>

          {/* RIGHT / CARD AREA: Sign In & Demo Login */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-md space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Sign In
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter your statutory credentials or choose a demonstration persona
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Authentication Notice: </span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    User ID / Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-email"
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. mine.official@smartmine.demo"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your security password"
                      className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-sign-in"
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Session...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* DEMO LOGIN SECTION */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>DEMO ACCOUNTS (Prototype Evaluation)</span>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    1-Click Auto Fill
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select any seeded persona to test role-specific dashboards, permissions, and sidebar menus:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map(account => {
                    const RoleIcon = getRoleIcon(account.role);
                    const isSelected = selectedDemoRole === account.role;

                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleSelectDemoAccount(account)}
                        disabled={loading}
                        className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 text-xs ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-850/60'
                        }`}
                      >
                        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5">
                          <RoleIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {account.roleTitle}
                          </div>
                          <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 truncate">
                            {account.demoEmail}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {account.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Prototype Disclaimer */}
            <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 px-4 space-y-1">
              <p>
                <strong>Evaluation Notice:</strong> Demonstration prototype utilizing synthetic data records. Does NOT represent actual operational figures of Coal India Limited, DGMS, or CPCB.
              </p>
              <p className="text-[10px]">
                Compliant with ISO/IEC 27001 Access Controls & Mines Act 1952 Statutory Framework
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Statutory Credential Reset</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Centralized IT Governance Cell
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with DGMS Cyber Security Directives and Ministry of Coal IT Governance policies, online self-service password reset is disabled for high-authority statutory accounts.
            </p>

            <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 font-mono">
              <div className="text-slate-500 dark:text-slate-400">Statutory IT Helpdesk:</div>
              <div className="text-blue-700 dark:text-blue-400 font-semibold">
                admin.gov@smartmine.gov.in
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                Demo Default Password: <strong className="text-slate-800 dark:text-slate-200">demo123</strong>
              </div>
            </div>

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl w-full mx-auto text-center text-xs text-slate-400 dark:text-slate-500 py-3 border-t border-slate-200 dark:border-slate-800 mt-4">
        SMARTMINE GOVERNANCE • Hackathon Prototype (Problem Statement ID: 26024) • Fictional Demonstration Data for Evaluation
      </div>
    </div>
  );
};
