import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LoginView } from './components/auth/LoginView';
import { AccountsDirectory } from './components/auth/AccountsDirectory';
import { ClusterOverview } from './components/cluster/ClusterOverview';
import { Dashboard } from './components/dashboard/Dashboard';
import { StudentList } from './components/students/StudentList';
import { TeacherList } from './components/teachers/TeacherList';
import { ClassSchedule } from './components/classes/ClassSchedule';
import { AttendanceSheet } from './components/attendance/AttendanceSheet';
import { GradeBook } from './components/grades/GradeBook';
import { ReceiptManager } from './components/finance/ReceiptManager';
import { DataManagement } from './components/backup/DataManagement';
import { StudentPortal } from './components/student-portal/StudentPortal';

export const AppContent: React.FC = () => {
  const { currentUser, isLoggedIn, currentUserRole } = useSchool();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (currentUserRole === 'student') return 'student_portal';
    if (currentUserRole === 'cluster_head') return 'cluster';
    return 'dashboard';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Sync tab when user changes role
  useEffect(() => {
    if (currentUserRole === 'student') {
      setActiveTab('student_portal');
    } else if (currentUserRole === 'cluster_head' && activeTab === 'student_portal') {
      setActiveTab('cluster');
    } else if (activeTab === 'student_portal') {
      setActiveTab('dashboard');
    }
  }, [currentUserRole]);

  // If not logged in, render Login View
  if (!isLoggedIn || !currentUser) {
    return (
      <>
        <LoginView />
        <AccountsDirectory />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-khmer selection:bg-blue-600 selection:text-white">
      {/* Navbar Header */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content View */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-10 overflow-y-auto max-w-full">
          {activeTab === 'student_portal' && <StudentPortal />}

          {activeTab === 'cluster' && (
            <ClusterOverview setActiveTab={setActiveTab} />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenAddStudent={() => {
                setActiveTab('students');
                setIsAddStudentOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentList
              isAddModalOpen={isAddStudentOpen}
              onCloseAddModal={() => setIsAddStudentOpen(false)}
            />
          )}

          {activeTab === 'teachers' && <TeacherList />}

          {activeTab === 'classes' && <ClassSchedule />}

          {activeTab === 'attendance' && <AttendanceSheet />}

          {activeTab === 'grades' && <GradeBook />}

          {activeTab === 'receipts' && <ReceiptManager />}

          {activeTab === 'backup' && <DataManagement />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Accounts Directory Modal */}
      <AccountsDirectory />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
