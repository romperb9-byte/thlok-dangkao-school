import React from 'react';
import { Student } from '../../types';
import { X, Printer, School, QrCode } from 'lucide-react';

interface StudentIDCardModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200 no-print">
          <h3 className="font-bold text-slate-800 text-sm">ប័ណ្ណសម្គាល់ខ្លួនសិស្ស (Student ID Card)</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center">
          <div
            id="student-id-card"
            className="w-full max-w-[340px] bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-5 shadow-xl border-2 border-amber-400 relative overflow-hidden"
          >
            {/* Background watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <School className="w-48 h-48" />
            </div>

            {/* School Header */}
            <div className="text-center pb-3 border-b border-blue-400/40">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <School className="w-4 h-4 text-amber-300" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  ព្រះរាជាណាចក្រកម្ពុជា
                </span>
              </div>
              <h2 className="text-sm font-bold font-moul tracking-wide text-white">
                សាលាបឋមសិក្សាថ្លុកដង្កោ
              </h2>
              <p className="text-[10px] text-blue-200 font-medium">
                THLOK DANGKAO PRIMARY SCHOOL
              </p>
            </div>

            {/* Photo & Main Details */}
            <div className="flex items-center gap-4 my-4">
              {/* Photo Box */}
              <div className="w-20 h-24 bg-white/10 rounded-xl border-2 border-white/40 flex flex-col items-center justify-center text-blue-200 shrink-0 overflow-hidden shadow-inner">
                <span className="text-3xl">{student.gender === 'female' ? '👧' : '👦'}</span>
                <span className="text-[9px] text-white/80 mt-1">រូបថត 4x6</span>
              </div>

              {/* Information */}
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-blue-300 text-[10px] block">ឈ្មោះសិស្ស៖</span>
                  <span className="font-bold text-sm text-amber-200">{student.nameKh}</span>
                </div>
                <div>
                  <span className="text-blue-300 text-[10px]">ភេទ៖ </span>
                  <span className="font-semibold">{student.gender === 'female' ? 'ស្រី' : 'ប្រុស'}</span>
                </div>
                <div>
                  <span className="text-blue-300 text-[10px]">ថ្នាក់ទី៖ </span>
                  <span className="font-semibold text-amber-300">ថ្នាក់ទី {student.grade}{student.section}</span>
                </div>
                <div>
                  <span className="text-blue-300 text-[10px]">ថ្ងៃខែឆ្នាំកំណើត៖ </span>
                  <span className="font-semibold text-[11px]">{student.dob}</span>
                </div>
              </div>
            </div>

            {/* Footer & QR Barcode */}
            <div className="pt-3 border-t border-blue-400/40 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-blue-300 block">អត្តលេខសិស្ស (ID)</span>
                <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
                  {student.code}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-lg border border-white/20">
                <QrCode className="w-7 h-7 text-white" />
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពប័ណ្ណ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
