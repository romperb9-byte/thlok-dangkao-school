import React from 'react';
import { TabType } from './Sidebar';
import { LayoutDashboard, GraduationCap, ClipboardCheck, Award, ReceiptText } from 'lucide-react';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard' as TabType, label: 'ផ្ទាំងដើម', icon: LayoutDashboard },
    { id: 'students' as TabType, label: 'សិស្ស', icon: GraduationCap },
    { id: 'attendance' as TabType, label: 'វត្តមាន', icon: ClipboardCheck },
    { id: 'grades' as TabType, label: 'ពិន្ទុ', icon: Award },
    { id: 'receipts' as TabType, label: 'បង្កាន់ដៃ', icon: ReceiptText },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 z-30 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
