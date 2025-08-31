export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  enrolledCourses?: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  students: number;
  rating: number;
  status: 'Active' | 'Inactive';
  faculty: string;
  icon: string;
  totalLessons: number;
  syllabus: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  course: string;
  status: 'Active' | 'Inactive';
  expertise: string[];
  experience: string;
  bio: string;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: number;
  rank: number;
  certificate?: 'Gold' | 'Silver' | 'Participation';
  mcqScores: { date: string; score: number }[];
  lastActivity: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  type: 'Gold' | 'Silver' | 'Participation';
  issueDate: string;
  uniqueId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  course?: string;
  read: boolean;
  createdAt: string;
  type: 'assignment' | 'live_session' | 'certificate' | 'general';
}

export interface Activity {
  id: string;
  userId: string;
  activity: string;
  score: string;
  time: string;
  courseId: string;
}

// Mock data
export const mockCourses: Course[] = [
  {
    id: 'powerbi',
    title: 'Power BI',
    description: 'Master data visualization and business intelligence',
    price: 4999,
    duration: '8 weeks',
    students: 150,
    rating: 4.8,
    status: 'Active',
    faculty: 'Dr. Amit Sharma',
    icon: '📊',
    totalLessons: 16,
    syllabus: ['Introduction to Power BI', 'Data Modeling', 'DAX Functions', 'Report Creation', 'Dashboard Design']
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development',
    description: 'Complete web development from frontend to backend',
    price: 7999,
    duration: '12 weeks',
    students: 300,
    rating: 4.9,
    status: 'Active',
    faculty: 'Priya Singh',
    icon: '💻',
    totalLessons: 24,
    syllabus: ['HTML/CSS Basics', 'JavaScript ES6+', 'React.js', 'Node.js', 'Database Integration', 'Deployment']
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'React, Next.js, and modern UI/UX development',
    price: 5999,
    duration: '10 weeks',
    students: 200,
    rating: 4.7,
    status: 'Active',
    faculty: 'Rohit Kumar',
    icon: '🎨',
    totalLessons: 20,
    syllabus: ['HTML5/CSS3', 'JavaScript', 'React.js', 'Next.js', 'UI/UX Design', 'Testing']
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Node.js, databases, and API development',
    price: 5999,
    duration: '10 weeks',
    students: 180,
    rating: 4.8,
    status: 'Active',
    faculty: 'Sneha Patel',
    icon: '⚙️',
    totalLessons: 20,
    syllabus: ['Node.js Fundamentals', 'Express.js', 'Database Design', 'REST APIs', 'Authentication', 'Deployment']
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'SQL, NoSQL, and database optimization',
    price: 4499,
    duration: '6 weeks',
    students: 120,
    rating: 4.6,
    status: 'Active',
    faculty: 'Dr. Kiran Desai',
    icon: '🗄️',
    totalLessons: 12,
    syllabus: ['SQL Basics', 'Advanced Queries', 'Database Design', 'NoSQL Databases', 'Performance Optimization']
  },
  {
    id: 'flutter',
    title: 'Flutter Development',
    description: 'Cross-platform mobile app development',
    price: 6499,
    duration: '10 weeks',
    students: 100,
    rating: 4.7,
    status: 'Active',
    faculty: 'Arjun Mehta',
    icon: '📱',
    totalLessons: 18,
    syllabus: ['Dart Language', 'Flutter Widgets', 'State Management', 'API Integration', 'App Deployment']
  }
];

export const mockFaculty: FacultyMember[] = [
  {
    id: '1',
    name: 'Dr. Amit Sharma',
    email: 'amit@ajc.com',
    course: 'Power BI',
    status: 'Active',
    expertise: ['Data Analytics', 'Business Intelligence', 'Power BI', 'Tableau'],
    experience: '8+ years',
    bio: 'Senior Data Analyst with expertise in Power BI and business intelligence solutions.'
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya@ajc.com',
    course: 'Full Stack Development',
    status: 'Active',
    expertise: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    experience: '6+ years',
    bio: 'Full Stack Developer with experience in modern web technologies and cloud deployment.'
  },
  {
    id: '3',
    name: 'Rohit Kumar',
    email: 'rohit@ajc.com',
    course: 'Frontend Development',
    status: 'Active',
    expertise: ['React.js', 'Next.js', 'TypeScript', 'UI/UX Design'],
    experience: '5+ years',
    bio: 'Frontend specialist with a passion for creating beautiful and functional user interfaces.'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha@ajc.com',
    course: 'Backend Development',
    status: 'Active',
    expertise: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
    experience: '7+ years',
    bio: 'Backend engineer with expertise in scalable API development and cloud architecture.'
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin',
    email: 'rishikmaduri@gmail.com',
    name: 'Rishik Maduri',
    role: 'admin',
    createdAt: '2024-01-01'
  },
  {
    id: 'student1',
    email: 'student@demo.com',
    name: 'Demo Student',
    role: 'student',
    enrolledCourses: ['fullstack', 'powerbi'],
    createdAt: '2024-01-15'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    userId: 'student1',
    courseId: 'powerbi',
    studentName: 'Demo Student',
    courseName: 'Power BI',
    type: 'Silver',
    issueDate: '2024-03-15',
    uniqueId: 'AJC2024-PBI-00142'
  }
];

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'ajc_users',
  COURSES: 'ajc_courses',
  FACULTY: 'ajc_faculty',
  CERTIFICATES: 'ajc_certificates',
  STUDENT_PROGRESS: 'ajc_student_progress',
  NOTIFICATIONS: 'ajc_notifications',
  ACTIVITIES: 'ajc_activities',
  CURRENT_USER: 'ajc_current_user'
};

// Initialize mock data in localStorage if not exists
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mockCourses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FACULTY)) {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(mockFaculty));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(mockCertificates));
  }
};

// Helper functions for data operations
export const getUserData = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : mockUsers;
};

export const getCourseData = (): Course[] => {
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  return data ? JSON.parse(data) : mockCourses;
};

export const getFacultyData = (): FacultyMember[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FACULTY);
  return data ? JSON.parse(data) : mockFaculty;
};

export const getCertificateData = (): Certificate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  return data ? JSON.parse(data) : mockCertificates;
};

export const saveUserData = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const saveCourseData = (courses: Course[]) => {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
};

export const saveFacultyData = (faculty: FacultyMember[]) => {
  localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
};

export const saveCertificateData = (certificates: Certificate[]) => {
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
};