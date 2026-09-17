import React from 'react';
import { useApp } from '../context/AppContext';
import { PREDEFINED_USERS } from '../types';
import {
  Users,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const UsersRolesView: React.FC = () => {
  const { currentUser, setCurrentUser, setCurrentRole, showToast } = useApp() as any;

  const handleSelectRole = (user: typeof PREDEFINED_USERS[0]) => {
    if (setCurrentUser) setCurrentUser(user);
    if (setCurrentRole) setCurrentRole(user.role);
    showToast('info', 'Identity Switched', `Now operating as ${user.name} (${user.roleTitle})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/80 p-5 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            ROLE-BASED ACCESS CONTROL (RBAC)
          </span>
          <span className="text-xs text-slate-500">Mines Act Statutory Authority Delegation</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Users, Statutory Personas & Access Permissions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between regulatory and operational roles to experience specialized permissions and audit identities
        </p>
      </div>

      {/* Role Switcher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PREDEFINED_USERS.map(user => {
          const isActive = currentUser.id === user.id;

          return (
            <div
              key={user.id}
              onClick={() => handleSelectRole(user)}
              className={`bg-white dark:bg-slate-800/80 rounded-lg border p-5 shadow-xs cursor-pointer transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                    {user.department}
                  </span>
                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-700 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Session
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {user.roleTitle}
                </div>

                {/* Permissions pills */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Statutory Delegated Permissions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((perm, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(user);
                  }}
                  className={`w-full py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isActive ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Current Identity</span>
                    </>
                  ) : (
                    <>
                      <span>Switch to this Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
