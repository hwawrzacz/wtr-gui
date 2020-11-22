import { Priority } from './enums/priority';
import { Status } from './enums/status';
import { SimpleEmployee } from './model';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  workers: number[];
  projectId: number;
  reporter: SimpleEmployee;
  creationDate: number; // timestamp 
  dutyDate: number; // timestamp 
}