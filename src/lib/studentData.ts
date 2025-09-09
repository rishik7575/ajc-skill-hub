import { STORAGE_KEYS, Activity, Notification, StudentProgress } from './mockData';

// Student-specific data management
export class StudentDataService {
  static getStudentProgress(userId: string): StudentProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS);
      const allProgress = data ? JSON.parse(data) : [];
      return allProgress.filter((p: StudentProgress) => p.userId === userId);
    } catch (error) {
      console.error('Error reading student progress from localStorage:', error);
      return [];
    }
  }

  static updateStudentProgress(userId: string, courseId: string, updates: Partial<StudentProgress>): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROGRESS);
      const allProgress = data ? JSON.parse(data) : [];

      const existingIndex = allProgress.findIndex((p: StudentProgress) =>
        p.userId === userId && p.courseId === courseId
      );

      if (existingIndex >= 0) {
        allProgress[existingIndex] = { ...allProgress[existingIndex], ...updates };
      } else {
        const newProgress: StudentProgress = {
          userId,
          courseId,
          progress: 0,
          completedLessons: 0,
          rank: 1,
          mcqScores: [],
          lastActivity: new Date().toISOString(),
          ...updates
        };
        allProgress.push(newProgress);
      }

      localStorage.setItem(STORAGE_KEYS.STUDENT_PROGRESS, JSON.stringify(allProgress));
      return true;
    } catch (error) {
      console.error('Error updating student progress:', error);
      return false;
    }
  }

  static getStudentNotifications(userId: string): Notification[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const allNotifications = data ? JSON.parse(data) : this.generateDefaultNotifications(userId);
    return allNotifications.filter((n: Notification) => n.userId === userId);
  }

  static markNotificationRead(notificationId: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications = data ? JSON.parse(data) : [];
    
    const notification = notifications.find((n: Notification) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  static getStudentActivities(userId: string): Activity[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const allActivities = data ? JSON.parse(data) : this.generateDefaultActivities(userId);
    return allActivities.filter((a: Activity) => a.userId === userId);
  }

  static addActivity(userId: string, activity: Omit<Activity, 'id' | 'userId'>): void {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const activities = data ? JSON.parse(data) : [];
    
    const newActivity: Activity = {
      id: `activity_${Date.now()}`,
      userId,
      ...activity
    };
    
    activities.unshift(newActivity); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 50))); // Keep only last 50
  }

  static enrollInCourse(userId: string, courseId: string): void {
    // Initialize progress for the course
    this.updateStudentProgress(userId, courseId, {
      progress: 0,
      completedLessons: 0,
      rank: Math.floor(Math.random() * 50) + 1, // Random initial rank
    });

    // Add enrollment notification
    this.addNotification(userId, {
      title: 'Course Enrollment Successful',
      message: 'Welcome to your new course! Start learning now.',
      course: courseId,
      type: 'general'
    });

    // Add activity
    this.addActivity(userId, {
      activity: 'Enrolled in new course',
      score: 'Enrolled',
      time: 'Just now',
      courseId
    });
  }

  private static addNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications = data ? JSON.parse(data) : [];
    
    const newNotification: Notification = {
      id: `notification_${Date.now()}`,
      userId,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications.slice(0, 100))); // Keep only last 100
  }

  private static generateDefaultNotifications(userId: string): Notification[] {
    const defaultNotifications: Notification[] = [
      {
        id: '1',
        userId,
        title: 'New assignment uploaded',
        message: 'A new assignment has been uploaded for Full Stack Development',
        course: 'Full Stack Development',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        type: 'assignment'
      },
      {
        id: '2',
        userId,
        title: 'Live session reminder',
        message: 'Your Power BI live session starts in 1 hour',
        course: 'Power BI',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        type: 'live_session'
      },
      {
        id: '3',
        userId,
        title: 'Certificate ready for download',
        message: 'Your Power BI certificate is ready for download',
        course: 'Power BI',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        type: 'certificate'
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }

  private static generateDefaultActivities(userId: string): Activity[] {
    const defaultActivities: Activity[] = [
      {
        id: '1',
        userId,
        activity: 'Completed MCQ Quiz - React Hooks',
        score: '8/10',
        time: '2 hours ago',
        courseId: 'fullstack'
      },
      {
        id: '2',
        userId,
        activity: 'Submitted Assignment - Database Design',
        score: 'Pending',
        time: '1 day ago',
        courseId: 'fullstack'
      },
      {
        id: '3',
        userId,
        activity: 'Attended Live Session - API Integration',
        score: 'Present',
        time: '2 days ago',
        courseId: 'fullstack'
      },
      {
        id: '4',
        userId,
        activity: 'Downloaded Notes - JavaScript Fundamentals',
        score: 'Completed',
        time: '3 days ago',
        courseId: 'fullstack'
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    return defaultActivities;
  }

  // Initialize default progress for demo student
  static initializeDefaultProgress(): void {
    const userId = 'student1';
    const existingProgress = this.getStudentProgress(userId);
    
    if (existingProgress.length === 0) {
      // Initialize progress for enrolled courses
      this.updateStudentProgress(userId, 'fullstack', {
        progress: 75,
        completedLessons: 18,
        rank: 5,
        mcqScores: [
          { date: '2024-01-20', score: 8 },
          { date: '2024-01-21', score: 9 },
          { date: '2024-01-22', score: 7 }
        ]
      });
      
      this.updateStudentProgress(userId, 'powerbi', {
        progress: 90,
        completedLessons: 14,
        rank: 2,
        certificate: 'Silver',
        mcqScores: [
          { date: '2024-01-20', score: 9 },
          { date: '2024-01-21', score: 10 },
          { date: '2024-01-22', score: 8 }
        ]
      });
    }
  }
}