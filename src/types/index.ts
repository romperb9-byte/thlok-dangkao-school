export type Gender = 'male' | 'female';

export interface SchoolCluster {
  id: string;
  nameKh: string;
  code: string;
  clusterHeadName: string;
  phone: string;
  totalSchools: number;
  district: string;
  province: string;
}

export interface School {
  id: string;
  clusterId: string;
  nameKh: string;
  code: string;
  principalName: string;
  phone: string;
  address: string;
  village?: string;
  commune?: string;
  district?: string;
  province?: string;
  gpsCoordinates?: string;
  isClusterCenter: boolean;
  totalClasses: number;
  totalTeachers: number;
}

export interface Teacher {
  id: string;
  schoolId: string;
  code: string;
  nameKh: string;
  nameEn?: string;
  gender: Gender;
  phone: string;
  email?: string;
  subjectSpecialty: string;
  homeroomClass?: string;
  classId?: string;
  education: string;
  status: 'active' | 'leave';
}

export interface Classroom {
  id: string;
  schoolId: string;
  grade: number;
  section: string;
  name: string;
  roomNumber: string;
  homeroomTeacherId?: string;
  totalStudents: number;
}

export interface Student {
  id: string;
  schoolId: string;
  code: string;
  nameKh: string;
  nameEn?: string;
  gender: Gender;
  dob: string;
  parentName: string;
  phone: string;
  address: string;
  grade: number;
  section: string;
  classId: string;
  status: 'active' | 'suspended' | 'transferred';
}

export interface Subject {
  id: string;
  nameKh: string;
  nameEn: string;
  category: 'ភាសា' | 'គណិតវិទ្យា' | 'វិទ្យាសាស្ត្រ-សង្គម' | 'សិល្បៈ-កីឡា' | 'បច្ចេកវិទ្យា-បំណិន';
  maxScore: number;
  coefficient: number;
}

export type AttendanceStatus = 'present' | 'permission' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  classId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface StudentGrade {
  id: string;
  schoolId: string;
  classId: string;
  studentId: string;
  month: string;
  year: number;
  scores: Record<string, number>;
  totalScore: number;
  averageScore: number;
  rank?: number;
  gradeLevel?: string;
  teacherRemark?: string;
}

export interface Receipt {
  id: string;
  schoolId: string;
  receiptNumber: string;
  date: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  currency: 'KHR' | 'USD';
  feeType: 'វិភាគទានសាលា' | 'សៀវភៅ-សម្ភារៈ' | 'ឯកសណ្ឋាន' | 'បណ្ណាល័យ' | 'ផ្សេងៗ';
  paymentMethod: 'សាច់ប្រាក់' | 'ABA Pay' | 'Wing' | 'ផ្សេងៗ';
  cashierName: string;
  note?: string;
}

export type DayOfWeek = 'ចន្ទ' | 'អង្គារ' | 'ពុធ' | 'ព្រហស្បតិ៍' | 'សុក្រ' | 'សៅរ៍';
export type SessionType = 'morning' | 'afternoon';

export interface TimetableEntry {
  id: string;
  schoolId: string;
  classId: string;
  session: SessionType;
  periodNumber: number; // 1, 2, 3, 4, 5
  timeSlot: string; // 07:10 - 07:50, etc.
  dayOfWeek: DayOfWeek;
  subject: string;
  teacherName: string;
}

export interface PeriodSlot {
  session: SessionType;
  periodNumber: number;
  timeSlot: string;
  label: string;
  isBreak?: boolean;
}

export type UserRole = 'cluster_head' | 'principal' | 'teacher' | 'student';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  displayName: string;
  titleKh: string;
  schoolId?: string;
  schoolName?: string;
  classId?: string;
  className?: string;
  referenceId?: string;
  phone?: string;
  avatarIcon?: string;
}
