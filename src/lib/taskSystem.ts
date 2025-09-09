// Task System for AJC Internship Platform
import { STORAGE_KEYS } from './mockData';

export interface DailyTask {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'text' | 'file' | 'code' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  dueDate: string;
  createdAt: string;
  isActive: boolean;
  requirements: {
    minWords?: number;
    maxWords?: number;
    fileTypes?: string[]; // ['pdf', 'doc', 'zip', 'jpg', 'png']
    maxFileSize?: number; // in MB
    codeLanguage?: string;
  };
  instructions: string[];
  resources?: {
    title: string;
    url: string;
    type: 'video' | 'document' | 'link';
  }[];
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  courseId: string;
  submissionType: 'text' | 'file' | 'code' | 'mixed';
  content: {
    text?: string;
    files?: {
      name: string;
      size: number;
      type: string;
      url: string; // In real app, this would be Firebase/S3 URL
      uploadedAt: string;
    }[];
    code?: {
      language: string;
      content: string;
    };
  };
  submittedAt: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'revision_required';
  score?: number;
  maxScore: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  isLate: boolean;
  timeSpent?: number; // in minutes
}

export interface TaskSchedule {
  id: string;
  courseId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:MM format
  taskTemplate: Omit<DailyTask, 'id' | 'createdAt' | 'dueDate'>;
  isActive: boolean;
}

// Mock Daily Tasks
export const mockDailyTasks: DailyTask[] = [
  // Power BI Tasks
  {
    id: 'task_pbi_001',
    courseId: 'powerbi',
    title: 'Create Your First Power BI Report',
    description: 'Create a basic Power BI report using the provided sample data',
    type: 'file',
    difficulty: 'easy',
    points: 10,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    createdAt: new Date().toISOString(),
    isActive: true,
    requirements: {
      fileTypes: ['pbix', 'pdf'],
      maxFileSize: 50
    },
    instructions: [
      'Download the sample dataset from the resources section',
      'Import the data into Power BI Desktop',
      'Create at least 3 different visualizations',
      'Add a title and format your report',
      'Export as PDF and upload both .pbix and .pdf files'
    ],
    resources: [
      {
        title: 'Sample Dataset',
        url: '/resources/sample-data.xlsx',
        type: 'document'
      },
      {
        title: 'Power BI Basics Video',
        url: '/videos/powerbi-basics',
        type: 'video'
      }
    ]
  },
  // Full Stack Tasks
  {
    id: 'task_fs_001',
    courseId: 'fullstack',
    title: 'Build a Simple HTML Portfolio',
    description: 'Create a personal portfolio website using HTML and CSS',
    type: 'code',
    difficulty: 'easy',
    points: 15,
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    createdAt: new Date().toISOString(),
    isActive: true,
    requirements: {
      codeLanguage: 'html',
      maxFileSize: 10
    },
    instructions: [
      'Create an index.html file with your personal information',
      'Include sections: About, Skills, Projects, Contact',
      'Style with CSS (internal or external)',
      'Make it responsive for mobile devices',
      'Upload your code files as a ZIP'
    ]
  },
  // Frontend Tasks
  {
    id: 'task_fe_001',
    courseId: 'frontend',
    title: 'JavaScript Calculator',
    description: 'Build a functional calculator using HTML, CSS, and JavaScript',
    type: 'code',
    difficulty: 'medium',
    points: 20,
    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    isActive: true,
    requirements: {
      codeLanguage: 'javascript',
      maxFileSize: 5
    },
    instructions: [
      'Create a calculator with basic operations (+, -, *, /)',
      'Include a clear button and decimal support',
      'Handle edge cases (division by zero, etc.)',
      'Style with modern CSS',
      'Test all functionality before submission'
    ]
  },
  // Backend Tasks
  {
    id: 'task_be_001',
    courseId: 'backend',
    title: 'REST API with Node.js',
    description: 'Create a simple REST API for a todo application',
    type: 'code',
    difficulty: 'medium',
    points: 25,
    dueDate: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    isActive: true,
    requirements: {
      codeLanguage: 'javascript',
      maxFileSize: 20
    },
    instructions: [
      'Set up Express.js server',
      'Create endpoints: GET, POST, PUT, DELETE for todos',
      'Use in-memory storage or JSON file',
      'Add input validation',
      'Include API documentation'
    ]
  }
];

export class TaskService {
  // Get tasks for a specific course
  static getTasksByCourse(courseId: string): DailyTask[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      const tasks: DailyTask[] = stored ? JSON.parse(stored) : mockDailyTasks;
      return tasks.filter(t => t.courseId === courseId && t.isActive);
    } catch (error) {
      console.error('Error getting tasks by course:', error);
      return mockDailyTasks.filter(t => t.courseId === courseId && t.isActive);
    }
  }

  // Get active tasks for a user
  static getActiveTasks(userId: string, courseIds: string[]): DailyTask[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      const tasks: DailyTask[] = stored ? JSON.parse(stored) : mockDailyTasks;
      
      return tasks.filter(task => 
        courseIds.includes(task.courseId) && 
        task.isActive &&
        new Date(task.dueDate) > new Date()
      );
    } catch (error) {
      console.error('Error getting active tasks:', error);
      return [];
    }
  }

  // Submit a task
  static submitTask(
    taskId: string, 
    userId: string, 
    content: TaskSubmission['content']
  ): TaskSubmission {
    try {
      const tasks = this.getAllTasks();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }

      const isLate = new Date() > new Date(task.dueDate);
      
      const submission: TaskSubmission = {
        id: `submission_${Date.now()}`,
        taskId,
        userId,
        courseId: task.courseId,
        submissionType: task.type,
        content,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        maxScore: task.points,
        isLate,
        timeSpent: 0 // This would be tracked in real app
      };

      // Store submission
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
      const submissions: TaskSubmission[] = stored ? JSON.parse(stored) : [];
      submissions.push(submission);
      localStorage.setItem(STORAGE_KEYS.TASK_SUBMISSIONS, JSON.stringify(submissions));

      return submission;
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  }

  // Get user's submissions for a course
  static getUserSubmissions(userId: string, courseId?: string): TaskSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
      const submissions: TaskSubmission[] = stored ? JSON.parse(stored) : [];
      
      return submissions.filter(s => 
        s.userId === userId && 
        (!courseId || s.courseId === courseId)
      );
    } catch (error) {
      console.error('Error getting user submissions:', error);
      return [];
    }
  }

  // Get submission by ID
  static getSubmissionById(submissionId: string): TaskSubmission | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
      const submissions: TaskSubmission[] = stored ? JSON.parse(stored) : [];
      return submissions.find(s => s.id === submissionId) || null;
    } catch (error) {
      console.error('Error getting submission by ID:', error);
      return null;
    }
  }

  // Review a submission (admin function)
  static reviewSubmission(
    submissionId: string, 
    score: number, 
    feedback: string, 
    status: TaskSubmission['status'],
    reviewerId: string
  ): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
      const submissions: TaskSubmission[] = stored ? JSON.parse(stored) : [];
      
      const submissionIndex = submissions.findIndex(s => s.id === submissionId);
      if (submissionIndex === -1) return false;

      submissions[submissionIndex] = {
        ...submissions[submissionIndex],
        score,
        feedback,
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEYS.TASK_SUBMISSIONS, JSON.stringify(submissions));
      return true;
    } catch (error) {
      console.error('Error reviewing submission:', error);
      return false;
    }
  }

  // Get all tasks (admin function)
  static getAllTasks(): DailyTask[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      return stored ? JSON.parse(stored) : mockDailyTasks;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      return mockDailyTasks;
    }
  }

  // Add new task (admin function)
  static addTask(task: Omit<DailyTask, 'id' | 'createdAt'>): boolean {
    try {
      const newTask: DailyTask = {
        ...task,
        id: `task_${task.courseId}_${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      const tasks = this.getAllTasks();
      tasks.push(newTask);
      localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  }

  // Get pending submissions for review (admin function)
  static getPendingSubmissions(): TaskSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_SUBMISSIONS);
      const submissions: TaskSubmission[] = stored ? JSON.parse(stored) : [];
      return submissions.filter(s => s.status === 'submitted');
    } catch (error) {
      console.error('Error getting pending submissions:', error);
      return [];
    }
  }

  // Initialize task data
  static initializeTaskData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(mockDailyTasks));
      }
    } catch (error) {
      console.error('Error initializing task data:', error);
    }
  }

  // Auto-generate daily tasks (would be called by a scheduler in real app)
  static generateDailyTasks(): void {
    try {
      // This would be more sophisticated in a real app
      // For now, just ensure we have active tasks for each course
      const courses = ['powerbi', 'fullstack', 'frontend', 'backend', 'database', 'flutter'];
      const tasks = this.getAllTasks();
      
      courses.forEach(courseId => {
        const courseTasks = tasks.filter(t => 
          t.courseId === courseId && 
          t.isActive &&
          new Date(t.dueDate) > new Date()
        );
        
        // If no active tasks, create a new one (simplified logic)
        if (courseTasks.length === 0) {
          // In real app, this would use task templates
          console.log(`No active tasks for ${courseId}, would generate new task`);
        }
      });
    } catch (error) {
      console.error('Error generating daily tasks:', error);
    }
  }
}
