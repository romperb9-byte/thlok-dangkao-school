import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  LayoutDashboard, Users, GraduationCap, Calendar, 
  ClipboardCheck, Award, ReceiptText, DatabaseBackup,
  Building2, Sparkles, X, ShieldAlert, BookOpen, KeyRound, LogOut
} from 'lucide-react';

export type TabType = 'cluster' | 'dashboard' | 'students' | 'teachers' | 'classes' | 'attendance' | 'grades' | 'receipts' | 'backup' | 'student_portal';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { 
    students, teachers, classes, activeSchool, currentUser, 
    currentUserRole, setShowAccountsModal, logout 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);
  const teacherClass = classes.find(c => c.id === currentTeacher?.classId || c.name === currentTeacher?.homeroomClass);

  const schoolStudents = students.filter(s => s.schoolId === activeSchool.id);
  const schoolTeachers = teachers.filter(t => t.schoolId === activeSchool.id);
  const myClassStudents = teacherClass ? students.filter(s => s.classId === teacherClass.id) : schoolStudents.slice(0, 50);

  // 1. STUDENT VIEW
  if (currentUserRole === 'student') {
    const studentNavItems = [
      { id: 'student_portal', label: 'ផ្ទាំងផ្ទាល់ខ្លួន (Portal)', icon: GraduationCap },
      { id: 'classes', label: 'កាលវិភាគ 2-1-2', icon: Calendar },
      { id: 'grades', label: 'ពិន្ទុ ១៥ មុខវិជ្ជា', icon: Award },
    ];

    return (
      <>
        {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" />}
        <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
              <span className="font-bold text-slate-800 text-sm">បញ្ជីមឺនុយសិស្ស</span>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-3 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ព័ត៌មានសិស្ស</div>
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); onClose(); }} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3.5 border-t border-slate-100 bg-amber-50/60 m-3 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎓</span>
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser?.displayName}</span>
            </div>
            <div className="text-[10px] text-slate-600">{currentUser?.titleKh}</div>
            <button onClick={logout} className="mt-3 w-full py-1.5 text-xs text-rose-600 font-bold bg-white border border-rose-200 rounded-xl hover:bg-rose-50 flex items-center justify-center gap-1">
              <LogOut className="w-3.5 h-3.5" /><span>ចាកចេញ (Logout)</span>
            </button>
          </div>
        </aside>
      </>
    );
  }

  // 2. TEACHER VIEW (Strictly isolated to their 50 students / class)
  if (currentUserRole === 'teacher') {
    const teacherNavItems = [
      { id: 'dashboard', label: `ថ្នាក់របស់ខ្ញុំ (${currentTeacher?.homeroomClass || '៥០ សិស្ស'})`, icon: LayoutDashboard },
      { id: 'attendance', label: 'ស្រង់វត្តមាន (៥០ នាក់)', icon: ClipboardCheck },
      { id: 'grades', label: 'ពិន្ទុ & ចំណាត់ថ្នាក់ (១៥ មុខ)', icon: Award },
      { id: 'students', label: 'បញ្ជីសិស្សក្នុងថ្នាក់ (៥០ នាក់)', icon: GraduationCap, badge: myClassStudents.length },
      { id: 'classes', label: 'កាលវិភាគ 2-1-2 របស់ថ្នាក់', icon: Calendar },
    ];

    return (
      <>
        {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" />}
        <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
              <span className="font-bold text-slate-800 text-sm">មឺនុយគ្រូបង្រៀន</span>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-3 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ការគ្រប់គ្រងថ្នាក់រៀន</div>
              {teacherNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); onClose(); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3.5 border-t border-slate-100 bg-emerald-50/70 m-3 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">👩‍🏫</span>
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser?.displayName}</span>
            </div>
            <div className="text-[10px] text-slate-600">{currentTeacher?.homeroomClass} • {activeSchool.nameKh}</div>
            <div className="mt-2.5 pt-2 border-t border-emerald-200 flex items-center justify-between">
              <button onClick={() => setShowAccountsModal(true)} className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1">
                <KeyRound className="w-3 h-3" /><span>តារាងគណនី</span>
              </button>
              <button onClick={logout} className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1">
                <LogOut className="w-3 h-3" /><span>ចាកចេញ</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // 3. PRINCIPAL VIEW (Strictly isolated to their 1 School: 10 Classes, 10 Teachers, 500 Students)
  if (currentUserRole === 'principal') {
    const principalNavItems = [
      { id: 'dashboard', label: 'ផ្ទាំងសាលារៀន (៥០០ សិស្ស)', icon: LayoutDashboard },
      { id: 'students', label: 'គ្រប់គ្រងសិស្ស (៥០០ នាក់)', icon: GraduationCap, badge: schoolStudents.length },
      { id: 'teachers', label: 'គ្រប់គ្រងគ្រូ (១០ នាក់)', icon: Users, badge: schoolTeachers.length },
      { id: 'classes', label: 'ថ្នាក់រៀន (១០ ថ្នាក់ 2-1-2)', icon: Calendar, badge: '១០ ថ្នាក់' },
      { id: 'attendance', label: 'ស្រង់វត្តមានប្រចាំថ្ងៃ', icon: ClipboardCheck },
      { id: 'grades', label: 'ពិន្ទុ & ចំណាត់ថ្នាក់ (១៥ មុខ)', icon: Award },
      { id: 'receipts', label: 'វិភាគទាន & បង្កាន់ដៃ', icon: ReceiptText },
    ];

    return (
      <>
        {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" />}
        <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
              <span className="font-bold text-slate-800 text-sm">មឺនុយនាយកសាលា</span>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-3 space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ការគ្រប់គ្រងសាលា</div>
              {principalNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); onClose(); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3.5 border-t border-slate-100 bg-purple-50/70 m-3 rounded-2xl border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">👨‍💼</span>
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser?.displayName}</span>
            </div>
            <div className="text-[10px] text-slate-600">{activeSchool.nameKh}</div>
            <div className="mt-2.5 pt-2 border-t border-purple-200 flex items-center justify-between">
              <button onClick={() => setShowAccountsModal(true)} className="text-[10px] font-bold text-purple-800 hover:underline flex items-center gap-1">
                <KeyRound className="w-3 h-3" /><span>តារាងគណនី</span>
              </button>
              <button onClick={logout} className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1">
                <LogOut className="w-3 h-3" /><span>ចាកចេញ</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  // 4. CLUSTER HEAD VIEW (Full control across 7 Schools, 70 Teachers, 3500 Students, Cluster Overview, Backup)
  const clusterNavItems = [
    { id: 'cluster', label: 'ទិដ្ឋភាពកម្រង (៧ សាលា)', icon: Building2, badge: '៧ សាលា', highlight: true },
    { id: 'dashboard', label: 'ផ្ទាំងសាលារៀន', icon: LayoutDashboard },
    { id: 'students', label: 'គ្រប់គ្រងសិស្ស (៣,៥០០ នាក់)', icon: GraduationCap, badge: students.length },
    { id: 'teachers', label: 'គ្រប់គ្រងគ្រូ (៧០ នាក់)', icon: Users, badge: teachers.length },
    { id: 'classes', label: 'ថ្នាក់រៀន (៧០ ថ្នាក់ 2-1-2)', icon: Calendar, badge: '៧០ ថ្នាក់' },
    { id: 'attendance', label: 'ស្រង់វត្តមានប្រចាំថ្ងៃ', icon: ClipboardCheck },
    { id: 'grades', label: 'ពិន្ទុ (១៥ មុខវិជ្ជា)', icon: Award, badge: '១៥ មុខ' },
    { id: 'receipts', label: 'វិភាគទាន & បង្កាន់ដៃ', icon: ReceiptText },
    { id: 'backup', label: 'បម្រុងទុកទិន្នន័យ (Backup)', icon: DatabaseBackup },
  ];

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" />}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-800 text-sm">បញ្ជីមឺនុយប្រធានកម្រង</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ការគ្រប់គ្រងកម្រង</div>
            {clusterNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id as TabType); onClose(); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20' : item.highlight ? 'bg-blue-50 text-blue-900 font-bold hover:bg-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{item.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-3.5 border-t border-slate-100 bg-blue-50/70 m-3 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[11px] font-bold text-slate-800 truncate">{currentUser?.displayName}</span>
          </div>
          <div className="text-[10px] text-slate-600">ប្រធានកម្រង • គ្រប់គ្រង ៧ សាលា</div>
          <div className="mt-2.5 pt-2 border-t border-blue-200 flex items-center justify-between">
            <button onClick={() => setShowAccountsModal(true)} className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-1">
              <KeyRound className="w-3 h-3" /><span>តារាងគណនី</span>
            </button>
            <button onClick={logout} className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1">
              <LogOut className="w-3 h-3" /><span>ចាកចេញ</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
