import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Calendar, Users, Clock, Plus, Trash2, Building2, Coffee } from 'lucide-react';
import { STANDARD_PERIOD_SLOTS } from '../../data/initialData';
import { DayOfWeek, SessionType } from '../../types';

export const ClassSchedule: React.FC = () => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    classes, students, teachers, timetables, addTimetable, deleteTimetable, 
    currentUserRole 
  } = useSchool();

  const schoolClasses = classes.filter(c => c.schoolId === activeSchoolId);
  const [selectedClassId, setSelectedClassId] = useState<string>(() => schoolClasses[0]?.id || 'cls-sch-1-1');
  const [selectedSession, setSelectedSession] = useState<SessionType>('morning');

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    session: 'morning' as SessionType,
    dayOfWeek: 'ចន្ទ' as DayOfWeek,
    periodNumber: 1,
    subject: 'ភាសាខ្មែរ (អំណាន)',
    teacherName: 'លោកគ្រូ សុខ ចិន្តា',
  });

  React.useEffect(() => {
    if (schoolClasses.length > 0 && !schoolClasses.some(c => c.id === selectedClassId)) {
      setSelectedClassId(schoolClasses[0].id);
    }
  }, [activeSchoolId, schoolClasses]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || schoolClasses[0] || classes[0];
  const classStudents = students.filter(s => s.schoolId === activeSchoolId && s.classId === selectedClass?.id);
  const schoolTeachers = teachers.filter(t => t.schoolId === activeSchoolId);
  const classTeacher = schoolTeachers.find(t => t.id === selectedClass?.homeroomTeacherId);

  const days: DayOfWeek[] = ['ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
  const sessionSlots = STANDARD_PERIOD_SLOTS.filter(s => s.session === selectedSession);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSlot = STANDARD_PERIOD_SLOTS.find(
      s => s.session === newSlot.session && s.periodNumber === Number(newSlot.periodNumber)
    );

    addTimetable({
      schoolId: activeSchoolId,
      classId: selectedClass.id,
      session: newSlot.session,
      periodNumber: Number(newSlot.periodNumber),
      timeSlot: matchedSlot?.timeSlot || '07:10 - 07:50',
      dayOfWeek: newSlot.dayOfWeek,
      subject: newSlot.subject,
      teacherName: newSlot.teacherName,
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>កាលវិភាគទម្រង់ 2-1-2 ({activeSchool.nameKh})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ម៉ោងសិក្សា ៤០ នាទី/ម៉ោង (07:10 - 10:45 ព្រឹក / 13:10 - 16:45 រសៀល) • ចេញលេង ១៥ នាទី
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* School Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={activeSchoolId}
              onChange={(e) => setActiveSchoolId(e.target.value)}
              disabled={currentUserRole === 'teacher' || currentUserRole === 'student'}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>

          {currentUserRole !== 'student' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមម៉ោង</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Selector Tabs (10 Classes) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {schoolClasses.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const count = students.filter(s => s.schoolId === activeSchoolId && s.classId === cls.id).length;

          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cls.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count} នាក់
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Class Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">{activeSchool.nameKh}</span>
          <h3 className="text-xl font-bold font-moul mt-1">{selectedClass.name} ({selectedClass.roomNumber})</h3>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-4">
            <span>👨‍🏫 គ្រូទទួលបន្ទុក៖ <strong className="text-amber-300">{classTeacher ? classTeacher.nameKh : 'មិនទាន់ចាត់តាំង'}</strong></span>
            <span>📞 {classTeacher?.phone}</span>
          </p>
        </div>

        {/* Morning vs Afternoon Switcher */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setSelectedSession('morning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSession === 'morning' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            ☀️ ពេលព្រឹក (07:10 - 10:45)
          </button>
          <button
            onClick={() => setSelectedSession('afternoon')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedSession === 'afternoon' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            🌤️ ពេលរសៀល (13:10 - 16:45)
          </button>
        </div>
      </div>

      {/* 2-1-2 Weekly Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>កាលវិភាគប្រចាំសប្តាហ៍ ({selectedSession === 'morning' ? 'វេនព្រឹក 2-1-2' : 'វេនរសៀល 2-1-2'})</span>
          </h3>

          <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>ចេញលេង ១៥ នាទី ({selectedSession === 'morning' ? '08:30 - 08:45' : '14:30 - 14:45'})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => {
            return (
              <div key={day} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 flex flex-col justify-between">
                <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-sm">ថ្ងៃ{day}</span>
                  <span className="text-[11px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                    ទម្រង់ 2-1-2
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  {sessionSlots.map((slot, idx) => {
                    if (slot.isBreak) {
                      return (
                        <div
                          key={idx}
                          className="py-1.5 px-3 bg-amber-100/80 border border-amber-200 rounded-xl text-center text-[11px] font-bold text-amber-950 flex items-center justify-center gap-1.5"
                        >
                          <Coffee className="w-3.5 h-3.5 text-amber-700" />
                          <span>{slot.timeSlot} — ចេញលេង (១៥ នាទី)</span>
                        </div>
                      );
                    }

                    const entry = timetables.find(
                      t => t.classId === selectedClassId && 
                           t.dayOfWeek === day && 
                           t.session === selectedSession && 
                           t.periodNumber === slot.periodNumber
                    );

                    return (
                      <div
                        key={idx}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                              {slot.timeSlot}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">ម៉ោងទី {slot.periodNumber}</span>
                          </div>
                          <div className="font-bold text-slate-800 text-xs mt-1">
                            {entry?.subject || 'ស្វ័យសិក្សា / មុខវិជ្ជាគោល'}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {entry?.teacherName || classTeacher?.nameKh || 'លោកគ្រូ-អ្នកគ្រូ'}
                          </div>
                        </div>

                        {entry && currentUserRole !== 'student' && (
                          <button
                            onClick={() => deleteTimetable(entry.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded"
                            title="លុប"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base mb-4">បន្ថែមម៉ោងបង្រៀន (ទម្រង់ 2-1-2)</h3>
            
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">វេនសិក្សា</label>
                  <select
                    value={newSlot.session}
                    onChange={(e) => setNewSlot({ ...newSlot, session: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  >
                    <option value="morning">ពេលព្រឹក</option>
                    <option value="afternoon">ពេលរសៀល</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ថ្ងៃនៃសប្តាហ៍</label>
                  <select
                    value={newSlot.dayOfWeek}
                    onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>ថ្ងៃ{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ម៉ោងសិក្សា (៤០ នាទី)</label>
                <select
                  value={newSlot.periodNumber}
                  onChange={(e) => setNewSlot({ ...newSlot, periodNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  {newSlot.session === 'morning' ? (
                    <>
                      <option value={1}>ម៉ោងទី ១ (07:10 - 07:50)</option>
                      <option value={2}>ម៉ោងទី ២ (07:50 - 08:30)</option>
                      <option value={3}>ម៉ោងទី ៣ (08:45 - 09:25)</option>
                      <option value={4}>ម៉ោងទី ៤ (09:25 - 10:05)</option>
                      <option value={5}>ម៉ោងទី ៥ (10:05 - 10:45)</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>ម៉ោងទី ១ រសៀល (13:10 - 13:50)</option>
                      <option value={2}>ម៉ោងទី ២ រសៀល (13:50 - 14:30)</option>
                      <option value={3}>ម៉ោងទី ៣ រសៀល (14:45 - 15:25)</option>
                      <option value={4}>ម៉ោងទី ៤ រសៀល (15:25 - 16:05)</option>
                      <option value={5}>ម៉ោងទី ៥ រសៀល (16:05 - 16:45)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">មុខវិជ្ជា</label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. ភាសាខ្មែរ (អំណាន)"
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">គ្រូបង្រៀន</label>
                <select
                  value={newSlot.teacherName}
                  onChange={(e) => setNewSlot({ ...newSlot, teacherName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  {schoolTeachers.map(t => (
                    <option key={t.id} value={t.nameKh}>{t.nameKh}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  បន្ថែម
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
