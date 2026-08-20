import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserAccount, UserRole } from '../../types';
import { X, Search, KeyRound, ShieldAlert, Award, UserCheck, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';

export const AccountsDirectory: React.FC = () => {
  const { accounts, showAccountsModal, setShowAccountsModal, switchAccount, currentUser } = useSchool();
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!showAccountsModal) return null;

  const filteredAccounts = accounts.filter(acc => {
    const matchRole = roleFilter === 'all' || acc.role === roleFilter;
    const matchSearch =
      acc.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.schoolName && acc.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.className && acc.className.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchRole && matchSearch;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'cluster_head':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">ប្រធានកម្រង</span>;
      case 'principal':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">នាយកសាលា</span>;
      case 'teacher':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">គ្រូបង្រៀន</span>;
      case 'student':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">សិស្ស</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">តារាងគណនី និងលេខកូដសម្ងាត់ (Accounts Directory)</h3>
              <p className="text-xs text-blue-200">ចុចប៊ូតុង "Login ភ្លាមៗ" លើគណនីណាមួយដើម្បីចូលប្រើប្រាស់</p>
            </div>
          </div>
          <button
            onClick={() => setShowAccountsModal(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះ, Username, សាលា, ថ្នាក់..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                ទាំងអស់ ({accounts.length})
              </button>
              <button
                onClick={() => setRoleFilter('cluster_head')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'cluster_head'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                ប្រធានកម្រង
              </button>
              <button
                onClick={() => setRoleFilter('principal')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'principal'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                នាយក ៧ សាលា
              </button>
              <button
                onClick={() => setRoleFilter('teacher')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'teacher'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                គ្រូបង្រៀន
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  roleFilter === 'student'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                សិស្ស
              </button>
            </div>
          </div>
        </div>

        {/* Table of Accounts */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">តួនាទី</th>
                <th className="py-2.5 px-3">ឈ្មោះអ្នកប្រើប្រាស់</th>
                <th className="py-2.5 px-3">Username (ឈ្មោះគណនី)</th>
                <th className="py-2.5 px-3">Password</th>
                <th className="py-2.5 px-3">សាលារៀន / ថ្នាក់</th>
                <th className="py-2.5 px-3 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;

                return (
                  <tr
                    key={acc.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      isCurrent ? 'bg-blue-50/80 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getRoleBadge(acc.role)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{acc.avatarIcon}</span>
                        <span>{acc.displayName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{acc.titleKh}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {acc.username}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {acc.password || '123'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div>{acc.schoolName || 'ទូទាំងកម្រង'}</div>
                      {acc.className && (
                        <span className="text-[10px] text-blue-600 font-semibold">{acc.className}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>កំពុងប្រើ</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => switchAccount(acc)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg shadow-xs transition-all active:scale-95"
                        >
                          <span>Login ភ្លាមៗ</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>បង្ហាញសរុប {filteredAccounts.length} គណនី</span>
          <button
            onClick={() => setShowAccountsModal(false)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
