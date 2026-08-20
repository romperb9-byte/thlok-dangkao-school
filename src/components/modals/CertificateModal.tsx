import React from 'react';
import { Student, StudentGrade } from '../../types';
import { X, Printer, Award, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  student: Student | null;
  grade: StudentGrade | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  grade,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student || !grade) return null;

  const handlePrint = () => {
    window.print();
  };

  const rankKhmer = ['លេខ ១ (ឆ្នើម)', 'លេខ ២', 'លេខ ៣', 'លេខ ៤', 'លេខ ៥'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">ប័ណ្ណសរសើរ (Certificate of Honor)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-8 flex justify-center bg-slate-50">
          <div
            id="certificate-print"
            className="w-full max-w-xl bg-white border-8 border-double border-amber-600 rounded-2xl p-6 sm:p-8 text-center relative shadow-lg text-slate-800"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500 text-xl font-bold">⚜️</div>
            <div className="absolute top-2 right-2 text-amber-500 text-xl font-bold">⚜️</div>
            <div className="absolute bottom-2 left-2 text-amber-500 text-xl font-bold">⚜️</div>
            <div className="absolute bottom-2 right-2 text-amber-500 text-xl font-bold">⚜️</div>

            {/* Header Text */}
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold tracking-widest text-slate-600">
                ព្រះរាជាណាចក្រកម្ពុជា
              </p>
              <p className="text-xs font-semibold text-slate-600">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </p>
              <div className="text-amber-600 text-lg">★★★</div>
              <p className="text-xs text-blue-900 font-bold">
                ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកជើងព្រៃ
              </p>
              <p className="text-sm font-bold font-moul text-blue-800">
                សាលាបឋមសិក្សាថ្លុកដង្កោ
              </p>
            </div>

            {/* Certificate Title */}
            <div className="my-6">
              <h1 className="text-2xl sm:text-3xl font-bold font-moul text-amber-700 underline decoration-amber-400 underline-offset-8">
                ប័ណ្ណសរសើរ
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-2">
                ជូនចំពោះសិស្សពូកែ និងមានវិន័យគំរូ
              </p>
            </div>

            {/* Body of Certificate */}
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 text-justify sm:text-center px-2 sm:px-6">
              <p>
                គណៈគ្រប់គ្រងសាលាបឋមសិក្សាថ្លុកដង្កោ សូមកោតសរសើរចំពោះ៖
              </p>
              <div className="text-lg sm:text-xl font-bold font-moul text-blue-900 py-1 border-b border-dashed border-slate-300 inline-block">
                កុមារា/កុមារី៖ {student.nameKh}
              </div>
              <p>
                ភេទ៖ <strong>{student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}</strong> | 
                ជាសិស្សរៀននៅ៖ <strong>ថ្នាក់ទី {student.grade}{student.section}</strong> | 
                អត្តលេខ៖ <strong>{student.code}</strong>
              </p>
              <p className="text-slate-600">
                ដែលបានខិតខំប្រឹងប្រែងរៀនសូត្រ ទទួលបានលទ្ធផលប្រឡងប្រចាំ <strong>ខែ{grade.month}</strong> ជាប់ចំណាត់ថ្នាក់ 
                <span className="text-amber-700 font-bold text-base sm:text-lg mx-1">
                  {grade.rank ? rankKhmer[(grade.rank - 1)] || `លេខ ${grade.rank}` : 'ឆ្នើម'}
                </span>
                មធ្យមភាគ <strong>{grade.averageScore}</strong> ពិន្ទុ (និទ្ទេស <strong>{grade.gradeLevel}</strong>)។
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-4 flex justify-between items-end text-xs text-slate-700 px-4">
              <div className="text-center">
                <p>បានឃើញ និងយល់ព្រម</p>
                <p className="font-bold text-blue-900 mt-1">នាយកសាលា</p>
                <div className="h-14"></div>
                <p className="font-semibold text-slate-500">(ហត្ថលេខា និងត្រា)</p>
              </div>

              <div className="text-center">
                <p>ថ្លុកដង្កោ, ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</p>
                <p className="font-bold text-blue-900 mt-1">គ្រូទទួលបន្ទុកថ្នាក់</p>
                <div className="h-14"></div>
                <p className="font-semibold text-slate-500">(ហត្ថលេខា)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200"
          >
            បិទ
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពប័ណ្ណសរសើរ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
