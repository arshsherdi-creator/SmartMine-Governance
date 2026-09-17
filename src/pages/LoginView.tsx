import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PREDEFINED_USERS } from '../types';
import {
  Pickaxe,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentUser, showToast } = useApp();
  const [selectedUser, setSelectedUser] = useState(PREDEFINED_USERS[0]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(selectedUser);
    showToast('success', 'Authentication Successful', `Welcome, ${selectedUser.name} (${selectedUser.roleTitle})`);
    onLoginSuccess();
  };

  const handleQuickRoleSelect = (user: typeof PREDEFINED_USERS[0]) => {
    setSelectedUser(user);
    setCurrentUser(user);
    showToast('success', 'Logged In as Persona', `Welcome, ${user.name}`);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-700 text-white shadow-md mb-1">
            <Pickaxe className="w-7 h-7 text-amber-400" />
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            Government of India • Ministry of Coal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SmartMine Governance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            AI-Powered Statutory Compliance, DGMS Section 22 Oversight & Geotechnical Risk Intelligence Platform
          </p>
        </div>

        {/* Persona Quick Selection for Hackathon / Evaluation */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Demonstration Evaluation Persona:
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                One-Click Sign-In
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any statutory or operational role to test specific view permissions and workflows:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PREDEFINED_USERS.map(user => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickRoleSelect(user)}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                  selectedUser.id === user.id
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{user.name}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {user.department.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {user.roleTitle}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-2">
                  {user.permissions.length} Statutory Permissions
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleSignIn}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Enter Portal as {selectedUser.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Compliant with DGMS CMR 2017 & ISO 19011 Audit Security Standards</span>
        </div>
      </div>
    </div>
  );
};
