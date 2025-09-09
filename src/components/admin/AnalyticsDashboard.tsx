import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,

  Area,
  AreaChart
} from 'recharts';
import {
  Users,
  BookOpen,
  Award,
  DollarSign
} from 'lucide-react';
import { getCourseData, getUserData, getCertificateData } from '@/lib/mockData';
import { FeedbackService } from '@/lib/feedbackService';

interface AnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalCertificates: number;
  totalRevenue: number;
  enrollmentTrend: Array<{ month: string; enrollments: number; revenue: number }>;
  coursePopularity: Array<{ name: string; students: number; rating: number }>;
  certificateDistribution: Array<{ type: string; count: number; color: string }>;
  recentActivity: Array<{ date: string; activity: string; count: number }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const courses = getCourseData();
      const users = getUserData();
      const certificates = getCertificateData();
      
      // Calculate basic metrics
      const totalStudents = users.filter(u => u.role === 'student').length;
      const totalCourses = courses.length;
      const totalCertificates = certificates.length;
      const totalRevenue = courses.reduce((sum, course) => sum + (course.students * course.price), 0);

      // Mock enrollment trend data
      const enrollmentTrend = [
        { month: 'Jan', enrollments: 45, revenue: 180000 },
        { month: 'Feb', enrollments: 52, revenue: 208000 },
        { month: 'Mar', enrollments: 48, revenue: 192000 },
        { month: 'Apr', enrollments: 61, revenue: 244000 },
        { month: 'May', enrollments: 55, revenue: 220000 },
        { month: 'Jun', enrollments: 67, revenue: 268000 },
      ];

      // Course popularity with ratings
      const coursePopularity = courses.map(course => {
        const rating = FeedbackService.getCourseRating(course.id);
        return {
          name: course.title,
          students: course.students,
          rating: rating?.averageRating || 0
        };
      });

      // Certificate distribution
      const certificateTypes = certificates.reduce((acc, cert) => {
        acc[cert.type] = (acc[cert.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const certificateDistribution = Object.entries(certificateTypes).map(([type, count], index) => ({
        type,
        count,
        color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index] || '#8884d8'
      }));

      // Recent activity (mock data)
      const recentActivity = [
        { date: '2024-03-15', activity: 'New Enrollments', count: 12 },
        { date: '2024-03-14', activity: 'Certificates Issued', count: 8 },
        { date: '2024-03-13', activity: 'Course Completions', count: 15 },
        { date: '2024-03-12', activity: 'New Enrollments', count: 9 },
        { date: '2024-03-11', activity: 'Feedback Received', count: 23 },
      ];

      setAnalytics({
        totalStudents,
        totalCourses,
        totalCertificates,
        totalRevenue,
        enrollmentTrend,
        coursePopularity,
        certificateDistribution,
        recentActivity
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(analytics.totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
            <CardDescription>Monthly enrollments and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Course Popularity</CardTitle>
            <CardDescription>Student enrollments by course</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.coursePopularity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Distribution</CardTitle>
          <CardDescription>Types of certificates issued</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.certificateDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.certificateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
