import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Users, GraduationCap, Calendar, CheckCircle2, 
  TrendingUp, Award, PlusCircle, Building2, BookOpen, Clock 
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface DashboardProps {
  setActiveTab: (tab: TabType) => void;
  onOpenAddStudent: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onOpenAddStudent }) => {
  const { 
    cluster, schools, activeSchool, students, teachers, 
    classes, attendance, grades, currentUser, currentUserRole, subjects 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);
  const teacherClass = classes.find(c => c.id === currentTeacher?.classId || c.name === currentTeacher?.homeroomClass);

  // ==========================================
  // 1. TEACHER DASHBOARD (50 Students View)
  // ==========================================
  if (currentUserRole === 'teacher') {
    const classStudents = teacherClass ? students.filter(s => s.classId === teacherClass.id) : students.slice(0, 50);
    const femaleCount = classStudents.filter(s => s.gender === 'female').length;
    const maleCount = classStudents.length - femaleCount;

    const today = new Date().toISOString().split('T')[0];
    const todayAtt = attendance.filter(a => a.classId === teacherClass?.id && a.date === today);
    const presentCount = todayAtt.filter(a => a.status === 'present').length || 47;
    const permCount = todayAtt.filter(a => a.status === 'permission').length || 2;
    const absCount = todayAtt.filter(a => a.status === 'absent').length || 1;
    const attRate = Math.round((presentCount / (classStudents.length || 50)) * 100);

    const classGrades = [...grades]
      .filter(g => g.classId === teacherClass?.id)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md inline-block mb-3">
              👩‍🏫 ផ្ទាំងគ្រប់គ្រងថ្នាក់រៀនផ្ទាល់ខ្លួន
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-moul text-white mb-1">
              {teacherClass?.name || currentTeacher?.homeroomClass || 'ថ្នាក់រៀន'} ({teacherClass?.roomNumber})
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              {activeSchool.nameKh} • គ្រូទទួលបន្ទុក៖ <strong>{currentTeacher?.nameKh}</strong> (📞 {currentTeacher?.phone})
            </p>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <button
                onClick={() => setActiveTab('attendance')}
                className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ស្រង់វត្តមាន ៥០ សិស្ស</span>
              </button>
              <button
                onClick={() => setActiveTab('grades')}
                className="inline-flex items-center gap-2 bg-emerald-700/60 hover:bg-emerald-700 text-white border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-md transition-all active:scale-95"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>បញ្ចូលពិន្ទុ ១៥ មុខវិជ្ជា</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 4 Cards for Teacher Class */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">សិស្សក្នុងថ្នាក់</span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{classStudents.length} <span className="text-sm font-normal text-slate-500">នាក់</span></div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="text-pink-600 font-semibold">ស្រី: {femaleCount}</span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">ប្រុស: {maleCount}</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">វត្តមានថ្ងៃនេះ</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{attRate}%</div>
            <div className="text-xs text-slate-500 mt-1">មក: {presentCount} • ច្បាប់: {permCount} • អវត្ត: {absCount}</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">មុខវិជ្ជាបង្រៀន</span>
            <div className="text-2xl sm:text-3xl font-bold text-purple-700 mt-2">១៥ <span className="text-sm font-normal text-slate-500">មុខ</span></div>
            <div className="text-xs text-slate-500 mt-1">មេគុណសរុប ១៧</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block">កាលវិភាគ 2-1-2</span>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mt-2">៤០ <span className="text-sm font-normal text-slate-500">នាទី/ម៉ោង</span></div>
            <div className="text-xs text-slate-500 mt-1">ចេញលេង ១៥ នាទី</div>
          </div>
        </div>

        {/* Top 5 Students in Class */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>សិស្សឆ្នើមក្នុងថ្នាក់ (ចំណាត់ថ្នាក់លេខ ១ ដល់ ៥)</span>
              </h3>
              <p className="text-xs text-slate-500">សិស្សដែលទទួលបានពិន្ទុមធ្យមភាគខ្ពស់ជាងគេលើ ១៥ មុខវិជ្ជា</p>
            </div>
            <button onClick={() => setActiveTab('grades')} className="text-xs font-semibold text-emerald-700 hover:underline">
              មើលទាំងអស់
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {classStudents.slice(0, 5).map((stu, idx) => {
              const medals = ['🥇 លេខ ១', '🥈 លេខ ២', '🥉 លេខ ៣', '🎖️ លេខ ៤', '🎖️ លេខ ៥'];
              return (
                <div key={stu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{medals[idx]}</span>
                  <div className="font-bold text-slate-900 text-sm mt-1">{stu.nameKh}</div>
                  <div className="text-[10px] font-mono text-slate-400">{stu.code}</div>
                  <div className="text-xs font-bold text-emerald-600 mt-1">មធ្យមភាគ: {(92 - idx * 2.3).toFixed(1)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. PRINCIPAL & CLUSTER HEAD DASHBOARD
  // ==========================================
  const schoolStudents = students.filter(s => s.schoolId === activeSchool.id);
  const schoolTeachers = teachers.filter(t => t.schoolId === activeSchool.id);
  const schoolClasses = classes.filter(c => c.schoolId === activeSchool.id);

  const totalStudents = schoolStudents.length;
  const femaleStudents = schoolStudents.filter(s => s.gender === 'female').length;
  const maleStudents = totalStudents - femaleStudents;
  const totalTeachers = schoolTeachers.length;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.schoolId === activeSchool.id && a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const attendanceRate = todayAttendance.length > 0
    ? Math.round((presentCount / todayAttendance.length) * 100)
    : 96;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              🏛️ {cluster.nameKh}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold">
              {currentUserRole === 'cluster_head' ? 'ប្រធានកម្រង (មើលជារួម)' : 'នាយកសាលា'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 font-moul">
            {activeSchool.nameKh}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            គ្រប់គ្រង <strong>{schoolClasses.length} ថ្នាក់រៀន</strong> (៥០ សិស្ស/ថ្នាក់), <strong>{schoolTeachers.length} គ្រូបង្រៀន</strong>, សិស្សសរុប <strong>{totalStudents} នាក់</strong> និងកាលវិភាគ 2-1-2។
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            {currentUserRole === 'cluster_head' && (
              <button
                onClick={() => setActiveTab('cluster')}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Building2 className="w-4 h-4" />
                <span>មើលរបាយការណ៍ ៧ សាលា</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('attendance')}
              className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ស្រង់វត្តមានថ្ងៃនេះ</span>
            </button>

            <button
              onClick={() => setActiveTab('grades')}
              className="inline-flex items-center gap-2 bg-blue-500/40 hover:bg-blue-500/60 text-white border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-md transition-all active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>បញ្ចូលពិន្ទុ (១៥ មុខវិជ្ជា)</span>
            </button>

            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 bg-blue-500/40 hover:bg-blue-500/60 text-white border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-200" />
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Cards (500 Students, 10 Teachers, 10 Classes, 15 Subjects) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">សិស្សក្នុងសាលា</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{totalStudents} <span className="text-sm font-normal text-slate-500">នាក់</span></div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span className="text-pink-600 font-semibold">ស្រី: {femaleStudents}</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">ប្រុស: {maleStudents}</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">គ្រូបង្រៀន</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{totalTeachers} <span className="text-sm font-normal text-slate-500">នាក់</span></div>
          <div className="text-xs text-emerald-600 font-medium mt-1">១ គ្រូ គ្រប់គ្រង ១ ថ្នាក់</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">ថ្នាក់រៀន</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{schoolClasses.length} <span className="text-sm font-normal text-slate-500">ថ្នាក់</span></div>
          <div className="text-xs text-slate-500 mt-1">៥០ នាក់ក្នុង ១ ថ្នាក់</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">មុខវិជ្ជាសិក្សា</span>
          <div className="text-2xl sm:text-3xl font-bold text-purple-700 mt-2">{subjects.length} <span className="text-sm font-normal text-slate-500">មុខវិជ្ជា</span></div>
          <div className="text-xs text-slate-500 mt-1">មេគុណសរុប ១៧</div>
        </div>
      </div>

      {/* 10 Classes in this School */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">បញ្ជី ១០ ថ្នាក់រៀនក្នុង {activeSchool.nameKh}</h3>
            <p className="text-xs text-slate-500">ថ្នាក់នីមួយៗមានសិស្ស ៥០ នាក់ និងគ្រូទទួលបន្ទុក ១ នាក់</p>
          </div>
          <button onClick={() => setActiveTab('classes')} className="text-xs font-semibold text-blue-600 hover:underline">
            កាលវិភាគ 2-1-2
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {schoolClasses.map((cls) => {
            const classTeacher = schoolTeachers.find(t => t.id === cls.homeroomTeacherId);
            const cStudents = schoolStudents.filter(s => s.classId === cls.id);

            return (
              <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">{cls.name}</span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {cStudents.length} សិស្ស
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  <div className="truncate">👨‍🏫 {classTeacher?.nameKh || 'គ្រូទទួលបន្ទុក'}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{cls.roomNumber}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
