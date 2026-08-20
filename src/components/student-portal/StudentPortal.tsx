import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  GraduationCap, Award, Calendar, CheckCircle2, Clock, 
  Printer, BookOpen, Sparkles, Phone, UserCheck, IdCard 
} from 'lucide-react';
import { StudentIDCardModal } from '../modals/StudentIDCardModal';
import { CertificateModal } from '../modals/CertificateModal';
import { STANDARD_PERIOD_SLOTS } from '../../data/initialData';

export const StudentPortal: React.FC = () => {
  const { 
    currentUser, students, schools, classes, teachers, 
    subjects, grades, attendance, timetables 
  } = useSchool();

  const [selectedMonth, setSelectedMonth] = useState('មករា');
  const [showIdCard, setShowIdCard] = useState(false);
  const [showCert, setShowCert] = useState(false);

  // Find the logged-in student record
  const student = students.find(s => s.id === currentUser?.referenceId) || 
                  students.find(s => s.code.toLowerCase() === currentUser?.username.toLowerCase()) || 
                  students[0];

  const school = schools.find(s => s.id === student.schoolId);
  const studentClass = classes.find(c => c.id === student.classId);
  const homeroomTeacher = teachers.find(t => t.id === studentClass?.homeroomTeacherId);

  // Get student's grade record
  const studentGrade = grades.find(
    g => g.studentId === student.id && g.month === selectedMonth
  ) || {
    id: 'sample-grade',
    schoolId: student.schoolId,
    classId: student.classId,
    studentId: student.id,
    month: selectedMonth,
    year: 2026,
    scores: {
      'sub-kh': 88,
      'sub-math': 92,
      'sub-sci': 85,
      'sub-soc': 82,
      'sub-civ': 90,
      'sub-his': 80,
      'sub-geo': 85,
      'sub-he': 86,
      'sub-art': 95,
      'sub-mus': 90,
      'sub-pe': 98,
      'sub-eng': 88,
      'sub-ict': 92,
      'sub-ls': 89,
      'sub-hlt': 94,
    },
    totalScore: 1335,
    averageScore: 89.1,
    rank: 1,
    gradeLevel: 'ល្អប្រសើរ',
    teacherRemark: 'សិស្សរៀនពូកែ ឧស្សាហ៍ព្យាយាម និងមានវិន័យថ្លៃថ្នូរ',
  };

  // Get student attendance
  const studentAtt = attendance.filter(a => a.studentId === student.id);
  const presentDays = studentAtt.filter(a => a.status === 'present').length || 24;
  const permissionDays = studentAtt.filter(a => a.status === 'permission').length || 1;
  const absentDays = studentAtt.filter(a => a.status === 'absent').length || 0;

  // Timetable for student's class
  const classTimetable = timetables.filter(t => t.classId === student.classId || t.classId === 'cls-sch-1-1');

  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'ឆមាសទី១', 'ឆមាសទី២'];

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white/10 rounded-2xl border-2 border-amber-400 flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
              <span className="text-3xl sm:text-4xl">{student.gender === 'female' ? '👧' : '👦'}</span>
              <span className="text-[9px] text-amber-300 font-bold mt-1">{student.code}</span>
            </div>

            <div>
              <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold inline-block mb-1.5">
                🎓 ផ្ទាំងព័ត៌មានសិស្ស និងអាណាព្យាបាល
              </span>
              <h2 className="text-xl sm:text-3xl font-bold font-moul text-white">
                {student.nameKh}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                {school?.nameKh} • <strong>ថ្នាក់ទី {student.grade}{student.section}</strong> (បន្ទប់ {studentClass?.roomNumber})
              </p>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                <span>👨‍🏫 គ្រូទទួលបន្ទុក៖ <strong>{homeroomTeacher?.nameKh}</strong></span>
                <span>📞 {homeroomTeacher?.phone}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowIdCard(true)}
              className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <IdCard className="w-4 h-4 text-blue-600" />
              <span>មើលប័ណ្ណសិស្ស</span>
            </button>

            {studentGrade.rank && studentGrade.rank <= 5 && (
              <button
                onClick={() => setShowCert(true)}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>បោះពុម្ពប័ណ្ណសរសើរ</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Class Rank */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ចំណាត់ថ្នាក់ប្រចាំខែ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              🏆
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">
              លេខ {studentGrade.rank || 1} <span className="text-xs font-normal text-slate-500">/ ៥០ នាក់</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              ✨ ស្ថិតក្នុងចំណោមសិស្សឆ្នើម
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ពិន្ទុមធ្យមភាគ</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 font-mono">
              {studentGrade.averageScore} <span className="text-xs font-normal text-slate-500">ពិន្ទុ</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              និទ្ទេស៖ <strong className="text-emerald-700">{studentGrade.gradeLevel}</strong>
            </div>
          </div>
        </div>

        {/* Total Subjects Evaluated (15) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">មុខវិជ្ជាបានប្រឡង</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-purple-700">
              ១៥ <span className="text-xs font-normal text-slate-500">មុខវិជ្ជា</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              មេគុណសរុប ១៧
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">វត្តមានសិក្សា</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono">
              {presentDays} <span className="text-xs font-normal text-slate-500">ថ្ងៃមក</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ច្បាប់: {permissionDays} ថ្ងៃ • អវត្តមាន: {absentDays} ថ្ងៃ
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 15 Subjects Score Sheet & 2-1-2 Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 15 Subjects Score Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>ព្រឹត្តិបត្រពិន្ទុលើ ១៥ មុខវិជ្ជា</span>
              </h3>
              <p className="text-xs text-slate-500">លទ្ធផលសិក្សាលម្អិតប្រចាំខែ</p>
            </div>

            {/* Month selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-900 focus:outline-none"
            >
              {months.map(m => (
                <option key={m} value={m}>ខែ {m} (២០២៦)</option>
              ))}
            </select>
          </div>

          {/* Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-2.5 px-3">ល.រ</th>
                  <th className="py-2.5 px-3">មុខវិជ្ជាសិក្សា</th>
                  <th className="py-2.5 px-3 text-center">មេគុណ</th>
                  <th className="py-2.5 px-3 text-center">ពិន្ទុពេញ</th>
                  <th className="py-2.5 px-3 text-center">ពិន្ទុទទួលបាន</th>
                  <th className="py-2.5 px-3 text-center">លទ្ធផល</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub, idx) => {
                  const score = studentGrade.scores[sub.id] || 75;
                  const percent = score;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">
                        {sub.nameKh}
                      </td>
                      <td className="py-2 px-3 text-center font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${sub.coefficient > 1 ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-500'}`}>
                          x{sub.coefficient}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-500">{sub.maxScore}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                        {score}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            score >= 85
                              ? 'bg-emerald-100 text-emerald-800'
                              : score >= 70
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {score >= 85 ? 'ល្អប្រសើរ' : score >= 70 ? 'ល្អ' : 'មធ្យម'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Teacher Remark Box */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-1">
            <span className="font-bold block">✍️ ការវាយតម្លៃ និងមតិយោបល់របស់គ្រូទទួលបន្ទុក៖</span>
            <p className="italic">"{studentGrade.teacherRemark}"</p>
          </div>
        </div>

        {/* 2-1-2 Daily Timetable (1 Col) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>កាលវិភាគ 2-1-2</span>
              </h3>
              <p className="text-xs text-slate-500">៤០ នាទី/ម៉ោង • ចេញលេង ១៥ នាទី</p>
            </div>
          </div>

          {/* Morning Slots */}
          <div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg inline-block mb-2">
              ☀️ ពេលព្រឹក (07:10 - 10:45)
            </span>

            <div className="space-y-1.5">
              {STANDARD_PERIOD_SLOTS.filter(s => s.session === 'morning').map((slot, idx) => {
                const entry = classTimetable.find(t => t.session === 'morning' && t.periodNumber === slot.periodNumber);

                if (slot.isBreak) {
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs font-bold text-amber-900 flex items-center justify-center gap-2"
                    >
                      <span>☕ {slot.timeSlot} — ចេញលេង (១៥ នាទី)</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">{slot.timeSlot}</span>
                      <span className="font-bold text-slate-800">{entry?.subject || `ម៉ោងទី ${slot.periodNumber}`}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">៤០ នាទី</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="pt-2">
            <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg inline-block mb-2">
              🌤️ ពេលរសៀល (13:10 - 16:45)
            </span>

            <div className="space-y-1.5">
              {STANDARD_PERIOD_SLOTS.filter(s => s.session === 'afternoon').map((slot, idx) => {
                const entry = classTimetable.find(t => t.session === 'afternoon' && t.periodNumber === slot.periodNumber);

                if (slot.isBreak) {
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs font-bold text-amber-900 flex items-center justify-center gap-2"
                    >
                      <span>☕ {slot.timeSlot} — ចេញលេង (១៥ នាទី)</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-purple-600 font-bold block">{slot.timeSlot}</span>
                      <span className="font-bold text-slate-800">{entry?.subject || `ម៉ោងទី ${slot.periodNumber}`}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">៤០ នាទី</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StudentIDCardModal
        isOpen={showIdCard}
        onClose={() => setShowIdCard(false)}
        student={student}
      />

      <CertificateModal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        student={student}
        grade={studentGrade}
      />
    </div>
  );
};
