import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher } from '../../types';
import { Users, Plus, Phone, BookOpen, GraduationCap, Edit2, Trash2, ShieldCheck, Building2 } from 'lucide-react';
import { TeacherModal } from '../modals/TeacherModal';

export const TeacherList: React.FC = () => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    teachers, addTeacher, updateTeacher, deleteTeacher, currentUserRole 
  } = useSchool();

  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(
    currentUserRole === 'cluster_head' ? 'all' : activeSchoolId
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);

  React.useEffect(() => {
    if (currentUserRole !== 'cluster_head') setSelectedSchoolFilter(activeSchoolId);
  }, [activeSchoolId, currentUserRole]);

  const filteredTeachers = teachers.filter(t => {
    if (currentUserRole !== 'cluster_head') return t.schoolId === activeSchoolId;
    return selectedSchoolFilter === 'all' || t.schoolId === selectedSchoolFilter;
  });

  const handleOpenAdd = () => {
    setTeacherToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setTeacherToEdit(teacher);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`តើលោកអ្នកពិតជាចង់លុបទិន្នន័យគ្រូបង្រៀន "${name}" មែនទេ?`)) {
      deleteTeacher(id);
    }
  };

  const handleSave = (data: any) => {
    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, data);
    } else {
      addTeacher({
        ...data,
        schoolId: data.schoolId || activeSchoolId,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>{selectedSchoolFilter === 'all' && currentUserRole === 'cluster_head' ? 'បញ្ជីគ្រូទូទាំងកម្រង (៧០ គ្រូ)' : `បញ្ជីគ្រូបង្រៀន (${activeSchool.nameKh})`}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ទិន្នន័យគ្រូបង្រៀនសរុប <strong className="text-emerald-600">{filteredTeachers.length}</strong> រូប
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* School Filter Dropdown */}
          {currentUserRole === 'cluster_head' && <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedSchoolFilter}
              onChange={(e) => {
                setSelectedSchoolFilter(e.target.value);
                if (e.target.value !== 'all') {
                  setActiveSchoolId(e.target.value);
                }
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">គ្រប់សាលាទាំង ៧ (៧០ គ្រូ)</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>}

          {currentUserRole !== 'teacher' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមគ្រូថ្មី</span>
            </button>
          )}
        </div>
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const sSchool = schools.find(sch => sch.id === teacher.schoolId);

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-inner">
                      {teacher.gender === 'female' ? '👩‍🏫' : '👨‍🏫'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">
                        {teacher.nameKh}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-600 font-semibold">
                        {teacher.code}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sSchool?.nameKh}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      teacher.gender === 'female'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {teacher.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>ថ្នាក់ទទួលបន្ទុក៖ <strong className="text-slate-800">{teacher.homeroomClass || 'គ្មាន'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>ឯកទេស៖ <span className="text-slate-700">{teacher.subjectSpecialty}</span></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${teacher.phone}`} className="text-blue-600 font-mono hover:underline">
                      {teacher.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{teacher.education}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {currentUserRole !== 'teacher' && (
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>កែប្រែ</span>
                  </button>

                  <button
                    onClick={() => handleDelete(teacher.id, teacher.nameKh)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>លុប</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <TeacherModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTeacherToEdit(null);
        }}
        onSave={handleSave}
        teacherToEdit={teacherToEdit}
      />
    </div>
  );
};
