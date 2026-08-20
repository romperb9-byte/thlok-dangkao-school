import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { X, UserPlus, Save } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<Student, 'id' | 'code'> | Partial<Student>) => void;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const { schools, activeSchoolId, classes } = useSchool();

  const [formData, setFormData] = useState({
    schoolId: activeSchoolId,
    nameKh: '',
    nameEn: '',
    gender: 'male' as 'male' | 'female',
    dob: '2018-05-15',
    parentName: '',
    phone: '',
    address: 'ភូមិថ្លុកដង្កោ ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    grade: 1,
    section: 'ក',
    classId: '',
    status: 'active' as Student['status'],
  });

  const availableClasses = classes.filter(c => c.schoolId === formData.schoolId);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        schoolId: studentToEdit.schoolId,
        nameKh: studentToEdit.nameKh,
        nameEn: studentToEdit.nameEn || '',
        gender: studentToEdit.gender,
        dob: studentToEdit.dob,
        parentName: studentToEdit.parentName,
        phone: studentToEdit.phone,
        address: studentToEdit.address,
        grade: studentToEdit.grade,
        section: studentToEdit.section,
        classId: studentToEdit.classId,
        status: studentToEdit.status,
      });
    } else {
      setFormData({
        schoolId: activeSchoolId,
        nameKh: '',
        nameEn: '',
        gender: 'male',
        dob: '2018-05-15',
        parentName: '',
        phone: '',
        address: 'ភូមិថ្លុកដង្កោ ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
        grade: 1,
        section: 'ក',
        classId: availableClasses[0]?.id || '',
        status: 'active',
      });
    }
  }, [studentToEdit, isOpen, activeSchoolId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKh.trim()) {
      alert('សូមបញ្ចូលឈ្មោះសិស្ស!');
      return;
    }
    const matchedClass = availableClasses.find(c => c.grade === formData.grade && c.section === formData.section);
    onSave({
      ...formData,
      classId: matchedClass?.id || availableClasses[0]?.id || 'cls-1',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {studentToEdit ? 'កែប្រែព័ត៌មានសិស្ស' : 'ចុះឈ្មោះសិស្សថ្មី'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              សាលារៀន (ក្នុងកម្រង) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-blue-900"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ឈ្មោះសិស្ស (ជាភាសាខ្មែរ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ឧ. សុខ ពិសិដ្ឋ"
              value={formData.nameKh}
              onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ភេទ <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="male">ប្រុស (Male)</option>
                <option value="female">ស្រី (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ថ្ងៃខែឆ្នាំកំណើត <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                កម្រិតថ្នាក់ទី <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>ថ្នាក់ទី {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                បន្ទប់ <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="ក">បន្ទប់ ក</option>
                <option value="ខ">បន្ទប់ ខ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ឈ្មោះឪពុក ឬម្តាយ (អាណាព្យាបាល)
            </label>
            <input
              type="text"
              placeholder="ឧ. សុខ ហេង"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              លេខទូរស័ព្ទទំនាក់ទំនង
            </label>
            <input
              type="text"
              placeholder="ឧ. 012 345 678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              អាសយដ្ឋានបច្ចុប្បន្ន
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុកទិន្នន័យ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
