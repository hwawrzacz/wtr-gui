import { Priority } from './enums/priority';
import { Status } from './enums/status';
import { SimpleEmployee } from './simple-employee';

export interface Task {
  id: string;
  stringId: string;
  projectStringId: string
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  workers: string[];
  projectId: number;
  reporter: SimpleEmployee;
  creationDate: number; // timestamp 
  dutyDate: number; // timestamp 
}