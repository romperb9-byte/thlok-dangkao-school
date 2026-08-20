import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  School, ShieldAlert, Award, UserCheck, GraduationCap, 
  Menu, Building2, LogOut, KeyRound 
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    cluster, schools, activeSchoolId, activeSchool, setActiveSchoolId,
    currentUser, currentUserRole, logout, setShowAccountsModal, teachers 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'cluster_head':
        return <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ប្រធានកម្រង</span>;
      case 'principal':
        return <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">នាយកសាលា</span>;
      case 'teacher':
        return <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">គ្រូបង្រៀន</span>;
      case 'student':
        return <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">សិស្ស</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 md:py-0 min-h-[4.2rem] gap-2">
          
          {/* Brand & Organization Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
                title="បើកមឺនុយ"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <School className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {cluster.nameKh}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• {cluster.district}</span>
                </div>
                
                {/* Title Scoped to Role */}
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight mt-0.5 flex items-center gap-1.5">
                  {currentUserRole === 'cluster_head' && (
                    <span>ផ្ទាំងគ្រប់គ្រងកម្រង (៧ សាលារៀន)</span>
                  )}
                  {currentUserRole === 'principal' && (
                    <span>{activeSchool.nameKh} (១០ ថ្នាក់, ១០ គ្រូ)</span>
                  )}
                  {currentUserRole === 'teacher' && (
                    <span>{activeSchool.nameKh} • <strong className="text-emerald-700">{currentTeacher?.homeroomClass || currentUser?.className || 'ថ្នាក់រៀន'} (៥០ សិស្ស)</strong></span>
                  )}
                  {currentUserRole === 'student' && (
                    <span>{activeSchool.nameKh} • <strong className="text-amber-700">{currentUser?.className}</strong></span>
                  )}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2 justify-end">
            
            {/* School Switcher: ONLY VISIBLE TO CLUSTER HEAD */}
            {currentUserRole === 'cluster_head' && (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <select
                  value={activeSchoolId}
                  onChange={(e) => setActiveSchoolId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-blue-950 focus:outline-none max-w-[170px] truncate"
                  title="ជ្រើសរើសសាលាដើម្បីចូលមើល"
                >
                  {schools.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nameKh} {s.isClusterCenter ? '★' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Principal / Teacher School Badge (Read-Only) */}
            {(currentUserRole === 'principal' || currentUserRole === 'teacher') && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeSchool.nameKh}</span>
              </div>
            )}

            {/* Accounts Directory Button */}
            <button
              onClick={() => setShowAccountsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="បើកតារាងគណនីទាំងអស់"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">តារាងគណនី</span>
            </button>

            {/* Logged in User Profile Pill */}
            {currentUser && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl pl-2 pr-1 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentUser.avatarIcon || '👤'}</span>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.displayName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {getRoleBadge(currentUser.role)}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors ml-1"
                  title="ចាកចេញពីប្រព័ន្ធ (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
