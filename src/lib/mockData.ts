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

export interface CourseFeedback {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  rating: number; // 1-5 stars
  review: string;
  createdAt: string;
  isApproved: boolean;
  adminResponse?: string;
  adminResponseDate?: string;
}

export interface CourseRating {
  courseId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
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

export const mockCourseFeedback: CourseFeedback[] = [
  {
    id: 'feedback1',
    userId: 'student1',
    courseId: 'powerbi',
    studentName: 'Demo Student',
    rating: 5,
    review: 'Excellent course! The instructor explained complex concepts very clearly. The hands-on projects were particularly helpful.',
    createdAt: '2024-03-10T10:30:00Z',
    isApproved: true,
    adminResponse: 'Thank you for your positive feedback! We\'re glad you found the course helpful.',
    adminResponseDate: '2024-03-11T09:00:00Z'
  },
  {
    id: 'feedback2',
    userId: 'student2',
    courseId: 'fullstack',
    studentName: 'Sarah Johnson',
    rating: 4,
    review: 'Great comprehensive course covering both frontend and backend. Would love more advanced topics in future modules.',
    createdAt: '2024-03-08T14:20:00Z',
    isApproved: true
  },
  {
    id: 'feedback3',
    userId: 'student3',
    courseId: 'powerbi',
    studentName: 'Mike Chen',
    rating: 5,
    review: 'Outstanding course content and delivery. The real-world examples made it easy to understand.',
    createdAt: '2024-03-05T16:45:00Z',
    isApproved: true
  }
];

export const mockCourseRatings: CourseRating[] = [
  {
    courseId: 'powerbi',
    averageRating: 4.8,
    totalReviews: 15,
    ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 4, 5: 10 }
  },
  {
    courseId: 'fullstack',
    averageRating: 4.9,
    totalReviews: 25,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 5, 5: 20 }
  },
  {
    courseId: 'frontend',
    averageRating: 4.7,
    totalReviews: 18,
    ratingDistribution: { 1: 0, 2: 0, 3: 2, 4: 6, 5: 10 }
  },
  {
    courseId: 'backend',
    averageRating: 4.8,
    totalReviews: 12,
    ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 8 }
  },
  {
    courseId: 'database',
    averageRating: 4.6,
    totalReviews: 8,
    ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 4, 5: 3 }
  },
  {
    courseId: 'flutter',
    averageRating: 4.7,
    totalReviews: 10,
    ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 6 }
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
  CURRENT_USER: 'ajc_current_user',
  COURSE_FEEDBACK: 'ajc_course_feedback',
  COURSE_RATINGS: 'ajc_course_ratings'
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
  if (!localStorage.getItem(STORAGE_KEYS.COURSE_FEEDBACK)) {
    localStorage.setItem(STORAGE_KEYS.COURSE_FEEDBACK, JSON.stringify(mockCourseFeedback));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSE_RATINGS)) {
    localStorage.setItem(STORAGE_KEYS.COURSE_RATINGS, JSON.stringify(mockCourseRatings));
  }
};

// Helper functions for data operations with error handling
export const getUserData = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : mockUsers;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return mockUsers;
  }
};

export const getCourseData = (): Course[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : mockCourses;
  } catch (error) {
    console.error('Error reading course data from localStorage:', error);
    return mockCourses;
  }
};

export const getFacultyData = (): FacultyMember[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FACULTY);
    return data ? JSON.parse(data) : mockFaculty;
  } catch (error) {
    console.error('Error reading faculty data from localStorage:', error);
    return mockFaculty;
  }
};

export const getCertificateData = (): Certificate[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    return data ? JSON.parse(data) : mockCertificates;
  } catch (error) {
    console.error('Error reading certificate data from localStorage:', error);
    return mockCertificates;
  }
};

export const saveUserData = (users: User[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
    return false;
  }
};

export const saveCourseData = (courses: Course[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    return true;
  } catch (error) {
    console.error('Error saving course data to localStorage:', error);
    return false;
  }
};

export const saveFacultyData = (faculty: FacultyMember[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    return true;
  } catch (error) {
    console.error('Error saving faculty data to localStorage:', error);
    return false;
  }
};

export const saveCertificateData = (certificates: Certificate[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
    return true;
  } catch (error) {
    console.error('Error saving certificate data to localStorage:', error);
    return false;
  }
};

// Feedback management functions
export const getCourseFeedback = (): CourseFeedback[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSE_FEEDBACK);
    return data ? JSON.parse(data) : mockCourseFeedback;
  } catch (error) {
    console.error('Error reading course feedback from localStorage:', error);
    return mockCourseFeedback;
  }
};

export const saveCourseFeedback = (feedback: CourseFeedback[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSE_FEEDBACK, JSON.stringify(feedback));
    return true;
  } catch (error) {
    console.error('Error saving course feedback to localStorage:', error);
    return false;
  }
};

export const getCourseRatings = (): CourseRating[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COURSE_RATINGS);
    return data ? JSON.parse(data) : mockCourseRatings;
  } catch (error) {
    console.error('Error reading course ratings from localStorage:', error);
    return mockCourseRatings;
  }
};

export const saveCourseRatings = (ratings: CourseRating[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSE_RATINGS, JSON.stringify(ratings));
    return true;
  } catch (error) {
    console.error('Error saving course ratings to localStorage:', error);
    return false;
  }
};