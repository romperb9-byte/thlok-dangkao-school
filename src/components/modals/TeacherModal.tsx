import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { X, UserCheck, Save } from 'lucide-react';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Omit<Teacher, 'id' | 'code'> | Partial<Teacher>) => void;
  teacherToEdit?: Teacher | null;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacherToEdit,
}) => {
  const { schools, activeSchoolId } = useSchool();

  const [formData, setFormData] = useState({
    schoolId: activeSchoolId,
    nameKh: '',
    nameEn: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    subjectSpecialty: 'គរុកោសល្យបឋមសិក្សា',
    homeroomClass: 'ថ្នាក់ទី១ក',
    education: 'បរិញ្ញាបត្រគរុកោសល្យ',
    status: 'active' as Teacher['status'],
  });

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({
        schoolId: teacherToEdit.schoolId,
        nameKh: teacherToEdit.nameKh,
        nameEn: teacherToEdit.nameEn || '',
        gender: teacherToEdit.gender,
        phone: teacherToEdit.phone,
        subjectSpecialty: teacherToEdit.subjectSpecialty,
        homeroomClass: teacherToEdit.homeroomClass || 'គ្មាន',
        education: teacherToEdit.education,
        status: teacherToEdit.status,
      });
    } else {
      setFormData({
        schoolId: activeSchoolId,
        nameKh: '',
        nameEn: '',
        gender: 'male',
        phone: '',
        subjectSpecialty: 'គរុកោសល្យបឋមសិក្សា',
        homeroomClass: 'ថ្នាក់ទី១ក',
        education: 'បរិញ្ញាបត្រគរុកោសល្យ',
        status: 'active',
      });
    }
  }, [teacherToEdit, isOpen, activeSchoolId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKh.trim()) {
      alert('សូមបញ្ចូលឈ្មោះលោកគ្រូ-អ្នកគ្រូ!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {teacherToEdit ? 'កែប្រែព័ត៌មានគ្រូបង្រៀន' : 'បន្ថែមគ្រូបង្រៀនថ្មី'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              សាលារៀនបង្រៀន <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.schoolId}
              onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-900"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              គោត្តនាម និងនាម (ខ្មែរ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ឧ. លោកគ្រូ សុខ ចិន្តា"
              value={formData.nameKh}
              onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ភេទ <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="male">ប្រុស (Male)</option>
                <option value="female">ស្រី (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                លេខទូរស័ព្ទ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="012 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ថ្នាក់ទទួលបន្ទុក (Homeroom)
              </label>
              <select
                value={formData.homeroomClass}
                onChange={(e) => setFormData({ ...formData, homeroomClass: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              >
                <option value="គ្មាន">គ្មាន (គ្រូជំនួយ/រដ្ឋបាល)</option>
                <option value="ថ្នាក់ទី១ក">ថ្នាក់ទី១ក</option>
                <option value="ថ្នាក់ទី១ខ">ថ្នាក់ទី១ខ</option>
                <option value="ថ្នាក់ទី២ក">ថ្នាក់ទី២ក</option>
                <option value="ថ្នាក់ទី២ខ">ថ្នាក់ទី២ខ</option>
                <option value="ថ្នាក់ទី៣ក">ថ្នាក់ទី៣ក</option>
                <option value="ថ្នាក់ទី៣ខ">ថ្នាក់ទី៣ខ</option>
                <option value="ថ្នាក់ទី៤ក">ថ្នាក់ទី៤ក</option>
                <option value="ថ្នាក់ទី៤ខ">ថ្នាក់ទី៤ខ</option>
                <option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</option>
                <option value="ថ្នាក់ទី៦">ថ្នាក់ទី៦</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                កម្រិតវប្បធម៌
              </label>
              <input
                type="text"
                placeholder="ឧ. បរិញ្ញាបត្រគរុកោសល្យ"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ឯកទេសបង្រៀន
            </label>
            <input
              type="text"
              placeholder="ឧ. គរុកោសល្យបឋម (ភាសាខ្មែរ & គណិតវិទ្យា)"
              value={formData.subjectSpecialty}
              onChange={(e) => setFormData({ ...formData, subjectSpecialty: e.target.value })}
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុក</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
