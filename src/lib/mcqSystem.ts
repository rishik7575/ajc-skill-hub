// MCQ System for AJC Internship Platform
import { STORAGE_KEYS } from './mockData';

export interface MCQQuestion {
  id: string;
  courseId: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation?: string;
}

export interface MCQAttempt {
  id: string;
  userId: string;
  courseId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attemptedAt: string;
  score: number; // 1 for correct, 0 for incorrect
}

export interface MCQSession {
  id: string;
  userId: string;
  courseId: string;
  questions: string[]; // Array of question IDs
  startTime: string;
  endTime?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  timeLimit: number; // in minutes
}

export interface DailyMCQ {
  id: string;
  courseId: string;
  date: string; // YYYY-MM-DD format
  questionIds: string[];
  isActive: boolean;
}

// Mock MCQ Questions Database
export const mockMCQQuestions: MCQQuestion[] = [
  // Power BI Questions
  {
    id: 'mcq_pbi_001',
    courseId: 'powerbi',
    question: 'What is the primary purpose of Power BI?',
    options: [
      'Database management',
      'Business intelligence and data visualization',
      'Web development',
      'Mobile app development'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Introduction to Power BI',
    explanation: 'Power BI is a business analytics tool that provides interactive visualizations and business intelligence capabilities.'
  },
  {
    id: 'mcq_pbi_002',
    courseId: 'powerbi',
    question: 'Which of the following is NOT a component of Power BI?',
    options: [
      'Power BI Desktop',
      'Power BI Service',
      'Power BI Mobile',
      'Power BI Database'
    ],
    correctAnswer: 3,
    difficulty: 'medium',
    topic: 'Power BI Components',
    explanation: 'Power BI Database is not a component. The main components are Desktop, Service, and Mobile.'
  },
  // Full Stack Questions
  {
    id: 'mcq_fs_001',
    courseId: 'fullstack',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink and Text Markup Language'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'HTML Basics',
    explanation: 'HTML stands for Hyper Text Markup Language, used for creating web pages.'
  },
  {
    id: 'mcq_fs_002',
    courseId: 'fullstack',
    question: 'Which HTTP method is used to update existing data?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: 2,
    difficulty: 'medium',
    topic: 'HTTP Methods',
    explanation: 'PUT method is used to update existing resources on the server.'
  },
  // Frontend Questions
  {
    id: 'mcq_fe_001',
    courseId: 'frontend',
    question: 'Which CSS property is used to change the text color?',
    options: ['color', 'text-color', 'font-color', 'text-style'],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'CSS Basics',
    explanation: 'The color property in CSS is used to set the color of text.'
  },
  // Backend Questions
  {
    id: 'mcq_be_001',
    courseId: 'backend',
    question: 'What is Node.js?',
    options: [
      'A JavaScript framework',
      'A JavaScript runtime environment',
      'A database',
      'A web browser'
    ],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Node.js Introduction',
    explanation: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.'
  },
  // Database Questions
  {
    id: 'mcq_db_001',
    courseId: 'database',
    question: 'What does SQL stand for?',
    options: [
      'Structured Query Language',
      'Simple Query Language',
      'Standard Query Language',
      'Sequential Query Language'
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    topic: 'SQL Basics',
    explanation: 'SQL stands for Structured Query Language, used for managing relational databases.'
  },
  // Flutter Questions
  {
    id: 'mcq_fl_001',
    courseId: 'flutter',
    question: 'Flutter is developed by which company?',
    options: ['Facebook', 'Google', 'Microsoft', 'Apple'],
    correctAnswer: 1,
    difficulty: 'easy',
    topic: 'Flutter Introduction',
    explanation: 'Flutter is an open-source UI software development kit created by Google.'
  }
];

export class MCQService {
  // Get questions for a specific course
  static getQuestionsByCourse(courseId: string): MCQQuestion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_QUESTIONS);
      const questions: MCQQuestion[] = stored ? JSON.parse(stored) : mockMCQQuestions;
      return questions.filter(q => q.courseId === courseId);
    } catch (error) {
      console.error('Error getting questions by course:', error);
      return mockMCQQuestions.filter(q => q.courseId === courseId);
    }
  }

  // Get daily MCQ for a course
  static getDailyMCQ(courseId: string, date: string = new Date().toISOString().split('T')[0]): MCQQuestion[] {
    try {
      const questions = this.getQuestionsByCourse(courseId);
      // For demo, return 5 random questions per day
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    } catch (error) {
      console.error('Error getting daily MCQ:', error);
      return [];
    }
  }

  // Start MCQ session
  static startMCQSession(userId: string, courseId: string, questionIds: string[]): MCQSession {
    const session: MCQSession = {
      id: `session_${Date.now()}`,
      userId,
      courseId,
      questions: questionIds,
      startTime: new Date().toISOString(),
      totalScore: 0,
      maxScore: questionIds.length,
      percentage: 0,
      status: 'in-progress',
      timeLimit: 30 // 30 minutes default
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_SESSIONS);
      const sessions: MCQSession[] = stored ? JSON.parse(stored) : [];
      sessions.push(session);
      localStorage.setItem(STORAGE_KEYS.MCQ_SESSIONS, JSON.stringify(sessions));
      return session;
    } catch (error) {
      console.error('Error starting MCQ session:', error);
      return session;
    }
  }

  // Submit MCQ answer
  static submitAnswer(sessionId: string, questionId: string, selectedAnswer: number, timeSpent: number): MCQAttempt {
    try {
      const questions = this.getAllQuestions();
      const question = questions.find(q => q.id === questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }

      const isCorrect = selectedAnswer === question.correctAnswer;
      const attempt: MCQAttempt = {
        id: `attempt_${Date.now()}`,
        userId: '', // Will be set by calling function
        courseId: question.courseId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        attemptedAt: new Date().toISOString(),
        score: isCorrect ? 1 : 0
      };

      // Store attempt
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_ATTEMPTS);
      const attempts: MCQAttempt[] = stored ? JSON.parse(stored) : [];
      attempts.push(attempt);
      localStorage.setItem(STORAGE_KEYS.MCQ_ATTEMPTS, JSON.stringify(attempts));

      return attempt;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  // Complete MCQ session
  static completeSession(sessionId: string): MCQSession | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_SESSIONS);
      const sessions: MCQSession[] = stored ? JSON.parse(stored) : [];
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) return null;

      const session = sessions[sessionIndex];
      session.endTime = new Date().toISOString();
      session.status = 'completed';
      
      // Calculate final score
      const attempts = this.getSessionAttempts(sessionId);
      session.totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      session.percentage = (session.totalScore / session.maxScore) * 100;

      sessions[sessionIndex] = session;
      localStorage.setItem(STORAGE_KEYS.MCQ_SESSIONS, JSON.stringify(sessions));

      return session;
    } catch (error) {
      console.error('Error completing session:', error);
      return null;
    }
  }

  // Get user's MCQ attempts for a session
  static getSessionAttempts(sessionId: string): MCQAttempt[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_ATTEMPTS);
      const attempts: MCQAttempt[] = stored ? JSON.parse(stored) : [];
      return attempts.filter(a => a.id.includes(sessionId));
    } catch (error) {
      console.error('Error getting session attempts:', error);
      return [];
    }
  }

  // Get user's MCQ performance for a course
  static getUserPerformance(userId: string, courseId: string): {
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number;
    averageScore: number;
    recentSessions: MCQSession[];
  } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_SESSIONS);
      const sessions: MCQSession[] = stored ? JSON.parse(stored) : [];
      
      const userSessions = sessions.filter(s => 
        s.userId === userId && 
        s.courseId === courseId && 
        s.status === 'completed'
      );

      const totalAttempts = userSessions.length;
      const totalScore = userSessions.reduce((sum, session) => sum + session.totalScore, 0);
      const maxPossibleScore = userSessions.reduce((sum, session) => sum + session.maxScore, 0);
      
      return {
        totalAttempts,
        correctAnswers: totalScore,
        accuracy: maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0,
        averageScore: totalAttempts > 0 ? totalScore / totalAttempts : 0,
        recentSessions: userSessions.slice(-5).reverse()
      };
    } catch (error) {
      console.error('Error getting user performance:', error);
      return {
        totalAttempts: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageScore: 0,
        recentSessions: []
      };
    }
  }

  // Get all questions (for admin)
  static getAllQuestions(): MCQQuestion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_QUESTIONS);
      return stored ? JSON.parse(stored) : mockMCQQuestions;
    } catch (error) {
      console.error('Error getting all questions:', error);
      return mockMCQQuestions;
    }
  }

  // Add new question (admin function)
  static addQuestion(question: Omit<MCQQuestion, 'id'>): boolean {
    try {
      const newQuestion: MCQQuestion = {
        ...question,
        id: `mcq_${question.courseId}_${Date.now()}`
      };

      const questions = this.getAllQuestions();
      questions.push(newQuestion);
      localStorage.setItem(STORAGE_KEYS.MCQ_QUESTIONS, JSON.stringify(questions));
      return true;
    } catch (error) {
      console.error('Error adding question:', error);
      return false;
    }
  }

  // Initialize MCQ data
  static initializeMCQData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MCQ_QUESTIONS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.MCQ_QUESTIONS, JSON.stringify(mockMCQQuestions));
      }
    } catch (error) {
      console.error('Error initializing MCQ data:', error);
    }
  }
}
