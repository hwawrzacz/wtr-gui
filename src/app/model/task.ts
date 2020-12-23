import { Priority } from './enums/priority';
import { Status } from './enums/status';
import { Project } from './project';
import { SimpleUser } from './simple-user';

export interface Task {
  _id: string;
  stringId: string;
  projectStringId: string
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  workers: SimpleUser[];
  idProject: string;
  reporter: SimpleUser;
  project: Project;
  creationDate: string;
  dutyDate: string;
}