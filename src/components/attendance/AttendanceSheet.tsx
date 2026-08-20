import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import { ClipboardCheck, Check, Clock, X, Save } from 'lucide-react';

export const AttendanceSheet: React.FC = () => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    classes, students, teachers, attendance, recordAttendance, 
    currentUser, currentUserRole 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);
  const teacherClass = classes.find(c => c.id === currentTeacher?.classId || c.name === currentTeacher?.homeroomClass);

  const schoolClasses = classes.filter(c => c.schoolId === activeSchoolId);
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    if (currentUserRole === 'teacher' && teacherClass) return teacherClass.id;
    return schoolClasses[0]?.id || 'cls-sch-1-1';
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUserRole === 'teacher' && teacherClass) {
      setSelectedClassId(teacherClass.id);
    } else if (schoolClasses.length > 0 && !schoolClasses.some(c => c.id === selectedClassId)) {
      setSelectedClassId(schoolClasses[0].id);
    }
  }, [activeSchoolId, schoolClasses, currentUserRole, teacherClass]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || teacherClass || schoolClasses[0] || classes[0];
  const classStudents = students.filter(
    s => s.schoolId === activeSchoolId && s.classId === selectedClass.id
  );

  // Load existing attendance
  useEffect(() => {
    const existing = attendance.filter(
      a => a.schoolId === activeSchoolId && a.classId === selectedClass.id && a.date === selectedDate
    );

    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      const match = existing.find(a => a.studentId === s.id);
      map[s.id] = {
        status: match ? match.status : 'present',
        note: match?.note || '',
      };
    });

    setStatusMap(map);
  }, [activeSchoolId, selectedClass.id, selectedDate, attendance, classStudents.length]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setStatusMap(prev => {
      const updated = { ...prev };
      classStudents.forEach(s => {
        updated[s.id] = {
          ...updated[s.id],
          status,
        };
      });
      return updated;
    });
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(s => ({
      studentId: s.id,
      status: statusMap[s.id]?.status || 'present',
      note: statusMap[s.id]?.note || '',
    }));

    recordAttendance(activeSchoolId, selectedClass.id, selectedDate, records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculations
  const presentCount = Object.values(statusMap).filter(v => v.status === 'present').length;
  const permissionCount = Object.values(statusMap).filter(v => v.status === 'permission').length;
  const absentCount = Object.values(statusMap).filter(v => v.status === 'absent').length;
  const lateCount = Object.values(statusMap).filter(v => v.status === 'late').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-600" />
            <span>
              {currentUserRole === 'teacher'
                ? `ស្រង់វត្តមានប្រចាំថ្ងៃ (${selectedClass.name} - ៥០ សិស្ស)`
                : `កត់ត្រាវត្តមានសិស្សប្រចាំថ្ងៃ (${activeSchool.nameKh})`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentUserRole === 'teacher' ? 'កត់ត្រាវត្តមានសិស្សក្នុងថ្នាក់ផ្ទាល់ខ្លួន' : 'ស្រង់វត្តមានសិស្សតាមបន្ទប់នីមួយៗ'}
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>បានរក្សាទុកវត្តមានដោយជោគជ័យ!</span>
          </div>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* School selector (ONLY FOR CLUSTER HEAD) */}
        {currentUserRole === 'cluster_head' && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">ជ្រើសរើសសាលា</label>
            <select
              value={activeSchoolId}
              onChange={(e) => setActiveSchoolId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>
        )}

        {/* Class selector (FOR CLUSTER HEAD & PRINCIPAL ONLY, HIDDEN FOR TEACHER) */}
        {currentUserRole !== 'teacher' && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">ជ្រើសរើសថ្នាក់ (១០ ថ្នាក់)</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none"
            >
              {schoolClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.roomNumber} - {c.totalStudents} នាក់)</option>
              ))}
            </select>
          </div>
        )}

        {/* Date selector */}
        <div className={currentUserRole === 'teacher' ? 'sm:col-span-2' : ''}>
          <label className="block text-xs font-bold text-slate-600 mb-1">កាលបរិច្ឆេទ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Bulk Action & Save */}
        <div className="flex items-end gap-2">
          <button
            onClick={() => handleMarkAll('present')}
            className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
          >
            ✓ វត្តមានទាំងអស់
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុក</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] font-semibold text-slate-500 block">សិស្សក្នុងថ្នាក់</span>
          <span className="text-base sm:text-xl font-bold text-slate-800">{classStudents.length} នាក់</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-3 sm:p-4 rounded-xl text-center">
          <span className="text-[11px] font-semibold text-emerald-700 block">វត្តមាន (មក)</span>
          <span className="text-base sm:text-xl font-bold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-xl text-center">
          <span className="text-[11px] font-semibold text-amber-700 block">ច្បាប់ (L)</span>
          <span className="text-base sm:text-xl font-bold text-amber-700">{permissionCount}</span>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-3 sm:p-4 rounded-xl text-center">
          <span className="text-[11px] font-semibold text-rose-700 block">អវត្តមាន (A)</span>
          <span className="text-base sm:text-xl font-bold text-rose-700">{absentCount}</span>
        </div>
        <div className="bg-sky-50 border border-sky-200 p-3 sm:p-4 rounded-xl text-center">
          <span className="text-[11px] font-semibold text-sky-700 block">មកយឺត (Late)</span>
          <span className="text-base sm:text-xl font-bold text-sky-700">{lateCount}</span>
        </div>
      </div>

      {/* Attendance Student List Table (50 Students) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="py-3 px-4 w-12 text-center">ល.រ</th>
                <th className="py-3 px-4">អត្តលេខ & ឈ្មោះសិស្ស</th>
                <th className="py-3 px-3">ភេទ</th>
                <th className="py-3 px-4 text-center">ស្ថានភាពវត្តមាន</th>
                <th className="py-3 px-4 hidden md:table-cell">សម្គាល់ / ហេតុផល</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student, index) => {
                const currentStatus = statusMap[student.id]?.status || 'present';
                const currentNote = statusMap[student.id]?.note || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 text-center font-mono text-slate-400 font-bold">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-800">{student.nameKh}</div>
                      <div className="text-[10px] font-mono text-slate-400">{student.code}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-semibold ${student.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                        {student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>វត្តមាន</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'permission')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'permission'
                              ? 'bg-amber-500 text-white shadow-xs scale-105'
                              : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>ច្បាប់</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>អវត្តមាន</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-sky-600 text-white shadow-xs scale-105'
                              : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>មកយឺត</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 hidden md:table-cell">
                      <input
                        type="text"
                        placeholder="មូលហេតុ (ឧ. ឈឺ)..."
                        value={currentNote}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            💡 ចុចប៊ូតុងខាងស្ដាំដើម្បីរក្សាទុកវត្តមានសិស្សទាំង ៥០ នាក់
          </span>
          <button
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុកវត្តមាន</span>
          </button>
        </div>
      </div>
    </div>
  );
};
