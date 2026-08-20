import { 
  SchoolCluster, School, Teacher, Classroom, Subject, 
  Student, Receipt, AttendanceRecord, StudentGrade, TimetableEntry,
  PeriodSlot, UserAccount 
} from '../types';

// 1 Cluster
export const INITIAL_CLUSTER: SchoolCluster = {
  id: 'cl-1',
  nameKh: 'កម្រងសាលាបឋមសិក្សាថ្លុកដង្កោ',
  code: 'CL-TD-01',
  clusterHeadName: 'លោក ឈន សុខុម (ប្រធានកម្រង)',
  phone: '012 998 877',
  totalSchools: 7,
  district: 'ស្រុកជើងព្រៃ',
  province: 'ខេត្តកំពង់ចាម',
};

// 7 Schools in the Cluster with Full Geographic Locations
export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-1',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាថ្លុកដង្កោ',
    code: 'SCH-01',
    principalName: 'លោក សេង វណ្ណឌី (នាយកសាលា)',
    phone: '012 345 678',
    village: 'ភូមិថ្លុកដង្កោ',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិថ្លុកដង្កោ ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0285° N, 105.0842° E',
    isClusterCenter: true,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-2',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាត្រពាំងឈូក',
    code: 'SCH-02',
    principalName: 'លោកស្រី ម៉ម ចិន្តា (នាយិកា)',
    phone: '098 765 432',
    village: 'ភូមិត្រពាំងឈូក',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិត្រពាំងឈូក ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0341° N, 105.0768° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-3',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាស្វាយទាប',
    code: 'SCH-03',
    principalName: 'លោក ហេង ពិសិដ្ឋ (នាយកសាលា)',
    phone: '077 112 233',
    village: 'ភូមិស្វាយទាប',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិស្វាយទាប ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0412° N, 105.0921° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-4',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាព្រៃទទឹង',
    code: 'SCH-04',
    principalName: 'លោក កែវ សម្បត្តិ (នាយកសាលា)',
    phone: '089 445 566',
    village: 'ភូមិព្រៃទទឹង',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិព្រៃទទឹង ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0210° N, 105.0987° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-5',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាអូរដូនពៅ',
    code: 'SCH-05',
    principalName: 'លោកស្រី សៅ មុន្នីរ័ត្ន (នាយិកា)',
    phone: '016 778 899',
    village: 'ភូមិអូរដូនពៅ',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិអូរដូនពៅ ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0154° N, 105.0712° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-6',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាភូមិថ្មី',
    code: 'SCH-06',
    principalName: 'លោក ឡុង វិបុល (នាយកសាលា)',
    phone: '093 332 211',
    village: 'ភូមិភូមិថ្មី',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិភូមិថ្មី ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0489° N, 105.0645° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
  {
    id: 'sch-7',
    clusterId: 'cl-1',
    nameKh: 'សាលាបឋមសិក្សាកោះចិន',
    code: 'SCH-07',
    principalName: 'លោក ទេព សុភ័ក្ត្រ (នាយកសាលា)',
    phone: '078 998 877',
    village: 'ភូមិកោះចិន',
    commune: 'ឃុំថ្លុកដង្កោ',
    district: 'ស្រុកជើងព្រៃ',
    province: 'ខេត្តកំពង់ចាម',
    address: 'ភូមិកោះចិន ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម',
    gpsCoordinates: '12.0521° N, 105.0894° E',
    isClusterCenter: false,
    totalClasses: 10,
    totalTeachers: 10,
  },
];

// 15 Standard Subjects for Primary/Cluster Curriculum
export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-kh', nameKh: 'ភាសាខ្មែរ', nameEn: 'Khmer Language', category: 'ភាសា', maxScore: 100, coefficient: 2 },
  { id: 'sub-math', nameKh: 'គណិតវិទ្យា', nameEn: 'Mathematics', category: 'គណិតវិទ្យា', maxScore: 100, coefficient: 2 },
  { id: 'sub-sci', nameKh: 'វិទ្យាសាស្ត្រ', nameEn: 'Science', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-soc', nameKh: 'សិក្សាសង្គម', nameEn: 'Social Studies', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-civ', nameKh: 'សីលធម៌-ពលរដ្ឋវិជ្ជា', nameEn: 'Moral & Civics', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-his', nameKh: 'ប្រវត្តិវិទ្យា', nameEn: 'History', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-geo', nameKh: 'ភូមិវិទ្យា', nameEn: 'Geography', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-he', nameKh: 'គេហវិទ្យា', nameEn: 'Home Economics', category: 'វិទ្យាសាស្ត្រ-សង្គម', maxScore: 100, coefficient: 1 },
  { id: 'sub-art', nameKh: 'សិល្បៈ និងគំនូរ', nameEn: 'Arts & Drawing', category: 'សិល្បៈ-កីឡា', maxScore: 100, coefficient: 1 },
  { id: 'sub-mus', nameKh: 'អប់រំតន្ត្រី', nameEn: 'Music Education', category: 'សិល្បៈ-កីឡា', maxScore: 100, coefficient: 1 },
  { id: 'sub-pe', nameKh: 'អប់រំកាយ និងកីឡា', nameEn: 'Physical Education', category: 'សិល្បៈ-កីឡា', maxScore: 100, coefficient: 1 },
  { id: 'sub-eng', nameKh: 'ភាសាអង់គ្លេស', nameEn: 'English', category: 'ភាសា', maxScore: 100, coefficient: 1 },
  { id: 'sub-ict', nameKh: 'បច្ចេកវិទ្យា-ICT', nameEn: 'ICT & Computers', category: 'បច្ចេកវិទ្យា-បំណិន', maxScore: 100, coefficient: 1 },
  { id: 'sub-ls', nameKh: 'បំណិនជីវិត', nameEn: 'Life Skills', category: 'បច្ចេកវិទ្យា-បំណិន', maxScore: 100, coefficient: 1 },
  { id: 'sub-hlt', nameKh: 'អនាម័យ និងសុខភាព', nameEn: 'Health & Hygiene', category: 'បច្ចេកវិទ្យា-បំណិន', maxScore: 100, coefficient: 1 },
];

// Standard 2-1-2 Period Slots (40 Minutes per period, 15 Minutes Recess)
export const STANDARD_PERIOD_SLOTS: PeriodSlot[] = [
  // Morning 2 - 1 - 2
  { session: 'morning', periodNumber: 1, timeSlot: '07:10 - 07:50', label: 'ម៉ោងទី ១ (៤០នាទី)' },
  { session: 'morning', periodNumber: 2, timeSlot: '07:50 - 08:30', label: 'ម៉ោងទី ២ (៤០នាទី)' },
  { session: 'morning', periodNumber: 0, timeSlot: '08:30 - 08:45', label: '☕ ចេញលេង (១៥ នាទី)', isBreak: true },
  { session: 'morning', periodNumber: 3, timeSlot: '08:45 - 09:25', label: 'ម៉ោងទី ៣ (៤០នាទី)' },
  { session: 'morning', periodNumber: 4, timeSlot: '09:25 - 10:05', label: 'ម៉ោងទី ៤ (៤០នាទី)' },
  { session: 'morning', periodNumber: 5, timeSlot: '10:05 - 10:45', label: 'ម៉ោងទី ៥ (៤០នាទី)' },

  // Afternoon 2 - 1 - 2
  { session: 'afternoon', periodNumber: 1, timeSlot: '13:10 - 13:50', label: 'ម៉ោងទី ១ រសៀល (៤០នាទី)' },
  { session: 'afternoon', periodNumber: 2, timeSlot: '13:50 - 14:30', label: 'ម៉ោងទី ២ រសៀល (៤០នាទី)' },
  { session: 'afternoon', periodNumber: 0, timeSlot: '14:30 - 14:45', label: '☕ ចេញលេង (១៥ នាទី)', isBreak: true },
  { session: 'afternoon', periodNumber: 3, timeSlot: '14:45 - 15:25', label: 'ម៉ោងទី ៣ រសៀល (៤០នាទី)' },
  { session: 'afternoon', periodNumber: 4, timeSlot: '15:25 - 16:05', label: 'ម៉ោងទី ៤ រសៀល (៤០នាទី)' },
  { session: 'afternoon', periodNumber: 5, timeSlot: '16:05 - 16:45', label: 'ម៉ោងទី ៥ រសៀល (៤០នាទី)' },
];

// Helper: 10 Class Templates per School
const classTemplates = [
  { grade: 1, section: 'ក', name: 'ថ្នាក់ទី១ក', roomNumber: 'បន្ទប់ ១០១' },
  { grade: 1, section: 'ខ', name: 'ថ្នាក់ទី១ខ', roomNumber: 'បន្ទប់ ១០២' },
  { grade: 2, section: 'ក', name: 'ថ្នាក់ទី២ក', roomNumber: 'បន្ទប់ ១០៣' },
  { grade: 2, section: 'ខ', name: 'ថ្នាក់ទី២ខ', roomNumber: 'បន្ទប់ ១០៤' },
  { grade: 3, section: 'ក', name: 'ថ្នាក់ទី៣ក', roomNumber: 'បន្ទប់ ២០១' },
  { grade: 3, section: 'ខ', name: 'ថ្នាក់ទី៣ខ', roomNumber: 'បន្ទប់ ២០២' },
  { grade: 4, section: 'ក', name: 'ថ្នាក់ទី៤ក', roomNumber: 'បន្ទប់ ២០៣' },
  { grade: 4, section: 'ខ', name: 'ថ្នាក់ទី៤ខ', roomNumber: 'បន្ទប់ ២០៤' },
  { grade: 5, section: 'ក', name: 'ថ្នាក់ទី៥', roomNumber: 'បន្ទប់ ៣០១' },
  { grade: 6, section: 'ក', name: 'ថ្នាក់ទី៦', roomNumber: 'បន្ទប់ ៣០២' },
];

const teacherNamesMale = ['សុខ ចិន្តា', 'ហេង ពិសិដ្ឋ', 'អ៊ឹម សម្បត្តិ', 'ឡុង វិបុល', 'រស់ វណ្ណា', 'ទេព សុភ័ក្ត្រ', 'គឹម សារ៉ាត់', 'ជា រតនៈ', 'នួន ចាន់រ៉ា', 'ម៉ៅ វឌ្ឍនៈ'];
const teacherNamesFemale = ['ចាន់ ស្រីមុំ', 'កែវ ធីតា', 'ម៉ម សុភាព', 'សៅ មុន្នីរ័ត្ន', 'ស៊ិន ចរិយា', 'ព្រំ គឹមហៀង', 'លី លក្ខិណា', 'សោម សុភារី', 'ឌៀប កល្យាណ', 'យិន ចរណៃ'];

// Generate 70 Classes
export function generateClasses(): Classroom[] {
  const classes: Classroom[] = [];
  INITIAL_SCHOOLS.forEach((school) => {
    classTemplates.forEach((tmpl, cIdx) => {
      const classId = `cls-${school.id}-${cIdx + 1}`;
      const teacherId = `t-${school.id}-${cIdx + 1}`;
      classes.push({
        id: classId,
        schoolId: school.id,
        grade: tmpl.grade,
        section: tmpl.section,
        name: tmpl.name,
        roomNumber: tmpl.roomNumber,
        homeroomTeacherId: teacherId,
        totalStudents: 50,
      });
    });
  });
  return classes;
}

// Generate 70 Teachers
export function generateTeachers(): Teacher[] {
  const teachers: Teacher[] = [];
  INITIAL_SCHOOLS.forEach((school, sIdx) => {
    classTemplates.forEach((tmpl, tIdx) => {
      const isFemale = (sIdx + tIdx) % 2 === 1;
      const namePool = isFemale ? teacherNamesFemale : teacherNamesMale;
      const rawName = namePool[tIdx % namePool.length];
      const prefix = isFemale ? 'អ្នកគ្រូ' : 'លោកគ្រូ';
      const nameKh = `${prefix} ${rawName}`;
      const teacherId = `t-${school.id}-${tIdx + 1}`;
      const classId = `cls-${school.id}-${tIdx + 1}`;

      teachers.push({
        id: teacherId,
        schoolId: school.id,
        code: `T-${school.code}-${String(tIdx + 1).padStart(2, '0')}`,
        nameKh,
        gender: isFemale ? 'female' : 'male',
        phone: `0${[12, 17, 70, 77, 85, 92, 97][(sIdx + tIdx) % 7]} ${String(200 + (sIdx * 10 + tIdx) * 11).slice(0, 3)} ${String(500 + (tIdx * 37)).slice(0, 3)}`,
        subjectSpecialty: `គរុកោសល្យបឋម (${tmpl.name})`,
        homeroomClass: tmpl.name,
        classId,
        education: tIdx > 7 ? 'បរិញ្ញាបត្រអប់រំ' : 'គរុកោសល្យបឋមសិក្សា',
        status: 'active',
      });
    });
  });
  return teachers;
}

export const INITIAL_CLASSES = generateClasses();
export const INITIAL_TEACHERS = generateTeachers();

// Generate 3,500 Students
const khmerFirstNamesMale = ['សុខ', 'ចាន់', 'គឹម', 'ហេង', 'រដ្ឋា', 'វិបុល', 'ពិសិដ្ឋ', 'ដារ៉ា', 'រតនៈ', 'វណ្ណដា', 'មុន្នី', 'សម្បត្តិ', 'សុភ័ក្ត្រ', 'ចិត្រា', 'វឌ្ឍនៈ', 'រិទ្ធី', 'សុវណ្ណ', 'មករា', 'បញ្ញា', 'សុជាតិ'];
const khmerFirstNamesFemale = ['ស្រីនិច', 'ស្រីមុំ', 'ធីតា', 'សុខា', 'បុប្ផា', 'កល្យាណ', 'រចនា', 'លក្ខិណា', 'ចរិយា', 'សុភារី', 'មុន្នីរ័ត្ន', 'ចិន្តា', 'កញ្ញា', 'ផល្លា', 'សោភា', 'ទេវី', 'ចរណៃ', 'រស្មី', 'មាលា', 'វណ្ណី'];
const khmerLastNames = ['សុខ', 'ចាន់', 'ហេង', 'កែវ', 'អ៊ឹម', 'ម៉ម', 'ឡុង', 'សៅ', 'រស់', 'ស៊ិន', 'ទេព', 'ព្រំ', 'យិន', 'ជា', 'នួន', 'លី', 'សោម', 'ម៉ៅ', 'សេង', 'ឌៀប', 'អ៊ុច', 'ប៉ែន', 'គង់', 'ឃឹម', 'ភោគ'];

export function generate3500Students(): Student[] {
  const students: Student[] = [];
  let globalStudentNum = 1;

  INITIAL_SCHOOLS.forEach((school, sIdx) => {
    const schoolClasses = INITIAL_CLASSES.filter(c => c.schoolId === school.id);

    schoolClasses.forEach((cls, cIdx) => {
      for (let i = 1; i <= 50; i++) {
        const isMale = (i + sIdx + cIdx) % 2 === 0;
        const lastName = khmerLastNames[(i + sIdx * 3 + cIdx * 2) % khmerLastNames.length];
        const firstNameList = isMale ? khmerFirstNamesMale : khmerFirstNamesFemale;
        const firstName = firstNameList[(i * 3 + cIdx) % firstNameList.length];
        const nameKh = `${lastName} ${firstName}`;

        const baseYear = 2026 - (cls.grade + 5);
        const month = String(((i + cIdx) % 12) + 1).padStart(2, '0');
        const day = String(((i * 7) % 28) + 1).padStart(2, '0');
        const dob = `${baseYear}-${month}-${day}`;

        const code = `${school.code.replace('SCH-', 'ST-')}-${String(globalStudentNum).padStart(4, '0')}`;
        const parentName = `${lastName} ${khmerFirstNamesMale[(i + 4) % khmerFirstNamesMale.length]}`;
        const phone = `0${[12, 17, 70, 77, 85, 92, 97][(i + sIdx) % 7]} ${String(100 + (i * 13) % 900)} ${String(100 + (i * 19) % 900)}`;

        students.push({
          id: `stu-${school.id}-${cls.id}-${i}`,
          schoolId: school.id,
          classId: cls.id,
          code,
          nameKh,
          gender: isMale ? 'male' : 'female',
          dob,
          parentName,
          phone,
          address: school.address,
          grade: cls.grade,
          section: cls.section,
          status: 'active',
        });

        globalStudentNum++;
      }
    });
  });

  return students;
}

export const INITIAL_STUDENTS = generate3500Students();

// Generate Initial User Accounts (Cluster Head, Principals, Teachers, Sample Students)
export function generateUserAccounts(): UserAccount[] {
  const accounts: UserAccount[] = [];

  // 1. Cluster Head Account
  accounts.push({
    id: 'acc-cluster-head',
    username: 'clusterhead',
    password: '123',
    role: 'cluster_head',
    displayName: 'លោក ឈន សុខុម',
    titleKh: 'ប្រធានកម្រងសាលារៀន',
    phone: '012 998 877',
    avatarIcon: '🏛️',
  });

  // 2. 7 School Principal Accounts
  INITIAL_SCHOOLS.forEach((school, index) => {
    accounts.push({
      id: `acc-principal-${school.id}`,
      username: `principal${index + 1}`,
      password: '123',
      role: 'principal',
      displayName: school.principalName,
      titleKh: `នាយក${school.nameKh}`,
      schoolId: school.id,
      schoolName: school.nameKh,
      phone: school.phone,
      avatarIcon: '👨‍💼',
    });
  });

  // 3. 70 Teacher Accounts (first teacher of each school featured)
  INITIAL_TEACHERS.forEach((teacher, idx) => {
    const school = INITIAL_SCHOOLS.find(s => s.id === teacher.schoolId);
    accounts.push({
      id: `acc-teacher-${teacher.id}`,
      username: teacher.code.toLowerCase().replace(/-/g, '_'),
      password: '123',
      role: 'teacher',
      displayName: teacher.nameKh,
      titleKh: `គ្រូបង្រៀន (${teacher.homeroomClass} - ${school?.nameKh})`,
      schoolId: teacher.schoolId,
      schoolName: school?.nameKh,
      classId: teacher.classId,
      className: teacher.homeroomClass,
      referenceId: teacher.id,
      phone: teacher.phone,
      avatarIcon: teacher.gender === 'female' ? '👩‍🏫' : '👨‍🏫',
    });
  });

  // 4. Sample Student Accounts (for instant student login)
  INITIAL_STUDENTS.slice(0, 30).forEach((student) => {
    const school = INITIAL_SCHOOLS.find(s => s.id === student.schoolId);
    accounts.push({
      id: `acc-student-${student.id}`,
      username: student.code.toLowerCase().replace(/-/g, '_'),
      password: '123',
      role: 'student',
      displayName: student.nameKh,
      titleKh: `សិស្ស ថ្នាក់ទី ${student.grade}${student.section} (${school?.nameKh})`,
      schoolId: student.schoolId,
      schoolName: school?.nameKh,
      classId: student.classId,
      className: `ថ្នាក់ទី ${student.grade}${student.section}`,
      referenceId: student.id,
      phone: student.phone,
      avatarIcon: student.gender === 'female' ? '👧' : '👦',
    });
  });

  return accounts;
}

export const INITIAL_ACCOUNTS = generateUserAccounts();

// Generate Initial Sample Attendance
export function generateInitialAttendance(students: Student[]): AttendanceRecord[] {
  const today = new Date().toISOString().split('T')[0];
  const sample = students.filter((_, idx) => idx % 4 === 0);

  return sample.map((student, index) => {
    let status: 'present' | 'permission' | 'absent' = 'present';
    if (index % 17 === 0) status = 'permission';
    else if (index % 29 === 0) status = 'absent';

    return {
      id: `att-${student.id}-${today}`,
      schoolId: student.schoolId,
      classId: student.classId,
      studentId: student.id,
      date: today,
      status,
      note: status === 'permission' ? 'សុំច្បាប់ឈឺ' : undefined,
    };
  });
}

// Generate Initial Sample Grades across 15 subjects
export function generateInitialGrades(students: Student[]): StudentGrade[] {
  const sampleStudents = students.slice(0, 150);

  return sampleStudents.map((student, index) => {
    const base = 70 + ((index * 3) % 25);

    const scores: Record<string, number> = {};
    let totalRaw = 0;
    let totalWeighted = 0;
    let totalCoeff = 0;

    INITIAL_SUBJECTS.forEach((sub, sIdx) => {
      const score = Math.min(100, Math.max(55, base + (((index + sIdx) % 7) - 3) * 3));
      scores[sub.id] = score;
      totalRaw += score;
      totalWeighted += score * sub.coefficient;
      totalCoeff += sub.coefficient;
    });

    const average = parseFloat((totalWeighted / totalCoeff).toFixed(2));

    let gradeLevel = 'មធ្យម';
    if (average >= 90) gradeLevel = 'ល្អប្រសើរ';
    else if (average >= 80) gradeLevel = 'ល្អ';
    else if (average >= 70) gradeLevel = 'ល្អបង្គួរ';
    else if (average < 50) gradeLevel = 'ខ្សោយ';

    return {
      id: `grd-${student.id}-jan-2026`,
      schoolId: student.schoolId,
      classId: student.classId,
      studentId: student.id,
      month: 'មករា',
      year: 2026,
      scores,
      totalScore: totalRaw,
      averageScore: average,
      gradeLevel,
      teacherRemark: average >= 85 ? 'សិស្សរៀនពូកែ និងមានវិន័យល្អ' : 'ខិតខំប្រឹងប្រែងរៀនសូត្រ',
    };
  });
}

// Initial Sample Receipts
export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 'rec-1',
    schoolId: 'sch-1',
    receiptNumber: 'REC-SCH01-2026-0001',
    date: '2026-01-10',
    studentId: 'stu-sch-1-cls-sch-1-1-1',
    studentName: 'សុខ ពិសិដ្ឋ',
    className: 'ថ្នាក់ទី១ក',
    amount: 20000,
    currency: 'KHR',
    feeType: 'វិភាគទានសាលា',
    paymentMethod: 'សាច់ប្រាក់',
    cashierName: 'លោក សេង វណ្ណឌី',
    note: 'វិភាគទានអភិវឌ្ឍន៍សាលាកម្រង',
  },
  {
    id: 'rec-2',
    schoolId: 'sch-2',
    receiptNumber: 'REC-SCH02-2026-0001',
    date: '2026-01-12',
    studentId: 'stu-sch-2-cls-sch-2-1-1',
    studentName: 'ចាន់ ស្រីនិច',
    className: 'ថ្នាក់ទី១ក',
    amount: 20000,
    currency: 'KHR',
    feeType: 'វិភាគទានសាលា',
    paymentMethod: 'ABA Pay',
    cashierName: 'លោកស្រី ម៉ម ចិន្តា',
    note: 'វិភាគទានអភិវឌ្ឍន៍សាលាត្រពាំងឈូក',
  },
];

// Generate 2-1-2 Timetables (40 minutes/period, 15 minutes break) for class 1A and others
export const SAMPLE_TIMETABLES: TimetableEntry[] = [
  // Monday Morning 2 - 1 - 2
  { id: 'tt-1', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 1, timeSlot: '07:10 - 07:50', dayOfWeek: 'ចន្ទ', subject: 'គោរពទង់ជាតិ & ភាសាខ្មែរ (អំណាន)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-2', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 2, timeSlot: '07:50 - 08:30', dayOfWeek: 'ចន្ទ', subject: 'ភាសាខ្មែរ (សរសេរតាមអាន)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  // [08:30 - 08:45 Recess 15mn]
  { id: 'tt-3', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 3, timeSlot: '08:45 - 09:25', dayOfWeek: 'ចន្ទ', subject: 'គណិតវិទ្យា (លេខនព្វន្ត)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-4', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 4, timeSlot: '09:25 - 10:05', dayOfWeek: 'ចន្ទ', subject: 'វិទ្យាសាស្ត្រ និងការអនុវត្ត', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-5', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 5, timeSlot: '10:05 - 10:45', dayOfWeek: 'ចន្ទ', subject: 'សិក្សាសង្គម', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },

  // Tuesday Morning 2 - 1 - 2
  { id: 'tt-6', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 1, timeSlot: '07:10 - 07:50', dayOfWeek: 'អង្គារ', subject: 'ភាសាខ្មែរ (តែងសេចក្តី)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-7', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 2, timeSlot: '07:50 - 08:30', dayOfWeek: 'អង្គារ', subject: 'គណិតវិទ្យា (ធរណីមាត្រ)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  // [08:30 - 08:45 Recess 15mn]
  { id: 'tt-8', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 3, timeSlot: '08:45 - 09:25', dayOfWeek: 'អង្គារ', subject: 'សីលធម៌ និងពលរដ្ឋវិជ្ជា', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-9', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 4, timeSlot: '09:25 - 10:05', dayOfWeek: 'អង្គារ', subject: 'ប្រវត្តិវិទ្យា & ភូមិវិទ្យា', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-10', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 5, timeSlot: '10:05 - 10:45', dayOfWeek: 'អង្គារ', subject: 'អប់រំកាយ និងកីឡា', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },

  // Wednesday Morning 2 - 1 - 2
  { id: 'tt-11', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 1, timeSlot: '07:10 - 07:50', dayOfWeek: 'ពុធ', subject: 'ភាសាអង់គ្លេស', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-12', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 2, timeSlot: '07:50 - 08:30', dayOfWeek: 'ពុធ', subject: 'បច្ចេកវិទ្យា-ICT', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  // [08:30 - 08:45 Recess 15mn]
  { id: 'tt-13', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 3, timeSlot: '08:45 - 09:25', dayOfWeek: 'ពុធ', subject: 'បំណិនជីវិត & គេហវិទ្យា', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-14', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 4, timeSlot: '09:25 - 10:05', dayOfWeek: 'ពុធ', subject: 'សិល្បៈ និងគំនូរ', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-15', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'morning', periodNumber: 5, timeSlot: '10:05 - 10:45', dayOfWeek: 'ពុធ', subject: 'អនាម័យ និងសុខភាព', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },

  // Thursday Afternoon Sample 2 - 1 - 2
  { id: 'tt-16', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'afternoon', periodNumber: 1, timeSlot: '13:10 - 13:50', dayOfWeek: 'ព្រហស្បតិ៍', subject: 'ភាសាខ្មែរ (ស្វ័យសិក្សា)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-17', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'afternoon', periodNumber: 2, timeSlot: '13:50 - 14:30', dayOfWeek: 'ព្រហស្បតិ៍', subject: 'គណិតវិទ្យា (លំហាត់អនុវត្ត)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  // [14:30 - 14:45 Recess 15mn]
  { id: 'tt-18', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'afternoon', periodNumber: 3, timeSlot: '14:45 - 15:25', dayOfWeek: 'ព្រហស្បតិ៍', subject: 'អប់រំតន្ត្រី', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-19', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'afternoon', periodNumber: 4, timeSlot: '15:25 - 16:05', dayOfWeek: 'ព្រហស្បតិ៍', subject: 'បំណិនជីវិត (សួនដំណាំសាលា)', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
  { id: 'tt-20', schoolId: 'sch-1', classId: 'cls-sch-1-1', session: 'afternoon', periodNumber: 5, timeSlot: '16:05 - 16:45', dayOfWeek: 'ព្រហស្បតិ៍', subject: 'អប់រំកាយ និងល្បែងប្រជាប្រិយ', teacherName: 'លោកគ្រូ សុខ ចិន្តា' },
];
