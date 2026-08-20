import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { DatabaseBackup, Download, Upload, AlertTriangle, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

export const DataManagement: React.FC = () => {
  const { 
    students, teachers, classes, attendance, grades, receipts, 
    exportDataJSON, importDataJSON, resetAllData, currentUserRole 
  } = useSchool();

  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ទិន្នន័យ_សាលាបឋមសិក្សាថ្លុកដង្កោ_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('success');
        setTimeout(() => setImportStatus(null), 3500);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const confirm1 = window.confirm(
      '⚠️ ការព្រមានសំខាន់៖ តើលោកអ្នកពិតជាចង់កំណត់ទិន្នន័យទាំងអស់ឡើងវិញ (Reset to Default) មែនទេ?'
    );
    if (confirm1) {
      const confirm2 = window.prompt('សូមវាយពាក្យ "យល់ព្រម" ដើម្បីបញ្ជាក់ការលុប និងកំណត់ឡើងវិញ៖');
      if (confirm2 === 'យល់ព្រម') {
        resetAllData();
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <DatabaseBackup className="w-6 h-6 text-blue-600" />
          <span>ការគ្រប់គ្រង និងបម្រុងទុកទិន្នន័យ (Data Backup & Restore)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ទាញយកទិន្នន័យរក្សាទុកលើកុំព្យូទ័រ/ទូរស័ព្ទ និងស្តារទិន្នន័យឡើងវិញនៅពេលត្រូវការ
        </p>
      </div>

      {/* Status Alerts */}
      {importStatus === 'success' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>បានស្តារទិន្នន័យជោគជ័យពីឯកសារ Backup!</span>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>ឯកសារមិនត្រឹមត្រូវ ឬមានបញ្ហាក្នុងការអានទិន្នន័យ!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-800 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
          <span>បានកំណត់ទិន្នន័យគំរូដើមឡើងវិញដោយជោគជ័យ!</span>
        </div>
      )}

      {/* Summary Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800">ស្ថិតិទិន្នន័យក្នុងប្រព័ន្ធបច្ចុប្បន្ន</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">សិស្ស</span>
            <span className="text-lg font-bold text-blue-600">{students.length} នាក់</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">គ្រូបង្រៀន</span>
            <span className="text-lg font-bold text-emerald-600">{teachers.length} នាក់</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">ថ្នាក់រៀន</span>
            <span className="text-lg font-bold text-purple-600">{classes.length} ថ្នាក់</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">កំណត់ត្រាវត្តមាន</span>
            <span className="text-lg font-bold text-amber-600">{attendance.length}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">កំណត់ត្រាពិន្ទុ</span>
            <span className="text-lg font-bold text-indigo-600">{grades.length}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block">បង្កាន់ដៃចេញ</span>
            <span className="text-lg font-bold text-pink-600">{receipts.length}</span>
          </div>
        </div>
      </div>

      {/* Backup and Restore Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">ទាញយកទិន្នន័យបម្រុងទុក (Export Backup)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ទាញយកទិន្នន័យសាលាទាំងអស់ (សិស្ស, គ្រូ, វត្តមាន, ពិន្ទុ, បង្កាន់ដៃ) ជាឯកសារ JSON រក្សាទុកក្នុងកុំព្យូទ័រ ឬ Flash Drive ដើម្បីការពារការបាត់បង់។
            </p>
          </div>

          <button
            onClick={handleExport}
            className="mt-6 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>ទាញយកឯកសារ Backup (.json)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">ស្តារទិន្នន័យឡើងវិញ (Restore Backup)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ជ្រើសរើសឯកសារ Backup JSON ដែលបានទាញយកពីមុន ដើម្បីបញ្ចូលទិន្នន័យមកក្នុងប្រព័ន្ធវិញ។
            </p>
          </div>

          <label className="mt-6 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
            <Upload className="w-4 h-4" />
            <span>ជ្រើសរើសឯកសារដើម្បីស្តារ</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone */}
      {(currentUserRole === 'cluster_head' || currentUserRole === 'principal') && (
        <div className="bg-rose-50/70 border border-rose-200 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-rose-900">តំបន់ប្រុងប្រយ័ត្ន (Danger Zone)</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                ការកំណត់ឡើងវិញនឹងសម្អាតទិន្នន័យដែលបានកែប្រែទាំងអស់ ហើយត្រឡប់ទៅទិន្នន័យគំរូដើមរបស់សាលាបឋមសិក្សាថ្លុកដង្កោ (សិស្ស ៤០០ នាក់ និង គ្រូ ១២ នាក់)។ ប្រព័ន្ធនឹងសួរការបញ្ជាក់មុនពេលអនុវត្ត។
              </p>

              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>កំណត់ទិន្នន័យឡើងវិញ (Reset to Default)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
