import { Priority } from './enums/priority';
import { Status } from './enums/status';
import { SimpleUser } from './simple-user';

export interface Task {
  _id: string;
  stringId: string;
  projectStringId: string
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  workers: string[];
  idProject: number;
  reporter: SimpleUser;
  creationDate: string;
  dutyDate: string;
}