
export type UserRole = 'admin' | 'trainer' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Trainer extends User {
  role: 'trainer';
  batches: Batch[];
}

export interface Student extends User {
  role: 'student';
  parentName: string;
  photoUrl?: string;
  contactNumber?: string;
  parentContactNumber?: string;
  resumeUrl?: string;
  batches: Batch[];
}

export interface Batch {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  trainerId: string;
  students: Student[];
  presentations: Presentation[];
  assignments: Assignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  batchId: string;
  trainerId: string;
  releaseDate: Date;
  isReleased: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  batchId: string;
  trainerId: string;
  submissions: AssignmentSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  submissionDate: Date;
  feedback?: string;
  grade?: string;
}
