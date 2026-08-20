import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { 
  Search, Plus, Edit2, Trash2, IdCard, 
  ChevronLeft, ChevronRight, Download, Users, Building2 
} from 'lucide-react';
import { StudentModal } from '../modals/StudentModal';
import { StudentIDCardModal } from '../modals/StudentIDCardModal';

interface StudentListProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ isAddModalOpen, onCloseAddModal }) => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    students, teachers, classes, addStudent, updateStudent, deleteStudent, 
    currentUser, currentUserRole 
  } = useSchool();

  const currentTeacher = teachers.find(t => t.id === currentUser?.referenceId);
  const teacherClass = classes.find(c => c.id === currentTeacher?.classId || c.name === currentTeacher?.homeroomClass);

  // Filters & Search
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(
    currentUserRole === 'cluster_head' ? 'all' : activeSchoolId
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSection, setSelectedSection] = useState<string | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'all'>('all');

  // Sync with activeSchoolId
  React.useEffect(() => {
    if (currentUserRole !== 'cluster_head') setSelectedSchoolFilter(activeSchoolId);
  }, [activeSchoolId, currentUserRole]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

  React.useEffect(() => {
    if (isAddModalOpen) {
      setStudentToEdit(null);
      setModalOpen(true);
    }
  }, [isAddModalOpen]);

  // Filtered Students with Strict RBAC
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. Teacher is strictly locked to their class
      if (currentUserRole === 'teacher') {
        if (teacherClass && s.classId !== teacherClass.id) return false;
        if (!teacherClass && s.schoolId !== activeSchoolId) return false;
      }
      // 2. Principal is strictly locked to their school
      else if (currentUserRole === 'principal') {
        if (s.schoolId !== activeSchoolId) return false;
      }
      // 3. Cluster Head can filter by school or see all
      else if (currentUserRole === 'cluster_head') {
        if (selectedSchoolFilter !== 'all' && s.schoolId !== selectedSchoolFilter) return false;
      }

      const matchSearch =
        s.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGrade = selectedGrade === 'all' || s.grade === selectedGrade;
      const matchSection = selectedSection === 'all' || s.section === selectedSection;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;

      return matchSearch && matchGrade && matchSection && matchGender;
    });
  }, [students, currentUserRole, teacherClass, activeSchoolId, selectedSchoolFilter, searchQuery, selectedGrade, selectedSection, selectedGender]);

  // Paginated Students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setStudentToEdit(student);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`តើលោកអ្នកពិតជាចង់លុបទិន្នន័យសិស្ស "${name}" មែនទេ?`)) {
      deleteStudent(id);
    }
  };

  const handleSaveStudent = (data: any) => {
    if (studentToEdit) {
      updateStudent(studentToEdit.id, data);
    } else {
      addStudent({
        ...data,
        schoolId: data.schoolId || activeSchoolId,
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setStudentToEdit(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const exportToCSV = () => {
    const headers = ['សាលារៀន,អត្តលេខ,ឈ្មោះសិស្ស,ភេទ,ថ្ងៃខែឆ្នាំកំណើត,ថ្នាក់,បន្ទប់,អាណាព្យាបាល,លេខទូរស័ព្ទ,អាសយដ្ឋាន'];
    const rows = filteredStudents.map(s => {
      const school = schools.find(sch => sch.id === s.schoolId);
      return `"${school?.nameKh || ''}","${s.code}","${s.nameKh}","${s.gender === 'female' ? 'ស្រី' : 'ប្រុស'}","${s.dob}","ថ្នាក់ទី ${s.grade}","${s.section}","${s.parentName}","${s.phone}","${s.address}"`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `បញ្ជីសិស្ស_${currentUserRole === 'teacher' ? currentTeacher?.homeroomClass : selectedSchoolFilter === 'all' ? 'កម្រង៧សាលា' : activeSchool.nameKh}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>
              {currentUserRole === 'teacher' 
                ? `បញ្ជីសិស្សក្នុង ${currentTeacher?.homeroomClass || 'ថ្នាក់រៀន'} (${filteredStudents.length} នាក់)` 
                : currentUserRole === 'principal'
                ? `បញ្ជីសិស្សក្នុង ${activeSchool.nameKh} (${filteredStudents.length} នាក់)`
                : `បញ្ជីសិស្សទូទាំងកម្រង (${filteredStudents.length} នាក់)`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentUserRole === 'teacher'
              ? 'គ្រប់គ្រងព័ត៌មានលម្អិតសិស្ស ៥០ នាក់ក្នុងថ្នាក់ផ្ទាល់ខ្លួន'
              : 'គ្រប់គ្រងទិន្នន័យសិស្ស និងបោះពុម្ពប័ណ្ណសិស្ស'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ទាញយក Excel</span>
          </button>

          {currentUserRole !== 'teacher' && currentUserRole !== 'student' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* School Filter (ONLY FOR CLUSTER HEAD) */}
          {currentUserRole === 'cluster_head' && (
            <div>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => {
                  setSelectedSchoolFilter(e.target.value);
                  if (e.target.value !== 'all') setActiveSchoolId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm font-bold text-blue-900 focus:outline-none"
              >
                <option value="all">គ្រប់សាលាទាំង ៧ (៣,៥០០ សិស្ស)</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.nameKh}</option>
                ))}
              </select>
            </div>
          )}

          {/* Search Box */}
          <div className={currentUserRole === 'cluster_head' ? '' : 'sm:col-span-2'}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Grade Filter (HIDDEN FOR TEACHER) */}
          {currentUserRole !== 'teacher' && (
            <div>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">គ្រប់កម្រិតថ្នាក់ (១-៦)</option>
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>ថ្នាក់ទី {g}</option>
                ))}
              </select>
            </div>
          )}

          {/* Gender Filter */}
          <div>
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">ភេទទាំងពីរ</option>
              <option value="male">សិស្សប្រុស</option>
              <option value="female">សិស្សស្រី</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">អត្តលេខ</th>
                <th className="py-3.5 px-4">ឈ្មោះសិស្ស</th>
                <th className="py-3.5 px-3">ភេទ</th>
                <th className="py-3.5 px-3">ថ្នាក់</th>
                <th className="py-3.5 px-4 hidden md:table-cell">សាលារៀន</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">អាណាព្យាបាល</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">លេខទូរស័ព្ទ</th>
                <th className="py-3.5 px-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    រកមិនឃើញទិន្នន័យសិស្សឡើយ
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const sSchool = schools.find(sch => sch.id === student.schoolId);

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {student.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{student.nameKh}</div>
                        <div className="text-[11px] text-slate-400 sm:hidden">
                          ថ្នាក់ទី {student.grade}{student.section} • {sSchool?.nameKh}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            student.gender === 'female'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          ទី {student.grade}{student.section}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-slate-600 text-xs truncate max-w-[180px]">
                        {sSchool?.nameKh || '—'}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-slate-600">
                        {student.parentName || '—'}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-slate-600 font-mono text-xs">
                        {student.phone || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setIdCardStudent(student)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                            title="បោះពុម្ពកាតសិស្ស"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                            title="កែប្រែព័ត៌មាន"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {currentUserRole !== 'teacher' && currentUserRole !== 'student' && (
                            <button
                              onClick={() => handleDelete(student.id, student.nameKh)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="លុបទិន្នន័យ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ទំព័រ <strong className="text-slate-800">{currentPage}</strong> នៃ {totalPages} (សរុប {filteredStudents.length} នាក់)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
              {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      <StudentIDCardModal
        isOpen={!!idCardStudent}
        onClose={() => setIdCardStudent(null)}
        student={idCardStudent}
      />
    </div>
  );
};
