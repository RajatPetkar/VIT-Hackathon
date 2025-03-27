
import { User, Batch, Presentation, Assignment, AssignmentSubmission } from './types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-01')
  },
  {
    id: '2',
    email: 'trainer@example.com',
    name: 'John Trainer',
    role: 'trainer',
    createdAt: new Date('2022-01-02'),
    updatedAt: new Date('2022-01-02')
  },
  {
    id: '3',
    email: 'student1@example.com',
    name: 'Alice Student',
    role: 'student',
    createdAt: new Date('2022-01-03'),
    updatedAt: new Date('2022-01-03')
  },
  {
    id: '4',
    email: 'student2@example.com',
    name: 'Bob Student',
    role: 'student',
    createdAt: new Date('2022-01-04'),
    updatedAt: new Date('2022-01-04')
  }
];

// Mock Batches
export const batches: Batch[] = [
  {
    id: '1',
    name: 'Web Development 2023',
    description: 'Learn modern web development techniques',
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-05-15'),
    trainerId: '2',
    students: [],
    presentations: [],
    assignments: [],
    createdAt: new Date('2022-12-10'),
    updatedAt: new Date('2022-12-10')
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Master creating mobile applications',
    startDate: new Date('2023-02-01'),
    trainerId: '2',
    students: [],
    presentations: [],
    assignments: [],
    createdAt: new Date('2022-12-15'),
    updatedAt: new Date('2022-12-15')
  }
];

// Mock Presentations
export const presentations: Presentation[] = [
  {
    id: '1',
    title: 'Introduction to HTML & CSS',
    description: 'Basic concepts of HTML and CSS',
    fileUrl: '/mock-files/intro-html-css.ppt',
    batchId: '1',
    trainerId: '2',
    releaseDate: new Date('2023-01-16'),
    isReleased: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    description: 'Core concepts of JavaScript programming',
    fileUrl: '/mock-files/javascript-fundamentals.ppt',
    batchId: '1',
    trainerId: '2',
    releaseDate: new Date('2023-01-23'),
    isReleased: true,
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20')
  },
  {
    id: '3',
    title: 'Introduction to React',
    description: 'Getting started with React framework',
    fileUrl: '/mock-files/intro-react.ppt',
    batchId: '1',
    trainerId: '2',
    releaseDate: new Date('2023-01-30'),
    isReleased: false,
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-01-25')
  }
];

// Mock Assignments
export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Create a Personal Webpage',
    description: 'Build a personal profile page using HTML and CSS',
    dueDate: new Date('2023-01-22'),
    batchId: '1',
    trainerId: '2',
    submissions: [],
    createdAt: new Date('2023-01-16'),
    updatedAt: new Date('2023-01-16')
  },
  {
    id: '2',
    title: 'JavaScript Calculator',
    description: 'Build a calculator application using JavaScript',
    dueDate: new Date('2023-01-29'),
    batchId: '1',
    trainerId: '2',
    submissions: [],
    createdAt: new Date('2023-01-23'),
    updatedAt: new Date('2023-01-23')
  }
];

// Mock Assignment Submissions
export const assignmentSubmissions: AssignmentSubmission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentId: '3',
    fileUrl: '/mock-files/alice-personal-webpage.zip',
    submissionDate: new Date('2023-01-20'),
    feedback: 'Good work! Nice design choices.',
    grade: 'A'
  },
  {
    id: '2',
    assignmentId: '1',
    studentId: '4',
    fileUrl: '/mock-files/bob-personal-webpage.zip',
    submissionDate: new Date('2023-01-21'),
    feedback: 'Well done, but could improve accessibility.',
    grade: 'B+'
  }
];

// Initialize relationships
batches[0].students = [users[2], users[3]] as any;
batches[0].presentations = [presentations[0], presentations[1], presentations[2]];
batches[0].assignments = [assignments[0], assignments[1]];

assignments[0].submissions = [assignmentSubmissions[0], assignmentSubmissions[1]];
