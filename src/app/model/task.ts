import { Priority } from './enums/priority';
import { Status } from './enums/status';
import { SimpleUser } from './simple-user';

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
  reporter: SimpleUser;
  creationDate: number; // timestamp 
  dutyDate: number; // timestamp 
}