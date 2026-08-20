import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Receipt } from '../../types';
import { ReceiptText, Plus, Printer, Trash2, Search, Building2 } from 'lucide-react';
import { ReceiptModal } from '../modals/ReceiptModal';

export const ReceiptManager: React.FC = () => {
  const { 
    schools, activeSchoolId, activeSchool, setActiveSchoolId,
    receipts, students, addReceipt, deleteReceipt, 
    currentUserRole, currentTeacherId, teachers 
  } = useSchool();

  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(activeSchoolId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<Receipt | null>(null);

  React.useEffect(() => {
    setSelectedSchoolFilter(activeSchoolId);
  }, [activeSchoolId]);

  const schoolStudents = students.filter(s => s.schoolId === activeSchoolId);

  // New receipt form state
  const [newReceipt, setNewReceipt] = useState({
    studentId: '',
    amount: 20000,
    currency: 'KHR' as 'KHR' | 'USD',
    feeType: 'វិភាគទានសាលា' as const,
    paymentMethod: 'សាច់ប្រាក់' as const,
    note: 'វិភាគទានអភិវឌ្ឍន៍សាលារៀន',
  });

  const filteredReceipts = useMemo(() => {
    return receipts.filter(r => {
      const matchSchool = selectedSchoolFilter === 'all' || r.schoolId === selectedSchoolFilter;
      const matchSearch =
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.className.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedFeeType === 'all' || r.feeType === selectedFeeType;

      return matchSchool && matchSearch && matchType;
    });
  }, [receipts, selectedSchoolFilter, searchQuery, selectedFeeType]);

  const totalKHR = useMemo(() => {
    return filteredReceipts
      .filter(r => r.currency === 'KHR')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [filteredReceipts]);

  const totalUSD = useMemo(() => {
    return filteredReceipts
      .filter(r => r.currency === 'USD')
      .reduce((sum, r) => sum + r.amount, 0);
  }, [filteredReceipts]);

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const student = schoolStudents.find(s => s.id === newReceipt.studentId) || schoolStudents[0] || students[0];
    const teacher = teachers.find(t => t.id === currentTeacherId);

    const created: Omit<Receipt, 'id' | 'receiptNumber'> = {
      schoolId: activeSchoolId,
      date: new Date().toISOString().split('T')[0],
      studentId: student.id,
      studentName: student.nameKh,
      className: `ថ្នាក់ទី ${student.grade}${student.section}`,
      amount: Number(newReceipt.amount),
      currency: newReceipt.currency,
      feeType: newReceipt.feeType,
      paymentMethod: newReceipt.paymentMethod,
      cashierName: currentUserRole === 'teacher' ? (teacher?.nameKh || 'លោកគ្រូ-អ្នកគ្រូ') : activeSchool.principalName,
      note: newReceipt.note,
    };

    addReceipt(created);
    setShowAddModal(false);
  };

  const handleDelete = (id: string, num: string) => {
    if (window.confirm(`តើលោកអ្នកពិតជាចង់លុបបង្កាន់ដៃលេខ "${num}" មែនទេ?`)) {
      deleteReceipt(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-blue-600" />
            <span>វិភាគទានសាលា និងបង្កាន់ដៃបង់ប្រាក់</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            គ្រប់គ្រងការចេញបង្កាន់ដៃវិភាគទានអភិវឌ្ឍន៍សាលារៀនក្នុងកម្រង
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedSchoolFilter}
              onChange={(e) => {
                setSelectedSchoolFilter(e.target.value);
                if (e.target.value !== 'all') setActiveSchoolId(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">គ្រប់សាលាទាំង ៧</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (schoolStudents.length > 0) {
                setNewReceipt(prev => ({ ...prev, studentId: schoolStudents[0].id }));
              }
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>ចេញបង្កាន់ដៃថ្មី</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">ចំណូលសរុប (រៀល)</span>
            <div className="text-2xl font-bold text-blue-700 mt-1 font-mono">
              {totalKHR.toLocaleString()} ៛
            </div>
            <span className="text-[11px] text-slate-400">គិតត្រឹមថ្ងៃនេះ</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            ៛
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">ចំណូលសរុប (ដុល្លារ)</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
              ${totalUSD.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">គិតត្រឹមថ្ងៃនេះ</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            $
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">ចំនួនបង្កាន់ដៃចេញ</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {filteredReceipts.length} <span className="text-sm font-normal text-slate-500">សន្លឹក</span>
            </div>
            <span className="text-[11px] text-slate-400">បានរក្សាទុក</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ReceiptText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">លេខបង្កាន់ដៃ</th>
                <th className="py-3.5 px-4">ឈ្មោះសិស្ស</th>
                <th className="py-3.5 px-3">ថ្នាក់</th>
                <th className="py-3.5 px-4">ប្រភេទ</th>
                <th className="py-3.5 px-4">ទឹកប្រាក់</th>
                <th className="py-3.5 px-4 hidden md:table-cell">សាលារៀន</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">កាលបរិច្ឆេទ</th>
                <th className="py-3.5 px-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    មិនមានទិន្នន័យបង្កាន់ដៃឡើយ
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((rec) => {
                  const sSchool = schools.find(s => s.id === rec.schoolId);

                  return (
                    <tr key={rec.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {rec.receiptNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {rec.studentName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {rec.className}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-blue-800 font-medium">
                        {rec.feeType}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {rec.amount.toLocaleString()} {rec.currency === 'KHR' ? '៛' : '$'}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-slate-500 text-xs truncate max-w-[150px]">
                        {sSchool?.nameKh}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-slate-500 font-mono">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedReceiptForPrint(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            title="មើល និងបោះពុម្ពបង្កាន់ដៃ"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {currentUserRole !== 'teacher' && (
                            <button
                              onClick={() => handleDelete(rec.id, rec.receiptNumber)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="លុប"
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
      </div>

      {/* Add Receipt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-100 animate-in fade-in">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-blue-600" />
              <span>ចេញបង្កាន់ដៃទទួលប្រាក់ ({activeSchool.nameKh})</span>
            </h3>

            <form onSubmit={handleCreateReceipt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ជ្រើសរើសសិស្ស</label>
                <select
                  value={newReceipt.studentId}
                  onChange={(e) => setNewReceipt({ ...newReceipt, studentId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {schoolStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nameKh} ({s.code} - ថ្នាក់ទី {s.grade}{s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ចំនួនទឹកប្រាក់</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newReceipt.amount}
                    onChange={(e) => setNewReceipt({ ...newReceipt, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">រូបិយប័ណ្ណ</label>
                  <select
                    value={newReceipt.currency}
                    onChange={(e) => setNewReceipt({ ...newReceipt, currency: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  >
                    <option value="KHR">រៀល (KHR)</option>
                    <option value="USD">ដុល្លារ (USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ប្រភេទការបង់ / វិភាគទាន</label>
                <select
                  value={newReceipt.feeType}
                  onChange={(e) => setNewReceipt({ ...newReceipt, feeType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="វិភាគទានសាលា">វិភាគទានសាលា</option>
                  <option value="សៀវភៅ-សម្ភារៈ">សៀវភៅ-សម្ភារៈ</option>
                  <option value="ឯកសណ្ឋាន">ឯកសណ្ឋាន</option>
                  <option value="បណ្ណាល័យ">បណ្ណាល័យ</option>
                  <option value="ផ្សេងៗ">ផ្សេងៗ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">វិធីសាស្ត្របង់ប្រាក់</label>
                <select
                  value={newReceipt.paymentMethod}
                  onChange={(e) => setNewReceipt({ ...newReceipt, paymentMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                >
                  <option value="សាច់ប្រាក់">សាច់ប្រាក់ (Cash)</option>
                  <option value="ABA Pay">ABA Pay</option>
                  <option value="Wing">Wing</option>
                  <option value="ផ្សេងៗ">ផ្សេងៗ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">សម្គាល់</label>
                <input
                  type="text"
                  placeholder="ឧ. វិភាគទានអភិវឌ្ឍន៍សាលា..."
                  value={newReceipt.note}
                  onChange={(e) => setNewReceipt({ ...newReceipt, note: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  ចេញបង្កាន់ដៃ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReceiptModal
        isOpen={!!selectedReceiptForPrint}
        onClose={() => setSelectedReceiptForPrint(null)}
        receipt={selectedReceiptForPrint}
      />
    </div>
  );
};
