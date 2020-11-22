import { SimpleEmployee } from './model';

export enum Status {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: number;
  title: string;
  descritpion: string;
  status: Status;
  priority: Priority;
  workers: number[];
  projectId: number;
  reporter: SimpleEmployee;
  creationDate: number; // timestamp 
  dutyDate: number; // timestamp 
}