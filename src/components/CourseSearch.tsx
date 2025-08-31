import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarDisplay } from '@/components/ui/star-rating';
import { FeedbackService } from '@/lib/feedbackService';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  BookOpen, 
  Users, 
  ArrowRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  title: string;
  description: string;
  price: string;
  duration: string;
  students: string;
  rating: string;
  icon: string;
  category: string;
  level: string;
  tags: string[];
}

interface CourseSearchProps {
  courses: Course[];
  className?: string;
}

export const CourseSearch: React.FC<CourseSearchProps> = ({ courses, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [courseRatings, setCourseRatings] = useState<{[key: string]: any}>({});

  useEffect(() => {
    // Load course ratings
    const loadRatings = () => {
      const ratings: {[key: string]: any} = {};
      courses.forEach(course => {
        const courseId = course.title.toLowerCase().replace(/\s+/g, '').replace('bi', 'bi');
        let id = courseId;
        if (courseId === 'powerbi') id = 'powerbi';
        else if (courseId === 'fullstackdevelopment') id = 'fullstack';
        else if (courseId === 'frontenddevelopment') id = 'frontend';
        else if (courseId === 'backenddevelopment') id = 'backend';
        else if (courseId === 'databasemanagement') id = 'database';
        else if (courseId === 'flutterdevelopment') id = 'flutter';
        
        const rating = FeedbackService.getCourseRating(id);
        if (rating) {
          ratings[course.title] = rating;
        }
      });
      setCourseRatings(ratings);
    };
    
    loadRatings();
  }, [courses]);

  // Get unique categories and levels
  const categories = useMemo(() => {
    const cats = [...new Set(courses.map(course => course.category))];
    return cats.filter(Boolean);
  }, [courses]);

  const levels = useMemo(() => {
    const lvls = [...new Set(courses.map(course => course.level))];
    return lvls.filter(Boolean);
  }, [courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
          const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
          comparison = priceA - priceB;
          break;
        case 'rating':
          const ratingA = courseRatings[a.title]?.averageRating || parseFloat(a.rating);
          const ratingB = courseRatings[b.title]?.averageRating || parseFloat(b.rating);
          comparison = ratingA - ratingB;
          break;
        case 'popularity':
          const studentsA = parseInt(a.students.replace(/[^\d]/g, ''));
          const studentsB = parseInt(b.students.replace(/[^\d]/g, ''));
          comparison = studentsA - studentsB;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy, sortOrder, courseRatings]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSortBy('popularity');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <div className={className}>
      {/* Search and Filter Controls */}
      <Card className="card-modern mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Perfect Course
          </CardTitle>
          <CardDescription>
            Search and filter from our comprehensive course catalog
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses, skills, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="title">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex-1"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredAndSortedCourses.length} course{filteredAndSortedCourses.length !== 1 ? 's' : ''} found
            </span>
            {hasActiveFilters && (
              <Badge variant="secondary">
                <Filter className="h-3 w-3 mr-1" />
                Filters Active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses.map((course, index) => (
          <Card key={index} className="card-modern card-hover group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{course.icon}</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  {course.price}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                {course.title}
              </CardTitle>
              <CardDescription className="leading-relaxed">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {courseRatings[course.title] ? (
                    <StarDisplay 
                      rating={courseRatings[course.title].averageRating}
                      totalReviews={courseRatings[course.title].totalReviews}
                      size="sm"
                    />
                  ) : (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <StarDisplay rating={parseFloat(course.rating)} size="sm" />
                    </div>
                  )}
                </div>
              </div>
              <Link to={`/course/${course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Button className="w-full btn-gradient group-hover:shadow-glow transition-all duration-300">
                  View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedCourses.length === 0 && (
        <Card className="card-modern text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
