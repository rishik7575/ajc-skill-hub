import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Code, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  X
} from 'lucide-react';
import { TaskService, DailyTask, TaskSubmission as TaskSubmissionType } from '@/lib/taskSystem';
import { useAuth } from '@/lib/auth';

interface TaskSubmissionProps {
  task: DailyTask;
  existingSubmission?: TaskSubmissionType;
  onSubmissionComplete?: (submission: TaskSubmissionType) => void;
}

export const TaskSubmission: React.FC<TaskSubmissionProps> = ({ 
  task, 
  existingSubmission, 
  onSubmissionComplete 
}) => {
  const [textContent, setTextContent] = useState(existingSubmission?.content.text || '');
  const [codeContent, setCodeContent] = useState(existingSubmission?.content.code?.content || '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const isOverdue = new Date() > new Date(task.dueDate);
  const timeUntilDue = new Date(task.dueDate).getTime() - new Date().getTime();
  const hoursUntilDue = Math.floor(timeUntilDue / (1000 * 60 * 60));

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      // Check file size
      if (file.size > (task.requirements.maxFileSize || 50) * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${task.requirements.maxFileSize || 50}MB)`);
        return;
      }

      // Check file type
      if (task.requirements.fileTypes) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !task.requirements.fileTypes.includes(fileExtension)) {
          errors.push(`${file.name} has invalid file type. Allowed: ${task.requirements.fileTypes.join(', ')}`);
          return;
        }
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      toast({
        title: "File Upload Errors",
        description: errors.join('\n'),
        variant: "destructive",
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateSubmission = (): string[] => {
    const errors: string[] = [];

    if (task.type === 'text' || task.type === 'mixed') {
      if (!textContent.trim()) {
        errors.push('Text content is required');
      } else {
        const wordCount = textContent.trim().split(/\s+/).length;
        if (task.requirements.minWords && wordCount < task.requirements.minWords) {
          errors.push(`Minimum ${task.requirements.minWords} words required (current: ${wordCount})`);
        }
        if (task.requirements.maxWords && wordCount > task.requirements.maxWords) {
          errors.push(`Maximum ${task.requirements.maxWords} words allowed (current: ${wordCount})`);
        }
      }
    }

    if (task.type === 'code' || task.type === 'mixed') {
      if (!codeContent.trim()) {
        errors.push('Code content is required');
      }
    }

    if (task.type === 'file' || task.type === 'mixed') {
      if (selectedFiles.length === 0 && !existingSubmission?.content.files?.length) {
        errors.push('At least one file is required');
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit tasks.",
        variant: "destructive",
      });
      return;
    }

    const errors = validateSubmission();
    if (errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: errors.join('\n'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, files would be uploaded to Firebase/S3
      const fileData = selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: `mock://uploads/${file.name}`, // Mock URL
        uploadedAt: new Date().toISOString()
      }));

      const submissionContent: TaskSubmissionType['content'] = {};

      if (task.type === 'text' || task.type === 'mixed') {
        submissionContent.text = textContent;
      }

      if (task.type === 'code' || task.type === 'mixed') {
        submissionContent.code = {
          language: task.requirements.codeLanguage || 'javascript',
          content: codeContent
        };
      }

      if (task.type === 'file' || task.type === 'mixed') {
        submissionContent.files = fileData;
      }

      const submission = TaskService.submitTask(task.id, user.id, submissionContent);

      toast({
        title: "Task Submitted Successfully!",
        description: isOverdue ? "Note: This submission is late." : "Your task has been submitted for review.",
      });

      if (onSubmissionComplete) {
        onSubmissionComplete(submission);
      }

    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {task.type === 'text' && <FileText className="h-5 w-5" />}
              {task.type === 'code' && <Code className="h-5 w-5" />}
              {task.type === 'file' && <Upload className="h-5 w-5" />}
              {task.type === 'mixed' && <FileText className="h-5 w-5" />}
              {task.title}
            </CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={task.difficulty === 'easy' ? 'default' : task.difficulty === 'medium' ? 'secondary' : 'destructive'}>
              {task.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {isOverdue ? (
                <span className="text-red-500 font-medium">Overdue</span>
              ) : (
                <span className={hoursUntilDue < 24 ? 'text-orange-500' : 'text-muted-foreground'}>
                  {hoursUntilDue > 0 ? `${hoursUntilDue}h left` : 'Due soon'}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Instructions */}
        <div>
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {task.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        {task.resources && task.resources.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Resources:</h4>
            <div className="space-y-2">
              {task.resources.map((resource, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  <a href={resource.url} className="text-primary hover:underline">
                    {resource.title}
                  </a>
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Submission Status */}
        {existingSubmission && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              {existingSubmission.status === 'submitted' && <Clock className="h-4 w-4 text-blue-500" />}
              {existingSubmission.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {existingSubmission.status === 'rejected' && <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="font-medium">
                Previous Submission: {existingSubmission.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {existingSubmission.score !== undefined && (
              <p className="text-sm text-muted-foreground">
                Score: {existingSubmission.score}/{existingSubmission.maxScore}
              </p>
            )}
            {existingSubmission.feedback && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Feedback:</strong> {existingSubmission.feedback}
              </p>
            )}
          </div>
        )}

        {/* Text Content */}
        {(task.type === 'text' || task.type === 'mixed') && (
          <div className="space-y-2">
            <Label htmlFor="text-content">
              Text Submission
              {task.requirements.minWords && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Min {task.requirements.minWords} words)
                </span>
              )}
            </Label>
            <Textarea
              id="text-content"
              placeholder="Enter your text submission here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground">
              Word count: {textContent.trim().split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>
        )}

        {/* Code Content */}
        {(task.type === 'code' || task.type === 'mixed') && (
          <div className="space-y-2">
            <Label htmlFor="code-content">
              Code Submission
              {task.requirements.codeLanguage && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({task.requirements.codeLanguage})
                </span>
              )}
            </Label>
            <Textarea
              id="code-content"
              placeholder="Paste your code here..."
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* File Upload */}
        {(task.type === 'file' || task.type === 'mixed') && (
          <div className="space-y-4">
            <Label>
              File Upload
              {task.requirements.fileTypes && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Allowed: {task.requirements.fileTypes.join(', ')})
                </span>
              )}
            </Label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to select
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept={task.requirements.fileTypes?.map(type => `.${type}`).join(',')}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Max file size: {task.requirements.maxFileSize || 50}MB
              </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files:</Label>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Task'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
