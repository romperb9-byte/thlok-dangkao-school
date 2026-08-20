import React, { useState, useEffect, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student, StudentGrade } from '../../types';
import { Award, Save, Printer, Check, BookOpen } from 'lucide-react';
import { CertificateModal } from '../modals/CertificateModal';

export const GradeBook: React.FC = () => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    classes, students, subjects, grades, saveGrade, 
    currentUser, currentUserRole, teachers 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);
  const teacherClass = classes.find(c => c.id === currentTeacher?.classId || c.name === currentTeacher?.homeroomClass);

  const schoolClasses = classes.filter(c => c.schoolId === activeSchoolId);
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    if (currentUserRole === 'teacher' && teacherClass) return teacherClass.id;
    return schoolClasses[0]?.id || 'cls-sch-1-1';
  });

  const [selectedMonth, setSelectedMonth] = useState<string>('មករា');
  const [selectedYear] = useState<number>(2026);
  const [activeSubjectCategory, setActiveSubjectCategory] = useState<string>('all');
  const [scoresState, setScoresState] = useState<Record<string, Record<string, number>>>({});
  const [saveAlert, setSaveAlert] = useState(false);

  // Certificate Modal State
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<{
    student: Student;
    grade: StudentGrade;
  } | null>(null);

  useEffect(() => {
    if (currentUserRole === 'teacher' && teacherClass) {
      setSelectedClassId(teacherClass.id);
    } else if (schoolClasses.length > 0 && !schoolClasses.some(c => c.id === selectedClassId)) {
      setSelectedClassId(schoolClasses[0].id);
    }
  }, [activeSchoolId, schoolClasses, currentUserRole, teacherClass]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || teacherClass || schoolClasses[0] || classes[0];
  const classStudents = useMemo(() => {
    return students.filter(
      s => s.schoolId === activeSchoolId && s.classId === selectedClass.id
    );
  }, [students, activeSchoolId, selectedClass.id]);

  const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'ឆមាសទី១', 'ឆមាសទី២'];

  const displayedSubjects = useMemo(() => {
    if (activeSubjectCategory === 'all') return subjects;
    return subjects.filter(s => s.category === activeSubjectCategory);
  }, [subjects, activeSubjectCategory]);

  const totalCoeff = useMemo(() => {
    return subjects.reduce((sum, s) => sum + s.coefficient, 0); // 17
  }, [subjects]);

  // Load existing grades into score state
  useEffect(() => {
    const existing = grades.filter(
      g => g.schoolId === activeSchoolId && g.classId === selectedClass.id && g.month === selectedMonth && g.year === selectedYear
    );

    const initialMap: Record<string, Record<string, number>> = {};

    classStudents.forEach((student) => {
      const found = existing.find(g => g.studentId === student.id);
      if (found) {
        initialMap[student.id] = { ...found.scores };
      } else {
        const defScores: Record<string, number> = {};
        subjects.forEach(s => {
          defScores[s.id] = 75;
        });
        initialMap[student.id] = defScores;
      }
    });

    setScoresState(initialMap);
  }, [activeSchoolId, selectedClass.id, selectedMonth, selectedYear, grades, classStudents, subjects]);

  const handleScoreChange = (studentId: string, subjectId: string, value: number) => {
    const validVal = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    setScoresState(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subjectId]: validVal,
      },
    }));
  };

  const calculatedGrades = useMemo(() => {
    const list = classStudents.map((student) => {
      const sScores = scoresState[student.id] || {};

      let totalRaw = 0;
      let totalWeighted = 0;

      subjects.forEach((sub) => {
        const sc = Number(sScores[sub.id] || 0);
        totalRaw += sc;
        totalWeighted += sc * sub.coefficient;
      });

      const average = parseFloat((totalWeighted / (totalCoeff || 17)).toFixed(2));

      let gradeLevel = 'មធ្យម';
      if (average >= 90) gradeLevel = 'ល្អប្រសើរ';
      else if (average >= 80) gradeLevel = 'ល្អ';
      else if (average >= 70) gradeLevel = 'ល្អបង្គួរ';
      else if (average < 50) gradeLevel = 'ខ្សោយ';

      return {
        student,
        scores: sScores,
        totalRaw,
        average,
        gradeLevel,
      };
    });

    list.sort((a, b) => b.average - a.average);

    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [classStudents, scoresState, subjects, totalCoeff]);

  const handleSaveAllScores = () => {
    calculatedGrades.forEach(item => {
      saveGrade({
        schoolId: activeSchoolId,
        studentId: item.student.id,
        classId: selectedClass.id,
        month: selectedMonth,
        year: selectedYear,
        scores: item.scores,
        totalScore: item.totalRaw,
        averageScore: item.average,
        rank: item.rank,
        gradeLevel: item.gradeLevel,
        teacherRemark: item.average >= 80 ? 'សិស្សរៀនពូកែ និងមានវិន័យល្អ' : 'ខិតខំប្រឹងប្រែងរៀនសូត្រ',
      });
    });

    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            <span>
              {currentUserRole === 'teacher'
                ? `បញ្ចូលពិន្ទុ & ចំណាត់ថ្នាក់ (${selectedClass.name} - ៥០ សិស្ស)`
                : `តារាងស្រង់ពិន្ទុ និងចំណាត់ថ្នាក់ (${activeSchool.nameKh})`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            គណនាមធ្យមភាគលើ ១៥ មុខវិជ្ជា (មេគុណ ១៧) និងចំណាត់ថ្នាក់ពីលេខ ១ ដល់ ៥០
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveAlert && (
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>បានរក្សាទុកពិន្ទុ!</span>
            </div>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពតារាងពិន្ទុ</span>
          </button>

          <button
            onClick={handleSaveAllScores}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>រក្សាទុកពិន្ទុ (៥០ នាក់)</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 no-print">
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

        {/* Month selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">ប្រចាំខែ / ឆមាស</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            {months.map(m => (
              <option key={m} value={m}>ខែ {m} (ឆ្នាំ២០២៦)</option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">តម្រងក្រុមមុខវិជ្ជា</label>
          <select
            value={activeSubjectCategory}
            onChange={(e) => setActiveSubjectCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="all">បង្ហាញទាំង ១៥ មុខវិជ្ជា</option>
            <option value="ភាសា">ភាសា (ខ្មែរ & អង់គ្លេស)</option>
            <option value="គណិតវិទ្យា">គណិតវិទ្យា</option>
            <option value="វិទ្យាសាស្ត្រ-សង្គម">វិទ្យាសាស្ត្រ & សង្គម</option>
            <option value="សិល្បៈ-កីឡា">សិល្បៈ & កីឡា</option>
            <option value="បច្ចេកវិទ្យា-បំណិន">បច្ចេកវិទ្យា & បំណិន</option>
          </select>
        </div>
      </div>

      {/* 15 Subjects Quick Legend */}
      <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 no-print">
        <div className="flex items-center gap-1.5 font-bold">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>បញ្ជី ១៥ មុខវិជ្ជាគោល (ថ្នាក់ {selectedClass.name})៖</span>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {subjects.map(s => (
            <span key={s.id} className="bg-white/80 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
              {s.nameKh} {s.coefficient > 1 ? `(x${s.coefficient})` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block text-center space-y-1 mb-6">
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-600">ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
        <h2 className="text-base font-bold font-moul text-blue-900">{activeSchool.nameKh}</h2>
        <h1 className="text-lg font-bold">បញ្ជីស្រង់ពិន្ទុ និងចំណាត់ថ្នាក់សិស្ស ({selectedClass.name} - ខែ{selectedMonth} ឆ្នាំ២០២៦)</h1>
      </div>

      {/* 15-Subject Grade Table with Horizontal Scroll */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-shadow-none">
        <div className="overflow-x-auto max-h-[650px] relative scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold sticky top-0 z-20 shadow-xs">
              <tr>
                <th className="py-3 px-3 text-center w-12 sticky left-0 bg-slate-50 z-20 shadow-r">ចំណាត់ថ្នាក់</th>
                <th className="py-3 px-4 min-w-[150px] sticky left-12 bg-slate-50 z-20 shadow-r">ឈ្មោះសិស្ស</th>
                <th className="py-3 px-2 text-center w-10">ភេទ</th>
                
                {/* 15 Subjects Headers */}
                {displayedSubjects.map(sub => (
                  <th
                    key={sub.id}
                    className={`py-3 px-2 text-center min-w-[70px] whitespace-nowrap text-[11px] ${
                      sub.coefficient > 1 ? 'bg-blue-50/80 text-blue-900 font-bold' : ''
                    }`}
                    title={sub.nameKh}
                  >
                    <div>{sub.nameKh}</div>
                    <span className="text-[9px] text-slate-400 font-normal">
                      មេគុណ {sub.coefficient}
                    </span>
                  </th>
                ))}

                <th className="py-3 px-3 text-center bg-amber-100/70 font-bold text-amber-950 min-w-[80px]">មធ្យមភាគ</th>
                <th className="py-3 px-3 text-center min-w-[75px]">និទ្ទេស</th>
                <th className="py-3 px-3 text-center no-print min-w-[90px]">ប័ណ្ណសរសើរ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {calculatedGrades.map((item) => {
                const isTopFive = item.rank <= 5;
                const studentScores = scoresState[item.student.id] || {};

                return (
                  <tr
                    key={item.student.id}
                    className={`transition-colors ${
                      isTopFive ? 'bg-amber-50/30' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-2.5 px-3 text-center sticky left-0 bg-white z-10 font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                          item.rank === 1
                            ? 'bg-amber-400 text-amber-950 font-bold shadow-xs'
                            : item.rank === 2
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : item.rank === 3
                            ? 'bg-amber-200 text-amber-900 font-bold'
                            : item.rank <= 5
                            ? 'bg-blue-100 text-blue-800 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-2.5 px-4 sticky left-12 bg-white z-10">
                      <div className="font-bold text-slate-900 whitespace-nowrap">{item.student.nameKh}</div>
                      <div className="text-[10px] font-mono text-slate-400">{item.student.code}</div>
                    </td>

                    {/* Gender */}
                    <td className="py-2.5 px-2 text-center">
                      <span className={`text-[11px] font-semibold ${item.student.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                        {item.student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>

                    {/* 15 Subject Scores Input */}
                    {displayedSubjects.map(sub => (
                      <td
                        key={sub.id}
                        className={`py-1.5 px-1 text-center ${
                          sub.coefficient > 1 ? 'bg-blue-50/20' : ''
                        }`}
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={studentScores[sub.id] ?? 0}
                          onChange={(e) => handleScoreChange(item.student.id, sub.id, parseFloat(e.target.value))}
                          className="w-12 text-center py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </td>
                    ))}

                    {/* Average */}
                    <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold font-mono text-amber-950 text-sm">
                      {item.average}
                    </td>

                    {/* Grade Level */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.gradeLevel === 'ល្អប្រសើរ'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.gradeLevel === 'ល្អ'
                            ? 'bg-blue-100 text-blue-800'
                            : item.gradeLevel === 'ល្អបង្គួរ'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.gradeLevel}
                      </span>
                    </td>

                    {/* Certificate Button */}
                    <td className="py-2.5 px-3 text-center no-print">
                      {item.rank <= 5 ? (
                        <button
                          onClick={() => {
                            setSelectedStudentForCert({
                              student: item.student,
                              grade: {
                                id: `cert-${item.student.id}`,
                                schoolId: activeSchoolId,
                                studentId: item.student.id,
                                classId: selectedClass.id,
                                month: selectedMonth,
                                year: selectedYear,
                                scores: item.scores,
                                totalScore: item.totalRaw,
                                averageScore: item.average,
                                rank: item.rank,
                                gradeLevel: item.gradeLevel,
                              },
                            });
                          }}
                          className="p-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          title="បោះពុម្ពប័ណ្ណសរសើរ"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>ប័ណ្ណ</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedStudentForCert}
        onClose={() => setSelectedStudentForCert(null)}
        student={selectedStudentForCert?.student || null}
        grade={selectedStudentForCert?.grade || null}
      />
    </div>
  );
};
