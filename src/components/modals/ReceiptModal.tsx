import React from 'react';
import { Receipt } from '../../types';
import { X, Printer, School, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  receipt: Receipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200 no-print">
          <h3 className="font-bold text-slate-800 text-sm">បង្កាន់ដៃទទួលប្រាក់ (Receipt Preview)</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 bg-slate-50 flex justify-center">
          <div
            id="receipt-print"
            className="w-full bg-white border border-slate-300 rounded-2xl p-6 shadow-sm text-slate-800 space-y-4 relative"
          >
            {/* Watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <School className="w-64 h-64" />
            </div>

            {/* School Receipt Header */}
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-200">
              <p className="text-[11px] uppercase font-bold tracking-widest text-slate-500">
                ព្រះរាជាណាចក្រកម្ពុជា • ជាតិ សាសនា ព្រះមហាក្សត្រ
              </p>
              <h2 className="text-base font-bold font-moul text-blue-900 mt-1">
                សាលាបឋមសិក្សាថ្លុកដង្កោ
              </h2>
              <h1 className="text-sm font-bold text-slate-800 mt-2 underline">
                បង្កាន់ដៃទទួលប្រាក់ (OFFICIAL RECEIPT)
              </h1>
              <p className="text-xs font-mono font-bold text-blue-600 mt-1">
                លេខបង្កាន់ដៃ: {receipt.receiptNumber}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">កាលបរិច្ឆេទចេញ៖</span>
                <span className="font-semibold font-mono">{receipt.date}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ឈ្មោះសិស្ស៖</span>
                <span className="font-bold text-sm text-slate-900">{receipt.studentName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ថ្នាក់រៀន៖</span>
                <span className="font-semibold">{receipt.className}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">ប្រភេទការបង់ / វិភាគទាន៖</span>
                <span className="font-semibold text-blue-700">{receipt.feeType}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">វិធីសាស្ត្រទូទាត់៖</span>
                <span className="font-semibold">{receipt.paymentMethod}</span>
              </div>

              {receipt.note && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">សម្គាល់៖</span>
                  <span className="text-slate-700 italic">{receipt.note}</span>
                </div>
              )}

              {/* Total Amount Box */}
              <div className="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex justify-between items-center">
                <span className="font-bold text-blue-900 text-sm">ទឹកប្រាក់សរុប៖</span>
                <span className="text-lg font-bold font-mono text-blue-700">
                  {receipt.amount.toLocaleString()} {receipt.currency === 'KHR' ? '៛ (រៀល)' : '$'}
                </span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-600 px-2">
              <div className="text-center">
                <p>អ្នកបង់ប្រាក់</p>
                <div className="h-10"></div>
                <p className="font-semibold text-slate-400">(ស្នាមមេដៃ ឬហត្ថលេខា)</p>
              </div>

              <div className="text-center">
                <p>អ្នកទទួលប្រាក់ / បេឡា</p>
                <div className="h-10"></div>
                <p className="font-bold text-slate-800">{receipt.cashierName}</p>
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពបង្កាន់ដៃ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
