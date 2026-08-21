import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SchoolCluster, School, Student, Teacher, Classroom, Subject, 
  AttendanceRecord, StudentGrade, Receipt, TimetableEntry, UserRole, UserAccount 
} from '../types';
import { 
  INITIAL_CLUSTER, INITIAL_SCHOOLS, INITIAL_CLASSES, INITIAL_TEACHERS,
  INITIAL_SUBJECTS, INITIAL_STUDENTS, generateInitialAttendance, 
  generateInitialGrades, INITIAL_RECEIPTS, SAMPLE_TIMETABLES, INITIAL_ACCOUNTS 
} from '../data/initialData';
import { appMode, supabase } from '../lib/supabase';

interface SchoolContextType {
  cluster: SchoolCluster;
  schools: School[];
  activeSchoolId: string;
  activeSchool: School;
  
  students: Student[];
  teachers: Teacher[];
  classes: Classroom[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  grades: StudentGrade[];
  receipts: Receipt[];
  timetables: TimetableEntry[];
  
  // Auth State
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  accounts: UserAccount[];
  currentUserRole: UserRole;
  currentTeacherId: string;
  showAccountsModal: boolean;
  
  // Auth Actions
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchAccount: (account: UserAccount) => void;
  setShowAccountsModal: (show: boolean) => void;
  
  // Role & Filter Actions
  setUserRole: (role: UserRole) => void;
  setActiveSchoolId: (schoolId: string) => void;
  setCurrentTeacherId: (teacherId: string) => void;
  
  // Student CRUD
  addStudent: (student: Omit<Student, 'id' | 'code'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, 'id' | 'code'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  // Attendance
  recordAttendance: (
    schoolId: string, 
    classId: string, 
    date: string, 
    records: { studentId: string; status: AttendanceRecord['status']; note?: string }[]
  ) => void;
  
  // Grades
  saveGrade: (grade: Omit<StudentGrade, 'id'>) => void;
  
  // Receipts
  addReceipt: (receipt: Omit<Receipt, 'id' | 'receiptNumber'>) => void;
  deleteReceipt: (id: string) => void;

  // Timetable
  addTimetable: (entry: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetable: (id: string) => void;
  
  // Backup & Reset
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY_CLUSTER = 'td_cluster_v3';
const STORAGE_KEY_SCHOOLS = 'td_schools_v3';
const STORAGE_KEY_ACTIVE_SCHOOL = 'td_active_school_v3';
const STORAGE_KEY_STUDENTS = 'td_students_v3';
const STORAGE_KEY_TEACHERS = 'td_teachers_v3';
const STORAGE_KEY_CLASSES = 'td_classes_v3';
const STORAGE_KEY_SUBJECTS = 'td_subjects_v3';
const STORAGE_KEY_ATTENDANCE = 'td_attendance_v3';
const STORAGE_KEY_GRADES = 'td_grades_v3';
const STORAGE_KEY_RECEIPTS = 'td_receipts_v3';
const STORAGE_KEY_TIMETABLES = 'td_timetables_v3';
const STORAGE_KEY_AUTH = 'td_auth_user_v3';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cluster] = useState<SchoolCluster>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLUSTER);
    return saved ? JSON.parse(saved) : INITIAL_CLUSTER;
  });

  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SCHOOLS);
    return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
  });

  const [activeSchoolId, setActiveSchoolIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_SCHOOL);
    return saved || 'sch-1';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TEACHERS);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [classes, setClasses] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLASSES);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [subjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SUBJECTS);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    return saved ? JSON.parse(saved) : generateInitialAttendance(INITIAL_STUDENTS);
  });

  const [grades, setGrades] = useState<StudentGrade[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GRADES);
    return saved ? JSON.parse(saved) : generateInitialGrades(INITIAL_STUDENTS);
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECEIPTS);
    return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
  });

  const [timetables, setTimetables] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIMETABLES);
    return saved ? JSON.parse(saved) : SAMPLE_TIMETABLES;
  });

  const [accounts] = useState<UserAccount[]>(appMode === 'demo' ? INITIAL_ACCOUNTS : []);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (appMode === 'production') return null;
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS[0]; // Default logged in as cluster head
  });

  const [currentTeacherId, setCurrentTeacherIdState] = useState<string>('t-sch-1-1');
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHOOLS, JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SCHOOL, activeSchoolId);
  }, [activeSchoolId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIMETABLES, JSON.stringify(timetables));
  }, [timetables]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  const activeSchool = schools.find(s => s.id === activeSchoolId) || schools[0];
  const currentUserRole: UserRole = currentUser?.role || 'cluster_head';
  const isLoggedIn = !!currentUser;

  const loadProductionUser = async (authUserId: string) => {
    if (!supabase) return false;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, school_id, role, display_name, phone, active')
      .eq('id', authUserId)
      .single();

    if (error || !profile || !profile.active) {
      setCurrentUser(null);
      return false;
    }

    const school = schools.find(item => item.id === profile.school_id);
    setCurrentUser({
      id: profile.id,
      username: profile.id,
      role: profile.role as UserRole,
      displayName: profile.display_name,
      titleKh: profile.role === 'cluster_head' ? 'ប្រធានកម្រង' : 'អ្នកប្រើប្រាស់',
      schoolId: profile.school_id || undefined,
      schoolName: school?.nameKh,
      phone: profile.phone || undefined,
    });
    if (profile.school_id) setActiveSchoolIdState(profile.school_id);
    return true;
  };

  useEffect(() => {
    if (appMode !== 'production' || !supabase) return;

    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void loadProductionUser(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void loadProductionUser(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [schools]);

  // Auth Methods
  const login = async (username: string, password?: string): Promise<boolean> => {
    if (appMode === 'production') {
      if (!supabase || !password) return false;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password,
      });
      if (error || !data.user) return false;
      return loadProductionUser(data.user.id);
    }

    const cleanUser = username.trim().toLowerCase().replace(/-/g, '_');
    const matched = accounts.find(
      a => a.username.toLowerCase() === cleanUser || a.username.toLowerCase().replace(/_/g, '-') === cleanUser
    );

    if (matched && (!matched.password || matched.password === password)) {
      setCurrentUser(matched);
      if (matched.schoolId) setActiveSchoolId(matched.schoolId);
      if (matched.referenceId) setCurrentTeacherId(matched.referenceId);
      return true;
    }

    // Try finding by student code (e.g. ST-01-0001)
    const matchedStudent = students.find(s => s.code.toLowerCase() === username.trim().toLowerCase());
    if (matchedStudent && password === '123') {
      const sSchool = schools.find(s => s.id === matchedStudent.schoolId);
      const studentAcc: UserAccount = {
        id: `acc-student-${matchedStudent.id}`,
        username: matchedStudent.code,
        role: 'student',
        displayName: matchedStudent.nameKh,
        titleKh: `សិស្ស ថ្នាក់ទី ${matchedStudent.grade}${matchedStudent.section}`,
        schoolId: matchedStudent.schoolId,
        schoolName: sSchool?.nameKh,
        classId: matchedStudent.classId,
        className: `ថ្នាក់ទី ${matchedStudent.grade}${matchedStudent.section}`,
        referenceId: matchedStudent.id,
        phone: matchedStudent.phone,
        avatarIcon: matchedStudent.gender === 'female' ? '👧' : '👦',
      };
      setCurrentUser(studentAcc);
      setActiveSchoolId(matchedStudent.schoolId);
      return true;
    }

    return false;
  };

  const logout = () => {
    if (appMode === 'production' && supabase) void supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const switchAccount = (account: UserAccount) => {
    if (appMode === 'production') return;
    setCurrentUser(account);
    if (account.schoolId) setActiveSchoolId(account.schoolId);
    if (account.referenceId) setCurrentTeacherId(account.referenceId);
    setShowAccountsModal(false);
  };

  const setUserRole = (role: UserRole) => {
    if (appMode === 'production') return;
    if (role === 'cluster_head') {
      switchAccount(accounts[0]);
    } else if (role === 'principal') {
      const pAcc = accounts.find(a => a.role === 'principal' && a.schoolId === activeSchoolId) || accounts[1];
      switchAccount(pAcc);
    } else if (role === 'teacher') {
      const tAcc = accounts.find(a => a.role === 'teacher' && a.schoolId === activeSchoolId) || accounts.find(a => a.role === 'teacher');
      if (tAcc) switchAccount(tAcc);
    } else if (role === 'student') {
      const sAcc = accounts.find(a => a.role === 'student' && a.schoolId === activeSchoolId) || accounts.find(a => a.role === 'student');
      if (sAcc) switchAccount(sAcc);
    }
  };

  const setActiveSchoolId = (schoolId: string) => {
    setActiveSchoolIdState(schoolId);
    localStorage.setItem(STORAGE_KEY_ACTIVE_SCHOOL, schoolId);
  };

  const setCurrentTeacherId = (teacherId: string) => {
    setCurrentTeacherIdState(teacherId);
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setActiveSchoolId(teacher.schoolId);
    }
  };

  // Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'code'>) => {
    const school = schools.find(s => s.id === studentData.schoolId) || activeSchool;
    const count = students.filter(s => s.schoolId === school.id).length + 1;
    const newCode = `${school.code.replace('SCH-', 'ST-')}-${String(count).padStart(4, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      code: newCode,
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'code'>) => {
    const school = schools.find(s => s.id === teacherData.schoolId) || activeSchool;
    const count = teachers.filter(t => t.schoolId === school.id).length + 1;
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t-${Date.now()}`,
      code: `T-${school.code}-${String(count).padStart(2, '0')}`,
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updatedData: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const recordAttendance = (
    schoolId: string,
    classId: string, 
    date: string, 
    records: { studentId: string; status: AttendanceRecord['status']; note?: string }[]
  ) => {
    setAttendance(prev => {
      const studentIds = new Set(records.map(r => r.studentId));
      const filtered = prev.filter(a => !(a.date === date && a.classId === classId && studentIds.has(a.studentId)));

      const newEntries: AttendanceRecord[] = records.map(r => ({
        id: `att-${r.studentId}-${date}`,
        schoolId,
        classId,
        date,
        studentId: r.studentId,
        status: r.status,
        note: r.note,
      }));

      return [...newEntries, ...filtered];
    });
  };

  const saveGrade = (gradeData: Omit<StudentGrade, 'id'>) => {
    setGrades(prev => {
      const existingIndex = prev.findIndex(
        g => g.studentId === gradeData.studentId && 
             g.month === gradeData.month && 
             g.year === gradeData.year
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...gradeData };
        return updated;
      } else {
        const newGrade: StudentGrade = {
          ...gradeData,
          id: `grd-${gradeData.studentId}-${gradeData.month}-${gradeData.year}`,
        };
        return [...prev, newGrade];
      }
    });
  };

  const addReceipt = (receiptData: Omit<Receipt, 'id' | 'receiptNumber'>) => {
    const school = schools.find(s => s.id === receiptData.schoolId) || activeSchool;
    const nextNo = receipts.length + 1;
    const receiptNumber = `REC-${school.code.replace('SCH-', 'SCH')}-${String(nextNo).padStart(4, '0')}`;
    const newReceipt: Receipt = {
      ...receiptData,
      id: `rec-${Date.now()}`,
      receiptNumber,
    };
    setReceipts(prev => [newReceipt, ...prev]);
  };

  const deleteReceipt = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  const addTimetable = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt-${Date.now()}`,
    };
    setTimetables(prev => [...prev, newEntry]);
  };

  const deleteTimetable = (id: string) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
  };

  const exportDataJSON = () => {
    const backupObj = {
      version: '3.0-auth-cluster',
      exportedAt: new Date().toISOString(),
      cluster: INITIAL_CLUSTER,
      data: {
        schools,
        students,
        teachers,
        classes,
        attendance,
        grades,
        receipts,
        timetables,
      }
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.data) {
        if (parsed.data.schools) setSchools(parsed.data.schools);
        if (parsed.data.students) setStudents(parsed.data.students);
        if (parsed.data.teachers) setTeachers(parsed.data.teachers);
        if (parsed.data.classes) setClasses(parsed.data.classes);
        if (parsed.data.attendance) setAttendance(parsed.data.attendance);
        if (parsed.data.grades) setGrades(parsed.data.grades);
        if (parsed.data.receipts) setReceipts(parsed.data.receipts);
        if (parsed.data.timetables) setTimetables(parsed.data.timetables);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  const resetAllData = () => {
    if (appMode === 'production') return;
    localStorage.clear();
    setSchools(INITIAL_SCHOOLS);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setAttendance(generateInitialAttendance(INITIAL_STUDENTS));
    setGrades(generateInitialGrades(INITIAL_STUDENTS));
    setReceipts(INITIAL_RECEIPTS);
    setTimetables(SAMPLE_TIMETABLES);
    setActiveSchoolId('sch-1');
    setCurrentUser(INITIAL_ACCOUNTS[0]);
  };

  return (
    <SchoolContext.Provider
      value={{
        cluster,
        schools,
        activeSchoolId,
        activeSchool,
        students,
        teachers,
        classes,
        subjects,
        attendance,
        grades,
        receipts,
        timetables,
        currentUser,
        isLoggedIn,
        accounts,
        currentUserRole,
        currentTeacherId,
        showAccountsModal,
        login,
        logout,
        switchAccount,
        setShowAccountsModal,
        setUserRole,
        setActiveSchoolId,
        setCurrentTeacherId,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        recordAttendance,
        saveGrade,
        addReceipt,
        deleteReceipt,
        addTimetable,
        deleteTimetable,
        exportDataJSON,
        importDataJSON,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
